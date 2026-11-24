import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const taskStatus = z.enum(["backlog", "todo", "in-progress", "review", "done"]);

const taskPriority = z.enum(["low", "medium", "high", "urgent"]);

// CREATE TASK
export const createTaskSchema = z
  .object({
    title: z.string().trim().min(2).max(200),

    description: z.string().trim().max(3000).optional(),

    status: taskStatus.optional(),

    priority: taskPriority.optional(),

    assignedTo: z
      .array(objectIdSchema)
      .max(20)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate assignee IDs are not allowed",
      )
      .optional(),

    dueDate: z.coerce.date().nullable().optional(),

    estimatedHours: z.number().min(0).max(10000).optional(),

    position: z.number().int().min(0).optional(),
  })
  .strict();

// UPDATE TASK
export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),

    description: z.string().trim().max(3000).nullable().optional(),

    priority: taskPriority.optional(),

    dueDate: z.coerce.date().nullable().optional(),

    estimatedHours: z.number().min(0).max(10000).optional(),

    position: z.number().int().min(0).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

// UPDATE TASK STATUS
export const updateTaskStatusSchema = z
  .object({
    status: taskStatus,
  })
  .strict();

// UPDATE TASK PRIORITY
export const updateTaskPrioritySchema = z
  .object({
    priority: taskPriority,
  })
  .strict();

// ASSIGN USERS
export const assignTaskSchema = z
  .object({
    userIds: z
      .array(objectIdSchema)
      .min(1)
      .max(20)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate user IDs are not allowed",
      ),
  })
  .strict();

// REMOVE USER
export const removeAssigneeSchema = z.object({
  userId: objectIdSchema,
});

// TASK QUERY PARAMETERS
export const taskQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    status: taskStatus.optional(),

    priority: taskPriority.optional(),

    search: z.string().trim().max(150).optional(),

    assignedTo: objectIdSchema.optional(),

    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "dueDate",
        "title",
        "priority",
        "status",
        "position",
      ])
      .default("createdAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();