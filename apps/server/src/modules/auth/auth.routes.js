import express from "express";
import rateLimit from "express-rate-limit";

import { register, login, refresh, logout } from "./auth.controller.js";

import { registerSchema, loginSchema } from "./auth.validation.js";

import validate from "../../middleware/validate.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

router.post("/register", authLimiter, validate(registerSchema), register);

router.post("/login", authLimiter, validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;