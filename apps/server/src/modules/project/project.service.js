import mongoose from "mongoose";

import Project from "./project.model.js";

import AppError from "../../utils/AppError.js";

// CREATE PROJECT
export const createProject = async (workspaceId, userId, data) => {
  const project = await Project.create({
    ...data,
    workspace: workspaceId,
    createdBy: userId,
  });

  return project;
};

// GET ALL PROJECTS
export const getWorkspaceProjects = async (workspaceId, query) => {
  const { page, limit, status, search, sortBy, order } = query;

  // Always scope queries to the workspace.
  const filter = {
    workspace: workspaceId,
  };

  // Status filter.
  if (status) {
    filter.status = status;
  } else {
    // Archived projects are hidden by default.
    filter.status = { $ne: "archived" };
  }

  // Search by project name.
  if (search) {
    filter.name = {
      $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

// GET SINGLE PROJECT
export const getProjectById = async (workspaceId, projectId) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).populate("createdBy", "name email");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

// UPDATE PROJECT
export const updateProject = async (workspaceId, projectId, data) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.status === "archived") {
    throw new AppError("Archived projects cannot be updated", 400);
  }

  const nextStartDate =
    data.startDate !== undefined ? data.startDate : project.startDate;

  const nextDueDate =
    data.dueDate !== undefined ? data.dueDate : project.dueDate;

  if (
    nextStartDate &&
    nextDueDate &&
    new Date(nextDueDate) < new Date(nextStartDate)
  ) {
    throw new AppError("Due date cannot be before start date", 400);
  }

  Object.assign(project, data);

  await project.save();

  return project;
};

// ARCHIVE PROJECT
export const archiveProject = async (workspaceId, projectId) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.status === "archived") {
    throw new AppError("Project is already archived", 400);
  }

  project.status = "archived";

  await project.save();

  return project;
};