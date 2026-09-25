import { Router } from "express";
import { list, create } from "./meetingSpaces.controller";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody, validateQuery, asyncHandler } from "../../middleware/validate";
import { createMeetingSpaceSchema, listMeetingSpacesSchema } from "./meetingSpaces.schema";

export const meetingSpacesRouter = Router();

meetingSpacesRouter.get("/", validateQuery(listMeetingSpacesSchema), asyncHandler(list));
meetingSpacesRouter.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validateBody(createMeetingSpaceSchema),
  asyncHandler(create)
);
