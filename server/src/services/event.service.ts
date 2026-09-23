import { FilterQuery } from "mongoose";
import { Event, IEvent } from "../models/Event";
import { Booking } from "../models/Booking";
import { ApiError } from "../utils/ApiError";
import { CreateEventInput, UpdateEventInput } from "../validators/event.validator";

export interface EventFilters {
  search?: string;
  category?: string;
  date?: string;
}

export async function getEvents(filters: EventFilters) {
  const query: FilterQuery<IEvent> = {};

  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.date) {
    const startOfDay = new Date(filters.date);
    const endOfDay = new Date(filters.date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    query.date = { $gte: startOfDay, $lt: endOfDay };
  }

  return Event.find(query)
    .populate("organizer", "name email")
    .sort({ date: 1 });
}

export async function getEventById(eventId: string) {
  const event = await Event.findById(eventId).populate("organizer", "name email");
  if (!event) {
    throw ApiError.notFound("Event not found");
  }
  return event;
}

export async function createEvent(organizerId: string, input: CreateEventInput) {
  const event = await Event.create({
    ...input,
    capacity: input.capacity,
    seatsAvailable: input.capacity,
    organizer: organizerId,
  });
  return event;
}

async function getOwnedEvent(eventId: string, organizerId: string) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }
  if (event.organizer.toString() !== organizerId) {
    throw ApiError.forbidden("You do not have permission to modify this event");
  }
  return event;
}

export async function updateEvent(
  eventId: string,
  organizerId: string,
  input: UpdateEventInput
) {
  const event = await getOwnedEvent(eventId, organizerId);
  const bookedSeats = event.capacity - event.seatsAvailable;

  if (input.capacity !== undefined) {
    if (input.capacity < bookedSeats) {
      throw ApiError.badRequest(
        `Capacity cannot be less than already booked seats (${bookedSeats})`
      );
    }
    event.seatsAvailable = input.capacity - bookedSeats;
    event.capacity = input.capacity;
  }

  const { capacity: _capacity, ...rest } = input;
  Object.assign(event, rest);

  await event.save();
  return event;
}

export async function deleteEvent(eventId: string, organizerId: string) {
  const event = await getOwnedEvent(eventId, organizerId);
  await Booking.deleteMany({ event: event._id });
  await event.deleteOne();
}

export async function getEventsByOrganizer(organizerId: string) {
  return Event.find({ organizer: organizerId }).sort({ date: 1 });
}
