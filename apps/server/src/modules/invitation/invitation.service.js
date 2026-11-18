import crypto from "crypto";
import mongoose from "mongoose";

import Invitation from "./invitation.model.js";
import Membership from "../workspace/membership.model.js";
import User from "../user/user.model.js";

import AppError from "../../utils/AppError.js";

const INVITATION_DURATION = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Create invitation.
export const createInvitation = async (
  workspaceId,
  invitedBy,
  { email, role },
) => {
  email = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const existingMembership = await Membership.findOne({
      workspace: workspaceId,
      user: existingUser._id,
      status: "active",
    });

    if (existingMembership) {
      throw new AppError("User is already a workspace member", 409);
    }
  }

  const existingInvitation = await Invitation.findOne({
    workspace: workspaceId,
    email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (existingInvitation) {
    throw new AppError("A pending invitation already exists", 409);
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await Invitation.create({
    workspace: workspaceId,
    email,
    role,
    invitedBy,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + INVITATION_DURATION),
  });

  return {
    invitation,
    token,
  };
};

// Get invitations for logged-in user.
export const getMyInvitations = async (email) => {
  return Invitation.find({
    email: email.toLowerCase(),
    status: "pending",
    expiresAt: { $gt: new Date() },
  })
    .populate("workspace", "name slug")
    .populate("invitedBy", "name email")
    .select("-tokenHash");
};

// Accept invitation.
export const acceptInvitation = async (token, userId) => {
  const tokenHash = hashToken(token);

  const session = await mongoose.startSession();

  let result;

  try {
    await session.withTransaction(async () => {
      const invitation = await Invitation.findOne({
        tokenHash,
        status: "pending",
        expiresAt: { $gt: new Date() },
      })
        .select("+tokenHash")
        .session(session);

      if (!invitation) {
        throw new AppError("Invalid or expired invitation", 400);
      }

      const user = await User.findById(userId).session(session);

      if (!user || user.email !== invitation.email) {
        throw new AppError(
          "This invitation belongs to another email address",
          403,
        );
      }

      const existingMembership = await Membership.findOne({
        user: userId,
        workspace: invitation.workspace,
      }).session(session);

      if (existingMembership) {
        if (existingMembership.status === "active") {
          throw new AppError("You are already a member", 409);
        }

        existingMembership.role = invitation.role;
        existingMembership.status = "active";
        existingMembership.joinedAt = new Date();

        await existingMembership.save({ session });
      } else {
        await Membership.create(
          [
            {
              user: userId,
              workspace: invitation.workspace,
              role: invitation.role,
              status: "active",
            },
          ],
          { session },
        );
      }

      invitation.status = "accepted";
      invitation.acceptedAt = new Date();

      await invitation.save({ session });

      result = {
        workspaceId: invitation.workspace,
        role: invitation.role,
      };
    });
  } finally {
    await session.endSession();
  }

  return result;
};