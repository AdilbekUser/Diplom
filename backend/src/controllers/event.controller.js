const Event = require("../models/Event");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");

const activeBookingStatuses = ["registered", "new", "review", "pending", "approved"];

function eventPayload(body) {
  const payload = {
    title: String(body.title || "").trim(),
    date: String(body.date || "").trim(),
    time: String(body.time || "10:00").trim(),
    category: String(body.category || "").trim(),
    description: String(body.description || "").trim(),
    agenda: String(body.agenda || "").trim(),
    organizer: String(body.organizer || "ORDA").trim(),
    location: String(body.location || "").trim(),
    format: String(body.format || "offline").trim(),
    meetingUrl: String(body.meetingUrl || "").trim(),
    price: Number(body.price || 0),
    currency: String(body.currency || "KZT").trim(),
    featured: body.featured === true || body.featured === "true" || body.featured === "on",
    tags: String(body.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    capacity: Number(body.capacity || 80),
    status: String(body.status || "published").trim(),
  };

  if (Object.prototype.hasOwnProperty.call(body, "endDate")) payload.endDate = String(body.endDate || "").trim();
  if (Object.prototype.hasOwnProperty.call(body, "city")) payload.city = String(body.city || "").trim();
  if (Object.prototype.hasOwnProperty.call(body, "image")) payload.image = String(body.image || "").trim();

  return payload;
}

function validateEventPayload(data) {
  if (!data.title || !data.date || !data.category || !data.location) {
    throw new ApiError(400, "Title, date, category and location are required.");
  }

  if (!Number.isFinite(data.capacity) || data.capacity < 1) {
    throw new ApiError(400, "Capacity must be greater than 0.");
  }

  if (!Number.isFinite(data.price) || data.price < 0) {
    throw new ApiError(400, "Price cannot be negative.");
  }
}

async function eventWithBookingCount(event, userEmail) {
  const [booked, userBooking] = await Promise.all([
    Booking.countDocuments({ eventId: event._id, status: { $in: activeBookingStatuses } }),
    userEmail ? Booking.findOne({ eventId: event._id, userEmail, status: { $in: activeBookingStatuses } }) : null,
  ]);

  return {
    ...event.toObject(),
    booked,
    seatsLeft: Math.max(Number(event.capacity || 0) - booked, 0),
    isBookedByMe: Boolean(userBooking),
  };
}

async function getEvents(req, res) {
  const query = {};
  const search = String(req.query.search || "").trim();

  if (req.query.category && req.query.category !== "all") query.category = req.query.category;
  if (req.query.status && req.query.status !== "all") query.status = req.query.status;
  if (req.query.format && req.query.format !== "all") query.format = req.query.format;
  if (req.query.free === "true") query.price = 0;
  if (req.query.featured === "true") query.featured = true;

  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { location: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
      { organizer: new RegExp(search, "i") },
      { tags: new RegExp(search, "i") },
    ];
  }

  const events = await Event.find(query).sort({ date: 1, time: 1, title: 1 });
  const result = await Promise.all(events.map((event) => eventWithBookingCount(event, req.user?.email)));
  res.json(result);
}

async function getEvent(req, res) {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event was not found.");
  }

  const result = await eventWithBookingCount(event, req.user?.email);
  res.json({
    success: true,
    message: "Event loaded.",
    data: result,
    ...result,
  });
}

async function createEvent(req, res) {
  const data = eventPayload(req.body);
  validateEventPayload(data);

  const event = await Event.create(data);
  const result = await eventWithBookingCount(event);
  res.status(201).json({ success: true, message: "Event has been created.", event: result, data: result });
}

async function updateEvent(req, res) {
  const data = eventPayload(req.body);
  validateEventPayload(data);

  const event = await Event.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw new ApiError(404, "Event was not found.");
  }

  const result = await eventWithBookingCount(event);
  res.json({ success: true, message: "Event has been updated.", event: result, data: result });
}

async function deleteEvent(req, res) {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event was not found.");
  }

  await Booking.deleteMany({ eventId: event._id });
  res.json({ success: true, message: "Event has been deleted." });
}

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  eventWithBookingCount,
};
