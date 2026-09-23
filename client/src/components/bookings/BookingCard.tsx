import { Link } from "react-router-dom";
import { Booking } from "../../types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatDate } from "../../utils/format";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isCancelling: boolean;
}

export function BookingCard({ booking, onCancel, isCancelling }: BookingCardProps) {
  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{booking.event.title}</h3>
          <Badge variant={isConfirmed ? "success" : "danger"}>{booking.status}</Badge>
        </div>
        <p className="text-sm text-gray-500">
          {formatDate(booking.event.date)} • {booking.event.venue}
        </p>
        <p className="text-xs text-gray-400">Booked on {formatDate(booking.bookingDate)}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        <Link to={`/events/${booking.event._id}`}>
          <Button variant="outline" size="sm">
            View Event
          </Button>
        </Link>
        {isConfirmed && (
          <Button
            variant="danger"
            size="sm"
            isLoading={isCancelling}
            onClick={() => onCancel(booking._id)}
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}
