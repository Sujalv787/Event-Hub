import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventForm } from "../../components/events/EventForm";
import { createEvent } from "../../services/event.service";
import { getApiErrorMessage } from "../../services/api";
import { EventFormSchemaValues } from "../../utils/validation";
import { EventCategory } from "../../types";

export function CreateEvent() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  async function handleSubmit(values: EventFormSchemaValues) {
    setServerError("");
    try {
      await createEvent({ ...values, category: values.category as EventCategory });
      navigate("/organizer/dashboard");
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
      <p className="mt-1 text-gray-500">Fill in the details for your new event.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <EventForm onSubmit={handleSubmit} submitLabel="Create Event" serverError={serverError} />
      </div>
    </div>
  );
}
