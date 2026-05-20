const User = require("../models/User");
const SupportMessage = require("../models/SupportMessage");
const ApiError = require("../utils/apiError");

async function createSupportMessage(req, res) {
  const text = String(req.body.message || req.body.text || "").trim();

  if (!text) {
    throw new ApiError(400, "Support message text is required.");
  }

  const user = await User.findById(req.user.id);
  const message = await SupportMessage.create({
    userId: String(user?._id || req.user.id || ""),
    userName: user?.name || req.user.name || req.user.email,
    userEmail: user?.email || req.user.email,
    text,
  });

  res.status(201).json({ success: true, message: "Support message has been sent.", data: message, supportMessage: message });
}

async function getSupportMessages(req, res) {
  const messages = await SupportMessage.find().sort({ createdAt: -1 });
  res.json(messages);
}

async function markSupportMessageRead(req, res) {
  const message = await SupportMessage.findByIdAndUpdate(
    req.params.id,
    { status: "read", readAt: new Date() },
    { new: true }
  );

  if (!message) {
    throw new ApiError(404, "Support message was not found.");
  }

  res.json({ success: true, message: "Support message has been marked as read.", data: message, supportMessage: message });
}

async function deleteSupportMessage(req, res) {
  const message = await SupportMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    throw new ApiError(404, "Support message was not found.");
  }

  res.json({ success: true, message: "Support message has been deleted.", data: message, supportMessage: message });
}

module.exports = {
  createSupportMessage,
  getSupportMessages,
  markSupportMessageRead,
  deleteSupportMessage,
};
