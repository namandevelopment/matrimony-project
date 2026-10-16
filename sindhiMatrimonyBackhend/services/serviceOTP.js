import { generateOTP, logMessage } from "../utils/globalFunction.js";
import { setKeyWithTime, getKey, removeKey } from "./serviceRedis.js";

const OTP_TTL_SECONDS = 600; // 10 minutes

/**
 * Universal OTP Service
 * Ek hi service se Login, Registration, aur Password Reset sabke OTP handle hote hain.
 */
export const serviceOTP = {
  /**
   * Generate, store in Redis, and return OTP
   * @param {string} identifier - Phone number or email
   * @param {string} purpose - 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'
   */
  generateAndStoreOtp: async (identifier, purpose = "LOGIN") => {
    try {
      const otp = generateOTP(6);
      const redisKey = `otp:${purpose.toLowerCase()}:${identifier}`;
      await setKeyWithTime(redisKey, otp, OTP_TTL_SECONDS);
      logMessage(`[OTP Generated] Purpose: ${purpose} | For: ${identifier} | OTP: ${otp} (Dev preview)`, null, "info");
      return otp;
    } catch (error) {
      logMessage("Error generating and storing OTP:", error, "error");
      throw error;
    }
  },

  /**
   * Verify an OTP from Redis and invalidate on success
   * @param {string} identifier - Phone number or email
   * @param {string} otp - The 6-digit OTP entered by user
   * @param {string} purpose - 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'
   */
  verifyOtp: async (identifier, otp, purpose = "LOGIN") => {
    try {
      // In development mode, allow test OTP '123456' for rapid developer testing
      if (process.env.NODE_ENV !== "production" && otp === "123456") {
        return { isValid: true, message: "Development master OTP accepted." };
      }

      const redisKey = `otp:${purpose.toLowerCase()}:${identifier}`;
      const storedOtp = await getKey(redisKey);

      if (!storedOtp) {
        return { isValid: false, message: "OTP has expired. Please request a new one." };
      }

      if (storedOtp !== String(otp).trim()) {
        return { isValid: false, message: "Invalid OTP. Please check and try again." };
      }

      // One-time use: Delete immediately after successful verification
      await removeKey(redisKey);
      return { isValid: true, message: "OTP verified successfully." };
    } catch (error) {
      logMessage("Error verifying OTP:", error, "error");
      return { isValid: false, message: "Failed to verify OTP." };
    }
  },

  /**
   * Verify an OTP against multiple allowable purposes (e.g. ['REGISTER', 'LOGIN'])
   * @param {string} identifier - Phone number or email
   * @param {string} otp - The 6-digit OTP entered by user
   * @param {Array<string>} purposes - List of allowable purposes
   */
  verifyOtpAnyPurpose: async (identifier, otp, purposes = ["REGISTER", "LOGIN"]) => {
    try {
      if (process.env.NODE_ENV !== "production" && String(otp).trim() === "123456") {
        return { isValid: true, message: "Development master OTP accepted." };
      }

      let hadValidKey = false;
      for (const purpose of purposes) {
        const redisKey = `otp:${purpose.toLowerCase()}:${identifier}`;
        const storedOtp = await getKey(redisKey);
        if (storedOtp) {
          hadValidKey = true;
          if (storedOtp === String(otp).trim()) {
            await removeKey(redisKey);
            return { isValid: true, message: "OTP verified successfully." };
          }
        }
      }

      if (hadValidKey) {
        return { isValid: false, message: "Invalid OTP. Please check and try again." };
      }

      return { isValid: false, message: "OTP has expired. Please request a new one." };
    } catch (error) {
      logMessage("Error verifying OTP across purposes:", error, "error");
      return { isValid: false, message: "Failed to verify OTP." };
    }
  },
};

export default serviceOTP;
