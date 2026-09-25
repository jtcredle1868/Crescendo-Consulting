import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import type { CreateMeetingSpaceInput, ListMeetingSpacesInput } from "./meetingSpaces.schema";

export async function listMeetingSpaces(filters: ListMeetingSpacesInput) {
  return prisma.meetingSpace.findMany({
    where: filters.city ? { city: { equals: filters.city, mode: "insensitive" } } : undefined,
    orderBy: [{ isPartner: "desc" }, { name: "asc" }],
  });
}

export async function getMeetingSpace(id: string) {
  const space = await prisma.meetingSpace.findUnique({ where: { id } });
  if (!space) throw ApiError.notFound("Meeting space not found");
  return space;
}

export async function createMeetingSpace(input: CreateMeetingSpaceInput) {
  return prisma.meetingSpace.create({ data: input });
}
