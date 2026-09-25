import { Router } from "express";
import { create, mine, updateStatus } from "./bookings.controller";
import { authenticate } from "../../middleware/auth";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { createBookingSchema, updateBookingStatusSchema } from "./bookings.schema";

export const bookingsRouter = Router();

bookingsRouter.use(authenticate);

bookingsRouter.post("/", validateBody(createBookingSchema), asyncHandler(create));
bookingsRouter.get("/", asyncHandler(mine));
bookingsRouter.patch("/:id", validateBody(updateBookingStatusSchema), asyncHandler(updateStatus));
