import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import invitationRoutes from "./modules/invitation/invitation.routes.js";
import taskRoutes from "./modules/task/task.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

//Body parsing should must happen before routes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkSpace API is running!", 
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/invitations", invitationRoutes);
app.use("/api/v1/workspaces/:workspaceId/projects", projectRoutes);
app.use("/api/v1/workspaces/:workspaceId/projects/:projectId/tasks", taskRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handler.
app.use(errorMiddleware);

export default app;