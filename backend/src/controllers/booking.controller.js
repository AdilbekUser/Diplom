const Event = require("../models/Event");
const Hall = require("../models/Hall");
const User = require("../models/User");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");

const activeBookingStatuses = ["registered", "new", "review", "pending", "approved"];
const inactiveBookingStatuses = ["rejected", "cancelled"];
const customEventAnnouncementPrice = 10000;

function normalizePaymentStatus(value, amount) {
  const status = String(value || "").trim();
  if (["free", "unpaid", "paid", "refunded"].includes(status)) return status;
  return Number(amount || 0) > 0 ? "unpaid" : "free";
}

function checkedEquipment(body) {
  if (Array.isArray(body.equipment)) return body.equipment;

  return ["projector", "mic", "webcast", "catering"]
    .filter((name) => body[`eq_${name}`] === true || body[`eq_${name}`] === "true" || body[`eq_${name}`] === "on")
    .map((name) => ({ name }));
}

function minutesFromTime(value) {
  const [hours, minutes] = String(value || "00:00")
    .split(":")
    .map((part) => Number(part || 0));
  return hours * 60 + minutes;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function userPayload(req) {
  const user = await User.findById(req.user.id);
  return {
    userId: String(user?._id || req.user.id || ""),
    userEmail: user?.email || req.user.email,
    userName: user?.name || req.user.name || req.user.email,
    userPhone: user?.phone || "",
    organization: user?.organization || "",
  };
}

async function bookEvent(req, res) {
  const event = await Event.findById(req.body.eventId);

  if (!event) {
    throw new ApiError(404, "Event was not found.");
  }

  if (event.status !== "published") {
    throw new ApiError(400, "Registration is closed for this event.");
  }

  const exists = await Booking.findOne({ userEmail: req.user.email, eventId: event._id, status: { $in: activeBookingStatuses } });

  if (exists) {
    throw new ApiError(400, "You are already registered for this event.");
  }

  const booked = await Booking.countDocuments({ eventId: event._id, status: { $in: activeBookingStatuses } });
  if (booked >= event.capacity) {
    throw new ApiError(400, "There are no free seats for this event.");
  }

  const price = Number(event.price || 0);
  const paymentStatus = normalizePaymentStatus(req.body.paymentStatus, price);
  const requester = await userPayload(req);
  const booking = await Booking.create({
    ...requester,
    userName: String(req.body.userName || req.body.contactName || requester.userName || "").trim(),
    userEmail: String(req.body.userEmail || req.body.email || requester.userEmail || "").trim(),
    userPhone: String(req.body.userPhone || req.body.phone || requester.userPhone || "").trim(),
    type: "event",
    eventId: event._id,
    eventTitle: event.title,
    date: event.date,
    time: event.time,
    price,
    amount: price,
    paymentStatus,
    paymentMethod: price > 0 ? String(req.body.paymentMethod || "card").trim() : "free",
    paidAt: paymentStatus === "paid" ? new Date() : null,
    status: "pending",
  });

  res.json({ success: true, message: "Participant registration has been completed.", booking, data: booking });
}

async function getMyBookings(req, res) {
  const bookings = await Booking.find({
    userEmail: req.user.email,
    $or: [{ type: "event" }, { type: { $exists: false } }],
  }).sort({ createdAt: -1 });
  res.json(bookings);
}

async function cancelMyBooking(req, res) {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, userEmail: req.user.email, $or: [{ type: "event" }, { type: { $exists: false } }] },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  res.json({ success: true, message: "Booking has been cancelled." });
}

async function updateMyBookingPayment(req, res) {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userEmail: req.user.email,
    $or: [{ type: "event" }, { type: { $exists: false } }],
  });

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  if (inactiveBookingStatuses.includes(booking.status)) {
    throw new ApiError(400, "Request status cannot be updated.");
  }

  booking.paymentStatus = "paid";
  booking.paymentMethod = String(req.body.paymentMethod || booking.paymentMethod || "card").trim();
  booking.paidAt = new Date();
  await booking.save();

  res.json({ success: true, message: "Payment has been completed.", booking, data: booking });
}

