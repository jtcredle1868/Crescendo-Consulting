import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import { getConnectionForUser } from "../connections/connections.service";
import { getMeetingSpace } from "../meetingSpaces/meetingSpaces.service";
import type { ProposeMeetingInput, RespondMeetingInput } from "./meetings.schema";

export async function proposeMeeting(userId: string, input: ProposeMeetingInput) {
  const connection = await getConnectionForUser(input.connectionId, userId);
  if (connection.status !== "ACCEPTED") {
    throw ApiError.forbidden("Both people must accept the connection before scheduling a meeting");
  }
  await getMeetingSpace(input.meetingSpaceId);

  return prisma.meetingProposal.create({
    data: {
      connectionId: input.connectionId,
      meetingSpaceId: input.meetingSpaceId,
      proposedById: userId,
      proposedTime: input.proposedTime,
      notes: input.notes,
    },
    include: { meetingSpace: true },
  });
}

export async function listMeetingsForConnection(connectionId: string, userId: string) {
  await getConnectionForUser(connectionId, userId);
  return prisma.meetingProposal.findMany({
    where: { connectionId },
    include: { meetingSpace: true },
    orderBy: { proposedTime: "asc" },
  });
}

export async function respondToMeeting(meetingId: string, userId: string, input: RespondMeetingInput) {
  const meeting = await prisma.meetingProposal.findUnique({ where: { id: meetingId } });
  if (!meeting) throw ApiError.notFound("Meeting proposal not found");

  await getConnectionForUser(meeting.connectionId, userId);

  if (input.status === "ACCEPTED" && meeting.proposedById === userId) {
    throw ApiError.forbidden("Wait for the other person to accept your proposal");
  }

  return prisma.meetingProposal.update({
    where: { id: meetingId },
    data: { status: input.status },
    include: { meetingSpace: true },
  });
}
