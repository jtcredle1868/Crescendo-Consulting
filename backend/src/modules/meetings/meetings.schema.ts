import { z } from "zod";

export const proposeMeetingSchema = z.object({
  connectionId: z.string().uuid(),
  meetingSpaceId: z.string().uuid(),
  proposedTime: z.coerce.date(),
  notes: z.string().max(500).optional(),
});
export type ProposeMeetingInput = z.infer<typeof proposeMeetingSchema>;

export const respondMeetingSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "CANCELLED", "COMPLETED"]),
});
export type RespondMeetingInput = z.infer<typeof respondMeetingSchema>;
