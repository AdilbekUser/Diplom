const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    floor: { type: String, trim: true, required: true },
    location: { type: String, trim: true, required: true },
    capacity: { type: Number, required: true, min: 1 },
    pricePerHour: { type: Number, default: 0, min: 0 },
    equipment: { type: [String], default: [] },
    description: { type: String, trim: true, default: "" },
    translations: { type: Object, default: {} },
    status: { type: String, enum: ["available", "busy", "maintenance"], default: "available" },
    image: { type: String, trim: true, default: "" },
    advantages: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hall", hallSchema);
