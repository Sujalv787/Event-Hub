import { z } from "zod";
import { EventCategory } from "../models/Event";

export const createEventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.nativeEnum(EventCategory, {
    errorMap: () => ({ message: "Select a valid category" }),
  }),
  date: z.coerce.date({ errorMap: () => ({ message: "Enter a valid date" }) }),
  time: z.string().trim().min(1, "Time is required"),
  venue: z.string().trim().min(3, "Venue is required"),
  ticketPrice: z.coerce.number().min(0, "Ticket price cannot be negative"),
  capacity: z.coerce.number().int().min(1, "Capacity must be greater than 0"),
  image: z.string().trim().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
