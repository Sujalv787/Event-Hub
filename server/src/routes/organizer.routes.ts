import { Router } from "express";
import { getMyEvents, getRegistrations } from "../controllers/organizer.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../models/User";

const router = Router();

router.use(protect, authorize(UserRole.ORGANIZER));

router.get("/events", getMyEvents);
router.get("/events/:id/bookings", getRegistrations);

export default router;
