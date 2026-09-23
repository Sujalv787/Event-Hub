import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormSchemaValues } from "../../utils/validation";
import { EVENT_CATEGORIES } from "../../types";
import { Input } from "../common/Input";
import { Textarea } from "../common/Textarea";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { Alert } from "../common/Alert";

interface EventFormProps {
  defaultValues?: Partial<EventFormSchemaValues>;
  onSubmit: (values: EventFormSchemaValues) => Promise<void>;
  submitLabel: string;
  serverError?: string;
}

export function EventForm({
  defaultValues,
  onSubmit,
  submitLabel,
  serverError,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormSchemaValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {serverError && <Alert message={serverError} />}

      <Input
        label="Event Title"
        placeholder="Full-Stack Web Development Workshop"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        rows={4}
        placeholder="Describe what attendees can expect from this event"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Category" error={errors.category?.message} {...register("category")}>
          <option value="">Select category</option>
          {EVENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Input
          label="Venue"
          placeholder="Main Auditorium"
          error={errors.venue?.message}
          {...register("venue")}
        />

        <Input
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />

        <Input
          label="Time"
          placeholder="10:00 AM - 1:00 PM"
          error={errors.time?.message}
          {...register("time")}
        />

        <Input
          label="Ticket Price (₹)"
          type="number"
          min={0}
          error={errors.ticketPrice?.message}
          {...register("ticketPrice")}
        />

        <Input
          label="Capacity"
          type="number"
          min={1}
          error={errors.capacity?.message}
          {...register("capacity")}
        />
      </div>

      <Input
        label="Image URL (optional)"
        placeholder="https://..."
        error={errors.image?.message}
        {...register("image")}
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
