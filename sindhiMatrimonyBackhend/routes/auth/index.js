import express from "express";
import userRoutes from "./users.js";

// Shorthand imports from controllers and validators for direct /auth/... endpoints
import validationMiddleware from "../../middlewares/validationMiddleware.js";
import {
  otpRateLimiter,
  registerRateLimiter,
  authRateLimiter,
} from "../../middlewares/rateLimiter.js";
import {
  sendOtpSchema,
  registerUserSchema,
  verifyOtpSchema,
  resendOtpSchema,
  checkPhoneSchema,
  createSecondaryProfileSchema,
  switchProfileSchema,
} from "../../validators/auth/users.js";
import {
  sendOtp,
  register,
  verifyLoginOtp,
  resendOtp,
  checkPhoneExists,
  logout,
  createSecondaryProfile,
  getMyProfiles,
  switchActiveProfile,
} from "../../controllers/auth/users.js";

const router = express.Router();

// 1. Nested User Routes: /api/v1/auth/users/...
router.use("/users", userRoutes);

// 2. Shorthand Routes directly matching Mobile App (sindhiMatrimony/src/redux/apiService/endpoint.ts):
// e.g. /api/v1/auth/send-otp, /api/v1/auth/register, /api/v1/auth/verify-otp
router.post("/send-otp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp);
router.post("/sendOtp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp); // Legacy camelCase support
router.post("/register", registerRateLimiter, validationMiddleware(registerUserSchema), register);
router.post("/verify-otp", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);
router.post("/login", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);
router.post("/resend-otp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp);
router.post("/reSendOtp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp); // Legacy camelCase support
router.post("/check-phone", validationMiddleware(checkPhoneSchema), checkPhoneExists);
router.post("/logout", logout);
router.post("/userLogout", logout); // Legacy camelCase support

// Shorthand multi-profile endpoints
router.get("/my-profiles", getMyProfiles);
router.post("/profiles", registerRateLimiter, validationMiddleware(createSecondaryProfileSchema), createSecondaryProfile);
router.post("/switch-profile", validationMiddleware(switchProfileSchema), switchActiveProfile);

export default router;
