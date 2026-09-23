# EventHub — Smart Event & Workshop Booking Platform

EventHub is a full-stack web application that lets college event organizers create and manage events (workshops, hackathons, seminars, conferences, cultural fests, etc.) while attendees can browse events, register for them, and track their bookings — all from one platform instead of Google Forms, spreadsheets and WhatsApp groups.

Built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript on both the client and server.

## 1. Project Overview

EventHub solves a simple, real problem: college events are usually managed through scattered tools — a Google Form for registration, a spreadsheet to track who signed up, a WhatsApp group for updates. EventHub centralizes this into one platform with two roles:

- **Organizers** create and manage events and can see exactly who registered.
- **Attendees** browse events, register in one click, and manage their bookings.

Seat availability is tracked automatically and updated in real time as users register or cancel.

## 2. Features

**Attendees**
- Register / login with JWT-based authentication
- Browse all events with search, category filter and date filter
- View full event details
- Register for an event (with duplicate-booking and sold-out protection)
- View all bookings on a "My Bookings" page
- Cancel a confirmed booking (seat is released back to the event)
- Personal dashboard with booking stats

**Organizers**
- Create, edit and delete their own events
- Dashboard with total events, total registrations and upcoming events
- View the full attendee list for any of their events, with booking status

**General**
- Role-based access control (USER vs ORGANIZER)
- Server-side seat management (never trusts the frontend)
- Clean error messages for invalid input, unauthorized access, etc.

## 3. Tech Stack

**Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS, Axios, React Hook Form, Zod

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod

## 4. Application Flow

```
User opens Event Details
        ↓
Clicks Register
        ↓
Backend verifies JWT
        ↓
Check event exists
        ↓
Check seatsAvailable > 0
        ↓
Check user has not already booked
        ↓
Create Booking + decrease seatsAvailable by 1
        ↓
Frontend updates the event card
```

Cancelling a booking flips its status to `CANCELLED` and increases `seatsAvailable` back by 1. All of this logic lives on the backend — the frontend only reflects what the API returns.

## 5. User Roles

| Role | Capabilities |
|---|---|
| **USER** | Browse/search events, register for events, view & cancel own bookings |
| **ORGANIZER** | Create/edit/delete own events, view registrations for own events |

There is no separate admin role — it wasn't needed for the scope of this project.

## 6. Database Structure

**User**
```
name, email (unique), password (hashed), role [USER | ORGANIZER], timestamps
```

**Event**
```
title, description, category, date, time, venue,
ticketPrice, capacity, seatsAvailable, image,
organizer (ref User), timestamps
```

**Booking**
```
user (ref User), event (ref Event), bookingDate,
status [CONFIRMED | CANCELLED], timestamps
```

## 7. API Overview

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

**Events**
```
GET    /api/events            search, category, date query params
GET    /api/events/:id
POST   /api/events            organizer only
PATCH  /api/events/:id        organizer only, owner only
DELETE /api/events/:id        organizer only, owner only
```

**Bookings**
```
POST   /api/bookings          { eventId }, user only
GET    /api/bookings/my
PATCH  /api/bookings/:id/cancel
```

**Organizer**
```
GET    /api/organizer/events
GET    /api/organizer/events/:id/bookings
```

## 8. Folder Structure

```
event-hub/
├── server/
│   └── src/
│       ├── config/       env loading, MongoDB connection
│       ├── models/       Mongoose schemas (User, Event, Booking)
│       ├── controllers/  request/response handling
│       ├── routes/       Express routers per resource
│       ├── middleware/   auth, role check, validation, error handling
│       ├── services/     business logic (booking flow, seat math, etc.)
│       ├── validators/   Zod schemas for request bodies
│       ├── utils/        JWT helpers, ApiError, asyncHandler
│       ├── seed/         demo data script
│       └── app.ts / server.ts
│
└── client/
    └── src/
        ├── components/   reusable UI pieces (common, layout, events, bookings, auth)
        ├── pages/        route-level views, incl. pages/organizer
        ├── layouts/       shared page shell (navbar + footer)
        ├── context/       AuthContext (current user, login/logout)
        ├── hooks/         useAuth
        ├── services/      Axios calls to the backend, grouped by resource
        ├── types/         shared TypeScript interfaces
        ├── utils/         formatting + Zod validation schemas
        └── App.tsx / main.tsx
```

## 9. Environment Variables

**server/.env** (copy from `server/.env.example`)
```
MONGO_URI=mongodb://127.0.0.1:27017/eventhub
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `client/.env.example`)
```
VITE_API_URL=http://localhost:5000/api
```

Never commit real `.env` files — only the `.env.example` templates are checked in.

## 10. Installation

```bash
git clone <repo-url>
cd event-hub
```

You'll need a MongoDB instance running locally (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### Backend setup

```bash
cd server
npm install
cp .env.example .env   # then fill in your own values
npm run seed            # optional: populates demo data
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Frontend setup

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` by default.

### Demo accounts (after running `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Organizer | organizer@eventhub.com | password123 |
| Attendee | user@eventhub.com | password123 |

## 11. Screenshots

_Add screenshots of the Home page, Events page, Event Details, User Dashboard and Organizer Dashboard here once the app is running._

## 12. Future Improvements

- Email notifications on booking confirmation/cancellation
- Pagination for the events list
- Image upload instead of pasting an image URL
- QR-code based check-in for events
- Waitlist when an event is sold out
