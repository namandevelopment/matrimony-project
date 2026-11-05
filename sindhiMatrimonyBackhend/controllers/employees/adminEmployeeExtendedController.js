import { asyncHandler, apiHTTPResponse, hashPassword } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import mongoose from "mongoose";

/**
 * 1. POST /api/v1/admin/employees
 * Create staff employee with role inheritance and audit log
 */
export const createStaffEmployee = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    mobile,
    role = "CRM_AGENT",
    roleId,
    branchId = "BR_MUMBAI",
    password,
    department,
    designation,
    managerId = null,
    managerName = "",
    teamId = null,
    recordScope = "OWN",
    maxLeadCapacity = 25,
    regions = [],
    languages = [],
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

  if (!password || String(password).length < 8) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Password is required and must be at least 8 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Duplicate email check
  if (mongoose.connection.readyState === 1) {
    const dbExisting = await Employee.findOne({ email: cleanEmail });
    if (dbExisting) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        `An employee with email '${cleanEmail}' already exists (ID: ${dbExisting.employeeId}).`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  const cleanPhone = String(phone || mobile || "").replace(/\D/g, "");
  const hashedPassword = await hashPassword(password);
  const empCount = await Employee.countDocuments();
  const now = new Date().toISOString();

  // Resolve role from DB to inherit permissions and allowedSections
  let resolvedRole = null;
  let targetRoleCode = String(role).toUpperCase();

  if (mongoose.connection.readyState === 1) {
    if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
      resolvedRole = await Role.findById(roleId);
    }
    if (!resolvedRole) {
      resolvedRole = await Role.findOne({ code: targetRoleCode });
    }
  }

  const inheritedPermissions = resolvedRole?.permissions || {
    leads: { view: true, edit: true, create: true, delete: false, assign: false, export: false, call: true },
    chat: { view: true, receive: true, initiate: true },
  };
  const inheritedSections = resolvedRole?.allowedSections || ["dashboard", "leads", "tasks"];
  const finalRoleCode = resolvedRole?.code || targetRoleCode;
  const finalDepartment = department || resolvedRole?.department || "Sales & CRM";

  let savedDoc = null;
  if (mongoose.connection.readyState === 1) {
    try {
      savedDoc = await Employee.create({
        employeeId,
        fullName: fullName.trim(),
        email: cleanEmail,
        mobile: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : (mobile || phone || "+91 9820011223"),
        phone: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : (mobile || phone || "+91 9820011223"),
        password: hashedPassword,
        role: finalRoleCode,
        roleId: resolvedRole?._id || null,
        department: finalDepartment,
        designation: designation || resolvedRole?.name || "CRM Executive",
        managerId: managerId || null,
        managerName: managerName || null,
        teamId: teamId || null,
        recordScope: recordScope || "OWN",
        permissions: inheritedPermissions,
        allowedSections: inheritedSections,
        status: "ACTIVE",
        isActive: true,
        isChatEnabled: true,
        maxLeadCapacity: Number(maxLeadCapacity) || 25,
        regions: Array.isArray(regions) ? regions : [],
        languages: Array.isArray(languages) ? languages : [],
        createdBy: req.auth?.employeeId || "ADMIN",
        updatedBy: req.auth?.employeeId || "ADMIN",
      });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          "An employee with this email or employeeId already exists.",
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
          CONSTANTS.ERROR_TRUE
        );
      }
      throw dbErr;
    }
  }

  const newEmployee = {
    _id: savedDoc ? String(savedDoc._id) : `staff_${Date.now()}`,
    id: savedDoc ? String(savedDoc._id) : `emp_${Date.now()}`,
    employeeId,
    fullName: fullName.trim(),
    name: fullName.trim(),
    email: cleanEmail,
    mobile: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : (mobile || phone || "+91 9820011223"),
    phone: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : (mobile || phone || "+91 9820011223"),
    role: finalRoleCode,
    roleId: resolvedRole?._id || null,
    department: finalDepartment,
    designation: designation || resolvedRole?.name || "CRM Executive",
    branchId,
    managerId: managerId || null,
    managerName: managerName || "",
    teamId: teamId || null,
    recordScope: recordScope || "OWN",
    status: "ACTIVE",
    isActive: true,
    isChatEnabled: true,
    permissions: inheritedPermissions,
    allowedSections: inheritedSections,
    maxLeadCapacity: Number(maxLeadCapacity) || 25,
    assignedLeadsCount: 0,
    activeProposalsCount: 0,
    regions: Array.isArray(regions) ? regions : [],
    languages: Array.isArray(languages) ? languages : [],
    createdAt: now,
    updatedAt: now,
  };

  // Record Audit Log
  AuditLog.create({
    targetEmployeeId: employeeId,
    targetNameSnapshot: fullName.trim(),
    action: "CREATE_EMPLOYEE",
    module: "EMPLOYEES",
    description: `Created new staff employee ${fullName} (${employeeId}) with role ${finalRoleCode}`,
    after: { ...newEmployee, password: "[REDACTED]" },
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => { });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Staff employee account for ${newEmployee.fullName} created successfully.`,
    newEmployee,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. PUT /api/v1/admin/employees/:id
 * Full employee profile update
 */
export const updateStaffEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    mobile,
    phone,
    department,
    designation,
    managerId,
    managerName,
    teamId,
    recordScope,
    role,
    roleId,
    regions,
    languages,
    maxLeadCapacity,
    isChatEnabled,
    status,
  } = req.body;

  let employee = null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
  }

  if (!employee) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Employee with identifier '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const beforeSnapshot = employee.toObject ? employee.toObject() : { ...employee };

  // Role update: if role changed, inherit the new role's permissions and allowedSections
  if (role || roleId) {
    let newRoleDoc = null;
    if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
      newRoleDoc = await Role.findById(roleId);
    }
    if (!newRoleDoc && role) {
      newRoleDoc = await Role.findOne({ code: String(role).toUpperCase() });
    }
    if (newRoleDoc) {
      employee.role = newRoleDoc.code;
      employee.roleId = newRoleDoc._id;
      employee.permissions = newRoleDoc.permissions;
      employee.allowedSections = newRoleDoc.allowedSections;
    }
  }

  if (fullName) employee.fullName = fullName.trim();
  if (mobile || phone) {
    const cleanP = String(mobile || phone).replace(/\D/g, "");
    employee.mobile = cleanP ? `+91 ${cleanP.slice(-10)}` : employee.mobile;
    employee.phone = employee.mobile;
  }
  if (department) employee.department = department.trim();
  if (designation) employee.designation = designation.trim();
  if (managerId !== undefined) employee.managerId = managerId || null;
  if (managerName !== undefined) employee.managerName = managerName || null;
  if (teamId !== undefined) employee.teamId = teamId || null;
  if (recordScope) employee.recordScope = recordScope;
  if (Array.isArray(regions)) employee.regions = regions;
  if (Array.isArray(languages)) employee.languages = languages;
  if (maxLeadCapacity !== undefined) employee.maxLeadCapacity = Number(maxLeadCapacity) || 25;
  if (isChatEnabled !== undefined) employee.isChatEnabled = Boolean(isChatEnabled);
  if (status && ["ACTIVE", "INACTIVE", "SUSPENDED"].includes(String(status).toUpperCase())) {
    employee.status = String(status).toUpperCase();
    employee.isActive = employee.status === "ACTIVE";
  }

  employee.updatedBy = req.auth?.employeeId || "ADMIN";
  if (employee.save) {
    await employee.save();
  }

  // Audit Log
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: employee.employeeId,
    targetNameSnapshot: employee.fullName,
    action: "UPDATE_EMPLOYEE",
    module: "EMPLOYEES",
    description: `Updated profile details for ${employee.fullName} (${employee.employeeId})`,
    before: beforeSnapshot,
    after: employee.toObject ? employee.toObject() : employee,
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Employee '${employee.fullName}' updated successfully.`,
    employee,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. PUT /api/v1/admin/employees/:id/status
 * Update employee status (ACTIVE, INACTIVE, SUSPENDED)
 */
export const updateStaffEmployeeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason = "" } = req.body;

  const upperStatus = String(status || "").toUpperCase();
  const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"];

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

  let employee = null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
  }

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

  const oldStatus = employee.status;
  employee.status = upperStatus;
  employee.isActive = upperStatus === "ACTIVE";
  employee.statusReason = reason.trim();
  employee.updatedBy = req.auth?.employeeId || "ADMIN";

  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: employee.employeeId,
    targetNameSnapshot: employee.fullName,
    action: "STATUS_CHANGE",
    module: "EMPLOYEES",
    description: `Changed status of ${employee.fullName} from ${oldStatus} to ${upperStatus}. Reason: ${reason || "N/A"}`,
    before: { status: oldStatus },
    after: { status: upperStatus, reason },
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => { });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Employee ${employee.fullName} status updated to '${upperStatus}'.`,
    {
      employeeId: employee.employeeId,
      name: employee.fullName,
      status: employee.status,
      isActive: employee.isActive,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 4. PUT /api/v1/admin/employees/:id/reset-password
 * Reset employee password
 */
export const resetEmployeePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || String(newPassword).length < 8) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'newPassword' must be at least 8 characters long.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  let employee = null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
  }

  if (!employee) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Employee not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const hashedPassword = await hashPassword(newPassword);
  employee.password = hashedPassword;
  employee.updatedBy = req.auth?.employeeId || "ADMIN";

  if (employee.save) {
    await employee.save();
  }

  // Audit Log
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: employee.employeeId,
    targetNameSnapshot: employee.fullName,
    action: "RESET_PASSWORD",
    module: "AUTH",
    description: `Administrative password reset performed for ${employee.fullName} (${employee.employeeId})`,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => { });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Password for employee '${employee.fullName}' reset successfully.`,
    { employeeId: employee.employeeId },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 5. DELETE /api/v1/admin/employees/:id
 * Permanent deletion (SUPER_ADMIN only; unlinks references, captures audit snapshot)
 */
export const deleteStaffEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let employee = null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
  }

  if (!employee) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Employee not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Prevent deleting the primary super administrator
  if (employee.employeeId === "EMP001" || employee.email === "superadmin@sindhimatrimony.com") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Cannot delete the primary root Super Administrator account.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
    await Lead.updateMany(
      { assignedEmployeeId: employee.employeeId },
      { $set: { assignedEmployeeId: null, "owner.name": "Unassigned" } }
    );
    await Task.updateMany(
      { assignedEmployeeId: employee.employeeId },
      { $set: { assignedEmployeeId: "UNASSIGNED", assignedEmployeeName: "Unassigned" } }
    );
    await Employee.findByIdAndDelete(employee._id);
  }

  // Preserve complete audit snapshot
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "SUPER_ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: employee.employeeId,
    targetNameSnapshot: employee.fullName,
    action: "PERMANENT_DELETE",
    module: "EMPLOYEES",
    description: `Permanently deleted employee ${employee.fullName} (${employee.employeeId}). References in leads and tasks unlinked safely.`,
    before: snapshot,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => { });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Employee '${employee.fullName}' (${employee.employeeId}) permanently deleted. Audit trail preserved.`,
    { employeeId: employee.employeeId },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
