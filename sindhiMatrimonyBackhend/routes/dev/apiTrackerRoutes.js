import express from "express";
import {
  getApiMetricsJson,
  clearApiMetrics,
  getApiTrackerDashboardHtml,
} from "../../controllers/dev/apiTrackerController.js";

const router = express.Router();

/**
 * Dev API Tracker Endpoints
 * Mounted at `/dev`
 */
router.get("/metrics", getApiMetricsJson);
router.delete("/metrics", clearApiMetrics);
router.get("/api-tracker", getApiTrackerDashboardHtml);

export default router;
