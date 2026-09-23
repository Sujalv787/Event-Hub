import { Event } from "../models/Event";
import { Booking, BookingStatus } from "../models/Booking";

export async function getOrganizerEvents(organizerId: string) {
  const events = await Event.find({ organizer: organizerId }).sort({ date: 1 });

  const eventsWithCounts = await Promise.all(
    events.map(async (event) => {
      const registeredCount = await Booking.countDocuments({
        event: event._id,
        status: BookingStatus.CONFIRMED,
      });
      return {
        ...event.toObject(),
        registeredCount,
      };
    })
  );

  return eventsWithCounts;
}
