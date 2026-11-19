import { z } from "zod";

const projectStatus = z.enum(["planning", "active", "completed", "archived"]);

const projectColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .optional();

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(2).max(100),

    description: z.string().trim().max(2000).optional(),

    status: projectStatus.optional(),

    startDate: z.coerce.date().optional(),

    dueDate: z.coerce.date().optional(),

    color: projectColor,
  })
  .refine(
    (data) =>
      !data.startDate || !data.dueDate || data.dueDate >= data.startDate,
    {
      message: "Due date cannot be before start date",
      path: ["dueDate"],
    },
  );

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    description: z.string().trim().max(2000).optional(),

    status: z.enum(["planning", "active", "completed"]).optional(),

    startDate: z.coerce.date().nullable().optional(),

    dueDate: z.coerce.date().nullable().optional(),

    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: projectStatus.optional(),

  search: z.string().trim().max(100).optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "name", "dueDate"])
    .default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});