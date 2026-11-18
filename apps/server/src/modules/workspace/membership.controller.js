import {
  getWorkspaceMembers,
  updateMemberRole,
  removeWorkspaceMember,
} from "./membership.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

export const getMembersController = asyncHandler(async (req, res) => {
  const members = await getWorkspaceMembers(req.params.workspaceId);

  res.status(200).json({
    success: true,
    count: members.length,
    members,
  });
});

export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const member = await updateMemberRole(
    req.params.workspaceId,
    req.params.memberId,
    req.body.role,
    req.workspaceMembership,
  );

  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
    member,
  });
});

export const removeMemberController = asyncHandler(async (req, res) => {
  await removeWorkspaceMember(
    req.params.workspaceId,
    req.params.memberId,
    req.workspaceMembership,
  );

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});