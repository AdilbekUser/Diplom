const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const eventRoutes = require("./event.routes");
const hallRoutes = require("./hall.routes");
const bookingRoutes = require("./booking.routes");
const adminRoutes = require("./admin.routes");
const supportRoutes = require("./support.routes");

function createApiRouter() {
  const router = express.Router();

  router.use(authRoutes);
  router.use(userRoutes);
  router.use(eventRoutes);
  router.use(hallRoutes);
  router.use(bookingRoutes);
  router.use(supportRoutes);
  router.use(adminRoutes);

  return router;
}

module.exports = createApiRouter;
