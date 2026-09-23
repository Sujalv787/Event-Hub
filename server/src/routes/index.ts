import { Router } from "express";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import bookingRoutes from "./booking.routes";
import organizerRoutes from "./organizer.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);
router.use("/organizer", organizerRoutes);

export default router;
