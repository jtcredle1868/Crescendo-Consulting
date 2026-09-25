import { apiClient } from "./client";
import type { User } from "./types";
import type { UserRole } from "@/constants/roles";

export interface RegisterPayload {
  email: string;
  password: string;
  role: Exclude<UserRole, "ADMIN">;
  displayName: string;
  isBusiness?: boolean;
  businessName?: string;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await apiClient.post<{ token: string; user: User }>("/auth/register", payload);
  return data;
}

export async function loginRequest(payload: { email: string; password: string }) {
  const { data } = await apiClient.post<{ token: string; user: User }>("/auth/login", payload);
  return data;
}

export async function meRequest() {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data.user;
}
