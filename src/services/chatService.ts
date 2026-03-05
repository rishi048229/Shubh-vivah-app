import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import api from "./api";

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

/**
 * GET /chat/history?otherUserId= — Fetch chat history between current user and other user.
 * Backend uses Principal to identify current user from JWT, so we only pass otherUserId.
 */
export async function getChatHistory(
  otherUserId: number,
): Promise<ChatMessage[]> {
  const res = await api.get(`/chat/history?otherUserId=${otherUserId}`);
  return res.data;
}

/**
 * Get WebSocket base URL for STOMP connection
 */
function getWsBaseUrl(): string {
  if (Platform.OS === "android") {
    return "ws://10.0.2.2:8080";
  }
  return "ws://localhost:8080";
}

/**
 * Build the WebSocket connection URL with JWT token
 * Backend WebSocket endpoint: /ws-chat
 */
export async function getWsUrl(): Promise<string> {
  let token: string | null = null;
  if (Platform.OS === "web") {
    token = localStorage.getItem("auth_token");
  } else {
    token = await SecureStore.getItemAsync("auth_token");
  }
  return `${getWsBaseUrl()}/ws-chat?token=${token}`;
}

/**
 * Get chat key (used for STOMP topic subscriptions)
 * Topic: /topic/chat/{min}_{max}
 */
export function getChatKey(u1: number, u2: number): string {
  const min = Math.min(u1, u2);
  const max = Math.max(u1, u2);
  return `${min}_${max}`;
}
