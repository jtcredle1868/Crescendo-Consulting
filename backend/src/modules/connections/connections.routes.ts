import { Router } from "express";
import { create, mine, respond, show } from "./connections.controller";
import { send, list as listMessages } from "../messages/messages.controller";
import { authenticate } from "../../middleware/auth";
import { validateBody, asyncHandler } from "../../middleware/validate";
import { createConnectionSchema, respondConnectionSchema } from "./connections.schema";
import { sendMessageSchema } from "../messages/messages.schema";

export const connectionsRouter = Router();

connectionsRouter.use(authenticate);

connectionsRouter.post("/", validateBody(createConnectionSchema), asyncHandler(create));
connectionsRouter.get("/", asyncHandler(mine));
connectionsRouter.get("/:id", asyncHandler(show));
connectionsRouter.patch("/:id", validateBody(respondConnectionSchema), asyncHandler(respond));

connectionsRouter.get("/:id/messages", asyncHandler(listMessages));
connectionsRouter.post("/:id/messages", validateBody(sendMessageSchema), asyncHandler(send));
