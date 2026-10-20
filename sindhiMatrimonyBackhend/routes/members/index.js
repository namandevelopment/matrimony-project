import express from "express";
import profileRoutes from "./profile.js";
import { viewContactDetails, getContactCredits } from "../../controllers/chat/chatController.js";

const router = express.Router();

// 📞 View / Unlock Candidate Verified Contact (Deducts 1 Credit)
router.post("/view-contact/:candidateId", viewContactDetails);
router.get("/contact-credits", getContactCredits);

// Profile endpoints
router.use("/", profileRoutes);

export default router;
