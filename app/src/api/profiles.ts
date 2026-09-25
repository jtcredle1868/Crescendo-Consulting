import { apiClient } from "./client";
import type { User, Profile } from "./types";
import type { UserRole } from "@/constants/roles";

export interface SearchFilters {
  role?: UserRole;
  city?: string;
  genre?: string;
  skill?: string;
  q?: string;
  verifiedOnly?: boolean;
  page?: number;
}

export interface SearchResult {
  results: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function searchProfiles(filters: SearchFilters) {
  const { data } = await apiClient.get<SearchResult>("/profiles", {
    params: { ...filters, verifiedOnly: filters.verifiedOnly ? "true" : undefined },
  });
  return data;
}

export async function getProfile(userId: string) {
  const { data } = await apiClient.get<{ user: User }>(`/profiles/${userId}`);
  return data.user;
}

export type ProfileUpdatePayload = Partial<
  Pick<
    Profile,
    | "displayName"
    | "headline"
    | "bio"
    | "city"
    | "state"
    | "country"
    | "genres"
    | "skills"
    | "portfolioLinks"
    | "avatarUrl"
    | "yearsExperience"
    | "rateMin"
    | "rateMax"
    | "rateUnit"
  >
>;

export async function updateMyProfile(payload: ProfileUpdatePayload) {
  const { data } = await apiClient.patch<{ profile: Profile }>("/profiles/me", payload);
  return data.profile;
}
