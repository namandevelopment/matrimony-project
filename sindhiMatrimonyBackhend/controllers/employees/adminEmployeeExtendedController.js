import { asyncHandler, apiHTTPResponse, hashPassword } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { STAFF_EMPLOYEES } from "../../services/realDataService.js";

/**
 * 1. POST /api/v1/admin/employees
 * Create staff onboarding account
 */
export const createStaffEmployee = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    role = "MATCHMAKER",
    branchId = "BR_MUMBAI",
    password = "StaffPassword@123",
    department = "Matchmaking",
    designation = "Senior Matchmaker",
  } = req.body;

  // Validation
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'fullName' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const cleanEmail = String(email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: A valid 'email' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Duplicate email check
  const existingEmployee = STAFF_EMPLOYEES.find(
    (e) => e.email?.toLowerCase() === cleanEmail
  );
  if (existingEmployee) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      `An employee with email '${cleanEmail}' already exists (ID: ${existingEmployee.employeeId}).`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const hashedPassword = await hashPassword(password);
  const employeeId = `EMP-${1000 + STAFF_EMPLOYEES.length + 1}`;
  const now = new Date().toISOString();

  const newEmployee = {
    _id: `staff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    employeeId,
    fullName: fullName.trim(),
    name: fullName.trim(),
    email: cleanEmail,
    phone: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : "+91 9820011223",
    role: role.toUpperCase(),
    department,
    designation,
    branchId,
    status: "ACTIVE",
    passwordHash: hashedPassword,
    permissions: [
      "VIEW_MEMBERS",
      "EDIT_PROFILES",
      "CREATE_PROPOSALS",
      "RECORD_CALLS",
      "INTERNAL_CHAT",
    ],
    assignedLeadsCount: 0,
    activeProposalsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  STAFF_EMPLOYEES.push(newEmployee);

  const sanitized = { ...newEmployee };
  delete sanitized.passwordHash;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Staff employee account for ${newEmployee.fullName} created successfully.`,
    sanitized,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. PUT /api/v1/admin/employees/:id/status
 * Suspend or activate staff account
 */
export const updateStaffEmployeeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason = "" } = req.body;

  const upperStatus = String(status || "").toUpperCase();
  const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "ON_LEAVE"];

  if (!ALLOWED_STATUSES.includes(upperStatus)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid status '${status}'. Allowed options: ${ALLOWED_STATUSES.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const employee = STAFF_EMPLOYEES.find(
    (e) => e._id === id || e.employeeId === id || e.id === id
  );

  if (!employee) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Employee with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  employee.status = upperStatus;
  employee.statusReason = reason.trim();
  employee.statusUpdatedAt = new Date().toISOString();
  employee.updatedAt = new Date().toISOString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Employee ${employee.fullName} status updated to '${upperStatus}'.`,
    {
      employeeId: employee.employeeId,
      name: employee.fullName,
      status: employee.status,
      statusReason: employee.statusReason,
      updatedAt: employee.updatedAt,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
