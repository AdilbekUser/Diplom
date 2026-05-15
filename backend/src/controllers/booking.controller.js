const Event = require("../models/Event");
const User = require("../models/User");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");

async function bookEvent(req, res) {
  const event = await Event.findById(req.body.eventId);

  if (!event) {
    throw new ApiError(404, "Event was not found.");
  }

  if (event.status !== "published") {
    throw new ApiError(400, "Registration is closed for this event.");
  }

  const user = await User.findById(req.user.id);
  const exists = await Booking.findOne({ userEmail: req.user.email, eventId: event._id, status: "registered" });

  if (exists) {
    throw new ApiError(400, "You are already registered for this event.");
  }

  const booked = await Booking.countDocuments({ eventId: event._id, status: "registered" });
  if (booked >= event.capacity) {
    throw new ApiError(400, "There are no free seats for this event.");
  }

  await Booking.create({
    userEmail: req.user.email,
    userName: user?.name || req.user.name || req.user.email,
    userPhone: user?.phone || "",
    organization: user?.organization || "",
    eventId: event._id,
    eventTitle: event.title,
  });

  res.json({ success: true, message: "Participant registration has been completed." });
}

async function getMyBookings(req, res) {
  const bookings = await Booking.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
  res.json(bookings);
}

async function cancelMyBooking(req, res) {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, userEmail: req.user.email },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  res.json({ success: true, message: "Booking has been cancelled." });
}

module.exports = {
  bookEvent,
  getMyBookings,
  cancelMyBooking,
};
