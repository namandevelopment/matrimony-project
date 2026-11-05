import {
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  FORBIDDEN,
  UNAUTHORIZED,
  DATA_NULL,
  ERROR_TRUE,
} from "../utils/constants.js";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import Employee from "../models/employees/employee.model.js";
import Role from "../models/roles/role.model.js";
import mongoose from "mongoose";

/**
 * Access Check Middleware:
 * 1. Verifies staff authentication & ACTIVE status.
 * 2. Enforces section access (allowedSections) & granular permissions.
 * 3. Injects req.recordScope query filter (ALL, OWN, ASSIGNED, TEAM, REGION).
 */
export const accessCheck = (sectionId, action = "view") => async (req, res, next) => {
  const auth = req.auth;

  if (!auth) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_UNAUTHORIZED,
      "Access denied. User not authenticated.",
      DATA_NULL,
      UNAUTHORIZED,
      ERROR_TRUE
    );
  }

  // 1. Fetch live employee status & clearance from MongoDB
  let employee = null;
  if (mongoose.connection.readyState === 1 && (auth.id || auth.employeeId)) {
    try {
      if (mongoose.Types.ObjectId.isValid(auth.id)) {
        employee = await Employee.findById(auth.id);
      }
      if (!employee && auth.employeeId) {
        employee = await Employee.findOne({ employeeId: auth.employeeId });
      }
    } catch (_) {}
  }

  // Status check: immediately reject deactivated or suspended accounts
  if (employee && (employee.status === "INACTIVE" || employee.status === "SUSPENDED" || employee.isActive === false)) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_FORBIDDEN,
      `Your account has been ${employee.status.toLowerCase()}. Access revoked.`,
      DATA_NULL,
      FORBIDDEN,
      ERROR_TRUE
    );
  }

  const roleCode = String(employee?.role || auth.role || "").toUpperCase();

  // 2. Super Admin full enterprise bypass
  if (roleCode === "SUPER_ADMIN") {
    req.recordScope = {};
    req.effectiveEmployee = employee;
    return next();
  }

  // 3. Resolve role-based allowedSections and permissions
  let roleDoc = null;
  if (mongoose.connection.readyState === 1 && (employee?.roleId || roleCode)) {
    try {
      if (employee?.roleId) {
        roleDoc = await Role.findById(employee.roleId);
      }
      if (!roleDoc && roleCode) {
        roleDoc = await Role.findOne({ code: roleCode });
      }
    } catch (_) {}
  }

  const allowedSections = roleDoc?.allowedSections || employee?.allowedSections || ["dashboard"];
  const permissions = roleDoc?.permissions || employee?.permissions || {};

  // 4. Section Clearance Check
  if (sectionId && !allowedSections.includes(sectionId)) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_FORBIDDEN,
      `Access denied: Your role [${roleCode}] does not have clearance for section '${sectionId}'.`,
      DATA_NULL,
      FORBIDDEN,
      ERROR_TRUE
    );
  }

  // 5. Granular Action Check
  if (sectionId && action && permissions[sectionId]) {
    const sectionPerms = permissions[sectionId];
    if (sectionPerms[action] === false) {
      return apiHTTPResponse(
        req,
        res,
        HTTP_FORBIDDEN,
        `Permission denied: You do not have permission to '${action}' in '${sectionId}'.`,
        DATA_NULL,
        FORBIDDEN,
        ERROR_TRUE
      );
    }
  }

  // 6. Injects req.recordScope query filter for database query isolation
  const scope = employee?.recordScope || auth.recordScope || "OWN";
  const empId = employee?.employeeId || auth.employeeId;

  if (scope === "ALL") {
    req.recordScope = {};
  } else if (scope === "ASSIGNED") {
    req.recordScope = { assignedEmployeeId: empId };
  } else if (scope === "TEAM") {
    req.recordScope = employee?.teamId ? { teamId: employee.teamId } : { assignedEmployeeId: empId };
  } else if (scope === "REGION") {
    req.recordScope = employee?.regions && employee.regions.length > 0
      ? { city: { $in: employee.regions } }
      : { assignedEmployeeId: empId };
  } else {
    // OWN: Strictly created by or assigned to self
    req.recordScope = {
      $or: [{ createdBy: empId }, { assignedEmployeeId: empId }],
    };
  }

  req.effectiveEmployee = employee;
  next();
};

/**
 * Restricted strictly to SUPER_ADMIN role
 */
export const requireSuperAdmin = (req, res, next) => {
  const role = String(req.auth?.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return apiHTTPResponse(
      req,
      res,
      HTTP_FORBIDDEN,
      "Super Administrator privilege required for this action.",
      DATA_NULL,
      FORBIDDEN,
      ERROR_TRUE
    );
  }
  next();
};

export default accessCheck;
