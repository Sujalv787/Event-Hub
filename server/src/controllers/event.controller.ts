import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as eventService from "../services/event.service";

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, date } = req.query;
  const events = await eventService.getEvents({
    search: typeof search === "string" ? search : undefined,
    category: typeof category === "string" ? category : undefined,
    date: typeof date === "string" ? date : undefined,
  });
  res.status(200).json({ success: true, count: events.length, data: events });
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({ success: true, data: event });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.createEvent(req.user!.id, req.body);
  res.status(201).json({ success: true, data: event });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.updateEvent(req.params.id, req.user!.id, req.body);
  res.status(200).json({ success: true, data: event });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventService.deleteEvent(req.params.id, req.user!.id);
  res.status(200).json({ success: true, message: "Event deleted successfully" });
});
