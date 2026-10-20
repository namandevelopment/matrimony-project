import express from "express";
import {
  createPaymentOrder,
  verifyAndActivateMembership,
  handlePaymentWebhook,
} from "../../controllers/plans/plansController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 💳 PAYMENT GATEWAY & ORDER ROUTES
 * --------------------------------------------------------------------------
 */
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyAndActivateMembership);
router.post("/activate", verifyAndActivateMembership);
router.post("/webhook", handlePaymentWebhook);

export default router;
