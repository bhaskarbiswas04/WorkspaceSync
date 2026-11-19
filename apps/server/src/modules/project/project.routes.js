import express from "express";

import authenticate from "../../middleware/authenticate.js";

import {
  requireWorkspaceMembership,
  requireWorkspaceRole,
} from "../../middleware/workspaceAuth.js";

import validate from "../../middleware/validate.js";

import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "./project.validation.js";

import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  archiveProjectController,
} from "./project.controller.js";

const router = express.Router({
  mergeParams: true,
});

// Authentication
router.use(authenticate);

// Workspace membership
router.use(requireWorkspaceMembership);

// CREATE PROJECT
router.post(
  "/",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(createProjectSchema),
  createProjectController,
);

// GET ALL PROJECTS
router.get("/", validate(projectQuerySchema, "query"), getProjectsController);

// GET SINGLE PROJECT
router.get("/:projectId", getProjectController);

// UPDATE PROJECT
router.patch(
  "/:projectId",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(updateProjectSchema),
  updateProjectController,
);

// ARCHIVE PROJECT
router.delete(
  "/:projectId",
  requireWorkspaceRole("owner", "admin"),
  archiveProjectController,
);

export default router;