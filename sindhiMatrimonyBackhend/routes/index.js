import express from "express";
import { HTTP_OK, OK, ERROR_FALSE } from "../utils/constants.js";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import authRoutes from "./auth/index.js";
import profileRoutes from "./members/profile.js";
import membersRoutes from "./members/index.js";
import masterDataRoutes from "./masterData/index.js";
import devApiTrackerRoutes from "./dev/apiTrackerRoutes.js";
import userDashboardRoutes from "./dashboard/userDashboard.js";
import matchmakingRoutes from "./matchmaking/index.js";
import chatRoutes from "./chat/index.js";
import horoscopeRoutes from "./horoscope/index.js";
import safetyRoutes from "./safety/index.js";
import verificationRoutes from "./verifications/index.js";
import plansRoutes from "./plans/index.js";
import paymentRoutes from "./finance/payments.js";
import notificationRoutes from "./notifications/index.js";
import {
  getDashboardData,
  getRecommendedMatches,
  getDailyHoroscope,
  saveUserRashi,
  getMobileHomeFeed,
} from "../controllers/dashboard/userDashboardController.js";

const router = express.Router();

// 1. System Health & Liveness Check
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

// 2. Authentication & Registration Router
router.use("/auth", authRoutes);

// 3. Candidate Profile & Partner Preferences Router (Matches Mobile App & Web Panel)
router.use("/profile", profileRoutes);
router.use("/members", membersRoutes);

// 4. Candidate Dashboard & Feeds Router
router.use("/dashboard", userDashboardRoutes);

// Frontend Direct Aliases (/feed/home, /feed/mobile-home, /matches/recommendations, /horoscope/daily)
router.get("/feed/home", getDashboardData);
router.get("/feed/mobile-home", getMobileHomeFeed);
router.get("/matches/recommendations", getRecommendedMatches);
router.get("/horoscope/daily", getDailyHoroscope);
router.post("/horoscope/save-rashi", saveUserRashi);


// 5. Matchmaking, Search & Interests Router
router.use("/matchmaking", matchmakingRoutes);

// 6. Real-Time Chat & Messaging Router
router.use("/chat", chatRoutes);

// 7. Kundli & Vedic Horoscope Matching Router
router.use("/horoscope", horoscopeRoutes);

// 8. Trust, Safety & Identity Verification Routers
router.use("/safety", safetyRoutes);
router.use("/verifications", verificationRoutes);

// 9. Membership Plans & Payment Gateway Routers
router.use("/plans", plansRoutes);
router.use("/payments", paymentRoutes);

// 10. Notifications & Device Push Alerts Router
router.use("/notifications", notificationRoutes);

// 11. Master Data & Dropdown Configurations Router
router.use("/master", masterDataRoutes);

// 12. Dev API Tracker (under /api/v1/dev)
if (process.env.NODE_ENV !== "production") {
  router.use("/dev", devApiTrackerRoutes);
}

export default router;
