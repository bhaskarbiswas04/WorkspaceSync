import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

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

export default app;