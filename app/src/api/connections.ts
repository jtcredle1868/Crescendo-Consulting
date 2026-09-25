import { apiClient } from "./client";
import type { Connection, Message } from "./types";

export async function createConnection(recipientId: string, message?: string) {
  const { data } = await apiClient.post<{ connection: Connection }>("/connections", { recipientId, message });
  return data.connection;
}

export async function getConnection(id: string) {
  const { data } = await apiClient.get<{ connection: Connection }>(`/connections/${id}`);
  return data.connection;
}

export async function listConnections(status?: string) {
  const { data } = await apiClient.get<{ connections: Connection[] }>("/connections", {
    params: status ? { status } : undefined,
  });
  return data.connections;
}

export async function respondToConnection(id: string, status: "ACCEPTED" | "DECLINED" | "BLOCKED") {
  const { data } = await apiClient.patch<{ connection: Connection }>(`/connections/${id}`, { status });
  return data.connection;
}

export async function listMessages(connectionId: string) {
  const { data } = await apiClient.get<{ messages: Message[] }>(`/connections/${connectionId}/messages`);
  return data.messages;
}

export async function sendMessage(connectionId: string, body: string) {
  const { data } = await apiClient.post<{ message: Message }>(`/connections/${connectionId}/messages`, { body });
  return data.message;
}
