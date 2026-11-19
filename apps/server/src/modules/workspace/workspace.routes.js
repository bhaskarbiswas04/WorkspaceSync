import express from "express";

import authenticate from "../../middleware/authenticate.js";

import {
  requireWorkspaceMembership,
  requireWorkspaceRole,
} from "../../middleware/workspaceAuth.js";

import validate from "../../middleware/validate.js";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspace.validation.js";

import {
  createWorkspaceController,
  getMyWorkspacesController,
  getWorkspaceController,
} from "./workspace.controller.js";

import {
  getMembersController,
  updateMemberRoleController,
  removeMemberController,
} from "./membership.controller.js";

import { createInvitationController } from "../invitation/invitation.controller.js";

import {
  createInvitationSchema,
  updateMemberRoleSchema,
} from "../invitation/invitation.validation.js";

const router = express.Router();

// All workspace routes require authentication.
router.use(authenticate);

// Create workspace.
router.post("/", validate(createWorkspaceSchema), createWorkspaceController);

// Get current user's workspaces.
router.get("/", getMyWorkspacesController);

// Workspace details.
router.get("/:workspaceId", requireWorkspaceMembership, getWorkspaceController);

// Invite members.
router.post(
  "/:workspaceId/invitations",
  requireWorkspaceMembership,
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(createInvitationSchema),
  createInvitationController,
);

// List members.
router.get(
  "/:workspaceId/members",
  requireWorkspaceMembership,
  getMembersController,
);

// Update member role.
router.patch(
  "/:workspaceId/members/:memberId/role",
  requireWorkspaceMembership,
  requireWorkspaceRole("owner", "admin"),
  validate(updateMemberRoleSchema),
  updateMemberRoleController,
);

// Remove member.
router.delete(
  "/:workspaceId/members/:memberId",
  requireWorkspaceMembership,
  requireWorkspaceRole("owner", "admin"),
  removeMemberController,
);

export default router;

// wE ARE THE SOURCES AND GET THE RECORDS OF THE 