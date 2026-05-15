function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: "Route was not found.",
  });
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error.";

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value already exists.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((error) => error.message).join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
