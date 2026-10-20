import express from "express";
import { uploadIdProof } from "../../controllers/safety/safetyController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🆔 CANDIDATE IDENTITY & KYC VERIFICATION ROUTES
 * --------------------------------------------------------------------------
 */
router.post("/id-proof", uploadIdProof);

export default router;
