import express from "express";
import {
  getPlans,
  recordScreenVisit,
  getScreenVisits,
  updateScreenVisitStatus,
} from "../../controllers/plans/plansController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🏷️ MEMBERSHIP PLANS & CATALOG ROUTES
 * --------------------------------------------------------------------------
 */
router.get("/", getPlans);
router.get("/public-list", getPlans);

// Screen Visit Intent Tracking (1 Visit / User / Day)
router.get("/visits", getScreenVisits);
router.post("/visits", recordScreenVisit);
router.patch("/visits/:id", updateScreenVisitStatus);

export default router;
