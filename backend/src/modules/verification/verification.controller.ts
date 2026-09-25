import type { Request, Response } from "express";
import {
  submitVerification,
  listMyVerificationRequests,
  listPendingVerificationRequests,
  decideVerificationRequest,
} from "./verification.service";
import { ApiError } from "../../lib/errors";

export async function submit(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const request = await submitVerification(req.user.id, req.body);
  res.status(201).json({ request });
}

export async function mine(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const requests = await listMyVerificationRequests(req.user.id);
  res.json({ requests });
}

export async function pending(_req: Request, res: Response): Promise<void> {
  const requests = await listPendingVerificationRequests();
  res.json({ requests });
}

export async function decide(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const updated = await decideVerificationRequest(req.params.id, req.user.id, req.body);
  res.json({ request: updated });
}
