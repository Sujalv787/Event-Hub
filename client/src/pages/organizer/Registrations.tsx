import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EventRegistration, Event } from "../../types";
import { getEventRegistrations } from "../../services/organizer.service";
import { getEventById } from "../../services/event.service";
import { getApiErrorMessage } from "../../services/api";
import { Badge } from "../../components/common/Badge";
import { PageLoader } from "../../components/common/Spinner";
import { Alert } from "../../components/common/Alert";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/format";

export function Registrations() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([getEventById(id), getEventRegistrations(id)])
      .then(([eventData, registrationData]) => {
        setEvent(eventData);
        setRegistrations(registrationData);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container-page py-10">
      <Link to="/organizer/dashboard" className="text-sm text-primary-600 hover:underline">
        ← Back to Dashboard
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {event ? event.title : "Registrations"}
          </h1>
          <p className="mt-1 text-gray-500">{registrations.length} attendee(s) registered</p>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      )}

      <div className="mt-6">
        {registrations.length === 0 ? (
          <EmptyState title="No registrations yet" description="Share your event to get attendees." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Attendee Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Booking Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {registration.user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{registration.user.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(registration.bookingDate)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={registration.status === "CONFIRMED" ? "success" : "danger"}>
                        {registration.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
