import { api } from "./api";
import { Event, EventFormValues } from "../types";

export interface EventFilters {
  search?: string;
  category?: string;
  date?: string;
}

export async function getEvents(filters: EventFilters = {}): Promise<Event[]> {
  const res = await api.get("/events", { params: filters });
  return res.data.data;
}

export async function getEventById(id: string): Promise<Event> {
  const res = await api.get(`/events/${id}`);
  return res.data.data;
}

export async function createEvent(payload: EventFormValues): Promise<Event> {
  const res = await api.post("/events", payload);
  return res.data.data;
}

export async function updateEvent(
  id: string,
  payload: Partial<EventFormValues>
): Promise<Event> {
  const res = await api.patch(`/events/${id}`, payload);
  return res.data.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}
