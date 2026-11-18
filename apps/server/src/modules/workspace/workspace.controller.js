import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
} from "./workspace.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

export const createWorkspaceController = asyncHandler(async (req, res) => {
  const workspace = await createWorkspace(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    workspace,
    role: "owner",
  });
});

export const getMyWorkspacesController = asyncHandler(async (req, res) => {
  const workspaces = await getMyWorkspaces(req.user.id);

  res.status(200).json({
    success: true,
    count: workspaces.length,
    workspaces,
  });
});

export const getWorkspaceController = asyncHandler(async (req, res) => {
  const workspace = await getWorkspaceById(req.params.workspaceId);

  res.status(200).json({
    success: true,
    workspace,
  });
});