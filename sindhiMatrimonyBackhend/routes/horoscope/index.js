import express from "express";
import {
  calculateGunaMilan,
  getHoroscopeChart,
} from "../../controllers/horoscope/horoscopeController.js";
import {
  getDailyHoroscope,
  saveUserRashi,
} from "../../controllers/dashboard/userDashboardController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🕉️ VEDIC HOROSCOPE & GUNA MILAN MATCHING ROUTES
 * --------------------------------------------------------------------------
 */
router.post("/guna-milan", calculateGunaMilan);
router.get("/chart/:candidateId", getHoroscopeChart);
router.get("/daily", getDailyHoroscope);
router.get("/", getDailyHoroscope);
router.post("/save-rashi", saveUserRashi);

export default router;
