const jwt = require("jsonwebtoken");
const { config } = require("../config/env");
const ApiError = require("../utils/apiError");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Authorization token is missing."));
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch (err) {
    return next(new ApiError(403, "Authorization token is invalid or expired."));
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access is required."));
  }

  return next();
}

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    req.user = null;
  }

  return next();
}

module.exports = {
  auth,
  adminOnly,
  optionalAuth,
};
