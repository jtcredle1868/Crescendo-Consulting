import { Router } from "express";
import { submit, mine } from "./verification.controller";
import { authenticate } from "../../middleware/auth";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { submitVerificationSchema } from "./verification.schema";

export const verificationRouter = Router();

verificationRouter.post("/requests", authenticate, validateBody(submitVerificationSchema), asyncHandler(submit));
verificationRouter.get("/requests/me", authenticate, asyncHandler(mine));
