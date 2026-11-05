import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { Lead, Employee } from "../../models/index.js";
import mongoose from "mongoose";

/**
 * POST /api/v1/admin/leads
 * Staff manual quick-add lead
 */
export const createAdminLead = asyncHandler(async (req, res) => {
  const {
    name,
    mobile,
    email = "",
    city = "Jaipur",
    gender = "MALE",
    subcaste = "Amil",
    source = "STAFF_MANUAL",
    priority = "MEDIUM",
    notes = "",
    ownerId,
  } = req.body;

  // Validation: Required candidate name & mobile
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'name' is required and must be at least 2 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const cleanPhone = String(mobile || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'mobile' must be a valid 10-digit phone number.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Duplicate Check in MongoDB
  let existingLead = null;
  if (mongoose.connection.readyState === 1) {
    existingLead = await Lead.findOne({ mobile: `+91 ${cleanPhone.slice(-10)}` });
  }
  if (existingLead) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      `A lead with mobile number '${mobile}' already exists in the system (Lead ID: ${existingLead.leadId}).`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Assign staff owner
  let assignedOwner = null;
  if (mongoose.connection.readyState === 1 && ownerId) {
    if (mongoose.Types.ObjectId.isValid(ownerId)) {
      assignedOwner = await Employee.findById(ownerId);
    }
    if (!assignedOwner) {
      assignedOwner = await Employee.findOne({ employeeId: ownerId });
    }
  }

  const leadTotalCount = mongoose.connection.readyState === 1 ? await Lead.countDocuments() : 0;
  const newLeadId = `LD-${1600 + leadTotalCount + 1}`;
  const now = new Date();

  const newLeadData = {
    leadId: newLeadId,
    name: name.trim(),
    candidateProfileId: `SM_MANUAL_${Date.now()}`,
    mobile: `+91 ${cleanPhone.slice(-10)}`,
    email: email.trim().toLowerCase(),
    city: city.trim(),
    gender: gender.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE",
    subcaste: subcaste.trim(),
    source: source.toUpperCase(),
    status: "NEW",
    priority: ["HIGH", "MEDIUM", "LOW"].includes(priority?.toUpperCase())
      ? priority.toUpperCase()
      : "MEDIUM",
    assignedEmployeeId: assignedOwner ? String(assignedOwner._id) : (ownerId || null),
    owner: {
      _id: assignedOwner ? String(assignedOwner._id) : (ownerId || "unassigned"),
      name: assignedOwner?.fullName || "Unassigned",
      email: assignedOwner?.email || "",
    },
    slaStatus: "ON_TIME",
    notes: notes
      ? [
          {
            noteText: notes.trim(),
            author: req.user?.fullName || req.user?.name || "Staff Member",
            createdAt: now,
          },
        ]
      : [],
    timeline: [
      {
        type: "LEAD_CREATED",
        description: `Lead created manually by ${req.user?.fullName || req.user?.name || "Staff"} via Admin Portal`,
        timestamp: now,
      },
    ],
    nextFollowUp: new Date(Date.now() + 4 * 3600000),
    lastContactedAt: null,
    createdAt: now,
  };

  let savedLead = null;
  if (mongoose.connection.readyState === 1) {
    savedLead = await Lead.create(newLeadData);
  } else {
    savedLead = { ...newLeadData, _id: `lead_${Date.now()}` };
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Lead ${newLead.name} (${newLead.leadId}) created successfully.`,
    newLead,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * GET /api/v1/admin/leads/export
 * Export filtered leads to CSV
 */
export const exportLeadsCSV = asyncHandler(async (req, res) => {
  const { search = "", status = "ALL", source = "ALL", priority = "ALL" } = req.query;

  const mongoQuery = {};
  if (search) {
    const s = String(search).trim();
    mongoQuery.$or = [
      { name: { $regex: s, $options: "i" } },
      { leadId: { $regex: s, $options: "i" } },
      { mobile: { $regex: s, $options: "i" } },
      { city: { $regex: s, $options: "i" } },
      { subcaste: { $regex: s, $options: "i" } },
    ];
  }
  if (status && status !== "ALL") mongoQuery.status = status.toUpperCase();
  if (source && source !== "ALL") mongoQuery.source = source.toUpperCase();
  if (priority && priority !== "ALL") mongoQuery.priority = priority.toUpperCase();

  let filtered = [];
  if (mongoose.connection.readyState === 1) {
    filtered = await Lead.find(mongoQuery).sort({ createdAt: -1 }).lean();
  }

  // Generate CSV rows
  const headers = [
    "Lead ID",
    "Candidate Name",
    "Mobile",
    "Email",
    "City",
    "Subcaste",
    "Source",
    "Status",
    "Priority",
    "Assigned Owner",
    "Created Date",
  ];

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '""';
    const stringVal = String(field).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const csvRows = [headers.join(",")];

  for (const lead of filtered) {
    csvRows.push(
      [
        escapeCSV(lead.leadId),
        escapeCSV(lead.name),
        escapeCSV(lead.mobile),
        escapeCSV(lead.email || ""),
        escapeCSV(lead.city || ""),
        escapeCSV(lead.subcaste || ""),
        escapeCSV(lead.source || ""),
        escapeCSV(lead.status || ""),
        escapeCSV(lead.priority || ""),
        escapeCSV(lead.owner?.name || "Unassigned"),
        escapeCSV(lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""),
      ].join(",")
    );
  }

  const csvContent = csvRows.join("\n");
  const filename = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.status(200).send(csvContent);
});
