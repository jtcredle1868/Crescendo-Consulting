import { apiClient } from "./client";
import type { MeetingProposal, MeetingStatus } from "./types";

export async function proposeMeeting(input: {
  connectionId: string;
  meetingSpaceId: string;
  proposedTime: string;
  notes?: string;
}) {
  const { data } = await apiClient.post<{ meeting: MeetingProposal }>("/meetings", input);
  return data.meeting;
}

export async function listMeetings(connectionId: string) {
  const { data } = await apiClient.get<{ meetings: MeetingProposal[] }>("/meetings", {
    params: { connectionId },
  });
  return data.meetings;
}

export async function respondToMeeting(id: string, status: MeetingStatus) {
  const { data } = await apiClient.patch<{ meeting: MeetingProposal }>(`/meetings/${id}`, { status });
  return data.meeting;
}
