import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkSpace API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

// Handle unknown endpoints.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling.
app.use(errorMiddleware);

export default app;