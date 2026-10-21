import express from "express";
import {
  adminLogin,
  verifyAdminMfa,
  getAdminProfile,
  adminLogout,
} from "../../controllers/auth/admin.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

// 🔐 Admin Authentication Endpoints
router.post("/login", authRateLimiter, adminLogin);
router.post("/verify-mfa", authRateLimiter, verifyAdminMfa);
router.get("/me", getAdminProfile);
router.post("/logout", adminLogout);

export default router;
