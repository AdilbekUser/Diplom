const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth } = require("../middleware/auth");
const { requireFields, validateObjectId } = require("../middleware/validate");
const {
  bookEvent,
  getMyBookings,
  cancelMyBooking,
} = require("../controllers/booking.controller");

const router = express.Router();

router.post("/book", dbReady, auth, requireFields(["eventId"]), asyncHandler(bookEvent));
router.get("/my-bookings", dbReady, auth, asyncHandler(getMyBookings));
router.delete("/my-bookings/:id", dbReady, auth, validateObjectId("id"), asyncHandler(cancelMyBooking));

module.exports = router;
