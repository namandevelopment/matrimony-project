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
import contentRoutes from "./common/content.js";
import supportRoutes from "./support/index.js";
import adminRoutes from "./admin/index.js";
import reviewsRoutes from "./reviews/index.js";
import { getContent } from "../controllers/common/contentMasterController.js";
import {
  getDashboardData,
  getRecommendedMatches,
  getDailyHoroscope,
  saveUserRashi,
  getMobileHomeFeed,
} from "../controllers/dashboard/userDashboardController.js";
import {
  getActiveAdvertisements,
  trackAdClick,
} from "../controllers/campaigns/index.js";

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

// 2b. Admin Portal & CRM Router
router.use("/admin", adminRoutes);

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

// 4b. Partner Deals & Advertisements for User Panel
router.get("/ads", getActiveAdvertisements);
router.get("/feed/partner-deals", getActiveAdvertisements);
router.post("/ads/:id/click", trackAdClick);


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

// 12. Dynamic Content Gateway (Privacy Policy, Terms & Conditions, Our Process, Help & Support)
router.use("/content", contentRoutes);

// 13. Customer Support, Help Desk & FAQs Gateway
router.use("/support", supportRoutes);

// 14. Reviews & Testimonials Gateway (Public & Member Submissions)
router.use("/reviews", reviewsRoutes);
router.use("/common/reviews", reviewsRoutes);

// 🌐 Direct Root-Level Aliases for Content & Policies
router.get("/privacy-policy", (req, res) => {
  req.query.type = "privacy-policy";
  return getContent(req, res);
});
router.get("/terms-and-conditions", (req, res) => {
  req.query.type = "terms-and-conditions";
  return getContent(req, res);
});
router.get("/help-support", (req, res) => {
  req.query.type = "help-support";
  return getContent(req, res);
});
router.get("/our-process", (req, res) => {
  req.query.type = "our-process";
  return getContent(req, res);
});

// 14. Dev API Tracker (under /api/v1/dev)
if (process.env.NODE_ENV !== "production") {
  router.use("/dev", devApiTrackerRoutes);
}

export default router;
