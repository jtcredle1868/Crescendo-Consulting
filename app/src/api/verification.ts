import { apiClient } from "./client";
import type { VerificationRequest, VerificationDocumentType } from "./types";

export async function submitVerification(input: {
  documents: { type: VerificationDocumentType; fileUrl: string }[];
  notes?: string;
}) {
  const { data } = await apiClient.post<{ request: VerificationRequest }>("/verification/requests", input);
  return data.request;
}

export async function listMyVerificationRequests() {
  const { data } = await apiClient.get<{ requests: VerificationRequest[] }>("/verification/requests/me");
  return data.requests;
}
