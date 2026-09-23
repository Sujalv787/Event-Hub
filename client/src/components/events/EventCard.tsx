import { Link } from "react-router-dom";
import { Event } from "../../types";
import { formatDate, formatPrice } from "../../utils/format";
import { Calendar, MapPin, Ticket, Sparkles, ArrowRight, UserCheck } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isSoldOut = event.seatsAvailable <= 0;
  const isLowStock = event.seatsAvailable > 0 && event.seatsAvailable <= 10;
  const totalCapacity = event.capacity || 100;
  const percentBooked = Math.min(
    100,
    Math.round(((totalCapacity - event.seatsAvailable) / totalCapacity) * 100)
  );

  const organizerName = typeof event.organizer === "object" ? event.organizer?.name : undefined;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-400">
            <Sparkles className="h-10 w-10 opacity-60" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
            {event.category}
          </span>
        </div>

        {/* Price Tag Pill */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md">
            {formatPrice(event.ticketPrice)}
          </span>
        </div>

        {/* Date Overlay on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-md px-2.5 py-1">
            <Calendar className="h-3.5 w-3.5 text-blue-300" />
            {formatDate(event.date)}
          </span>
          {organizerName && (
            <span className="flex items-center gap-1 rounded-lg bg-black/40 backdrop-blur-md px-2 py-1 text-[11px] text-slate-200">
              <UserCheck className="h-3 w-3 text-emerald-400" />
              {organizerName}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Venue / Location */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{event.venue}</span>
        </div>

        {/* Description snippet */}
        <p className="mt-2.5 line-clamp-2 text-xs text-slate-600 leading-relaxed">
          {event.description}
        </p>

        {/* Seats Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Ticket className="h-3.5 w-3.5 text-slate-400" />
              {isSoldOut ? (
                <span className="font-bold text-red-600">Sold Out</span>
              ) : isLowStock ? (
                <span className="font-semibold text-amber-600">Only {event.seatsAvailable} seats left!</span>
              ) : (
                <span>{event.seatsAvailable} seats available</span>
              )}
            </span>
            <span className="text-slate-400 text-[11px] font-medium">{percentBooked}% booked</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSoldOut
                  ? "bg-red-500"
                  : isLowStock
                  ? "bg-gradient-to-r from-amber-400 to-red-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
              style={{ width: `${percentBooked}%` }}
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 pt-1">
          <Link
            to={`/events/${event._id}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-semibold text-white transition-all duration-200 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/25"
          >
            <span>View Event & Book</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
