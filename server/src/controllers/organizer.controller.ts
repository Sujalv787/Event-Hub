import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getOrganizerEvents } from "../services/organizer.service";
import { getEventBookings } from "../services/booking.service";

export const getMyEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await getOrganizerEvents(req.user!.id);
  res.status(200).json({ success: true, count: events.length, data: events });
});

export const getRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await getEventBookings(req.params.id, req.user!.id);
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});
