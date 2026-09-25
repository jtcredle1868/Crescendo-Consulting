import type { UserRole, VerificationStatus } from "@/constants/roles";

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  headline?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  genres: string[];
  skills: string[];
  portfolioLinks: string[];
  avatarUrl?: string | null;
  yearsExperience?: number | null;
  rateMin?: number | null;
  rateMax?: number | null;
  rateUnit?: string | null;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isBusiness: boolean;
  businessName?: string | null;
  verificationStatus: VerificationStatus;
  createdAt: string;
  profile?: Profile | null;
}

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  message?: string | null;
  createdAt: string;
  respondedAt?: string | null;
  requester?: User;
  recipient?: User;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export type MeetingSpaceCategory =
  | "COWORKING"
  | "CAFE"
  | "REHEARSAL_STUDIO"
  | "RECORDING_STUDIO"
  | "COMMUNITY_CENTER"
  | "VENUE_LOBBY"
  | "OTHER";

export interface MeetingSpace {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string | null;
  country: string;
  category: MeetingSpaceCategory;
  capacity?: number | null;
  notes?: string | null;
  isPartner: boolean;
}

export type MeetingStatus = "PROPOSED" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "COMPLETED";

export interface MeetingProposal {
  id: string;
  connectionId: string;
  meetingSpaceId: string;
  proposedById: string;
  proposedTime: string;
  status: MeetingStatus;
  notes?: string | null;
  meetingSpace: MeetingSpace;
}

export type BookingStatus = "REQUESTED" | "CONFIRMED" | "DECLINED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  providerId: string;
  clientId: string;
  meetingSpaceId?: string | null;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  rate?: number | null;
  status: BookingStatus;
  provider?: User;
  client?: User;
  meetingSpace?: MeetingSpace | null;
}

export type VerificationDocumentType =
  | "GOVERNMENT_ID"
  | "BUSINESS_LICENSE"
  | "TAX_DOCUMENT"
  | "PORTFOLIO_PROOF"
  | "OTHER";

export interface VerificationRequest {
  id: string;
  userId: string;
  provider: "MANUAL" | "IDME";
  status: VerificationStatus;
  notes?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  documents: { id: string; type: VerificationDocumentType; fileUrl: string }[];
  user?: User;
}
