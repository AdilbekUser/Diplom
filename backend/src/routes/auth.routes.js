const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { requireFields } = require("../middleware/validate");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", dbReady, requireFields(["name", "email", "password"]), asyncHandler(register));
router.post("/login", dbReady, requireFields(["email", "password"]), asyncHandler(login));

module.exports = router;
