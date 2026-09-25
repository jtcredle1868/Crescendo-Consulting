import type { Request, Response } from "express";
import { listMeetingSpaces, createMeetingSpace } from "./meetingSpaces.service";

export async function list(req: Request, res: Response): Promise<void> {
  const spaces = await listMeetingSpaces(req.query as { city?: string });
  res.json({ spaces });
}

export async function create(req: Request, res: Response): Promise<void> {
  const space = await createMeetingSpace(req.body);
  res.status(201).json({ space });
}
