import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(100),

  description: z.string().trim().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  description: z.string().trim().max(500).optional(),
});