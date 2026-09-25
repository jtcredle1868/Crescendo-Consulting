import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import type { CreateBookingInput, UpdateBookingStatusInput } from "./bookings.schema";

export async function createBooking(clientId: string, input: CreateBookingInput) {
  if (clientId === input.providerId) {
    throw ApiError.badRequest("You cannot book yourself");
  }

  const provider = await prisma.user.findUnique({ where: { id: input.providerId } });
  if (!provider) throw ApiError.notFound("Provider not found");

  if (input.meetingSpaceId) {
    const space = await prisma.meetingSpace.findUnique({ where: { id: input.meetingSpaceId } });
    if (!space) throw ApiError.notFound("Meeting space not found");
  }

  return prisma.booking.create({
    data: {
      clientId,
      providerId: input.providerId,
      meetingSpaceId: input.meetingSpaceId,
      title: input.title,
      description: input.description,
      startTime: input.startTime,
      endTime: input.endTime,
      rate: input.rate,
    },
  });
}

export async function listMyBookings(userId: string) {
  return prisma.booking.findMany({
    where: { OR: [{ providerId: userId }, { clientId: userId }] },
    include: {
      provider: { include: { profile: true } },
      client: { include: { profile: true } },
      meetingSpace: true,
    },
    orderBy: { startTime: "asc" },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  userId: string,
  input: UpdateBookingStatusInput
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw ApiError.notFound("Booking not found");

  const isProvider = booking.providerId === userId;
  const isClient = booking.clientId === userId;
  if (!isProvider && !isClient) {
    throw ApiError.forbidden("You are not part of this booking");
  }

  if ((input.status === "CONFIRMED" || input.status === "DECLINED") && !isProvider) {
    throw ApiError.forbidden("Only the provider can confirm or decline a booking");
  }
  if (input.status === "COMPLETED" && !isProvider) {
    throw ApiError.forbidden("Only the provider can mark a booking complete");
  }

  return prisma.booking.update({ where: { id: bookingId }, data: { status: input.status } });
}
