const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const dbReady = require("../middleware/dbReady");
const { auth, adminOnly } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validate");
const {
  createSupportMessage,
  getSupportMessages,
  markSupportMessageRead,
  deleteSupportMessage,
} = require("../controllers/support.controller");

const router = express.Router();

router.post("/support-messages", dbReady, auth, asyncHandler(createSupportMessage));
router.get("/support-messages", dbReady, auth, adminOnly, asyncHandler(getSupportMessages));
router.patch(
  "/support-messages/:id/read",
  dbReady,
  auth,
  adminOnly,
  validateObjectId("id"),
  asyncHandler(markSupportMessageRead)
);
router.delete(
  "/support-messages/:id",
  dbReady,
  auth,
  adminOnly,
  validateObjectId("id"),
  asyncHandler(deleteSupportMessage)
);

module.exports = router;
