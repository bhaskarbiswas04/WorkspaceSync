import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),

  role: z.enum(["admin", "manager", "member"]),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "manager", "member"]),
});