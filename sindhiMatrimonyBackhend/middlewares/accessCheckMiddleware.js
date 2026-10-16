import {
  HTTP_FORBIDDEN,
  FORBIDDEN,
  DATA_NULL,
  ERROR_TRUE,
} from "../utils/constants.js";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import { ROLES, RECORD_SCOPE } from "../utils/variables.js";

/**
 * Access Check Middleware:
 * 1. Verifies granular screen/action permission.
 * 2. Injects req.recordScope filter for data isolation (e.g. Telecallers only see their assigned leads).
 */
export const accessCheck = (screenId, action = "read") => (req, res, next) => {
  const auth = req.auth;

  if (!auth) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_FORBIDDEN,
      "Access denied. User not authenticated.",
      DATA_NULL,
      FORBIDDEN,
      ERROR_TRUE
    );
  }

  // Super Admin has full bypass on all screens and actions
  if (auth.role === ROLES.SUPER_ADMIN) {
    req.recordScope = {}; // Unrestricted access
    return next();
  }

  // Determine Record Scope based on employee role and branch
  if (auth.role === ROLES.TELECALLER) {
    // Telecaller is restricted to records assigned to their employeeId
    req.recordScope = { assignedTo: auth.userId || auth.employeeId };
  } else if (auth.role === ROLES.MATCHMAKER) {
    // Matchmaker sees assigned candidate profiles or branch profiles
    req.recordScope = auth.branchId
      ? { $or: [{ assignedMatchmaker: auth.userId }, { branchId: auth.branchId }] }
      : { assignedMatchmaker: auth.userId };
  } else if (auth.role === ROLES.ADMIN) {
    // Branch Admin sees everything within their branch
    req.recordScope = auth.branchId ? { branchId: auth.branchId } : {};
  } else {
    req.recordScope = {};
  }

  // Check granular permission if permissions array is present in JWT
  if (Array.isArray(auth.permissions) && auth.permissions.length > 0) {
    const hasClearance = auth.permissions.some(
      (p) => p.screen === screenId && (p.actions?.includes(action) || p.actions?.includes("ALL"))
    );
    if (!hasClearance) {
      return apiHTTPResponse(
        req,
        res,
        HTTP_FORBIDDEN,
        `You do not have permission to ${action} on ${screenId}.`,
        DATA_NULL,
        FORBIDDEN,
        ERROR_TRUE
      );
    }
  }

  next();
};

export default accessCheck;
