import express from "express";
import { HTTP_OK, OK, ERROR_FALSE } from "../utils/constants.js";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import authRoutes from "./auth/index.js";
import profileRoutes from "./members/profile.js";
import membersRoutes from "./members/index.js";

const router = express.Router();

// System Health & Liveness Check
router.get("/health", (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Sindhi Matrimony Unified API Gateway is healthy and running.",
    {
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || "development",
    },
    OK,
    ERROR_FALSE
  );
});

// Authentication & Registration Router
router.use("/auth", authRoutes);

// Candidate Profile & Partner Preferences Router (Matches Mobile App & Web Panel)
router.use("/profile", profileRoutes);
router.use("/members", membersRoutes);

export default router;
