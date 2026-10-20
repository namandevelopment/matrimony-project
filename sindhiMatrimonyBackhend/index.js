import "dotenv/config";
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

    // 4. Start HTTP Server with automatic port fallback
    let currentPort = Number(PORT);
    const startListening = (p) => {
      server.listen(p, () => {
        logMessage(`🚀 Sindhi Matrimony Unified Backend running on port ${p} [${ENV}]`, null, "info");
        logMessage(`📍 Health Check: http://localhost:${p}/api/v1/health`, null, "info");
      });
    };

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logMessage(`⚠️ Port ${currentPort} in use. Switching to port ${currentPort + 1}...`, null, "warn");
        currentPort += 1;
        startListening(currentPort);
      } else {
        logMessage("❌ Server error:", err, "error");
      }
    });

    startListening(currentPort);
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
