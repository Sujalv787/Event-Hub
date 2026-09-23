import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrganizerEvent } from "../../types";
import { getMyOrganizerEvents } from "../../services/organizer.service";
import { deleteEvent } from "../../services/event.service";
import { getApiErrorMessage } from "../../services/api";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { PageLoader } from "../../components/common/Spinner";
import { Alert } from "../../components/common/Alert";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate, isPastDate } from "../../utils/format";

export function OrganizerDashboard() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  function loadEvents() {
    setIsLoading(true);
    getMyOrganizerEvents()
      .then(setEvents)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }

  async function handleDelete(eventId: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(eventId);
    setError("");
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const upcomingCount = events.filter((e) => !isPastDate(e.date)).length;

  return (
    <div className="container-page py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage your events and registrations.</p>
        </div>
        <Link to="/organizer/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {error && (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Events" value={events.length} />
        <StatCard label="Total Registrations" value={totalRegistrations} />
        <StatCard label="Upcoming Events" value={upcomingCount} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Events</h2>
        {events.length === 0 ? (
          <EmptyState
            title="You haven't created any events yet"
            description="Create your first event to start accepting registrations."
            action={
              <Link to="/organizer/events/create">
                <Button>Create Event</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Capacity</th>
                  <th className="px-4 py-3 font-medium">Registered</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{event.title}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(event.date)}</td>
                    <td className="px-4 py-3 text-gray-600">{event.capacity}</td>
                    <td className="px-4 py-3 text-gray-600">{event.registeredCount}</td>
                    <td className="px-4 py-3 text-gray-600">{event.seatsAvailable}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/organizer/events/${event._id}/registrations`}>
                          <Button variant="outline" size="sm">
                            Registrations
                          </Button>
                        </Link>
                        <Link to={`/organizer/events/${event._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={deletingId === event._id}
                          onClick={() => handleDelete(event._id, event.title)}
                        >
                          Delete
                        </Button>
                      </div>
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
