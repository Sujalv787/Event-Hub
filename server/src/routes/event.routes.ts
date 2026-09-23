import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createEventSchema, updateEventSchema } from "../validators/event.validator";
import { UserRole } from "../models/User";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post(
  "/",
  protect,
  authorize(UserRole.ORGANIZER),
  validate(createEventSchema),
  createEvent
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ORGANIZER),
  validate(updateEventSchema),
  updateEvent
);

router.delete("/:id", protect, authorize(UserRole.ORGANIZER), deleteEvent);

export default router;
