import { api } from "./api";
import { Booking } from "../types";

export async function createBooking(eventId: string): Promise<Booking> {
  const res = await api.post("/bookings", { eventId });
  return res.data.data;
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await api.get("/bookings/my");
  return res.data.data;
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const res = await api.patch(`/bookings/${bookingId}/cancel`);
  return res.data.data;
}
