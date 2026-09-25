import { z } from "zod";

export const meetingSpaceCategoryEnum = z.enum([
  "COWORKING",
  "CAFE",
  "REHEARSAL_STUDIO",
  "RECORDING_STUDIO",
  "COMMUNITY_CENTER",
  "VENUE_LOBBY",
  "OTHER",
]);

export const createMeetingSpaceSchema = z.object({
  name: z.string().min(2).max(120),
  address: z.string().min(4).max(200),
  city: z.string().min(1).max(80),
  state: z.string().max(80).optional(),
  country: z.string().max(80).optional().default("US"),
  category: meetingSpaceCategoryEnum,
  capacity: z.number().int().min(1).optional(),
  notes: z.string().max(500).optional(),
  isPartner: z.boolean().optional().default(false),
});
export type CreateMeetingSpaceInput = z.infer<typeof createMeetingSpaceSchema>;

export const listMeetingSpacesSchema = z.object({
  city: z.string().optional(),
});
export type ListMeetingSpacesInput = z.infer<typeof listMeetingSpacesSchema>;
