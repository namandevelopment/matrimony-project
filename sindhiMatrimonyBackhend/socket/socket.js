import { Server } from "socket.io";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware.js";
import { logMessage } from "../utils/globalFunction.js";
import { ROLES } from "../utils/variables.js";

let io = null;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
  });

  // Attach JWT Authentication to Socket handshake
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const user = socket.user;
    logMessage(`⚡ Socket Connected: ${user?.userId || socket.id} (Role: ${user?.role})`, null, "info");

    // Auto-join personal user room for targeted notifications & chat
    if (user?.userId) {
      socket.join(`user_${user.userId}`);
    }

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
