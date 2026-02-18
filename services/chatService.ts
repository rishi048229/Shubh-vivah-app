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
 * GET /chat/history?u1=&u2= — Fetch chat history between two users
 */
export async function getChatHistory(
  u1: number,
  u2: number,
): Promise<ChatMessage[]> {
  const res = await api.get(`/chat/history?u1=${u1}&u2=${u2}`);
  return res.data;
}

/**
 * POST /chat/send - Send a message
 */
export async function sendMessage(
  senderId: number,
  receiverId: number,
  content: string,
): Promise<ChatMessage> {
  const res = await api.post("/chat/send", {
    senderId,
    receiverId,
    content,
    message: content, // Dual field support just in case
    type: "TEXT",
  });
  return res.data;
}

/**
 * Get WebSocket base URL
 */
function getWsBaseUrl(): string {
  if (Platform.OS === "android") {
    return "ws://10.0.2.2:8080";
  }
  return "ws://localhost:8080";
}

/**
 * Build the WebSocket connection URL with JWT token
 */
export async function getWsUrl(): Promise<string> {
  const token = await SecureStore.getItemAsync("auth_token");
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
