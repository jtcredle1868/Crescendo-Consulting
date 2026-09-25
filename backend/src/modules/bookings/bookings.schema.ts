import { z } from "zod";

export const createBookingSchema = z
  .object({
    providerId: z.string().uuid(),
    meetingSpaceId: z.string().uuid().optional(),
    title: z.string().min(2).max(140),
    description: z.string().max(2000).optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    rate: z.number().int().min(0).optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "DECLINED", "CANCELLED", "COMPLETED"]),
});
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
