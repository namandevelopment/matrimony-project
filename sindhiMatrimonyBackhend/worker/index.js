/**
 * 🛠️ Sindhi Matrimony Background Job Worker
 * Handles scheduled tasks, cache sweeps, and asynchronous notifications.
 */
import "dotenv/config";
import { logMessage } from "../utils/globalFunction.js";
import { initializeRedis } from "../services/serviceRedis.js";
import connectDB from "../models/connection.js";

(async () => {
  try {
    logMessage("⚡ Starting Sindhi Matrimony Worker Process...", null, "info");

    // 1. Connect MongoDB
    await connectDB();

    // 2. Initialize Redis
    await initializeRedis();

    logMessage("✅ Sindhi Matrimony Background Worker running stably.", null, "info");
  } catch (err) {
    logMessage("❌ Fatal Error in Background Worker:", err, "error");
    process.exit(1);
  }
})();

// Graceful Shutdown
process.on("SIGTERM", () => {
  logMessage("🛑 Worker SIGTERM received. Shutting down gracefully...", null, "warn");
  process.exit(0);
});
