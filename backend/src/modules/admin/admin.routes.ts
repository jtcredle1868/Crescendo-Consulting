import { Router } from "express";
import { authenticate, requireRole } from "../../middleware/auth";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { pending, decide } from "../verification/verification.controller";
import { reviewDecisionSchema } from "../verification/verification.schema";

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole("ADMIN"));

adminRouter.get("/verification/requests", asyncHandler(pending));
adminRouter.post(
  "/verification/requests/:id/decision",
  validateBody(reviewDecisionSchema),
  asyncHandler(decide)
);
