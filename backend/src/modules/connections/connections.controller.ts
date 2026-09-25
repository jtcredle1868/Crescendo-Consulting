import type { Request, Response } from "express";
import {
  createConnectionRequest,
  listMyConnections,
  respondToConnection,
  getConnectionDetail,
} from "./connections.service";
import { ApiError } from "../../lib/errors";

export async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const connection = await createConnectionRequest(req.user.id, req.body);
  res.status(201).json({ connection });
}

export async function show(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const connection = await getConnectionDetail(req.params.id, req.user.id);
  res.json({ connection });
}

export async function mine(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const connections = await listMyConnections(req.user.id, status);
  res.json({ connections });
}

export async function respond(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const connection = await respondToConnection(req.params.id, req.user.id, req.body);
  res.json({ connection });
}
