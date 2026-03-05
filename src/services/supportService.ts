import api from "./api";

/**
 * Support ticket service matching backend's SupportController
 * Backend base path: /support
 */
export interface SupportTicket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
}

export interface SupportMessage {
  id: number;
  ticketId: number;
  senderId: number;
  adminMessage: boolean;
  message: string;
  sentAt: string;
  attachments?: { id: number; fileName: string; fileUrl: string; fileType: string }[];
}

/**
 * POST /support/ticket — Create a new support ticket
 */
export async function createTicket(data: {
  subject: string;
  message: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}): Promise<SupportTicket> {
  const res = await api.post("/support/ticket", data);
  return res.data;
}

/**
 * POST /support/ticket/:ticketId/reply — Reply to a ticket
 */
export async function replyToTicket(
  ticketId: number,
  message: string,
): Promise<string> {
  const res = await api.post(
    `/support/ticket/${ticketId}/reply?message=${encodeURIComponent(message)}`,
  );
  return res.data;
}

/**
 * GET /support/ticket/:ticketId/messages — Get messages for a ticket
 */
export async function getTicketMessages(
  ticketId: number,
): Promise<SupportMessage[]> {
  const res = await api.get(`/support/ticket/${ticketId}/messages`);
  return res.data;
}
