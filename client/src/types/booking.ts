import { Event } from "./event";

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface Booking {
  _id: string;
  user: string;
  event: Event;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
}

export interface EventRegistration {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bookingDate: string;
  status: BookingStatus;
}
