const Hall = require("../models/Hall");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const ApiError = require("../utils/apiError");

const activeBookingStatuses = ["registered", "new", "review", "pending", "approved"];

function hallPayload(body) {
  const equipment = Array.isArray(body.equipment)
    ? body.equipment
    : String(body.equipment || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const payload = {
    name: String(body.name || "").trim(),
    floor: String(body.floor || "").trim(),
    location: String(body.location || "").trim(),
    capacity: Number(body.capacity || 0),
    pricePerHour: Number(body.pricePerHour || 0),
    equipment,
    description: String(body.description || "").trim(),
    status: String(body.status || "available").trim(),
  };

  if (body.translations && typeof body.translations === "object") {
    payload.translations = body.translations;
  }

  return payload;
}

function assertHallPayload(payload) {
  if (!payload.name || !payload.floor || !payload.location) {
    throw new ApiError(400, "Hall name, floor and location are required.");
  }
  if (!Number.isFinite(payload.capacity) || payload.capacity < 1) {
    throw new ApiError(400, "Capacity must be positive.");
  }
  if (!Number.isFinite(payload.pricePerHour) || payload.pricePerHour < 0) {
    throw new ApiError(400, "Price must not be negative.");
  }
  if (!["available", "busy", "maintenance"].includes(payload.status)) {
    throw new ApiError(400, "Invalid hall status.");
  }
}

async function withActiveRequests(hall) {
  const activeRequests = await Booking.countDocuments({
    hallId: String(hall._id),
    status: { $in: activeBookingStatuses },
  });

  return {
    ...hall.toObject(),
    activeRequests,
  };
}

async function getHalls(req, res) {
  const search = String(req.query.search || "").trim();
  const capacity = String(req.query.capacity || "all").trim();
  const query = {};

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { location: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { "translations.ru.name": new RegExp(search, "i") },
      { "translations.ru.location": new RegExp(search, "i") },
      { "translations.ru.description": new RegExp(search, "i") },
      { "translations.kk.name": new RegExp(search, "i") },
      { "translations.kk.location": new RegExp(search, "i") },
      { "translations.kk.description": new RegExp(search, "i") },
      { "translations.en.name": new RegExp(search, "i") },
      { "translations.en.location": new RegExp(search, "i") },
      { "translations.en.description": new RegExp(search, "i") },
    ];
  }

  if (capacity === "small") query.capacity = { $lte: 50 };
  if (capacity === "medium") query.capacity = { $gt: 50, $lte: 150 };
  if (capacity === "large") query.capacity = { $gt: 150 };

  const halls = await Hall.find(query).sort({ createdAt: -1 });
  const result = await Promise.all(halls.map(withActiveRequests));
  res.json(result);
}

async function createHall(req, res) {
  const payload = hallPayload(req.body);
  assertHallPayload(payload);

  const hall = await Hall.create(payload);
  res.status(201).json({ success: true, message: "Hall has been created.", hall, data: hall });
}

async function updateHall(req, res) {
  const payload = hallPayload(req.body);
  assertHallPayload(payload);

  const hall = await Hall.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!hall) {
    throw new ApiError(404, "Hall was not found.");
  }

  res.json({ success: true, message: "Hall has been updated.", hall, data: hall });
}

async function deleteHall(req, res) {
  const hall = await Hall.findById(req.params.id);
  if (!hall) {
    throw new ApiError(404, "Hall was not found.");
  }

  const hasActiveRequests = await Booking.exists({
    hallId: String(hall._id),
    status: { $in: activeBookingStatuses },
  });
  if (hasActiveRequests) {
    throw new ApiError(400, "Hall has active requests.");
  }

  const usedByEvents = await Event.exists({ location: hall.name, status: { $ne: "closed" } });
  if (usedByEvents) {
    throw new ApiError(400, "Hall is used by active events.");
  }

  await hall.deleteOne();
  res.json({ success: true, message: "Hall has been deleted." });
}

module.exports = {
  getHalls,
  createHall,
  updateHall,
  deleteHall,
};
