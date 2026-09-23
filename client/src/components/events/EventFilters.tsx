import { EVENT_CATEGORIES } from "../../types";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";

interface EventFiltersProps {
  search: string;
  category: string;
  date: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClear: () => void;
}

export function EventFilters({
  search,
  category,
  date,
  onSearchChange,
  onCategoryChange,
  onDateChange,
  onClear,
}: EventFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {EVENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />

      <Button variant="outline" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
