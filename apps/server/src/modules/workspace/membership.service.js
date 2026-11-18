import Membership from "./membership.model.js";

import AppError from "../../utils/AppError.js";

export const getWorkspaceMembers = async (workspaceId) => {
  return Membership.find({
    workspace: workspaceId,
    status: "active",
  })
    .populate("user", "name email avatar")
    .sort({ createdAt: 1 });
};

export const updateMemberRole = async (
  workspaceId,
  memberId,
  newRole,
  actorMembership,
) => {
  const target = await Membership.findOne({
    _id: memberId,
    workspace: workspaceId,
    status: "active",
  });

  if (!target) {
    throw new AppError("Member not found", 404);
  }

  if (target.role === "owner") {
    throw new AppError("Workspace owner role cannot be changed here", 403);
  }

  if (actorMembership.role === "admin" && target.role === "admin") {
    throw new AppError("Admins cannot modify another admin", 403);
  }

  if (actorMembership.role === "admin" && newRole === "admin") {
    throw new AppError("Only the owner can assign admin role", 403);
  }

  target.role = newRole;

  await target.save();

  return target;
};

export const removeWorkspaceMember = async (
  workspaceId,
  memberId,
  actorMembership,
) => {
  const target = await Membership.findOne({
    _id: memberId,
    workspace: workspaceId,
    status: "active",
  });

  if (!target) {
    throw new AppError("Member not found", 404);
  }

  if (target.role === "owner") {
    throw new AppError("Workspace owner cannot be removed", 403);
  }

  if (actorMembership.role === "admin" && target.role === "admin") {
    throw new AppError("Admins cannot remove another admin", 403);
  }

  target.status = "suspended";

  await target.save();

  return target;
};