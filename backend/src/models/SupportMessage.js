const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    userId: { type: String, trim: true, default: "" },
    userName: { type: String, trim: true, required: true },
    userEmail: { type: String, trim: true, required: true },
    text: { type: String, trim: true, required: true },
    status: { type: String, enum: ["new", "read"], default: "new" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
