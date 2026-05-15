const ApiError = require("../utils/apiError");

function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length) {
      return next(new ApiError(400, `Missing required fields: ${missing.join(", ")}`));
    }

    return next();
  };
}

function validateObjectId(paramName = "id") {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!/^[a-f\d]{24}$/i.test(String(value))) {
      return next(new ApiError(400, `Invalid ${paramName}.`));
    }

    return next();
  };
}

module.exports = {
  requireFields,
  validateObjectId,
};
