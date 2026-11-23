import {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  archiveProject,
} from "./project.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const project = await createProject(
    req.params.workspaceId,
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

// We are the inclinational society

export const getProjectsController = asyncHandler(async (req, res) => {
  const result = await getWorkspaceProjects(
    req.params.workspaceId,
    req.validatedQuery,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getProjectController = asyncHandler(async (req, res) => {
  const project = await getProjectById(
    req.params.workspaceId,
    req.params.projectId,
  );

  res.status(200).json({
    success: true,
    project,
  });
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const project = await updateProject(
    req.params.workspaceId,
    req.params.projectId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

export const archiveProjectController = asyncHandler(async (req, res) => {
  const project = await archiveProject(
    req.params.workspaceId,
    req.params.projectId,
  );

  res.status(200).json({
    success: true,
    message: "Project archived successfully",
    project,
  });
});