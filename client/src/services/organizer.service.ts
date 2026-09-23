import { api } from "./api";
import { OrganizerEvent, EventRegistration } from "../types";

export async function getMyOrganizerEvents(): Promise<OrganizerEvent[]> {
  const res = await api.get("/organizer/events");
  return res.data.data;
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const res = await api.get(`/organizer/events/${eventId}/bookings`);
  return res.data.data;
}
