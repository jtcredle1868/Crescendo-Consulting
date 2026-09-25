import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["MUSICIAN", "PRODUCER", "TECHNICIAN", "VENUE", "SERVICE_PROVIDER"]),
  displayName: z.string().min(2).max(80),
  isBusiness: z.boolean().optional().default(false),
  businessName: z.string().min(2).max(120).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
