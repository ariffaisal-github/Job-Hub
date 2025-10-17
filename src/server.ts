import app from "./app";
import { env } from "./utils/env";
import { seedAdmin } from "./config/seedAdmin";

async function startServer() {
  const port = Number(env.PORT);

  // 🧩 Ensure default admin exists before server starts
  await seedAdmin();

  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  // 🧹 Graceful shutdown on SIGTERM (Docker, etc.)
  process.on("SIGTERM", () => {
    console.log("Shutting down gracefully...");
    server.close(() => process.exit(0));
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
