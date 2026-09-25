import { Router } from "express";
import { show, updateMine, search } from "./profiles.controller";
import { authenticate } from "../../middleware/auth";
import { validateBody, validateQuery, asyncHandler } from "../../middleware/validate";
import { updateProfileSchema, searchProfilesSchema } from "./profiles.schema";

export const profilesRouter = Router();

profilesRouter.get("/", validateQuery(searchProfilesSchema), asyncHandler(search));
profilesRouter.patch("/me", authenticate, validateBody(updateProfileSchema), asyncHandler(updateMine));
profilesRouter.get("/:userId", asyncHandler(show));
