import { z } from "zod";
import { EVENT_CATEGORIES } from "../types";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["USER", "ORGANIZER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(EVENT_CATEGORIES as [string, ...string[]]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(3, "Venue is required"),
  ticketPrice: z.coerce.number().min(0, "Ticket price cannot be negative"),
  capacity: z.coerce.number().int().min(1, "Capacity must be greater than 0"),
  image: z.string().optional(),
});

export type EventFormSchemaValues = z.infer<typeof eventFormSchema>;
