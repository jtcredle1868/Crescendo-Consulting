import type { VerificationProvider, VerificationOutcome, VerificationSubmission } from "./VerificationProvider";

/**
 * MVP default. Every submission lands in a PENDING queue that an admin
 * reviews in the /api/admin/verification endpoints. This is the safe,
 * always-available fallback that requires no third-party credentials.
 */
export class ManualReviewProvider implements VerificationProvider {
  readonly type = "MANUAL" as const;

  async submit(_input: VerificationSubmission): Promise<VerificationOutcome> {
    return { status: "PENDING", notes: "Awaiting manual admin review" };
  }
}
