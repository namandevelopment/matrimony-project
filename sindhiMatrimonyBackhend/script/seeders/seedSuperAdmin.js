import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User, Employee } from "../../models/index.js";
import { ROLES, ACCOUNT_STATUS } from "../../utils/variables.js";
import { logMessage, hashPassword } from "../../utils/globalFunction.js";

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
    logMessage(`✅ Super Admin user created with mobile: ${adminPhone}`, null, "info");
  } else {
    logMessage("ℹ️ Super Admin user account already exists.", null, "info");
  }

  // Seed Employee account for Admin CRM Panel
  const existingEmployee = await Employee.findOne({ email: "admin@sindhimarriage.in" });
  if (!existingEmployee) {
    const hashedEmpPassword = await hashPassword("Admin@1234");
    await Employee.create({
      employeeId: "EMP001",
      fullName: "Super Administrator",
      email: "admin@sindhimarriage.in",
      mobile: "+91 98200 11223",
      phone: "+91 98200 11223",
      password: hashedEmpPassword,
      role: "SUPER_ADMIN",
      roleCode: ROLES.SUPER_ADMIN,
      department: "Executive Management",
      designation: "Managing Director & Super Admin",
      team: "Executive Leadership",
      recordScope: "ALL",
      isActive: true,
      isChatEnabled: true,
    });
    logMessage("✅ Super Admin employee account created: admin@sindhimarriage.in", null, "info");
  }

export default seedSuperAdmin;