async function createHallBooking(req, res) {
  const type = String(req.body.type || "hall").trim() === "custom-event" ? "custom-event" : "hall";
  const date = String(req.body.date || "").trim();
  const time = String(req.body.time || req.body.startTime || "").trim();
  const duration = Number(req.body.duration || 0);
  const attendees = Number(req.body.attendees || 0);
  const purpose = String(req.body.purpose || req.body.description || "").trim();
  const hallId = String(req.body.hallId || "").trim();
  const ownLocation = String(req.body.location || "").trim();
  const ownCity = String(req.body.city || "").trim();

  if (!date || !time || !duration || !attendees || !purpose) {
    throw new ApiError(400, "Hall request fields are required.");
  }
  if (type === "hall" && !hallId) {
    throw new ApiError(400, "Hall request fields are required.");
  }
  if (type === "custom-event" && (!req.body.eventTitle || !ownLocation || !ownCity)) {
    throw new ApiError(400, "Event title, location and city are required.");
  }

  const hall = type === "hall" ? await Hall.findById(hallId) : null;
  if (type === "hall" && !hall) {
    throw new ApiError(404, "Hall was not found.");
  }
  if (hall && attendees > hall.capacity) {
    throw new ApiError(400, "Guest count exceeds hall capacity.");
  }

  const start = minutesFromTime(time);
  const end = start + duration * 60;
  if (type === "hall") {
    const sameDayBookings = await Booking.find({
      hallId,
      date,
      status: { $in: activeBookingStatuses },
    });
    const bookingConflict = sameDayBookings.some((booking) => {
      const bookingStart = minutesFromTime(booking.time || booking.startTime || "00:00");
      const bookingEnd = booking.endTime ? minutesFromTime(booking.endTime) : bookingStart + Number(booking.duration || 2) * 60;
      return overlaps(start, end, bookingStart, bookingEnd);
    });
    if (bookingConflict) {
      throw new ApiError(400, "This hall time slot is already booked.");
    }

    const sameDayEvents = await Event.find({ date, location: hall.name, status: { $in: ["published", "draft"] } });
    const eventConflict = sameDayEvents.some((event) => {
      const eventStart = minutesFromTime(event.time || "10:00");
      return overlaps(start, end, eventStart, eventStart + 120);
    });
    if (eventConflict) {
      throw new ApiError(400, "This hall time slot is already used by an event.");
    }
  }

  const hallName = String(req.body.hallName || hall?.name || "").trim();
  const pricePerHour = Number(req.body.pricePerHour || hall?.pricePerHour || 0);
  const amount = Number(req.body.amount || (type === "custom-event" ? customEventAnnouncementPrice : pricePerHour * duration) || 0);
  const paymentStatus = normalizePaymentStatus(req.body.paymentStatus, amount);
  const booking = await Booking.create({
    ...(await userPayload(req)),
    type,
    status: "pending",
    eventTitle: String(req.body.eventTitle || req.body.title || purpose || hallName || "Hall request").trim(),
    category: String(req.body.category || "").trim(),
    format: String(req.body.format || "").trim(),
    description: String(req.body.description || "").trim(),
    location: type === "custom-event" ? ownLocation : hallName,
    city: ownCity,
    hallId,
    hallName,
    date,
    time,
    startTime: String(req.body.startTime || time).trim(),
    endTime: String(req.body.endTime || "").trim(),
    duration,
    attendees,
    purpose,
    adminNotes: String(req.body.adminNotes || req.body.notes || "").trim(),
    services: Array.isArray(req.body.services) ? req.body.services : [],
    equipment: checkedEquipment(req.body),
    ticketPrice: Number(req.body.ticketPrice || 0),
    pricePerHour,
    rentAmount: Number(req.body.rentAmount || pricePerHour * duration || 0),
    amount,
    paymentStatus,
    paymentMethod: amount > 0 ? String(req.body.paymentMethod || "card").trim() : "free",
    paidAt: paymentStatus === "paid" ? new Date() : null,
  });

  res.status(201).json({ success: true, message: "Hall request has been created.", booking, data: booking });
}

async function getMyNotifications(req, res) {
  const bookings = await Booking.find({
    userEmail: req.user.email,
    status: { $in: ["approved", "rejected", "cancelled"] },
    type: { $in: ["hall", "custom-event"] },
  }).sort({ updatedAt: -1 });

  res.json(
    bookings.map((booking) => ({
      _id: `booking-${booking._id}`,
      type: booking.status === "approved" ? "success" : "warn",
      messageKey:
        booking.status === "approved"
          ? "msgRequestApproved"
          : booking.status === "rejected"
            ? "msgRequestRejected"
            : "msgRequestCancelledByAdmin",
      reason: booking.adminReason || "",
      requestId: String(booking._id),
      requestType: booking.type,
      read: Boolean(booking.clientNotificationReadAt),
      createdAt: booking.updatedAt || booking.createdAt,
    }))
  );
}

async function markMyNotificationRead(req, res) {
  const id = String(req.params.id || "").replace(/^booking-/, "");
  const booking = await Booking.findOneAndUpdate(
    { _id: id, userEmail: req.user.email },
    { clientNotificationReadAt: new Date() },
    { new: true }
  );
  if (!booking) throw new ApiError(404, "Notification was not found.");
  res.json({ success: true, message: "Notification has been marked as read." });
}

async function getMyHallBookings(req, res) {
  const bookings = await Booking.find({
    userEmail: req.user.email,
    type: { $in: ["hall", "custom-event"] },
  }).sort({ createdAt: -1 });
  res.json(bookings);
}

async function updateMyHallBookingPayment(req, res) {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userEmail: req.user.email,
    type: { $in: ["hall", "custom-event"] },
  });

  if (!booking) {
    throw new ApiError(404, "Booking was not found.");
  }

  if (inactiveBookingStatuses.includes(booking.status)) {
    throw new ApiError(400, "Request status cannot be updated.");
  }

  booking.paymentStatus = "paid";
  booking.paymentMethod = String(req.body.paymentMethod || booking.paymentMethod || "card").trim();
  booking.paidAt = new Date();
  await booking.save();

  res.json({ success: true, message: "Payment has been completed.", booking, data: booking });
}

async function cancelMyHallBooking(req, res) {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, userEmail: req.user.email, type: { $in: ["hall", "custom-event"] } },
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
  updateMyBookingPayment,
  cancelMyBooking,
  createHallBooking,
  getMyHallBookings,
  updateMyHallBookingPayment,
  cancelMyHallBooking,
  getMyNotifications,
  markMyNotificationRead,
};
