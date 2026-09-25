import type { VerificationStatus } from "@prisma/client";

export interface VerificationSubmission {
  userId: string;
  isBusiness: boolean;
  businessName?: string | null;
  documentUrls: { type: string; fileUrl: string }[];
}

export interface VerificationOutcome {
  status: VerificationStatus;
  notes?: string;
}

/**
 * A VerificationProvider decides the initial status of a submitted
 * verification request. Phase 1 ships with ManualReviewProvider (an admin
 * reviews documents by hand). IdMeProvider is scaffolded for when the
 * business obtains ID.me production API credentials.
 */
export interface VerificationProvider {
  readonly type: "MANUAL" | "IDME";
  submit(input: VerificationSubmission): Promise<VerificationOutcome>;
}
