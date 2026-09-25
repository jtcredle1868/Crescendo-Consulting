import type { Request, Response } from "express";
import { createBooking, listMyBookings, updateBookingStatus } from "./bookings.service";
import { ApiError } from "../../lib/errors";

export async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const booking = await createBooking(req.user.id, req.body);
  res.status(201).json({ booking });
}

export async function mine(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const bookings = await listMyBookings(req.user.id);
  res.json({ bookings });
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const booking = await updateBookingStatus(req.params.id, req.user.id, req.body);
  res.json({ booking });
}
