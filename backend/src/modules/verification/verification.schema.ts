import { z } from "zod";

export const documentTypeEnum = z.enum([
  "GOVERNMENT_ID",
  "BUSINESS_LICENSE",
  "TAX_DOCUMENT",
  "PORTFOLIO_PROOF",
  "OTHER",
]);

export const submitVerificationSchema = z.object({
  documents: z
    .array(
      z.object({
        type: documentTypeEnum,
        fileUrl: z.string().url(),
      })
    )
    .min(1, "At least one supporting document is required"),
  notes: z.string().max(1000).optional(),
});
export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;

export const reviewDecisionSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  notes: z.string().max(1000).optional(),
});
export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>;
