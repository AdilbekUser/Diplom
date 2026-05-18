const { dbStatus, isDbReady } = require("../config/db");
const ApiError = require("../utils/apiError");

function dbReady(req, res, next) {
  if (!isDbReady()) {
    const message =
      dbStatus() === "disabled"
        ? "Database is not configured. Set a real MONGODB_URI to use backend data."
        : "Database is connecting. Please try again in a few seconds.";
    return next(new ApiError(503, message));
  }

  return next();
}

module.exports = dbReady;
