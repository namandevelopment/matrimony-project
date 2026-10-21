import express from "express";
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
  // Mount Dev Tracker Dashboard & Metrics
  app.use("/dev", devApiTrackerRoutes);
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
