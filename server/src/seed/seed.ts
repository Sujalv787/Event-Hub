import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { env } from "../config/env";
import { User, UserRole } from "../models/User";
import { Event, EventCategory } from "../models/Event";
import { Booking, BookingStatus } from "../models/Booking";

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB for seeding");

  await Booking.deleteMany({});
  await Event.deleteMany({});
  await User.deleteMany({});

  const organizer = await User.create({
    name: "Priya Verma",
    email: "organizer@eventhub.com",
    password: "password123",
    role: UserRole.ORGANIZER,
  });

  const user = await User.create({
    name: "Rahul Sharma",
    email: "user@eventhub.com",
    password: "password123",
    role: UserRole.USER,
  });

  const eventsData = [
    {
      title: "Full-Stack Web Development Workshop",
      description:
        "A hands-on workshop covering React, Node.js and MongoDB. Build and deploy a complete web application in one day.",
      category: EventCategory.WORKSHOP,
      date: daysFromNow(10),
      time: "10:00 AM - 4:00 PM",
      venue: "CS Seminar Hall, Block A",
      ticketPrice: 199,
      capacity: 60,
      image: "https://picsum.photos/seed/eventhub-workshop1/800/450",
    },
    {
      title: "CodeStorm Hackathon 2026",
      description:
        "A 24-hour hackathon where teams build innovative solutions to real-world problems. Great prizes and mentorship from industry experts.",
      category: EventCategory.HACKATHON,
      date: daysFromNow(20),
      time: "9:00 AM onwards (24 hrs)",
      venue: "Main Auditorium",
      ticketPrice: 0,
      capacity: 120,
      image: "https://picsum.photos/seed/eventhub-hackathon1/800/450",
    },
    {
      title: "AI & Machine Learning Seminar",
      description:
        "Industry experts discuss the latest trends in artificial intelligence and machine learning, with a focus on career opportunities for students.",
      category: EventCategory.SEMINAR,
      date: daysFromNow(5),
      time: "2:00 PM - 5:00 PM",
      venue: "Room 204, Academic Block",
      ticketPrice: 0,
      capacity: 80,
      image: "https://picsum.photos/seed/eventhub-seminar1/800/450",
    },
    {
      title: "National Tech Conference 2026",
      description:
        "A full-day conference featuring speakers from top tech companies, covering software engineering, product management and entrepreneurship.",
      category: EventCategory.CONFERENCE,
      date: daysFromNow(30),
      time: "9:00 AM - 6:00 PM",
      venue: "City Convention Centre",
      ticketPrice: 499,
      capacity: 200,
      image: "https://picsum.photos/seed/eventhub-conference1/800/450",
    },
    {
      title: "Rangmanch Cultural Fest",
      description:
        "An evening of dance, music and drama performances by students. Open to all with food stalls and games.",
      category: EventCategory.CULTURAL,
      date: daysFromNow(15),
      time: "5:00 PM onwards",
      venue: "Open Air Theatre",
      ticketPrice: 50,
      capacity: 300,
      image: "https://picsum.photos/seed/eventhub-cultural1/800/450",
    },
    {
      title: "Live Music Night",
      description:
        "A live performance featuring local bands and solo artists across genres. Food and beverages available on campus grounds.",
      category: EventCategory.MUSIC,
      date: daysFromNow(12),
      time: "7:00 PM - 10:00 PM",
      venue: "College Ground",
      ticketPrice: 150,
      capacity: 250,
      image: "https://picsum.photos/seed/eventhub-music1/800/450",
    },
    {
      title: "Inter-College Sports Meet",
      description:
        "Annual sports competition featuring athletics, football, basketball and badminton between colleges in the region.",
      category: EventCategory.SPORTS,
      date: daysFromNow(25),
      time: "8:00 AM - 5:00 PM",
      venue: "Sports Complex",
      ticketPrice: 0,
      capacity: 150,
      image: "https://picsum.photos/seed/eventhub-sports1/800/450",
    },
    {
      title: "Cloud Computing with AWS Workshop",
      description:
        "Learn the basics of cloud computing and get hands-on experience deploying applications on AWS. Laptop required.",
      category: EventCategory.WORKSHOP,
      date: daysFromNow(8),
      time: "11:00 AM - 3:00 PM",
      venue: "Computer Lab 3",
      ticketPrice: 99,
      capacity: 50,
      image: "https://picsum.photos/seed/eventhub-workshop2/800/450",
    },
  ];

  const events = await Event.create(
    eventsData.map((data) => ({
      ...data,
      seatsAvailable: data.capacity,
      organizer: organizer._id,
    }))
  );

  const bookedEvents = [events[0], events[2]];
  for (const event of bookedEvents) {
    await Booking.create({
      user: user._id,
      event: event._id,
      status: BookingStatus.CONFIRMED,
    });
    event.seatsAvailable -= 1;
    await event.save();
  }

  console.log("Seed data created:");
  console.log(`  Organizer login -> email: organizer@eventhub.com | password: password123`);
  console.log(`  User login      -> email: user@eventhub.com | password: password123`);
  console.log(`  ${events.length} events created`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
