import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { IN_MEMORY_LEADS, STAFF_EMPLOYEES } from "../../services/realDataService.js";

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

  // Duplicate Check
  const existingLead = IN_MEMORY_LEADS.find(
    (l) => l.mobile?.replace(/\D/g, "") === cleanPhone
  );
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
  const assignedOwner =
    STAFF_EMPLOYEES.find((s) => s._id === ownerId || s.employeeId === ownerId) ||
    STAFF_EMPLOYEES[1] || {
      _id: "staff_default",
      fullName: "Pooja Advani",
      email: "pooja.advani@sindhimatrimony.com",
    };

  const newLeadId = `LD-${1600 + IN_MEMORY_LEADS.length}`;
  const now = new Date().toISOString();

  const newLead = {
    _id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
    owner: {
      _id: assignedOwner._id,
      name: assignedOwner.fullName || assignedOwner.name,
      email: assignedOwner.email,
    },
    slaStatus: "ON_TIME",
    notes: notes
      ? [
          {
            _id: `note_${Date.now()}`,
            noteText: notes.trim(),
            author: req.user?.name || "Staff Member",
            createdAt: now,
          },
        ]
      : [],
    timeline: [
      {
        _id: `time_${Date.now()}`,
        type: "LEAD_CREATED",
        description: `Lead created manually by ${req.user?.name || "Staff"} via Admin Portal`,
        timestamp: now,
      },
    ],
    nextFollowUp: new Date(Date.now() + 4 * 3600000).toISOString(),
    lastContactedAt: null,
    createdAt: now,
  };

  IN_MEMORY_LEADS.unshift(newLead);

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

  let filtered = [...IN_MEMORY_LEADS];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name?.toLowerCase().includes(s) ||
        l.leadId?.toLowerCase().includes(s) ||
        l.mobile?.includes(s) ||
        l.city?.toLowerCase().includes(s) ||
        l.subcaste?.toLowerCase().includes(s)
    );
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((l) => l.status === status.toUpperCase());
  }
  if (source && source !== "ALL") {
    filtered = filtered.filter((l) => l.source === source.toUpperCase());
  }
  if (priority && priority !== "ALL") {
    filtered = filtered.filter((l) => l.priority === priority.toUpperCase());
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
