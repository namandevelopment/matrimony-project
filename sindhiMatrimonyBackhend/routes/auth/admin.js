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

import { adminChangePassword } from "../../controllers/admin/adminSettingsController.js";
router.post("/change-password", adminChangePassword);

export default router;
