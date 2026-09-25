import { apiClient } from "./client";
import type { MeetingSpace } from "./types";

export async function listMeetingSpaces(city?: string) {
  const { data } = await apiClient.get<{ spaces: MeetingSpace[] }>("/meeting-spaces", {
    params: city ? { city } : undefined,
  });
  return data.spaces;
}
