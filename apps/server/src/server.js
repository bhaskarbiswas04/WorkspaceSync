
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `WorkSpace API running on http://localhost:${PORT}`
      );
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        const mongoose = await import("mongoose");
        await mongoose.default.connection.close();

        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  }
};

startServer();