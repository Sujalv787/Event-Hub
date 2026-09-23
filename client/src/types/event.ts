export type EventCategory =
  | "Workshop"
  | "Hackathon"
  | "Seminar"
  | "Conference"
  | "Cultural"
  | "Music"
  | "Sports";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Workshop",
  "Hackathon",
  "Seminar",
  "Conference",
  "Cultural",
  "Music",
  "Sports",
];

export interface EventOrganizer {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  capacity: number;
  seatsAvailable: number;
  image: string;
  organizer: EventOrganizer;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerEvent extends Omit<Event, "organizer"> {
  organizer: string;
  registeredCount: number;
}

export interface EventFormValues {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  capacity: number;
  image?: string;
}
