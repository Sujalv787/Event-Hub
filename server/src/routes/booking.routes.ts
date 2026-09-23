import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createBookingSchema } from "../validators/booking.validator";
import { UserRole } from "../models/User";

const router = Router();

router.post("/", protect, authorize(UserRole.USER), validate(createBookingSchema), createBooking);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
