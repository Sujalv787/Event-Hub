import { Schema, model, Document, Types } from "mongoose";

export enum EventCategory {
  WORKSHOP = "Workshop",
  HACKATHON = "Hackathon",
  SEMINAR = "Seminar",
  CONFERENCE = "Conference",
  CULTURAL = "Cultural",
  MUSIC = "Music",
  SPORTS = "Sports",
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  time: string;
  venue: string;
  ticketPrice: number;
  capacity: number;
  seatsAvailable: number;
  image: string;
  organizer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: Object.values(EventCategory),
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: [0, "Ticket price cannot be negative"],
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be greater than 0"],
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: [0, "Seats available cannot be negative"],
      validate: {
        validator: function (this: IEvent, value: number) {
          return value <= this.capacity;
        },
        message: "Seats available cannot be greater than capacity",
      },
    },
    image: {
      type: String,
      default: "",
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = model<IEvent>("Event", eventSchema);
