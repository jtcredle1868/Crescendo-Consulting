import { Router } from "express";
import { propose, listForConnection, respond } from "./meetings.controller";
import { authenticate } from "../../middleware/auth";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { proposeMeetingSchema, respondMeetingSchema } from "./meetings.schema";

export const meetingsRouter = Router();

meetingsRouter.use(authenticate);

meetingsRouter.post("/", validateBody(proposeMeetingSchema), asyncHandler(propose));
meetingsRouter.get("/", asyncHandler(listForConnection));
meetingsRouter.patch("/:id", validateBody(respondMeetingSchema), asyncHandler(respond));
