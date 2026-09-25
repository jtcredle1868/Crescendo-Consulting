import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import type { CreateConnectionInput, RespondConnectionInput } from "./connections.schema";

export async function createConnectionRequest(requesterId: string, input: CreateConnectionInput) {
  if (requesterId === input.recipientId) {
    throw ApiError.badRequest("You cannot connect with yourself");
  }

  const recipient = await prisma.user.findUnique({ where: { id: input.recipientId } });
  if (!recipient) {
    throw ApiError.notFound("Recipient not found");
  }

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId, recipientId: input.recipientId },
        { requesterId: input.recipientId, recipientId: requesterId },
      ],
    },
  });
  if (existing) {
    throw ApiError.conflict("A connection already exists between these users");
  }

  return prisma.connection.create({
    data: {
      requesterId,
      recipientId: input.recipientId,
      message: input.message,
    },
  });
}

export async function listMyConnections(userId: string, status?: string) {
  return prisma.connection.findMany({
    where: {
      OR: [{ requesterId: userId }, { recipientId: userId }],
      ...(status ? { status: status as never } : {}),
    },
    include: {
      requester: { include: { profile: true } },
      recipient: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getConnectionForUser(connectionId: string, userId: string) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) throw ApiError.notFound("Connection not found");
  if (connection.requesterId !== userId && connection.recipientId !== userId) {
    throw ApiError.forbidden("You are not part of this connection");
  }
  return connection;
}

export async function getConnectionDetail(connectionId: string, userId: string) {
  await getConnectionForUser(connectionId, userId);
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
    include: {
      requester: { include: { profile: true } },
      recipient: { include: { profile: true } },
    },
  });
  if (!connection) throw ApiError.notFound("Connection not found");
  return connection;
}

export async function respondToConnection(
  connectionId: string,
  userId: string,
  input: RespondConnectionInput
) {
  const connection = await getConnectionForUser(connectionId, userId);

  if (connection.recipientId !== userId) {
    throw ApiError.forbidden("Only the recipient can respond to this connection request");
  }
  if (connection.status !== "PENDING") {
    throw ApiError.conflict("This connection request has already been resolved");
  }

  return prisma.connection.update({
    where: { id: connectionId },
    data: { status: input.status, respondedAt: new Date() },
  });
}

export { getConnectionForUser };
