import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { STAFF_EMPLOYEES } from "../../services/realDataService.js";

// Store for staff daily tasks
let staffTasksStore = [
  {
    _id: "tsk_601",
    taskId: "TSK-601",
    title: "Call Candidate Kunal Ahuja regarding document KYC",
    description: "Follow up on Aadhar card upload and horoscope details.",
    dueDate: new Date(Date.now() + 3600000 * 2).toISOString(),
    priority: "HIGH",
    status: "PENDING",
    category: "FOLLOW_UP",
    leadId: "LD-1501",
    candidateProfileId: "SM10001",
    assignedTo: {
      _id: "staff_002",
      name: "Pooja Advani",
      email: "pooja.advani@sindhimatrimony.com",
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "tsk_602",
    taskId: "TSK-602",
    title: "Schedule Family Intro Call for Simran & Kunal",
    description: "Both candidates accepted mutual interest. Confirm convenient weekend slot.",
    dueDate: new Date(Date.now() + 3600000 * 6).toISOString(),
    priority: "HIGH",
    status: "PENDING",
    category: "MATCHMAKING",
    leadId: "LD-1502",
    candidateProfileId: "SM10002",
    assignedTo: {
      _id: "staff_001",
      name: "Rajesh Vazirani",
      email: "rajesh.vazirani@sindhimatrimony.com",
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: "tsk_603",
    taskId: "TSK-603",
    title: "Verify Offline Payment Bank Cheque",
    description: "Verify clearance of ₹25,000 cheque from HDFC Bank for Royal Sindhi Plan.",
    dueDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    priority: "MEDIUM",
    status: "OVERDUE",
    category: "FINANCE",
    leadId: null,
    candidateProfileId: "SM10003",
    assignedTo: {
      _id: "staff_003",
      name: "Deepak Mirchandani",
      email: "deepak.mirchandani@sindhimatrimony.com",
    },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/tasks
 * Full task registry (Overdue, Due Today, Upcoming, Completed)
 */
export const getStaffTasks = asyncHandler(async (req, res) => {
  const { status = "ALL", priority = "ALL", assignedToId, search = "" } = req.query;

  const now = Date.now();
  // Auto-mark overdue tasks
  for (const t of staffTasksStore) {
    if (t.status === "PENDING" && new Date(t.dueDate).getTime() < now) {
      t.status = "OVERDUE";
    }
  }

  let filtered = [...staffTasksStore];

  if (status && status !== "ALL") {
    filtered = filtered.filter((t) => t.status === status.toUpperCase());
  }

  if (priority && priority !== "ALL") {
    filtered = filtered.filter((t) => t.priority === priority.toUpperCase());
  }

  if (assignedToId) {
    filtered = filtered.filter(
      (t) => t.assignedTo?._id === assignedToId || t.assignedTo?.email === assignedToId
    );
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title?.toLowerCase().includes(s) ||
        t.taskId?.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s)
    );
  }

  const counts = {
    total: staffTasksStore.length,
    dueToday: staffTasksStore.filter((t) => t.status === "PENDING").length,
    overdue: staffTasksStore.filter((t) => t.status === "OVERDUE").length,
    completed: staffTasksStore.filter((t) => t.status === "COMPLETED").length,
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Staff daily tasks registry retrieved successfully.",
    {
      counts,
      tasks: filtered,
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

  const assignedStaff =
    STAFF_EMPLOYEES.find((s) => s._id === assignedToId || s.employeeId === assignedToId) ||
    STAFF_EMPLOYEES[0] || {
      _id: "staff_default",
      fullName: "Staff Member",
      email: "staff@sindhimatrimony.com",
    };

  const taskId = `TSK-${600 + staffTasksStore.length + 1}`;
  const now = new Date().toISOString();

  const newTask = {
    _id: `tsk_${Date.now()}`,
    taskId,
    title: title.trim(),
    description: description.trim(),
    dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 3600000 * 24).toISOString(),
    priority: ["HIGH", "MEDIUM", "LOW"].includes(priority?.toUpperCase()) ? priority.toUpperCase() : "MEDIUM",
    status: "PENDING",
    category: category.toUpperCase(),
    leadId: leadId || null,
    candidateProfileId: candidateProfileId || null,
    assignedTo: {
      _id: assignedStaff._id,
      name: assignedStaff.fullName || assignedStaff.name,
      email: assignedStaff.email,
    },
    createdBy: req.user?.name || "Admin",
    createdAt: now,
  };

  staffTasksStore.unshift(newTask);

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

  const task = staffTasksStore.find((t) => t._id === id || t.taskId === id);

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

  if (status) {
    const upperStatus = status.toUpperCase();
    if (["COMPLETED", "PENDING", "CANCELLED", "OVERDUE"].includes(upperStatus)) {
      task.status = upperStatus;
      if (upperStatus === "COMPLETED") {
        task.completedAt = new Date().toISOString();
        task.completedBy = req.user?.name || "Staff Member";
      }
    }
  }

  if (rescheduledDate) {
    task.dueDate = new Date(rescheduledDate).toISOString();
    task.status = "PENDING";
    task.rescheduledAt = new Date().toISOString();
  }

  if (notes) {
    task.completionNotes = notes.trim();
  }

  task.updatedAt = new Date().toISOString();

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
