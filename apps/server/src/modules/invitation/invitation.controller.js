import {
  createInvitation,
  getMyInvitations,
  acceptInvitation,
} from "./invitation.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

export const createInvitationController = asyncHandler(async (req, res) => {
  const { invitation, token } = await createInvitation(
    req.params.workspaceId,
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Invitation created successfully",
    invitation: {
      id: invitation._id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
    },
    ...(process.env.NODE_ENV === "development"
      ? { developmentToken: token }
      : {}),
  });
});

export const getMyInvitationsController = asyncHandler(async (req, res) => {
  const invitations = await getMyInvitations(req.user.email);

  res.status(200).json({
    success: true,
    count: invitations.length,
    invitations,
  });
});

export const acceptInvitationController = asyncHandler(async (req, res) => {
  const result = await acceptInvitation(req.params.token, req.user.id);

  res.status(200).json({
    success: true,
    message: "Invitation accepted successfully",
    ...result,
  });
});