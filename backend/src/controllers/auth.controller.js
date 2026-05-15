const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { config } = require("../config/env");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function register(req, res) {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must contain at least 6 characters.");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(400, "This email is already registered.");
  }

  const adminsCount = await User.countDocuments({ role: "admin" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hash,
    role: adminsCount === 0 ? "admin" : "user",
  });

  res.status(201).json({
    success: true,
    message: adminsCount === 0 ? "User has been created as administrator." : "User has been created.",
    role: user.role,
    data: {
      role: user.role,
    },
  });
}

async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User was not found.");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new ApiError(401, "Password is incorrect.");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  const payload = {
    token,
    role: user.role,
    email: user.email,
    name: user.name,
    phone: user.phone,
    organization: user.organization,
    city: user.city,
  };

  res.json({
    success: true,
    message: "Login successful.",
    ...payload,
    data: payload,
  });
}

module.exports = {
  register,
  login,
};
