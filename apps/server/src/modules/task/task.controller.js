import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  updateTaskPriority,
  assignUsers,
  addAssignees,
  removeAssignee,
  archiveTask,
} from "./task.service.js";

import asyncHandler from "../../utils/asyncHandler.js";

/* 1. CREATE TASK */

export const createTaskController = asyncHandler(async (req, res) => {
  const task = await createTask(
    req.params.workspaceId,
    req.params.projectId,
    req.user.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

/* 2. GET ALL PROJECT TASKS */

export const getProjectTasksController = asyncHandler(async (req, res) => {
  const result = await getProjectTasks(
    req.params.workspaceId,
    req.params.projectId,
    req.validatedQuery,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

/* 3. GET SINGLE TASK */

export const getTaskController = asyncHandler(async (req, res) => {
  const task = await getTaskById(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
  );

  res.status(200).json({
    success: true,
    task,
  });
});

/* 4. UPDATE TASK DETAILS */

export const updateTaskController = asyncHandler(async (req, res) => {
  const task = await updateTask(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

/* 5. UPDATE TASK STATUS */

export const updateTaskStatusController = asyncHandler(async (req, res) => {
  const task = await updateTaskStatus(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    task,
  });
});

/* 6. UPDATE TASK PRIORITY */

export const updateTaskPriorityController = asyncHandler(async (req, res) => {
  const task = await updateTaskPriority(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.body.priority,
  );

  res.status(200).json({
    success: true,
    message: "Task priority updated successfully",
    task,
  });
});

/* 7. REPLACE TASK ASSIGNEES */

export const assignUsersController = asyncHandler(async (req, res) => {
  const task = await assignUsers(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.body.userIds,
  );

  res.status(200).json({
    success: true,
    message: "Task assignees updated successfully",
    task,
  });
});

/* 8. ADD TASK ASSIGNEES */

export const addAssigneesController = asyncHandler(async (req, res) => {
  const task = await addAssignees(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.body.userIds,
  );

  res.status(200).json({
    success: true,
    message: "Assignees added successfully",
    task,
  });
});

/* 9. REMOVE TASK ASSIGNEE */

export const removeAssigneeController = asyncHandler(async (req, res) => {
  const task = await removeAssignee(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
    req.params.userId,
  );

  res.status(200).json({
    success: true,
    message: "Assignee removed successfully",
    task,
  });
});

/* 10. ARCHIVE TASK */

export const archiveTaskController = asyncHandler(async (req, res) => {
  const task = await archiveTask(
    req.params.workspaceId,
    req.params.projectId,
    req.params.taskId,
  );

  res.status(200).json({
    success: true,
    message: "Task archived successfully",
    task,
  });
});