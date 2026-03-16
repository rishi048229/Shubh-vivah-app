import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { Client, IMessage } from "@stomp/stompjs";
import api from "./api";
import Constants from "expo-constants";

// Polyfill for React Native (STOMP needs TextEncoder)
if (typeof global.TextEncoder === "undefined") {
  const encoding = require("text-encoding");
  global.TextEncoder = encoding.TextEncoder;
  global.TextDecoder = encoding.TextDecoder;
}

// --- Types ---
export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  message?: string;
  imageUrl?: string;
  sentAt: string;
  deleted: boolean;
  delivered: boolean;
  seen: boolean;
  seenAt?: string;
  type?: string;
}

export interface TypingEvent {
  from: number;
  to: number;
  typing: boolean;
}

// --- Helpers ---

/**
 * Get current user's ID from SecureStore
 */
export async function getCurrentUserId(): Promise<number> {
  let userId: string | null = null;
  if (Platform.OS === "web") {
    userId = localStorage.getItem("user_id");
  } else {
    userId = await SecureStore.getItemAsync("user_id");
  }
  return userId ? parseInt(userId, 10) : 0;
}

/**
 * Get chat key (used for STOMP topic subscriptions)
 * Topic: /topic/messages/{min}_{max}
 */
export function getChatKey(u1: number, u2: number): string {
  const min = Math.min(u1, u2);
  const max = Math.max(u1, u2);
  return `${min}_${max}`;
}

/**
 * Build WebSocket URL dynamically using same IP as REST API
 */
function getWsBaseUrl(): string {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    return `ws://${ip}:8085`;
  }
  if (Platform.OS === "android") {
    return "ws://10.0.2.2:8085";
  }
  return "ws://localhost:8085";
}

// --- REST Endpoints ---

/**
 * GET /chat/history?otherUserId= — Fetch chat history (Step 1)
 */
export async function getChatHistory(
  otherUserId: number,
): Promise<ChatMessage[]> {
  const res = await api.get(`/chat/history?otherUserId=${otherUserId}`);
  return res.data;
}

// --- STOMP WebSocket Client ---

let stompClient: Client | null = null;
let activeSubscriptions: Map<string, any> = new Map();

/**
 * Connect to WebSocket (Step 2)
 * Connects to ws://host:port/ws-chat with JWT auth
 */
