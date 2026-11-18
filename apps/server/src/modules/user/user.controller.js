import User from "./user.model.js";

import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.isActive) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
  });
});