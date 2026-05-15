const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, trim: true, default: "" },
    organization: { type: String, trim: true, default: "" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    eventTitle: { type: String, required: true },
    status: { type: String, default: "registered", enum: ["registered", "cancelled"] },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
