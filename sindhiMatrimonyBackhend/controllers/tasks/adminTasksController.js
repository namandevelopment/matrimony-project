import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { Task, Employee } from "../../models/index.js";
import mongoose from "mongoose";

/**
 * 1. GET /api/v1/admin/tasks
 * Full task registry (Overdue, Due Today, Upcoming, Completed)
 */
export const getStaffTasks = asyncHandler(async (req, res) => {
  const { status = "ALL", priority = "ALL", assignedToId, search = "" } = req.query;

  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  if (status && status !== "ALL") {
    query.status = status.toUpperCase();
  }

  if (priority && priority !== "ALL") {
    query.priority = priority.toUpperCase();
  }

  if (assignedToId) {
    query.$or = [
      { assignedEmployeeId: assignedToId },
      { "assignedTo._id": assignedToId },
    ];
  }

  if (search && search.trim()) {
    const sRegex = { $regex: search.trim(), $options: "i" };
    query.$or = [
      { title: sRegex },
      { taskId: sRegex },
      { description: sRegex },
    ];
  }

  let tasks = [];
  let total = 0;
  let dueToday = 0;
  let overdue = 0;
  let completed = 0;

  if (mongoose.connection.readyState === 1) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      [tasks, total, dueToday, overdue, completed] = await Promise.all([
        Task.find(query).sort({ dueDate: 1 }).skip(skip).limit(limit).lean(),
        Task.countDocuments(query),
        Task.countDocuments({ status: "PENDING", dueDate: { $gte: startOfDay, $lte: endOfDay } }),
        Task.countDocuments({ status: "OVERDUE" }),
        Task.countDocuments({ status: "COMPLETED" }),
      ]);
    } catch {
      tasks = [];
      total = 0;
    }
  }

  const counts = {
    total,
    dueToday,
    overdue,
    completed,
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Staff daily tasks registry retrieved successfully.",
    {
      counts,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      tasks,
      list: tasks,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/tasks
 * Create staff task / reminder
 */
export const createStaffTask = asyncHandler(async (req, res) => {
  const {
    title,
    description = "",
    dueDate,
    priority = "MEDIUM",
    category = "FOLLOW_UP",
    assignedToId,
    leadId,
    leadName = "",
    candidateProfileId,
  } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'title' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  let assignedStaff = null;
  if (mongoose.connection.readyState === 1 && assignedToId) {
    try {
      if (mongoose.Types.ObjectId.isValid(assignedToId)) {
        assignedStaff = await Employee.findById(assignedToId).select("fullName employeeId email").lean();
      }
      if (!assignedStaff) {
        assignedStaff = await Employee.findOne({ employeeId: assignedToId }).select("fullName employeeId email").lean();
      }
    } catch {
      assignedStaff = null;
    }
  }

  const count = await Task.countDocuments();
  const taskId = `TSK-${Date.now().toString().slice(-4)}${count + 1}`;

  const taskPayload = {
    taskId,
    title: title.trim(),
    description: description.trim(),
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 3600000 * 24),
    priority: ["HIGH", "MEDIUM", "LOW", "URGENT"].includes(priority?.toUpperCase()) ? priority.toUpperCase() : "MEDIUM",
    status: "PENDING",
    category: category.toUpperCase(),
    leadId: leadId || null,
    leadName: leadName || "",
    candidateProfileId: candidateProfileId || null,
    assignedEmployeeId: assignedStaff?.employeeId || assignedToId || "UNASSIGNED",
    assignedEmployeeName: assignedStaff?.fullName || "Staff Member",
    assignedTo: {
      _id: assignedStaff?._id || assignedToId,
      name: assignedStaff?.fullName || "Staff Member",
      email: assignedStaff?.email || "",
    },
    createdBy: req.user?.fullName || req.user?.name || "Admin",
  };

  const newTask = await Task.create(taskPayload);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Task '${newTask.title}' (${newTask.taskId}) created successfully.`,
    newTask,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. PUT /api/v1/admin/tasks/:id
 * Mark complete or reschedule task
 */
export const updateStaffTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, rescheduledDate, notes = "" } = req.body;

  let query = { taskId: id };
  if (mongoose.Types.ObjectId.isValid(id)) {
    query = { $or: [{ _id: id }, { taskId: id }] };
  }

  const updateFields = {};

  if (status) {
    const upperStatus = status.toUpperCase();
    if (["COMPLETED", "PENDING", "CANCELLED", "OVERDUE"].includes(upperStatus)) {
      updateFields.status = upperStatus;
      if (upperStatus === "COMPLETED") {
        updateFields.completedAt = new Date();
        updateFields.completedBy = req.user?.name || req.user?.fullName || "Staff Member";
      }
    }
  }

  if (rescheduledDate) {
    updateFields.dueDate = new Date(rescheduledDate);
    updateFields.status = "PENDING";
    updateFields.rescheduledAt = new Date();
  }

  if (notes) {
    updateFields.completionNotes = notes.trim();
  }

  const task = await Task.findOneAndUpdate(query, updateFields, { new: true });

  if (!task) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Task with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Task ${task.taskId} updated successfully.`,
    task,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
