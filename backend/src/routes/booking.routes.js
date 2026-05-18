const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth } = require("../middleware/auth");
const { requireFields, validateObjectId } = require("../middleware/validate");
const {
  bookEvent,
  getMyBookings,
  cancelMyBooking,
  createHallBooking,
  getMyHallBookings,
  updateMyHallBookingPayment,
  cancelMyHallBooking,
  getMyNotifications,
  markMyNotificationRead,
} = require("../controllers/booking.controller");

const router = express.Router();

router.post("/book", dbReady, auth, requireFields(["eventId"]), asyncHandler(bookEvent));
router.get("/my-bookings", dbReady, auth, asyncHandler(getMyBookings));
router.delete("/my-bookings/:id", dbReady, auth, validateObjectId("id"), asyncHandler(cancelMyBooking));
router.post("/hall-bookings", dbReady, auth, asyncHandler(createHallBooking));
router.get("/my-hall-bookings", dbReady, auth, asyncHandler(getMyHallBookings));
router.patch("/my-hall-bookings/:id", dbReady, auth, validateObjectId("id"), asyncHandler(updateMyHallBookingPayment));
router.delete("/my-hall-bookings/:id", dbReady, auth, validateObjectId("id"), asyncHandler(cancelMyHallBooking));
router.get("/my-notifications", dbReady, auth, asyncHandler(getMyNotifications));
router.patch("/my-notifications/:id/read", dbReady, auth, asyncHandler(markMyNotificationRead));

module.exports = router;
