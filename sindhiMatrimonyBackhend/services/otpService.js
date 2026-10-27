import crypto from "crypto";
import { getKey, setKeyWithTime, removeKey } from "./serviceRedis.js";
import { logMessage } from "../utils/globalFunction.js";

const OTP_TTL_SECONDS = 600; // 10 minutes
const COOLDOWN_SECONDS = 60; // 60 seconds
const MAX_ATTEMPTS = 5;
const MAX_PER_HOUR = 5;

const HMAC_SECRET = process.env.OTP_HMAC_SECRET || "sindhi-matrimony-secure-otp-hmac-salt-2026";

export const hashOtp = (otp) => {
  return crypto.createHmac("sha256", HMAC_SECRET).update(String(otp).trim()).digest("hex");
};

export const timingSafeCompare = (a, b) => {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
};

export const otpService = {
  /**
   * Check resend cooldown and rate limits for phone
   */
  checkLimits: async (phone, purpose = "REGISTER") => {
    const cooldownKey = `otp_cooldown:${purpose}:${phone}`;
    const rateHourKey = `otp_rate_hour:${phone}`;

    const inCooldown = await getKey(cooldownKey);
    if (inCooldown) {
      return { allowed: false, reason: "COOLDOWN", message: "Please wait 60 seconds before requesting another OTP." };
    }

    const hourCountStr = await getKey(rateHourKey);
    const hourCount = hourCountStr ? parseInt(hourCountStr, 10) : 0;
    if (hourCount >= MAX_PER_HOUR) {
      return { allowed: false, reason: "RATE_LIMIT", message: "Too many OTP requests. Please try again in an hour." };
    }

    return { allowed: true };
  },

  /**
   * Create challenge with cryptographically secure random OTP and HMAC hash
   */
  createChallenge: async (phone, purpose = "REGISTER") => {
    const limits = await otpService.checkLimits(phone, purpose);
    if (!limits.allowed) {
      const err = new Error(limits.message);
      err.code = limits.reason;
      throw err;
    }

    const otp = crypto.randomInt(1000, 10000).toString();
    const challengeId = crypto.randomUUID();
    const otpHash = hashOtp(otp);

    const challengeData = {
      challengeId,
      phone,
      purpose,
      otpHash,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      status: "PENDING",
      createdAt: Date.now(),
      expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    };

    const challengeKey = `otp_challenge:${challengeId}`;
    await setKeyWithTime(challengeKey, JSON.stringify(challengeData), OTP_TTL_SECONDS);

    // Set cooldown
    const cooldownKey = `otp_cooldown:${purpose}:${phone}`;
    await setKeyWithTime(cooldownKey, "1", COOLDOWN_SECONDS);

    // Increment hourly rate
    const rateHourKey = `otp_rate_hour:${phone}`;
    const currentRate = await getKey(rateHourKey);
    const newRate = (currentRate ? parseInt(currentRate, 10) : 0) + 1;
    await setKeyWithTime(rateHourKey, String(newRate), 3600);

    // In non-production, log preview for testing without leaking in production
    if (process.env.NODE_ENV !== "production") {
      logMessage(`[OTP DEV CHALLENGE] Id: ${challengeId} | Phone: ${phone} | Purpose: ${purpose} | OTP: ${otp}`, null, "info");
    }

    return {
      challengeId,
      expiresIn: OTP_TTL_SECONDS,
      phone,
      purpose,
      rawOtp: otp,
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
    };
  },

  /**
   * Verify and lock challenge (Phase 1 of 2-phase commit)
   */
  verifyAndLockChallenge: async (challengeId, candidateOtp, expectedPurpose, expectedPhone) => {
    if (!challengeId) {
      return { success: false, code: "MISSING_CHALLENGE", message: "challengeId is required." };
    }

    const challengeKey = `otp_challenge:${challengeId}`;
    const rawData = await getKey(challengeKey);

    if (!rawData) {
      return { success: false, code: "EXPIRED_OR_NOT_FOUND", message: "OTP challenge has expired or is invalid. Please request a new one." };
    }

    let challenge;
    try {
      challenge = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    } catch {
      return { success: false, code: "CORRUPTED_CHALLENGE", message: "Invalid challenge data." };
    }

    if (challenge.status === "CONSUMED") {
      return { success: false, code: "ALREADY_CONSUMED", message: "This OTP challenge has already been used." };
    }

    if (challenge.status === "EXHAUSTED" || challenge.attempts >= challenge.maxAttempts) {
      return { success: false, code: "ATTEMPTS_EXCEEDED", message: "Maximum OTP attempts exceeded. Please request a new OTP." };
    }

    if (Date.now() > challenge.expiresAt) {
      return { success: false, code: "EXPIRED", message: "OTP has expired. Please request a new OTP." };
    }

    if (expectedPurpose && challenge.purpose !== expectedPurpose) {
      return { success: false, code: "PURPOSE_MISMATCH", message: "OTP challenge purpose mismatch." };
    }

    if (expectedPhone && challenge.phone !== expectedPhone) {
      return { success: false, code: "PHONE_MISMATCH", message: "OTP challenge does not match this phone number." };
    }

    const isDevMasterOtp =
      process.env.NODE_ENV !== "production" &&
      (String(candidateOtp).trim() === "1234" || String(candidateOtp).trim() === "123456");

    const candidateHash = hashOtp(candidateOtp);
    const isMatch = isDevMasterOtp || timingSafeCompare(candidateHash, challenge.otpHash);

    if (!isMatch) {
      challenge.attempts += 1;
      const remaining = challenge.maxAttempts - challenge.attempts;
      if (remaining <= 0) {
        challenge.status = "EXHAUSTED";
      }
      const remainingSeconds = Math.max(1, Math.floor((challenge.expiresAt - Date.now()) / 1000));
      await setKeyWithTime(challengeKey, JSON.stringify(challenge), remainingSeconds);
      return {
        success: false,
        isValid: false,
        code: "INVALID_OTP",
        remainingAttempts: Math.max(0, remaining),
        message: remaining > 0 ? `Invalid OTP. ${remaining} attempts remaining.` : "Maximum attempts exceeded. Request a new OTP.",
      };
    }

    // Lock challenge
    challenge.status = "LOCKED";
    const remainingSeconds = Math.max(1, Math.floor((challenge.expiresAt - Date.now()) / 1000));
    await setKeyWithTime(challengeKey, JSON.stringify(challenge), remainingSeconds);

    return {
      success: true,
      isValid: true,
      challenge,
    };
  },

  /**
   * Commit challenge after DB transaction succeeds (Phase 2 commit)
   */
  commitChallenge: async (challengeId) => {
    const challengeKey = `otp_challenge:${challengeId}`;
    await removeKey(challengeKey);
  },

  /**
   * Rollback challenge if DB transaction fails (Phase 2 rollback)
   */
  rollbackChallenge: async (challengeId) => {
    const challengeKey = `otp_challenge:${challengeId}`;
    const rawData = await getKey(challengeKey);
    if (rawData) {
      try {
        const challenge = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        if (challenge.status === "LOCKED") {
          challenge.status = "PENDING";
          const remainingSeconds = Math.max(1, Math.floor((challenge.expiresAt - Date.now()) / 1000));
          await setKeyWithTime(challengeKey, JSON.stringify(challenge), remainingSeconds);
        }
      } catch (e) {
        logMessage("Error during challenge rollback:", e, "warn");
      }
    }
  },
};

export default otpService;
