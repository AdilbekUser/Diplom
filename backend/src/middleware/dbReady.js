const { isDbReady } = require("../config/db");
const ApiError = require("../utils/apiError");

function dbReady(req, res, next) {
  if (!isDbReady()) {
    return next(new ApiError(503, "Database is connecting. Please try again in a few seconds."));
  }

  return next();
}

module.exports = dbReady;
