import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware.js";
import { logMessage } from "../utils/globalFunction.js";
import { ROLES } from "../utils/variables.js";
import { publisher, subscriber } from "../services/serviceRedis.js";
import { registerUserChatSocket } from "./userChatSocket.js";

let io = null;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
  });

  // Attach Redis Adapter for multi-worker PM2 cluster synchronization
  try {
    if (publisher.isReady && subscriber.isReady) {
      io.adapter(createAdapter(publisher, subscriber));
      logMessage("✅ Socket.IO Redis Cluster Adapter enabled.", null, "info");
    }
  } catch (adapterErr) {
    logMessage("Socket.IO running in standalone in-memory adapter mode:", adapterErr?.message || adapterErr, "warn");
  }

  // Attach JWT Authentication to Socket handshake
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const user = socket.user;
    logMessage(`⚡ Socket Connected: ${user?.userId || socket.id} (Role: ${user?.role})`, null, "info");

    // Auto-join personal user room for targeted notifications & chat
    if (user?.userId) {
      socket.join(`user_${user.userId}`);
    }

    // Attach candidate-to-candidate 1-on-1 real-time chat handlers
    registerUserChatSocket(io, socket);

    // Staff auto-joins admin broadcast channel
    if (user?.role && user.role !== ROLES.USER) {
      socket.join("admin_broadcast");
      if (user.branchId) {
        socket.join(`branch_${user.branchId}`);
      }
    }

    socket.on("disconnect", () => {
      logMessage(`🔌 Socket Disconnected: ${socket.id}`, null, "info");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet!");
  }
  return io;
};
