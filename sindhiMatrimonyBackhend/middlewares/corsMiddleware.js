import cors from "cors";
import { isProduction } from "../utils/globalFunction.js";

const getCorsOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  const allowThirdParty = process.env.ALLOW_THIRD_PARTY_API_CLIENTS === "true";

  if (allowThirdParty || !isProduction()) {
    allowedOrigins.push(
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8081",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8081"
    );
  }

  return allowedOrigins;
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getCorsOrigins();

    if (!isProduction()) {
      return callback(null, true);
    }

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS policy violation: Origin not allowed."));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-client-platform",
    "x-client-version",
    "x-device-id",
  ],

  exposedHeaders: ["x-client-platform"],

  credentials: true,
};

const corsMiddleware = () => cors(corsOptions);

export default corsMiddleware;
