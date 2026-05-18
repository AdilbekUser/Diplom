const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth, adminOnly } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const {
  getBookings,
  getUsers,
  getStats,
  checkInBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  seed,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/bookings", dbReady, auth, adminOnly, asyncHandler(getBookings));
router.get("/users", dbReady, auth, adminOnly, asyncHandler(getUsers));
router.get("/stats", dbReady, auth, adminOnly, asyncHandler(getStats));
router.patch("/bookings/:id/check-in", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(checkInBooking));
router.patch("/bookings/:id/status", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(updateBookingStatus));
router.patch("/bookings/:id", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(updateBooking));
router.delete("/bookings/:id", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(deleteBooking));
router.get("/seed", dbReady, auth, adminOnly, asyncHandler(seed));

module.exports = router;
