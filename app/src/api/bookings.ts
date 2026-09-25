import { apiClient } from "./client";
import type { Booking, BookingStatus } from "./types";

export async function createBooking(input: {
  providerId: string;
  meetingSpaceId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  rate?: number;
}) {
  const { data } = await apiClient.post<{ booking: Booking }>("/bookings", input);
  return data.booking;
}

export async function listMyBookings() {
  const { data } = await apiClient.get<{ bookings: Booking[] }>("/bookings");
  return data.bookings;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data } = await apiClient.patch<{ booking: Booking }>(`/bookings/${id}`, { status });
  return data.booking;
}
