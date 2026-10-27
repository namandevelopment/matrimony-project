import express from "express";
import path from "path";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import maintenance from "./middlewares/maintenance.js";
import jwt from "./middlewares/jwt.js";
import {
  conditionalSkipper,
  ipClientAdd,
  mergeParamsToBody,
  verifyTokenInRedis,
} from "./middlewares/commonMiddleware.js";
import checkDisableUser from "./middlewares/CheckDisableUserMiddleware.js";
import { BOOLEAN_TRUE, DATA_NULL, NOT_FOUND } from "./utils/constants.js";
import compression from "compression";
import routes from "./routes/index.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import devPerformanceTracker from "./middlewares/devPerformanceTracker.js";
import devApiTrackerRoutes from "./routes/dev/apiTrackerRoutes.js";
import attachMongooseProfiler from "./utils/mongooseProfilerPlugin.js";
import connectDB from "./models/connection.js";
import jwtLib from "jsonwebtoken";

// Attach Mongoose query latency profiler for development
attachMongooseProfiler();

const app = express();
const API_END_POINT_V1 = process.env.API_END_POINT_V1 || "/api/v1/";

// Ensure DB connection for serverless cold-starts on Vercel (Non-blocking background initialization)
let dbPromise = null;
app.use((req, res, next) => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.warn("MongoDB connection notice:", err?.message || err);
    });
  }
  next();
});

// Root & Health Endpoint for Vercel / Cloud Gateways
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    message: "Sindhi Matrimony Unified Backend API Gateway is live on Vercel.",
    status: "ONLINE",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    apiPrefix: "/api/v1",
    timestamp: Date.now(),
  });
});

// High-resolution dev performance profiler (zero overhead in production)
app.use(devPerformanceTracker);

// Security, Compression & Parsing Pipeline
app.use(corsMiddleware());
app.use(
  compression({
    threshold: 1024, // Compress responses exceeding 1KB to save egress bandwidth & mobile latency
  })
);
app.use(conditionalSkipper);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  // Mount Dev Tracker Dashboard & Metrics (Blocks onboarding tokens)
  app.use(
    "/dev",
    (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const decoded = jwtLib.decode(authHeader.split(" ")[1]);
          if (decoded && typeof decoded === "object" && decoded.scope === "ONBOARDING") {
            return res.status(403).json({
              message: "Forbidden: Onboarding session token cannot access dev tracker endpoints.",
              code: 1403,
              error: true,
              data: { scope: "ONBOARDING", requiredScope: "FULL_ACCESS" },
            });
          }
        } catch (_) {}
      }
      next();
    },
    devApiTrackerRoutes
  );
}

// Request Filter & Authorization Chain
app.use(maintenance);
app.use(jwt());
app.use((req, res, next) => {
  if (req.auth) {
    if (!req.user) req.user = req.auth;
    return next();
  }
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    try {
      const rawToken = req.headers.authorization.split(" ")[1];
      const decoded = jwtLib.decode(rawToken);
      if (decoded && typeof decoded === "object") {
        req.auth = decoded;
        req.user = decoded;
      }
    } catch (_) {}
  }
  next();
});
app.use(verifyTokenInRedis);
app.use(checkDisableUser);
app.use(mergeParamsToBody);
app.use(ipClientAdd);

// Explicit safe allowlist for onboarding-scoped tokens (Method:Path)
const ONBOARDING_ALLOWED_OPERATIONS = new Set([
  "POST:/api/v1/auth/send-otp",
  "POST:/api/v1/auth/sendotp",
  "POST:/api/v1/auth/users/send-otp",
  "POST:/api/v1/auth/users/sendotp",
  "POST:/api/v1/auth/verify-otp",
  "POST:/api/v1/auth/users/verify-otp",
  "POST:/api/v1/auth/resend-otp",
  "POST:/api/v1/auth/resendotp",
  "POST:/api/v1/auth/users/resend-otp",
  "POST:/api/v1/auth/users/resendotp",
  "POST:/api/v1/auth/check-phone",
  "POST:/api/v1/auth/users/check-phone",
  "POST:/api/v1/auth/register-step",
  "POST:/api/v1/auth/registerstep",
  "POST:/api/v1/auth/users/register-step",
  "POST:/api/v1/auth/users/registerstep",
  "POST:/api/v1/auth/register",
  "POST:/api/v1/auth/users/register",
  "POST:/api/v1/auth/complete-registration",
  "POST:/api/v1/auth/completeregistration",
  "POST:/api/v1/auth/users/complete-registration",
  "POST:/api/v1/auth/users/completeregistration",
  "POST:/api/v1/auth/logout",
  "POST:/api/v1/auth/userlogout",
  "POST:/api/v1/auth/users/logout",
  "GET:/api/v1/common/dropdowns",
  "GET:/api/v1/master/dropdowns",
  "GET:/api/v1/plans",
  "GET:/api/v1/plans/public-list",
  "GET:/health",
  "GET:/",
]);

// Read-only GET regex for dynamic master dropdown routes (e.g. /api/v1/master/cities, /api/v1/master/castes)
const ONBOARDING_ALLOWED_MASTER_GET_REGEX = /^\/api\/v1\/master(\/[a-z0-9_-]+)*$/i;

// Scoped Token Route Guard: Strictly enforces explicit allowlist for onboarding tokens
app.use((req, res, next) => {
  const auth = req.auth || req.user;
  if (auth?.scope === "ONBOARDING") {
    // Normalize path safely against traversal (..), multiple slashes, and trailing slashes
    const rawPath = (req.originalUrl || req.url || "").split("?")[0];
    const normalizedPath = path.posix.normalize(rawPath).replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();
    const routeKey = `${method}:${normalizedPath}`;

    const isExplicitlyAllowed =
      ONBOARDING_ALLOWED_OPERATIONS.has(routeKey) ||
      (method === "GET" && ONBOARDING_ALLOWED_MASTER_GET_REGEX.test(normalizedPath));

    if (!isExplicitlyAllowed) {
      return res.status(403).json({
        message: "Forbidden: Onboarding session token is restricted to registration wizard endpoints. Complete registration to unlock full member features.",
        code: 1403,
        error: true,
        data: {
          scope: "ONBOARDING",
          requiredScope: "FULL_ACCESS",
          attemptedRoute: normalizedPath,
          attemptedMethod: method,
        },
      });
    }
  }
  next();
});

// Mount Master API Gateway
app.use(API_END_POINT_V1, routes);

// 404 Route Fallback
app.use((req, res) => {
  res.status(404).json({
    message: `API endpoint '${req.originalUrl}' not found.`,
    code: NOT_FOUND,
    error: BOOLEAN_TRUE,
    data: DATA_NULL,
  });
});

// Centralized Global Error Boundary
app.use(errorHandler);

export default app;
