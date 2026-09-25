import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import { getConnectionForUser } from "../connections/connections.service";
import type { SendMessageInput } from "./messages.schema";

export async function sendMessage(connectionId: string, senderId: string, input: SendMessageInput) {
  const connection = await getConnectionForUser(connectionId, senderId);
  if (connection.status !== "ACCEPTED") {
    throw ApiError.forbidden("You can only message accepted connections");
  }

  return prisma.message.create({
    data: {
      connectionId,
      senderId,
      body: input.body,
    },
  });
}

export async function listMessages(connectionId: string, userId: string) {
  await getConnectionForUser(connectionId, userId);
  return prisma.message.findMany({
    where: { connectionId },
    orderBy: { createdAt: "asc" },
  });
}
