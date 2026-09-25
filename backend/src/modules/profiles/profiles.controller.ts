import type { Request, Response } from "express";
import { getPublicProfile, updateMyProfile, searchProfiles } from "./profiles.service";
import { ApiError } from "../../lib/errors";
import type { SearchProfilesInput } from "./profiles.schema";

export async function show(req: Request, res: Response): Promise<void> {
  const user = await getPublicProfile(req.params.userId);
  res.json({ user });
}

export async function updateMine(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const profile = await updateMyProfile(req.user.id, req.body);
  res.json({ profile });
}

export async function search(req: Request, res: Response): Promise<void> {
  const result = await searchProfiles(req.query as unknown as SearchProfilesInput);
  res.json(result);
}
