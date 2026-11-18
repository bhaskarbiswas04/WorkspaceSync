
import mongoose from "mongoose";
import crypto from "crypto";

import Workspace from "./workspace.model.js";
import Membership from "./membership.model.js";

import AppError from "../../utils/AppError.js";

const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base}-${crypto.randomBytes(4).toString("hex")}`;
};

// Create workspace and owner membership.
export const createWorkspace = async (userId, data) => {
  const session = await mongoose.startSession();

  let workspace;

  try {
    await session.withTransaction(async () => {
      const [createdWorkspace] = await Workspace.create(
        [
          {
            name: data.name,
            description: data.description || "",
            slug: generateSlug(data.name),
            owner: userId,
          },
        ],
        { session }
      );

      workspace = createdWorkspace;

      await Membership.create(
        [
          {
            user: userId,
            workspace: workspace._id,
            role: "owner",
            status: "active",
          },
        ],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  return workspace;
};

// Get all workspaces of logged-in user.
export const getMyWorkspaces = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
    status: "active",
  })
    .populate({
      path: "workspace",
      match: { isActive: true },
    })
    .sort({ createdAt: -1 });

  return memberships
    .filter((membership) => membership.workspace)
    .map((membership) => ({
      workspace: membership.workspace,
      role: membership.role,
      joinedAt: membership.joinedAt,
    }));
};

// Get workspace details.
export const getWorkspaceById = async (workspaceId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    isActive: true,
  });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return workspace;
};