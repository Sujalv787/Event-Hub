import { useEffect, useState } from "react";
import { Booking } from "../types";
import { getMyBookings, cancelBooking } from "../services/booking.service";
import { getApiErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { StatCard } from "../components/common/StatCard";
import { BookingCard } from "../components/bookings/BookingCard";
import { PageLoader } from "../components/common/Spinner";
import { Alert } from "../components/common/Alert";
import { EmptyState } from "../components/common/EmptyState";
import { isPastDate } from "../utils/format";

export function Dashboard() {
  const { user } = useAuth();
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

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const upcomingBookings = confirmedBookings.filter((b) => !isPastDate(b.event.date));
  const completedBookings = confirmedBookings.filter((b) => isPastDate(b.event.date));

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
      <p className="mt-1 text-gray-500">Here's an overview of your bookings.</p>

      {error && (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Upcoming Events" value={upcomingBookings.length} />
        <StatCard label="Completed Events" value={completedBookings.length} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <EmptyState
            title="No upcoming bookings"
            description="Browse events and register for one to see it here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingBookings.map((booking) => (
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
