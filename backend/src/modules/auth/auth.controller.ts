import type { Request, Response } from "express";
import { registerUser, loginUser, getUserById } from "./auth.service";
import { toSafeUser } from "../../lib/serialize";
import { ApiError } from "../../lib/errors";

export async function register(req: Request, res: Response): Promise<void> {
  const { token, user } = await registerUser(req.body);
  res.status(201).json({ token, user: toSafeUser(user) });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { token, user } = await loginUser(req.body);
  res.json({ token, user: toSafeUser(user) });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const user = await getUserById(req.user.id);
  res.json({ user: toSafeUser(user) });
}
