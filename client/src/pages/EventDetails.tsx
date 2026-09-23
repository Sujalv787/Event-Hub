import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Event } from "../types";
import { getEventById } from "../services/event.service";
import { createBooking, getMyBookings } from "../services/booking.service";
import { getApiErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Alert } from "../components/common/Alert";
import { PageLoader } from "../components/common/Spinner";
import { formatDate, formatPrice } from "../utils/format";

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const eventData = await getEventById(id as string);
        if (ignore) return;
        setEvent(eventData);

        if (user?.role === "USER") {
          const bookings = await getMyBookings();
          const match = bookings.find(
            (b) => b.event._id === eventData._id && b.status === "CONFIRMED"
          );
          setIsRegistered(Boolean(match));
        }
      } catch (err) {
        if (!ignore) setError(getApiErrorMessage(err));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id, user]);

  async function handleRegister() {
    if (!event) return;
    setIsBooking(true);
    setError("");
    setSuccessMessage("");
    try {
      await createBooking(event._id);
      setEvent({ ...event, seatsAvailable: event.seatsAvailable - 1 });
      setIsRegistered(true);
      setSuccessMessage("You have successfully registered for this event.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (!event) {
    return (
      <div className="container-page py-16 text-center">
        <Alert message={error || "Event not found"} />
      </div>
    );
  }

  const isSoldOut = event.seatsAvailable <= 0;

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-72 w-full overflow-hidden rounded-lg bg-gray-100">
            {event.image ? (
              <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="mt-6">
            <Badge variant="info">{event.category}</Badge>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-4 whitespace-pre-line text-gray-600">{event.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow label="Date" value={formatDate(event.date)} />
            <DetailRow label="Time" value={event.time} />
            <DetailRow label="Venue" value={event.venue} />
            <DetailRow label="Organizer" value={event.organizer?.name || "N/A"} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(event.ticketPrice)}
              </span>
              {!isSoldOut && (
                <span className="text-sm text-gray-500">{event.seatsAvailable} seats left</span>
              )}
            </div>

            <div className="mt-6">
              {error && <Alert message={error} />}
              {successMessage && <Alert variant="success" message={successMessage} />}
            </div>

            <div className="mt-4">
              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Please login to register</p>
                  <Link to="/login">
                    <Button className="w-full">Login to Register</Button>
                  </Link>
                </div>
              ) : user.role === "ORGANIZER" ? (
                <p className="text-sm text-gray-500">
                  Organizer accounts cannot register for events.
                </p>
              ) : isRegistered ? (
                <Badge variant="success">Already Registered</Badge>
              ) : isSoldOut ? (
                <Badge variant="danger">Sold Out</Badge>
              ) : (
                <Button className="w-full" isLoading={isBooking} onClick={handleRegister}>
                  Register Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value}</p>
    </div>
  );
}
