import { z } from "zod";

export const createConnectionSchema = z.object({
  recipientId: z.string().uuid(),
  message: z.string().max(500).optional(),
});
export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;

export const respondConnectionSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "BLOCKED"]),
});
export type RespondConnectionInput = z.infer<typeof respondConnectionSchema>;
