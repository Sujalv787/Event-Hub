import { z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
