import express from "express";
import {
  reportProfile,
  blockCandidate,
  getBlockedList,
} from "../../controllers/safety/safetyController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🛡️ TRUST & SAFETY ROUTES
 * --------------------------------------------------------------------------
 */
router.post("/report", reportProfile);
router.post("/block", blockCandidate);
router.get("/blocked-list", getBlockedList);

export default router;
