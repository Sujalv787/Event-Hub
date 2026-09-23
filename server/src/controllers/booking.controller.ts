import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as bookingService from "../services/booking.service";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.user!.id, req.body.eventId);
  res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(req.user!.id);
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.user!.id, req.params.id);
  res.status(200).json({ success: true, data: booking });
});
