const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "event",
      enum: ["event", "hall", "custom-event"],
    },
    userId: { type: String, trim: true, default: "" },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, trim: true, default: "" },
    organization: { type: String, trim: true, default: "" },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required() {
        return this.type === "event";
      },
    },
    eventTitle: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    format: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    hallId: { type: String, trim: true, default: "" },
    hallName: { type: String, trim: true, default: "" },
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    startTime: { type: String, trim: true, default: "" },
    endTime: { type: String, trim: true, default: "" },
    duration: { type: Number, default: 0 },
    attendees: { type: Number, default: 0 },
    purpose: { type: String, trim: true, default: "" },
    adminNotes: { type: String, trim: true, default: "" },
    services: { type: Array, default: [] },
    equipment: { type: Array, default: [] },
    price: { type: Number, default: 0 },
    ticketPrice: { type: Number, default: 0 },
    pricePerHour: { type: Number, default: 0 },
    rentAmount: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      default: "free",
      enum: ["free", "unpaid", "paid", "refunded"],
    },
    paymentMethod: { type: String, trim: true, default: "" },
    paidAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    status: {
      type: String,
      default: "pending",
      enum: ["new", "review", "pending", "approved", "rejected", "cancelled", "registered"],
    },
    adminReason: { type: String, trim: true, default: "" },
    clientNotificationReadAt: { type: Date, default: null },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
