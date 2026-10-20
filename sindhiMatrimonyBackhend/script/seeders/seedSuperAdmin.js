import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../../models/index.js";
import { ROLES, ACCOUNT_STATUS } from "../../utils/variables.js";
import { logMessage } from "../../utils/globalFunction.js";

/**
 * 👑 Seed Default Super Admin Account
 */
export async function seedSuperAdmin() {
  logMessage("Checking Super Admin account...", null, "info");

  const adminPhone = "9829000000";
  const existingAdmin = await User.findOne({ phone: adminPhone });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("AdminSuperPass2026@", 10);
    const adminUser = new User({
      phone: adminPhone,
      countryCode: "+91",
      email: "admin@sindhimarriage.in",
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN || 99,
      status: ACCOUNT_STATUS.ACTIVE,
      isPhoneVerified: true,
      isEmailVerified: true,
      isKycVerified: true,
      onboardingStep: 7,
      isOnboardingComplete: true,
      clientPlatform: "WEB",
    });

    await adminUser.save();
    logMessage(`✅ Super Admin created with mobile: ${adminPhone}`, null, "info");
  } else {
    logMessage("ℹ️ Super Admin account already exists.", null, "info");
  }
}

export default seedSuperAdmin;
