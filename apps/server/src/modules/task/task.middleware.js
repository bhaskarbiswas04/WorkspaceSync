import Task from "./task.model.js";

import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const requireTaskStatusPermission = asyncHandler(
  async (req, res, next) => {
    const { workspaceId, projectId, taskId } = req.params;

    // const membership = req.workspaceMembership;
    const membership = req.workspaceMembership;

    // Managers and above can update any task status.
    const privilegedRoles = ["owner", "admin", "manager"];

    if (privilegedRoles.includes(membership.role)) {
      return next();
    }

    // Members can only update tasks assigned to them.
    const task = await Task.findOne({
      _id: taskId,
      workspace: workspaceId,
      project: projectId,
      deletedAt: null,
    }).select("assignedTo");

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user.id.toString(),
    );

    if (!isAssigned) {
      throw new AppError(
        "You can only update the status of tasks assigned to you",
        403,
      );
    }

    next();
  },
);