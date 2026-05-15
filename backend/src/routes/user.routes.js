const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth } = require("../middleware/auth");
const { getMe, updateMe } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", dbReady, auth, asyncHandler(getMe));
router.put("/me", dbReady, auth, asyncHandler(updateMe));

module.exports = router;
