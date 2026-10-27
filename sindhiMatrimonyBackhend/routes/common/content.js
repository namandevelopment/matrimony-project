import express from "express";
import {
  getContent,
  getContentByType,
  updateContent,
  submitSupportTicket,
} from "../../controllers/common/contentMasterController.js";

const router = express.Router();

/**
 * 🌟 Primary Unified Endpoint (Supports ?type=..., ?types=..., ?select=..., ?category=..., ?q=...)
 * GET /api/v1/content
 */
router.get("/", getContent);

/**
 * 🔗 Explicit Direct Path Aliases for convenience
 */
router.get("/privacy-policy", (req, res) => {
  req.query.type = "privacy-policy";
  return getContent(req, res);
});

router.get("/terms-and-conditions", (req, res) => {
  req.query.type = "terms-and-conditions";
  return getContent(req, res);
});

router.get("/help-support", (req, res) => {
  req.query.type = "help-support";
  return getContent(req, res);
});

/**
 * 🎫 Submit Customer Support Ticket via Content router
 * POST /api/v1/content/ticket
 */
router.post("/ticket", submitSupportTicket);

/**
 * 🎯 Param-based route for any dynamic type (e.g. /api/v1/content/our-process)
 * GET /api/v1/content/:type
 */
router.get("/:type", getContentByType);

/**
 * ✏️ Admin Content Updaters
 * PUT /api/v1/content (with ?type=... or body { type: ... })
 * PUT /api/v1/content/:type
 */
router.put("/", updateContent);
router.put("/:type", updateContent);

export default router;