export async function connectWebSocket(): Promise<Client> {
  if (stompClient && stompClient.connected) {
    return stompClient;
  }

  let token: string | null = null;
  if (Platform.OS === "web") {
    token = localStorage.getItem("auth_token");
  } else {
    token = await SecureStore.getItemAsync("auth_token");
  }

  // Since we removed .withSockJS() from the backend for better compatibility,
  // we use the raw endpoint URL directly.
  const wsUrl = `${getWsBaseUrl()}/ws-chat?token=${token || ""}`;

  return new Promise((resolve, reject) => {
    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token || ""}`,
      },
      debug: (str) => {
        if (__DEV__) console.log("[STOMP]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      // Use native WebSocket directly without SockJS wrapper
      webSocketFactory: () => new WebSocket(wsUrl),
    });

    let timeoutId = setTimeout(() => {
      reject(new Error("WebSocket connection timeout"));
    }, 10000);

    client.onConnect = () => {
      clearTimeout(timeoutId);
      console.log("[STOMP] Connected to", wsUrl);
      stompClient = client;
      resolve(client);
    };

    client.onStompError = (frame) => {
      clearTimeout(timeoutId);
      console.warn("[STOMP] Error:", frame.headers["message"]);
      reject(new Error(frame.headers["message"]));
    };

    client.onWebSocketError = (event) => {
      clearTimeout(timeoutId);
      console.warn("[STOMP] WebSocket error:", event);
      reject(new Error("WebSocket error"));
    };

    client.activate();
  });
}

/**
 * Subscribe to chat messages (Step 3)
 * /topic/chat/{chatKey}
 */
export function subscribeToMessages(
  chatKey: string,
  onMessage: (msg: ChatMessage) => void,
): () => void {
  if (!stompClient || !stompClient.connected) {
    console.warn("[STOMP] Not connected, cannot subscribe");
    return () => {};
  }

  const subKey = `chat_${chatKey}`;
  if (activeSubscriptions.has(subKey)) {
    activeSubscriptions.get(subKey).unsubscribe();
  }

  const subscription = stompClient.subscribe(
    `/topic/chat/${chatKey}`,
    (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body);
        onMessage(parsed);
      } catch (e) {
        console.warn("[STOMP] Failed to parse message:", e);
      }
    },
  );

  activeSubscriptions.set(subKey, subscription);

  return () => {
    subscription.unsubscribe();
    activeSubscriptions.delete(subKey);
  };
}

/**
 * Subscribe to typing events
 * /topic/typing/{chatKey}
 */
export function subscribeToTyping(
  chatKey: string,
  onTyping: (event: TypingEvent) => void,
): () => void {
  if (!stompClient || !stompClient.connected) return () => {};

  const subKey = `typing_${chatKey}`;
  if (activeSubscriptions.has(subKey)) {
    activeSubscriptions.get(subKey).unsubscribe();
  }

  const subscription = stompClient.subscribe(
    `/topic/typing/${chatKey}`,
    (message: IMessage) => {
      try {
        onTyping(JSON.parse(message.body));
      } catch (e) {}
    },
  );

  activeSubscriptions.set(subKey, subscription);

  return () => {
    subscription.unsubscribe();
    activeSubscriptions.delete(subKey);
  };
}

/**
 * Subscribe to notifications (e.g. New Match Requests)
 * /topic/notifications/{userId}
 */
export function subscribeToNotifications(
  userId: number,
  componentId: string,
  onNotification: (event: any) => void
): void {
  if (!stompClient || !stompClient.connected) return;

  const subKey = `notifications_${userId}_${componentId}`;
  if (activeSubscriptions.has(subKey)) {
    activeSubscriptions.get(subKey).unsubscribe();
  }

  const subscription = stompClient.subscribe(
    `/topic/notifications/${userId}`,
    (message: IMessage) => {
      try {
        onNotification(JSON.parse(message.body));
      } catch (e) {
        console.warn("[STOMP] Failed to parse notification:", e);
      }
    }
  );

  activeSubscriptions.set(subKey, subscription);
}

let presenceCallbacks: ((event: { userId: number; status: string }) => void)[] = [];

/**
 * Subscribe to presence updates (Online/Offline)
 * /topic/presence
 */
export function subscribeToPresence(
  onPresence: (event: { userId: number; status: string }) => void
): () => void {
  presenceCallbacks.push(onPresence);

  const subKey = "presence";
  if (!activeSubscriptions.has(subKey)) {
    if (!stompClient || !stompClient.connected) {
      return () => {
        presenceCallbacks = presenceCallbacks.filter((cb) => cb !== onPresence);
      };
    }

    const subscription = stompClient.subscribe(
      `/topic/presence`,
      (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body);
          presenceCallbacks.forEach((cb) => cb(parsed));
        } catch (e) {
          console.warn("[STOMP] Failed to parse presence update:", e);
        }
      }
    );

    activeSubscriptions.set(subKey, subscription);
  }

  // Return unsubscribe function
  return () => {
    presenceCallbacks = presenceCallbacks.filter((cb) => cb !== onPresence);
    if (presenceCallbacks.length === 0) {
      if (activeSubscriptions.has(subKey)) {
        activeSubscriptions.get(subKey).unsubscribe();
        activeSubscriptions.delete(subKey);
      }
    }
  };
}

// --- STOMP Send Endpoints ---

/**
 * Send message (Step 4) → /app/chat.send
 */
export function sendMessage(
  senderId: number,
  receiverId: number,
  content: string,
): void {
  if (!stompClient || !stompClient.connected) {
    console.warn("[STOMP] Not connected, cannot send");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      senderId,
      receiverId,
      content,
    }),
  });
}

/**
 * Send typing indicator → /app/chat.typing
 */
export function sendTyping(
  senderId: number,
  receiverId: number,
  typing: boolean,
): void {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.typing",
    body: JSON.stringify({
      from: senderId,
      to: receiverId,
      typing,
    }),
  });
}

/**
 * Mark messages as seen → /app/chat.seen
 */
export function markSeen(messageId: number, userId: number): void {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.seen",
    body: JSON.stringify({
      messageId,
      userId,
    }),
  });
}

/**
 * Delete a message → /app/chat.delete
 */
export function deleteMessage(messageId: number): void {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.delete",
    body: JSON.stringify({ messageId }),
  });
}

/**
 * Edit a message → /app/chat.edit
 */
export function editMessage(messageId: number, newContent: string): void {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.edit",
    body: JSON.stringify({ messageId, content: newContent }),
  });
}

/**
 * Disconnect from WebSocket
 */
export function disconnectWebSocket(): void {
  if (stompClient) {
    activeSubscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (e) {}
    });
    activeSubscriptions.clear();
    stompClient.deactivate();
    stompClient = null;
  }
}

/**
 * Check if currently connected
 */
export function isConnected(): boolean {
  return stompClient?.connected ?? false;
}

/**
 * Check if a user is online via REST API
 */
export async function checkUserOnline(userId: number): Promise<boolean> {
  try {
    const res = await api.get(`/chat/online/${userId}`);
    return res.data?.online === true;
  } catch (e) {
    return false;
  }
}
