
import mongoose from "mongoose";

import Membership from "../modules/workspace/membership.model.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const requireWorkspaceMembership = asyncHandler(
  async (req, res, next) => {
    const { workspaceId } = req.params;

    if (!mongoose.isValidObjectId(workspaceId)) {
      throw new AppError("Invalid workspace ID", 400);
    }

    const membership = await Membership.findOne({
      user: req.user.id,
      workspace: workspaceId,
      status: "active",
    });

    if (!membership) {
      throw new AppError(
        "You do not have access to this workspace",
        403
      );
    }

    req.workspaceMembership = membership;

    next();
  }
);

export const requireWorkspaceRole = (...allowedRoles) => {
  return (req, res, next) => {
    const membership = req.workspaceMembership;

    if (!membership) {
      return next(
        new AppError("Workspace membership not verified", 403)
      );
    }

    if (!allowedRoles.includes(membership.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};