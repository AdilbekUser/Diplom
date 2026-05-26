const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Hall = require("../models/Hall");

const activeBookingStatuses = ["registered", "new", "review", "pending", "approved"];
const confirmedBookingStatuses = ["registered", "approved"];
const activeEventStatuses = ["published", "draft"];

function cleanText(value) {
  const text = String(value ?? "").trim();
  if (!text || ["undefined", "null", "nan"].includes(text.toLowerCase())) return "";
  return text;
}

function minutesFromTime(value) {
  const [hours, minutes] = cleanText(value || "00:00")
    .split(":")
    .map((part) => Number(part || 0));
  return Number(hours || 0) * 60 + Number(minutes || 0);
}

function timeFromMinutes(value) {
  const safe = Math.max(0, Number(value || 0));
  const hours = Math.floor(safe / 60) % 24;
  const minutes = safe % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function endTimeFrom(startTime, duration = 2, explicitEnd = "") {
  if (cleanText(explicitEnd)) return cleanText(explicitEnd);
  return timeFromMinutes(minutesFromTime(startTime) + Number(duration || 2) * 60);
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function sameText(left, right) {
  return cleanText(left).toLowerCase() === cleanText(right).toLowerCase();
}

function bookingStart(booking) {
  return cleanText(booking.time || booking.startTime || "00:00");
}

function bookingEnd(booking) {
  return endTimeFrom(bookingStart(booking), Number(booking.duration || 2), booking.endTime);
}

function eventEnd(event) {
  return endTimeFrom(event.time || "10:00", 2, event.endTime);
}

function hallNames(hall) {
  return [hall?.name, hall?.translations?.ru?.name, hall?.translations?.en?.name, hall?.translations?.kk?.name]
    .map(cleanText)
    .filter(Boolean);
}

function findHallForVenue(halls, { hallId = "", hallName = "", location = "" } = {}) {
  const id = cleanText(hallId);
  if (id) {
    const byId = halls.find((hall) => String(hall._id) === id);
    if (byId) return byId;
  }

  const candidates = [hallName, location].map(cleanText).filter(Boolean);
  if (!candidates.length) return null;

  return halls.find((hall) => hallNames(hall).some((name) => candidates.some((candidate) => sameText(name, candidate)))) || null;
}

function entryStatus(status) {
  return confirmedBookingStatuses.includes(status) || status === "published" ? "busy" : "planned";
}

function bookingMatchesVenue(booking, hall) {
  if (!booking || !hall) return false;
  if (cleanText(booking.hallId) && cleanText(booking.hallId) === String(hall._id)) return true;
  return hallNames(hall).some((name) => sameText(name, booking.hallName) || sameText(name, booking.location));
}

function eventMatchesVenue(event, hall) {
  if (!event || !hall) return false;
  return hallNames(hall).some((name) => sameText(name, event.location) || sameText(name, event.hallName));
}

async function buildAvailability(filters = {}) {
  const date = cleanText(filters.date);
  const hallId = cleanText(filters.hallId);
  const [halls, bookings, events] = await Promise.all([
    Hall.find().lean(),
    Booking.find({
      status: { $in: activeBookingStatuses },
      ...(date ? { date } : {}),
      type: { $in: ["hall", "custom-event"] },
    }).lean(),
    Event.find({
      status: { $in: activeEventStatuses },
      ...(date ? { date } : {}),
    }).lean(),
  ]);

  const entries = [];

  bookings.forEach((booking) => {
    if (booking.type === "custom-event" && booking.eventId) return;
    const hall = findHallForVenue(halls, booking);
    if (!hall) return;
    if (hallId && String(hall._id) !== hallId) return;

    const startTime = bookingStart(booking);
    entries.push({
      source: "booking",
      sourceId: String(booking._id),
      requestType: booking.type,
      hallId: String(hall._id),
      hallName: hall.name,
      date: cleanText(booking.date),
      startTime,
      endTime: bookingEnd(booking),
      status: entryStatus(booking.status),
      requestStatus: booking.status,
      title: booking.type === "custom-event" ? cleanText(booking.eventTitle) || "Event announcement" : cleanText(booking.hallName) || hall.name,
    });
  });

  events.forEach((event) => {
    const hall = findHallForVenue(halls, { hallName: event.hallName, location: event.location });
    if (!hall) return;
    if (hallId && String(hall._id) !== hallId) return;

    const startTime = cleanText(event.time || "10:00");
    entries.push({
      source: "event",
      sourceId: String(event._id),
      requestType: "event",
      hallId: String(hall._id),
      hallName: hall.name,
      date: cleanText(event.date),
      startTime,
      endTime: eventEnd(event),
      status: entryStatus(event.status),
      eventStatus: event.status,
      title: cleanText(event.title) || "Event",
    });
  });

  return entries
    .filter((entry) => entry.date && entry.startTime)
    .sort((left, right) => `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`));
}

async function findScheduleConflicts({
  hallId = "",
  hallName = "",
  location = "",
  date = "",
  time = "",
  duration = 2,
  endTime = "",
  excludeBookingId = "",
  excludeEventId = "",
  statuses = activeBookingStatuses,
} = {}) {
  const cleanDate = cleanText(date);
  const startTime = cleanText(time || "00:00");
  const windowStart = minutesFromTime(startTime);
  const windowEnd = minutesFromTime(endTimeFrom(startTime, duration, endTime));
  if (!cleanDate || !startTime) return [];

  const halls = await Hall.find().lean();
  const targetHall = findHallForVenue(halls, { hallId, hallName, location });
  const targetNames = targetHall ? hallNames(targetHall) : [hallName, location].map(cleanText).filter(Boolean);
  const targetHallId = targetHall ? String(targetHall._id) : cleanText(hallId);

  if (!targetHallId && !targetNames.length) return [];

  const [bookings, events] = await Promise.all([
    Booking.find({
      date: cleanDate,
      status: { $in: statuses },
      type: { $in: ["hall", "custom-event"] },
      ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
    }).lean(),
    Event.find({
      date: cleanDate,
      status: { $in: activeEventStatuses },
      ...(excludeEventId ? { _id: { $ne: excludeEventId } } : {}),
    }).lean(),
  ]);

  const conflicts = [];

  bookings.forEach((booking) => {
    if (booking.type === "custom-event" && booking.eventId) return;
    const sameVenue = targetHall
      ? bookingMatchesVenue(booking, targetHall)
      : targetNames.some((name) => sameText(name, booking.hallName) || sameText(name, booking.location));
    if (!sameVenue) return;

    const existingStart = minutesFromTime(bookingStart(booking));
    const existingEnd = minutesFromTime(bookingEnd(booking));
    if (overlaps(windowStart, windowEnd, existingStart, existingEnd)) {
      conflicts.push({ source: "booking", id: String(booking._id), title: booking.eventTitle || booking.hallName || booking.purpose || "Booking" });
    }
  });

  events.forEach((event) => {
    const sameVenue = targetHall
      ? eventMatchesVenue(event, targetHall)
      : targetNames.some((name) => sameText(name, event.location) || sameText(name, event.hallName));
    if (!sameVenue) return;

    const existingStart = minutesFromTime(event.time || "10:00");
    const existingEnd = minutesFromTime(eventEnd(event));
    if (overlaps(windowStart, windowEnd, existingStart, existingEnd)) {
      conflicts.push({ source: "event", id: String(event._id), title: event.title || "Event" });
    }
  });

  return conflicts;
}

module.exports = {
  activeBookingStatuses,
  confirmedBookingStatuses,
  activeEventStatuses,
  buildAvailability,
  cleanText,
  endTimeFrom,
  findScheduleConflicts,
  minutesFromTime,
  overlaps,
};
