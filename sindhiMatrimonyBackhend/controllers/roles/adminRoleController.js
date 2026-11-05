import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import Role from "../../models/roles/role.model.js";
import Employee from "../../models/employees/employee.model.js";
import AuditLog from "../../models/audit/auditLog.model.js";
import { INITIAL_12_ROLES } from "../../services/roleSeederService.js";
import mongoose from "mongoose";

/**
 * 1. GET /api/v1/admin/roles
 * Retrieve all roles with permissions and clearance scopes
 */
export const getRolesList = asyncHandler(async (req, res) => {
  let roles = [];

  if (mongoose.connection.readyState === 1) {
    roles = await Role.find().sort({ hierarchyLevel: 1, createdAt: 1 }).lean();
  }

  // Fallback if not yet seeded
  if (!roles || roles.length === 0) {
    roles = INITIAL_12_ROLES.map((r, i) => ({
      _id: `role_${i + 1}`,
      id: `role_${i + 1}`,
      ...r,
      isActive: true,
    }));
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Roles retrieved successfully.",
    {
      roles,
      total: roles.length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/roles
 * Create custom RBAC role (SUPER_ADMIN only)
 */
export const createRole = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    description,
    department = "Operations",
    hierarchyLevel = 4,
    canManageEmployees = false,
    canManageRoles = false,
    canManagePermissions = false,
    canViewAuditLogs = false,
    allowedSections = ["dashboard"],
    permissions = {},
  } = req.body;

  if (!name || !code) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Role 'name' and 'code' are required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const cleanCode = String(code).trim().toUpperCase();

  // Protect against creating duplicate or unauthorized super admin roles
  if (cleanCode === "SUPER_ADMIN") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Cannot create another SUPER_ADMIN role.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existing = await Role.findOne({ code: cleanCode });
  if (existing) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      `Role with code '${cleanCode}' already exists.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  const newRole = await Role.create({
    name: name.trim(),
    code: cleanCode,
    description: description || "",
    department,
    hierarchyLevel: Math.max(2, Number(hierarchyLevel) || 4), // Custom roles cannot exceed level 1
    canManageEmployees: Boolean(canManageEmployees),
    canManageRoles: Boolean(canManageRoles),
    canManagePermissions: Boolean(canManagePermissions),
    canViewAuditLogs: Boolean(canViewAuditLogs),
    isSystemRole: false,
    isActive: true,
    allowedSections: Array.isArray(allowedSections) ? allowedSections : ["dashboard"],
    permissions: permissions || {},
    createdBy: req.auth?.employeeId || "ADMIN",
    updatedBy: req.auth?.employeeId || "ADMIN",
  });

  // Audit log
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "SUPER_ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: cleanCode,
    targetNameSnapshot: name.trim(),
    action: "CREATE_ROLE",
    module: "ROLES",
    description: `Created new custom RBAC role ${name} (${cleanCode})`,
    after: newRole.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => {});

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Custom role '${newRole.name}' created successfully.`,
    newRole,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. PUT /api/v1/admin/roles/:id
 * Update role definition, permissions or allowed sections
 */
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    department,
    hierarchyLevel,
    canManageEmployees,
    canManageRoles,
    canManagePermissions,
    canViewAuditLogs,
    allowedSections,
    permissions,
    isActive,
  } = req.body;

  const role = await Role.findById(id);
  if (!role) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Role not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Prevent modifying critical system flags on SUPER_ADMIN
  if (role.code === "SUPER_ADMIN" && req.auth?.role !== "SUPER_ADMIN") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Only Super Administrators can modify SUPER_ADMIN configurations.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const beforeSnapshot = role.toObject();

  if (name) role.name = name.trim();
  if (description !== undefined) role.description = description;
  if (department) role.department = department;
  if (hierarchyLevel !== undefined && role.code !== "SUPER_ADMIN") {
    role.hierarchyLevel = Math.max(2, Number(hierarchyLevel) || 4);
  }
  if (canManageEmployees !== undefined && role.code !== "SUPER_ADMIN") role.canManageEmployees = Boolean(canManageEmployees);
  if (canManageRoles !== undefined && role.code !== "SUPER_ADMIN") role.canManageRoles = Boolean(canManageRoles);
  if (canManagePermissions !== undefined && role.code !== "SUPER_ADMIN") role.canManagePermissions = Boolean(canManagePermissions);
  if (canViewAuditLogs !== undefined && role.code !== "SUPER_ADMIN") role.canViewAuditLogs = Boolean(canViewAuditLogs);
  if (Array.isArray(allowedSections)) role.allowedSections = allowedSections;
  if (permissions && typeof permissions === "object") role.permissions = permissions;
  if (isActive !== undefined && !role.isSystemRole) role.isActive = Boolean(isActive);

  role.updatedBy = req.auth?.employeeId || "ADMIN";
  await role.save();

  // Audit log
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: role.code,
    targetNameSnapshot: role.name,
    action: "UPDATE_ROLE",
    module: "ROLES",
    description: `Updated role ${role.name} (${role.code})`,
    before: beforeSnapshot,
    after: role.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => {});

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Role '${role.name}' updated successfully.`,
    role,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 4. DELETE /api/v1/admin/roles/:id
 * Delete custom role (System roles protected; blocked if active employees assigned)
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);
  if (!role) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Role not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Prevent deleting system-critical roles
  if (role.isSystemRole) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      `Cannot delete protected system role '${role.code}'.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Check if any active employee is currently assigned to this role
  const assignedCount = await Employee.countDocuments({
    $or: [{ role: role.code }, { roleId: role._id }],
    status: { $ne: "INACTIVE" },
  });

  if (assignedCount > 0) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      `Cannot delete role '${role.name}' because it is assigned to ${assignedCount} active employee(s). Reassign them first.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  await Role.findByIdAndDelete(id);

  // Audit log
  AuditLog.create({
    actorEmployeeId: req.auth?.employeeId || "SUPER_ADMIN",
    actorNameSnapshot: req.auth?.fullName || "Admin",
    targetEmployeeId: role.code,
    targetNameSnapshot: role.name,
    action: "DELETE_ROLE",
    module: "ROLES",
    description: `Permanently deleted custom role ${role.name} (${role.code})`,
    before: role.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }).catch(() => {});

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Role '${role.name}' permanently deleted.`,
    { roleId: id },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 5. GET /api/v1/admin/audit-logs
 * Paginated compliance audit logs with filters
 */
export const getAuditLogsList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));

  const filter = {};
  if (req.query.module) filter.module = req.query.module;
  if (req.query.action) filter.action = req.query.action;
  if (req.query.actorEmployeeId) filter.actorEmployeeId = req.query.actorEmployeeId;
  if (req.query.targetEmployeeId) filter.targetEmployeeId = req.query.targetEmployeeId;

  let total = 0;
  let logs = [];

  if (mongoose.connection.readyState === 1) {
    total = await AuditLog.countDocuments(filter);
    logs = await AuditLog.find(filter)
      .sort({ timestamp: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Audit logs retrieved successfully.",
    {
      logs,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

