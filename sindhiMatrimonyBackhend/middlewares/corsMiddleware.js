import cors from "cors";
import { isProduction } from "../utils/globalFunction.js";

// Pre-allocate origins in a Set for O(1) constant-time lookup
const baseDevOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8081",
];

const getAllowedOriginsSet = () => {
  const envOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowThirdParty = process.env.ALLOW_THIRD_PARTY_API_CLIENTS === "true";

  const all = new Set(envOrigins);
  if (allowThirdParty || !isProduction()) {
    baseDevOrigins.forEach((o) => all.add(o));
  }
  return all;
};

const allowedOriginsSet = getAllowedOriginsSet();

const corsOptions = {
  origin: (origin, callback) => {
    if (!isProduction() || !origin) {
      return callback(null, true);
    }

    if (
      allowedOriginsSet.has(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("sindhimarriage.in") ||
      origin.includes("localhost")
    ) {
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
    "x-active-profile-id",
  ],

  exposedHeaders: ["x-client-platform"],

  credentials: true,

  // Cache browser OPTIONS preflight for 24 hours (cuts preflight roundtrips by 50%)
  maxAge: 86400,
};

const corsMiddleware = () => cors(corsOptions);

export default corsMiddleware;
