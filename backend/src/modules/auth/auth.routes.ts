import { Router } from "express";
import { register, login, me } from "./auth.controller";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.schema";
import { authenticate } from "../../middleware/auth";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), asyncHandler(register));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(login));
authRouter.get("/me", authenticate, asyncHandler(me));
