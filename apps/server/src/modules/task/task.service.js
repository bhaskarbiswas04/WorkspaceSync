import mongoose from "mongoose";

import Task from "./task.model.js";
import Project from "../project/project.model.js";
import Membership from "../workspace/membership.model.js";

import AppError from "../../utils/AppError.js";

/* PART A: HELPER FUNCTIONS */

// Validate MongoDB ObjectId
const validateObjectId = (id, fieldName = "ID") => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};

// Verify project belongs to the requested workspace
const verifyProject = async (workspaceId, projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
    status: { $ne: "archived" },
  });

  if (!project) {
    throw new AppError("Project not found in this workspace", 404);
  }

  return project;
};

// Verify all assignees are active workspace members
const verifyAssignees = async (workspaceId, userIds = []) => {
  if (!Array.isArray(userIds)) {
    throw new AppError("Assignees must be an array", 400);
  }

  const uniqueUserIds = [...new Set(userIds.map(String))];

  if (uniqueUserIds.length > 20) {
    throw new AppError("A task can have a maximum of 20 assignees", 400);
  }

  uniqueUserIds.forEach((id) => {
    validateObjectId(id, "Assignee ID");
  });

  if (uniqueUserIds.length === 0) {
    return [];
  }

  const memberships = await Membership.find({
    workspace: workspaceId,
    user: { $in: uniqueUserIds },
    status: "active",
  }).select("user");

  if (memberships.length !== uniqueUserIds.length) {
    throw new AppError(
      "One or more assignees are not active members of this workspace",
      400,
    );
  }

  return uniqueUserIds;
};

// Find a task within its workspace and project
const findTask = async (workspaceId, projectId, taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
    deletedAt: null,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

// Escape special characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Fields that can be set when creating a task
const getCreateTaskData = (data) => {
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "estimatedHours",
    "position",
  ];

  return Object.fromEntries(
    allowedFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]]),
  );
};

/* PART B: CREATE TASK */

export const createTask = async (workspaceId, projectId, userId, data) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(userId, "User ID");

  await verifyProject(workspaceId, projectId);

  const assignedTo = await verifyAssignees(workspaceId, data.assignedTo || []);

  const task = await Task.create({
    ...getCreateTaskData(data),
    workspace: workspaceId,
    project: projectId,
    createdBy: userId,
    assignedTo,
  });

  return task;
};

/* PART C: GET ALL PROJECT TASKS */

export const getProjectTasks = async (workspaceId, projectId, query = {}) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");

  await verifyProject(workspaceId, projectId);

  const {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    assignedTo,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const currentPage = Math.max(1, Number(page) || 1);
  const pageLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * pageLimit;

  const filter = {
    workspace: workspaceId,
    project: projectId,
    deletedAt: null,
  };

  // Filter by task status
  if (status) {
    filter.status = status;
  }

  // Filter by priority
  if (priority) {
    filter.priority = priority;
  }

  // Filter by assigned user
  if (assignedTo) {
    validateObjectId(assignedTo, "Assignee ID");
    filter.assignedTo = assignedTo;
  }

  // Search by task title or description
  if (search && search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

    filter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "dueDate",
    "title",
    "priority",
    "status",
    "position",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  // Get total count and tasks concurrently
  const [totalTasks, tasks] = await Promise.all([
    Task.countDocuments(filter),

    safeSortBy === "priority"
      ? Task.aggregate([
          { $match: filter },
          {
            $addFields: {
              priorityOrder: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$priority", "urgent"] },
                      then: 1,
                    },
                    {
                      case: { $eq: ["$priority", "high"] },
                      then: 2,
                    },
                    {
                      case: { $eq: ["$priority", "medium"] },
                      then: 3,
                    },
                    {
                      case: { $eq: ["$priority", "low"] },
                      then: 4,
                    },
                  ],
                  default: 5,
                },
              },
            },
          },
          {
            $sort: {
              priorityOrder: sortOrder,
              createdAt: -1,
            },
          },
          { $skip: skip },
          { $limit: pageLimit },
          { $project: { priorityOrder: 0 } },
        ])
      : Task.find(filter)
          .sort({ [safeSortBy]: sortOrder })
          .skip(skip)
          .limit(pageLimit)
          .lean(),
  ]);

  // Populate references for both normal and aggregate queries
  await Task.populate(tasks, [
    {
      path: "createdBy",
      select: "name email avatar",
    },
    {
      path: "assignedTo",
      select: "name email avatar",
    },
  ]);

  return {
    tasks,
    pagination: {
      totalTasks,
      currentPage,
      totalPages: Math.ceil(totalTasks / pageLimit),
      pageLimit,
      hasNextPage: currentPage * pageLimit < totalTasks,
      hasPrevPage: currentPage > 1,
    },
  };
};

/*  PART D: GET SINGLE TASK */

export const getTaskById = async (workspaceId, projectId, taskId) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  await task.populate([
    {
      path: "createdBy",
      select: "name email avatar",
    },
    {
      path: "assignedTo",
      select: "name email avatar",
    },
  ]);

  return task;
};

/* PART E: UPDATE TASK DETAILS*/

export const updateTask = async (workspaceId, projectId, taskId, data) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  // Only allow explicitly editable fields
  const allowedFields = [
    "title",
    "description",
    "priority",
    "dueDate",
    "estimatedHours",
    "position",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      task[field] = data[field];
    }
  });

  await task.save();

  return task;
};

/*  PART F: UPDATE STATUS AND PRIORITY */

// Update task status
export const updateTaskStatus = async (
  workspaceId,
  projectId,
  taskId,
  status,
) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  task.status = status;

  await task.save();

  return task;
};

// Update task priority
export const updateTaskPriority = async (
  workspaceId,
  projectId,
  taskId,
  priority,
) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  task.priority = priority;

  await task.save();

  return task;
};

/*  PART G: TASK ASSIGNMENT OPERATIONS  */

// Replace all existing assignees
export const assignUsers = async (workspaceId, projectId, taskId, userIds) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  const assignedTo = await verifyAssignees(workspaceId, userIds);

  task.assignedTo = assignedTo;

  await task.save();

  return task;
};

// Add new assignees without removing existing ones
export const addAssignees = async (workspaceId, projectId, taskId, userIds) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new AppError("Please provide at least one user ID", 400);
  }

  const validUserIds = await verifyAssignees(workspaceId, userIds);

  const existingIds = task.assignedTo.map((id) => id.toString());

  const newIds = validUserIds.filter((id) => !existingIds.includes(id));

  if (existingIds.length + newIds.length > 20) {
    throw new AppError("A task can have a maximum of 20 assignees", 400);
  }

  if (newIds.length > 0) {
    task.assignedTo.push(...newIds);
    await task.save();
  }

  return task;
};

// Remove one assignee
export const removeAssignee = async (
  workspaceId,
  projectId,
  taskId,
  userId,
) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");
  validateObjectId(userId, "User ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  task.assignedTo = task.assignedTo.filter(
    (id) => id.toString() !== userId.toString(),
  );

  await task.save();

  return task;
};

/*  PART H: SOFT DELETE TASK */

export const archiveTask = async (workspaceId, projectId, taskId) => {
  validateObjectId(workspaceId, "Workspace ID");
  validateObjectId(projectId, "Project ID");
  validateObjectId(taskId, "Task ID");

  await verifyProject(workspaceId, projectId);

  const task = await findTask(workspaceId, projectId, taskId);

  task.deletedAt = new Date();

  await task.save();

  return task;
};

