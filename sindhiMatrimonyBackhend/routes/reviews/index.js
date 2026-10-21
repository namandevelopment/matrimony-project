import express from "express";
import {
  getPublicReviews,
  submitUserReview,
  getAdminReviews,
  updateAdminReview,
  moderateReviewStatus,
  deleteAdminReview,
} from "../../controllers/reviews/reviewController.js";

const router = express.Router();

/**
 * 🌟 Public Endpoints
 * GET /api/v1/reviews/public-list
 * GET /api/v1/reviews
 * POST /api/v1/reviews
 * POST /api/v1/reviews/submit
 */
router.get("/public-list", getPublicReviews);
router.get("/", getPublicReviews);
router.post("/", submitUserReview);
router.post("/submit", submitUserReview);

/**
 * 🛡️ Admin Moderation & Editing Endpoints
 * GET /api/v1/reviews/admin
 * PUT /api/v1/reviews/admin/:id
 * POST /api/v1/reviews/admin/:id/moderation
 * DELETE /api/v1/reviews/admin/:id
 */
router.get("/admin", getAdminReviews);
router.put("/admin/:id", updateAdminReview);
router.post("/admin/:id/moderation", moderateReviewStatus);
router.delete("/admin/:id", deleteAdminReview);

export default router;
