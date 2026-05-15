const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    phone: { type: String, trim: true, default: "" },
    organization: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
