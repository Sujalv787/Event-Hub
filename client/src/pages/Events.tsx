import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Event } from "../types";
import { getEvents } from "../services/event.service";
import { EventCard } from "../components/events/EventCard";
import { EventFilters } from "../components/events/EventFilters";
import { Spinner } from "../components/common/Spinner";
import { EmptyState } from "../components/common/EmptyState";

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (date) params.date = date;
      setSearchParams(params, { replace: true });

      setIsLoading(true);
      getEvents(params)
        .then(setEvents)
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, category, date, setSearchParams]);

  function handleClear() {
    setSearch("");
    setCategory("");
    setDate("");
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Browse Events</h1>

      <EventFilters
        search={search}
        category={category}
        date={date}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onDateChange={setDate}
        onClear={handleClear}
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
