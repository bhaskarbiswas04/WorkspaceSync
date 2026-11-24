import express from "express";

import authenticate from "../../middleware/authenticate.js";

import {
  requireWorkspaceMembership,
  requireWorkspaceRole,
} from "../../middleware/workspaceAuth.js";

import validate from "../../middleware/validate.js";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  updateTaskPrioritySchema,
  assignTaskSchema,
  taskQuerySchema,
} from "./task.validation.js";

import {
  createTaskController,
  getProjectTasksController,
  getTaskController,
  updateTaskController,
  updateTaskStatusController,
  updateTaskPriorityController,
  assignUsersController,
  addAssigneesController,
  removeAssigneeController,
  archiveTaskController,
} from "./task.controller.js";

import { requireTaskStatusPermission } from "./task.middleware.js";

const router = express.Router({
  mergeParams: true,
});

// Authentication
router.use(authenticate);

// Verify workspace membership
router.use(requireWorkspaceMembership);

/* =====================================================
   GET ALL PROJECT TASKS
   GET /
===================================================== */

router.get("/", validate(taskQuerySchema, "query"), getProjectTasksController);

/* =====================================================
   CREATE TASK
   POST /
===================================================== */

router.post(
  "/",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(createTaskSchema),
  createTaskController,
);

/* =====================================================
   GET SINGLE TASK
   GET /:taskId
===================================================== */

router.get("/:taskId", getTaskController);

/* =====================================================
   UPDATE TASK DETAILS
   PATCH /:taskId
===================================================== */

router.patch(
  "/:taskId",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(updateTaskSchema),
  updateTaskController,
);

/* =====================================================
   UPDATE TASK STATUS
   PATCH /:taskId/status
===================================================== */

router.patch(
  "/:taskId/status",
  validate(updateTaskStatusSchema),
  requireTaskStatusPermission,
  updateTaskStatusController,
);

/* =====================================================
   UPDATE TASK PRIORITY
   PATCH /:taskId/priority
===================================================== */

router.patch(
  "/:taskId/priority",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(updateTaskPrioritySchema),
  updateTaskPriorityController,
);

/* =====================================================
   REPLACE TASK ASSIGNEES
   PUT /:taskId/assignees
===================================================== */

router.put(
  "/:taskId/assignees",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(assignTaskSchema),
  assignUsersController,
);

/* =====================================================
   ADD TASK ASSIGNEES
   POST /:taskId/assignees
===================================================== */

router.post(
  "/:taskId/assignees",
  requireWorkspaceRole("owner", "admin", "manager"),
  validate(assignTaskSchema),
  addAssigneesController,
);

/* =====================================================
   REMOVE TASK ASSIGNEE
   DELETE /:taskId/assignees/:userId
===================================================== */

router.delete(
  "/:taskId/assignees/:userId",
  requireWorkspaceRole("owner", "admin", "manager"),
  removeAssigneeController,
);

/* =====================================================
   ARCHIVE TASK
   DELETE /:taskId
===================================================== */

router.delete(
  "/:taskId",
  requireWorkspaceRole("owner", "admin"),
  archiveTaskController,
);

export default router;