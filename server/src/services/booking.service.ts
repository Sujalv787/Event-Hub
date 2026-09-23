import { Booking, BookingStatus } from "../models/Booking";
import { Event } from "../models/Event";
import { ApiError } from "../utils/ApiError";

export async function createBooking(userId: string, eventId: string) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  const existingBooking = await Booking.findOne({
    user: userId,
    event: eventId,
    status: BookingStatus.CONFIRMED,
  });
  if (existingBooking) {
    throw ApiError.conflict("You have already registered for this event");
  }

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, seatsAvailable: { $gt: 0 } },
    { $inc: { seatsAvailable: -1 } },
    { new: true }
  );
  if (!updatedEvent) {
    throw ApiError.badRequest("No seats available");
  }

  try {
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      status: BookingStatus.CONFIRMED,
    });
    return booking.populate("event");
  } catch (error) {
    await Event.updateOne({ _id: eventId }, { $inc: { seatsAvailable: 1 } });
    throw error;
  }
}

export async function getMyBookings(userId: string) {
  return Booking.find({ user: userId })
    .populate("event")
    .sort({ createdAt: -1 });
}

export async function cancelBooking(userId: string, bookingId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound("Booking not found");
  }

  if (booking.user.toString() !== userId) {
    throw ApiError.forbidden("You do not have permission to cancel this booking");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw ApiError.badRequest("This booking is already cancelled");
  }

  booking.status = BookingStatus.CANCELLED;
  await booking.save();

  const event = await Event.findById(booking.event);
  if (event) {
    event.seatsAvailable = Math.min(event.capacity, event.seatsAvailable + 1);
    await event.save();
  }

  return booking;
}

export async function getEventBookings(eventId: string, organizerId: string) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }
  if (event.organizer.toString() !== organizerId) {
    throw ApiError.forbidden("You do not have permission to view these registrations");
  }

  return Booking.find({ event: eventId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
}
