const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth, adminOnly } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const {
  getHalls,
  createHall,
  updateHall,
  deleteHall,
} = require("../controllers/hall.controller");

const router = express.Router();

router.get("/halls", dbReady, asyncHandler(getHalls));
router.post("/halls", dbReady, auth, adminOnly, asyncHandler(createHall));
router.put("/halls/:id", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(updateHall));
router.delete("/halls/:id", dbReady, auth, adminOnly, validateObjectId("id"), asyncHandler(deleteHall));

module.exports = router;
