const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");
const demoEvents = require("../utils/seedData");

async function getBookings(req, res) {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
}

async function getStats(req, res) {
  const [events, bookings, users, publishedEvents, checkedIn] = await Promise.all([
    Event.countDocuments(),
    Booking.countDocuments({ status: "registered" }),
    User.countDocuments(),
    Event.countDocuments({ status: "published" }),
    Booking.countDocuments({ status: "registered", checkedIn: true }),
  ]);

  const stats = { events, bookings, users, publishedEvents, checkedIn };
  res.json({ success: true, message: "Stats loaded.", ...stats, data: stats });
}

async function checkInBooking(req, res) {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { checkedIn: true, checkedInAt: new Date() },
    { new: true }
  );

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  res.json({ success: true, message: "Participant has been checked in.", booking, data: booking });
}

async function seed(req, res) {
  await Event.deleteMany();
  await Booking.deleteMany();
  await Event.insertMany(demoEvents);

  res.json({ success: true, message: "Demo data has been added." });
}

module.exports = {
  getBookings,
  getStats,
  checkInBooking,
  seed,
};
