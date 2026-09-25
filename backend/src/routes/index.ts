import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { profilesRouter } from "../modules/profiles/profiles.routes";
import { verificationRouter } from "../modules/verification/verification.routes";
import { connectionsRouter } from "../modules/connections/connections.routes";
import { meetingSpacesRouter } from "../modules/meetingSpaces/meetingSpaces.routes";
import { meetingsRouter } from "../modules/meetings/meetings.routes";
import { bookingsRouter } from "../modules/bookings/bookings.routes";
import { adminRouter } from "../modules/admin/admin.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/profiles", profilesRouter);
router.use("/verification", verificationRouter);
router.use("/connections", connectionsRouter);
router.use("/meeting-spaces", meetingSpacesRouter);
router.use("/meetings", meetingsRouter);
router.use("/bookings", bookingsRouter);
router.use("/admin", adminRouter);
