const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth, adminOnly } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const {
  getBookings,
  getStats,
  checkInBooking,
  seed,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/bookings", dbReady, auth, adminOnly, asyncHandler(getBookings));
router.get("/stats", dbReady, auth, adminOnly, asyncHandler(getStats));
router.patch("/bookings/:id/check-in", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(checkInBooking));
router.get("/seed", dbReady, asyncHandler(seed));

module.exports = router;
