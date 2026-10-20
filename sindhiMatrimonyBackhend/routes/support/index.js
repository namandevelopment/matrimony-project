import express from "express";
import {
  getContent,
  submitSupportTicket,
  getMySupportTickets,
} from "../../controllers/common/contentMasterController.js";

const router = express.Router();

/**
 * 📞 GET /api/v1/support
 * Full Help & Support details (channels, categories, faqs, grievance officer)
 */
router.get("/", (req, res) => {
  req.query.type = "help-support";
  return getContent(req, res);
});

/**
 * 📞 GET /api/v1/support/help-desk
 * Alias focusing on support channels and grievance officer
 */
router.get("/help-desk", (req, res) => {
  req.query.type = "help-support";
  req.query.select = req.query.select || "channels,grievanceOfficer,title";
  return getContent(req, res);
});

/**
 * ❓ GET /api/v1/support/faqs
 * FAQs with optional ?category=... and ?q=... search
 */
router.get("/faqs", (req, res) => {
  req.query.type = "help-support";
  req.query.select = req.query.select || "faqs,categories,title";
  return getContent(req, res);
});

/**
 * 🎫 POST /api/v1/support/ticket
 * Create new support ticket
 */
router.post("/ticket", submitSupportTicket);

/**
 * 📋 GET /api/v1/support/tickets/my-tickets
 * Retrieve user tickets by auth user ID or email query
 */
router.get("/tickets/my-tickets", getMySupportTickets);

export default router;
