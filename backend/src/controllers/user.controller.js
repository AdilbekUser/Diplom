const User = require("../models/User");
const ApiError = require("../utils/apiError");

function profilePayload(body) {
  return {
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").trim(),
    organization: String(body.organization || "").trim(),
    city: String(body.city || "").trim(),
  };
}

async function getMe(req, res) {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User was not found.");
  }

  res.json({
    success: true,
    message: "Profile loaded.",
    data: user,
    ...user.toObject(),
  });
}

async function updateMe(req, res) {
  const data = profilePayload(req.body);

  if (!data.name) {
    throw new ApiError(400, "Name is required.");
  }

  const user = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User was not found.");
  }

  res.json({
    success: true,
    message: "Profile has been updated.",
    user,
    data: user,
  });
}

module.exports = {
  getMe,
  updateMe,
};
