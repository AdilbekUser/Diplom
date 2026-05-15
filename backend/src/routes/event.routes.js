const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth, adminOnly, optionalAuth } = require("../middleware/auth");
const { requireFields, validateObjectId } = require("../middleware/validate");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/events", dbReady, optionalAuth, asyncHandler(getEvents));
router.get("/events/:id", dbReady, validateObjectId("id"), optionalAuth, asyncHandler(getEvent));
router.post("/events", dbReady, auth, adminOnly, requireFields(["title", "date", "category", "location"]), asyncHandler(createEvent));
router.put("/events/:id", dbReady, validateObjectId("id"), auth, adminOnly, requireFields(["title", "date", "category", "location"]), asyncHandler(updateEvent));
router.delete("/events/:id", dbReady, validateObjectId("id"), auth, adminOnly, asyncHandler(deleteEvent));

module.exports = router;
