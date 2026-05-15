const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, trim: true, default: "10:00" },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    agenda: { type: String, trim: true, default: "" },
    organizer: { type: String, trim: true, default: "ORDA" },
    location: { type: String, required: true, trim: true },
    format: { type: String, default: "offline", enum: ["offline", "online", "hybrid"] },
    meetingUrl: { type: String, trim: true, default: "" },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, trim: true, default: "KZT" },
    featured: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    capacity: { type: Number, default: 80, min: 1 },
    status: { type: String, default: "published", enum: ["draft", "published", "closed"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
