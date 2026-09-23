import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventForm } from "../../components/events/EventForm";
import { getEventById, updateEvent } from "../../services/event.service";
import { getApiErrorMessage } from "../../services/api";
import { EventFormSchemaValues } from "../../utils/validation";
import { Event, EventCategory } from "../../types";
import { PageLoader } from "../../components/common/Spinner";
import { Alert } from "../../components/common/Alert";

export function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!id) return;
    getEventById(id)
      .then(setEvent)
      .catch((err) => setLoadError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(values: EventFormSchemaValues) {
    if (!id) return;
    setServerError("");
    try {
      await updateEvent(id, { ...values, category: values.category as EventCategory });
      navigate("/organizer/dashboard");
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (loadError || !event) {
    return (
      <div className="container-page py-16">
        <Alert message={loadError || "Event not found"} />
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
      <p className="mt-1 text-gray-500">Update the details for this event.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <EventForm
          defaultValues={{
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.slice(0, 10),
            time: event.time,
            venue: event.venue,
            ticketPrice: event.ticketPrice,
            capacity: event.capacity,
            image: event.image,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          serverError={serverError}
        />
      </div>
    </div>
  );
}
