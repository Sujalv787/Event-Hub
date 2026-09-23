import { useEffect, useState } from "react";
import { Booking } from "../types";
import { getMyBookings, cancelBooking } from "../services/booking.service";
import { getApiErrorMessage } from "../services/api";
import { BookingCard } from "../components/bookings/BookingCard";
import { PageLoader } from "../components/common/Spinner";
import { Alert } from "../components/common/Alert";
import { EmptyState } from "../components/common/EmptyState";

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  function loadBookings() {
    setIsLoading(true);
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }

  async function handleCancel(bookingId: string) {
    setCancellingId(bookingId);
    setError("");
    try {
      await cancelBooking(bookingId);
      loadBookings();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
      <p className="mt-1 text-gray-500">All the events you've registered for.</p>

      {error && (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      )}

      <div className="mt-6">
        {bookings.length === 0 ? (
          <EmptyState
            title="You haven't booked any events yet"
            description="Browse events and register for one to see it here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
                isCancelling={cancellingId === booking._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
