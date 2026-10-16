import express from "express";
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
} from "../../validators/auth/users.js";
import {
  sendOtp,
  register,
  verifyLoginOtp,
  resendOtp,
  checkPhoneExists,
  logout,
} from "../../controllers/auth/users.js";

const router = express.Router();

/**
 * @route   POST /api/v1/auth/users/send-otp
 * @desc    Request OTP for Mobile App & Web (Login / Register)
 * @access  Public
 */
router.post("/send-otp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp);

/**
 * @route   POST /api/v1/auth/users/register
 * @desc    Complete Quick Registration & Multi-step Profile Initialization
 * @access  Public
 */
router.post("/register", registerRateLimiter, validationMiddleware(registerUserSchema), register);

/**
 * @route   POST /api/v1/auth/users/verify-otp
 * @desc    Verify OTP for Existing User Login
 * @access  Public
 */
router.post("/verify-otp", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);

/**
 * @route   POST /api/v1/auth/users/resend-otp
 * @desc    Resend OTP to Mobile
 * @access  Public
 */
router.post("/resend-otp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp);

/**
 * @route   POST /api/v1/auth/users/check-phone
 * @desc    Ultra-fast check if phone is already registered
 * @access  Public
 */
router.post("/check-phone", validationMiddleware(checkPhoneSchema), checkPhoneExists);

/**
 * @route   POST /api/v1/auth/users/logout
 * @desc    Logout User & Blacklist Token in Redis
 * @access  Private (JWT Required)
 */
router.post("/logout", logout);

export default router;
