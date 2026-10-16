import dotenv from "dotenv";
import http from "http";

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env${ENV !== "production" ? "" : ".production"}` });

import app from "./app.js";
import { logMessage } from "./utils/globalFunction.js";
import { initializeRedis } from "./services/serviceRedis.js";
import connectDB from "./models/connection.js";
import { initializeSocket } from "./socket/socket.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Initialize Redis Client & Pub/Sub
    await initializeRedis();

    // 3. Initialize WebSockets (Socket.IO)
    initializeSocket(server);

    // 4. Start HTTP Server
    server.listen(PORT, () => {
      logMessage(`🚀 Sindhi Matrimony Unified Backend running on port ${PORT} [${ENV}]`, null, "info");
      logMessage(`📍 Health Check: http://localhost:${PORT}/api/v1/health`, null, "info");
    });
  } catch (err) {
    logMessage("❌ Fatal Error during server bootstrap:", err, "error");
  }
})();

// Graceful Shutdown
process.on("SIGTERM", () => {
  logMessage("🛑 SIGTERM received: Closing HTTP server...", null, "warn");
  server.close(() => {
    logMessage("HTTP server closed.", null, "info");
    process.exit(0);
  });
});
