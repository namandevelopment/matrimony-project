import express from "express";
import profileRoutes from "./profile.js";

const router = express.Router();

// Profile endpoints
router.use("/", profileRoutes);

export default router;
