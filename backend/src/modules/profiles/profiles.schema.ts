import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(80).optional(),
  headline: z.string().max(140).optional(),
  bio: z.string().max(2000).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  genres: z.array(z.string().max(40)).max(20).optional(),
  skills: z.array(z.string().max(40)).max(20).optional(),
  portfolioLinks: z.array(z.string().url()).max(10).optional(),
  avatarUrl: z.string().url().optional(),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  rateMin: z.number().int().min(0).optional(),
  rateMax: z.number().int().min(0).optional(),
  rateUnit: z.enum(["hour", "session", "gig", "day"]).optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const searchProfilesSchema = z.object({
  role: z.enum(["MUSICIAN", "PRODUCER", "TECHNICIAN", "VENUE", "SERVICE_PROVIDER"]).optional(),
  city: z.string().optional(),
  genre: z.string().optional(),
  skill: z.string().optional(),
  q: z.string().optional(),
  verifiedOnly: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(50, Math.max(1, parseInt(v, 10))) : 20)),
});
export type SearchProfilesInput = z.infer<typeof searchProfilesSchema>;
