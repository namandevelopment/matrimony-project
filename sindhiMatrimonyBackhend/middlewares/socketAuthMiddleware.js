import jwt from "jsonwebtoken";
import { logMessage } from "../utils/globalFunction.js";

const getJwtSecret = () => process.env.JWT_SECRET_KEY || "sindhi_matrimony_default_jwt_secret";

const socketAuthMiddleware = (socket, next) => {
  try {
    const authHeader =
      socket.handshake?.auth?.token ||
      socket.handshake?.headers?.authorization;

    if (!authHeader) {
      logMessage("Socket Auth: Missing Authorization token", null, "warn");
      return next(new Error("Authentication error: Missing token."));
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    jwt.verify(token, getJwtSecret(), (err, decoded) => {
      if (err) {
        logMessage("Socket Auth: Token verification failed", err, "warn");
        return next(new Error("Authentication error: Invalid or expired token."));
      }

      socket.user = decoded;
      next();
    });
  } catch (error) {
    logMessage("Socket Auth Exception:", error, "error");
    next(new Error("Authentication error: Internal socket authorization failure."));
  }
};

export default socketAuthMiddleware;
