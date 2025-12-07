import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingControllers.addBooking
);

router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingControllers.getBookings
);

router.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
