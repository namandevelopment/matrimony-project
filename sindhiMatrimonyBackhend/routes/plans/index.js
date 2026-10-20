import express from "express";
import { getPlans } from "../../controllers/plans/plansController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🏷️ MEMBERSHIP PLANS & CATALOG ROUTES
 * --------------------------------------------------------------------------
 */
router.get("/", getPlans);
router.get("/public-list", getPlans);

export default router;
