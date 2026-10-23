import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";

// Store for customer support tickets
let supportTicketsStore = [
  {
    _id: "tkt_301",
    ticketId: "TKT-301",
    userId: "SM10001",
    candidateName: "Kunal Ahuja",
    subject: "Unable to update partner preference subcaste filter",
    category: "TECHNICAL_ISSUE",
    priority: "HIGH",
    status: "OPEN",
    channel: "EMAIL",
    messages: [
      {
        sender: "USER",
        text: "I want to include Larai and Bhaiband subcastes in my partner preferences, but the save button throws a network error.",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    _id: "tkt_302",
    ticketId: "TKT-302",
    userId: "SM10004",
    candidateName: "Ananya Wadhwa",
    subject: "Payment deducted twice for membership renewal",
    category: "BILLING",
    priority: "URGENT",
    status: "IN_PROGRESS",
    channel: "WHATSAPP",
    messages: [
      {
        sender: "USER",
        text: "My account was debited twice for ₹9,999 on Razorpay transaction ID pay_Okz21.",
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/support/tickets
 * Grievance & enquiry ticket queue
 */
export const getSupportTickets = asyncHandler(async (req, res) => {
  const { status = "ALL", category = "ALL", priority = "ALL", search = "", page = 1, limit = 20 } = req.query;

  let filtered = [...supportTicketsStore];

  if (status && status !== "ALL") {
    filtered = filtered.filter((t) => t.status === status.toUpperCase());
  }

  if (category && category !== "ALL") {
    filtered = filtered.filter((t) => t.category === category.toUpperCase());
  }

  if (priority && priority !== "ALL") {
    filtered = filtered.filter((t) => t.priority === priority.toUpperCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.ticketId?.toLowerCase().includes(s) ||
        t.candidateName?.toLowerCase().includes(s) ||
        t.subject?.toLowerCase().includes(s)
    );
  }

  const counts = {
    total: supportTicketsStore.length,
    open: supportTicketsStore.filter((t) => t.status === "OPEN").length,
    inProgress: supportTicketsStore.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: supportTicketsStore.filter((t) => t.status === "RESOLVED").length,
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Support tickets queue retrieved successfully.",
    {
      counts,
      tickets: filtered,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. PUT /api/v1/admin/support/tickets/:id/resolve
 * Reply & close support ticket
 */
export const resolveSupportTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resolutionNotes, status = "RESOLVED", replyMessage = "" } = req.body;

  const ticket = supportTicketsStore.find((t) => t._id === id || t.ticketId === id);

  if (!ticket) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Support ticket with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const upperStatus = status.toUpperCase();
  const ALLOWED_STATUSES = ["IN_PROGRESS", "RESOLVED", "CLOSED"];
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

  const now = new Date().toISOString();
  ticket.status = upperStatus;
  ticket.resolvedAt = now;
  ticket.resolution = {
    notes: resolutionNotes ? resolutionNotes.trim() : "Resolved by Support Team",
    resolvedBy: req.user?.name || "Support Executive",
    timestamp: now,
  };

  if (replyMessage) {
    ticket.messages.push({
      sender: "STAFF",
      text: replyMessage.trim(),
      staffName: req.user?.name || "Support Executive",
      createdAt: now,
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Support ticket ${ticket.ticketId} marked as '${upperStatus}'.`,
    ticket,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
