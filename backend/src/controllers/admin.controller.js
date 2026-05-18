const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");
const demoEvents = require("../utils/seedData");

const activeBookingStatuses = ["registered", "new", "review", "pending", "approved"];
const adminBookingStatuses = ["new", "review", "pending", "approved", "rejected", "cancelled", "registered"];

async function getBookings(req, res) {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
}

async function getUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

async function getStats(req, res) {
  const [events, bookings, users, publishedEvents, checkedIn, paidTickets, approvedHallBookings] = await Promise.all([
    Event.countDocuments(),
    Booking.countDocuments({ status: { $in: activeBookingStatuses } }),
    User.countDocuments(),
    Event.countDocuments({ status: "published" }),
    Booking.countDocuments({ status: { $in: activeBookingStatuses }, checkedIn: true }),
    Booking.countDocuments({ type: "event", paymentStatus: "paid" }),
    Booking.countDocuments({ type: { $in: ["hall", "custom-event"] }, status: "approved" }),
  ]);

  const stats = { events, bookings, users, publishedEvents, checkedIn, paidTickets, approvedHallBookings };
  res.json({ success: true, message: "Stats loaded.", ...stats, data: stats });
}

async function checkInBooking(req, res) {
  const existing = await Booking.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, "Booking was not found.");
  }

  if (!["approved", "registered"].includes(existing.status)) {
    throw new ApiError(400, "Check-in is available only for approved requests.");
  }

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

function bookingStatusPayload(body, fallbackStatus) {
  const status = String(body.status || fallbackStatus || "").trim();

  if (!adminBookingStatuses.includes(status)) {
    throw new ApiError(400, "Invalid request status.");
  }

  return {
    status,
    adminReason: String(body.reason || body.adminReason || "").trim(),
  };
}

async function publishCustomEvent(booking) {
  if (booking.type !== "custom-event" || booking.eventId) return;

  const event = await Event.create({
    title: booking.eventTitle || "Client event",
    date: booking.date,
    time: booking.time || booking.startTime || "10:00",
    category: booking.category || "conference",
    description: booking.description || booking.purpose || "",
    agenda: `Длительность: ${booking.duration || 1} ч. ${booking.adminNotes || ""}`.trim(),
    organizer: booking.organization || booking.userName || "Client",
    location: booking.location || booking.hallName || "Client venue",
    city: booking.city || "",
    format: ["offline", "online", "hybrid"].includes(booking.format) ? booking.format : "offline",
    price: Number(booking.ticketPrice || 0),
    currency: "KZT",
    capacity: Number(booking.attendees || 80),
    status: "published",
    tags: [booking.category, "client-event"].filter(Boolean),
  });

  booking.eventId = event._id;
}

async function updateBooking(req, res) {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  const previousStatus = booking.status;
  const payload = bookingStatusPayload(req.body, booking.status);
  booking.status = payload.status;
  booking.adminReason = payload.adminReason;
  if (payload.status !== previousStatus && ["approved", "rejected", "cancelled"].includes(payload.status)) {
    booking.clientNotificationReadAt = null;
  }
  if (booking.type === "hall" || booking.type === "custom-event") {
    if (req.body.date) booking.date = String(req.body.date).trim();
    if (req.body.time) booking.time = String(req.body.time).trim();
    if (Number(req.body.duration) > 0) booking.duration = Number(req.body.duration);
    if (Number(req.body.attendees) > 0) booking.attendees = Number(req.body.attendees);
    if (typeof req.body.purpose === "string") booking.purpose = String(req.body.purpose).trim();
    booking.amount = Number(booking.pricePerHour || 0) * Number(booking.duration || 0) || Number(booking.amount || 0);
  }

  if (payload.status !== "approved" && payload.status !== "registered") {
    booking.checkedIn = false;
    booking.checkedInAt = null;
  }

  if (payload.status === "approved") {
    await publishCustomEvent(booking);
  }

  await booking.save();

  res.json({ success: true, message: "Request status updated.", booking, data: booking });
}

async function updateBookingStatus(req, res) {
  return updateBooking(req, res);
}

async function deleteBooking(req, res) {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  res.json({ success: true, message: "Request has been deleted." });
}

async function seed(req, res) {
  await Event.deleteMany();
  await Booking.deleteMany();
  await Event.insertMany(demoEvents);

  res.json({ success: true, message: "Demo data has been added." });
}

module.exports = {
  getBookings,
  getUsers,
  getStats,
  checkInBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  seed,
};
