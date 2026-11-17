import { email, z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),

  email: z.string().trim().max(254).pipe(z.email()),

  password: z.string().min(8).max(72),
});

// export const loginSchema = z.object({
//   email: z.string().trim().email().max(254),

//   password: z.string().min(1).max(72),
// });

export const loginSchema = z.object({
  // Use .pipe() to trim first, then validate as an email
  email: z.string().trim().max(254).pipe(z.email()),

  password: z.string().min(1).max(72),
});