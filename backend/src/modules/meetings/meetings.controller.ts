import type { Request, Response } from "express";
import { proposeMeeting, listMeetingsForConnection, respondToMeeting } from "./meetings.service";
import { ApiError } from "../../lib/errors";

export async function propose(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const meeting = await proposeMeeting(req.user.id, req.body);
  res.status(201).json({ meeting });
}

export async function listForConnection(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const connectionId = req.query.connectionId as string | undefined;
  if (!connectionId) throw ApiError.badRequest("connectionId query parameter is required");
  const meetings = await listMeetingsForConnection(connectionId, req.user.id);
  res.json({ meetings });
}

export async function respond(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const meeting = await respondToMeeting(req.params.id, req.user.id, req.body);
  res.json({ meeting });
}
