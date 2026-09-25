import type { Request, Response } from "express";
import { sendMessage, listMessages } from "./messages.service";
import { ApiError } from "../../lib/errors";

export async function send(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const message = await sendMessage(req.params.id, req.user.id, req.body);
  res.status(201).json({ message });
}

export async function list(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const messages = await listMessages(req.params.id, req.user.id);
  res.json({ messages });
}
