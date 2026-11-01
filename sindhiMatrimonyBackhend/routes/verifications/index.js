import express from "express";
import {
  uploadIdProof,
  submitSelfieVerification,
  getKycStatus,
} from "../../controllers/safety/safetyController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🆔 CANDIDATE IDENTITY & KYC VERIFICATION ROUTES
 * --------------------------------------------------------------------------
 */
router.post("/id-proof", uploadIdProof);
router.post("/selfie", submitSelfieVerification);
router.get("/status", getKycStatus);

export default router;
