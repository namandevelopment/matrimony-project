import express from "express";
import {
  getDashboardData,
  getRecommendedMatches,
  getDailyHoroscope,
  saveUserRashi,
  getMobileHomeFeed,
  getDailyRecommendationsFeed,
  getAllMatchesFeed,
  getNewMatchesFeed,
  getWhoViewedYouFeed,
  getProfilesYouViewedFeed,
  trackProfileView,
  getSuccessStoriesFeed,
  getHomeBanners,
  getSupportInfo,
} from "../../controllers/dashboard/userDashboardController.js";

const router = express.Router();

/**
 * @route   GET /api/v1/dashboard
 * @desc    Get consolidated user panel dashboard data (sub-10ms single flight)
 * @access  Private / Public (Resilient)
 */
router.get("/", getDashboardData);

/**
 * @route   GET /api/v1/dashboard/matches
 * @desc    Get recommended matches carousel feed (paginated)
 * @access  Private / Public (Resilient)
 */
router.get("/matches", getRecommendedMatches);

/**
 * @route   GET /api/v1/dashboard/horoscope
 * @desc    Get daily astrological horoscope for all 12 rashis or specific rashi
 * @access  Public / Private
 */
router.get("/horoscope", getDailyHoroscope);

/**
 * @route   POST /api/v1/dashboard/horoscope/save-rashi
 * @desc    Save preferred moon sign (rashi) to user's profile
 * @access  Private (Candidate JWT Required)
 */
router.post("/horoscope/save-rashi", saveUserRashi);

// =============================================================================
// 📱 MOBILE HOMESCREEN API ROUTES (Sub-15ms, Redis Cached, Resilient)
// =============================================================================

/**
 * @route   GET /api/v1/dashboard/mobile-home
 * @alias   GET /api/v1/dashboard/home-feed
 * @desc    Single-flight consolidated endpoint for all 12 mobile HomeScreen sections
 * @access  Private / Public (Resilient)
 */
router.get("/mobile-home", getMobileHomeFeed);
router.get("/home-feed", getMobileHomeFeed);

/**
 * @route   GET /api/v1/dashboard/daily-recommendations
 * @desc    Get curated daily recommendations carousel with dynamic countdown timer
 * @access  Private / Public (Resilient)
 */
router.get("/daily-recommendations", getDailyRecommendationsFeed);

/**
 * @route   GET /api/v1/dashboard/all-matches
 * @desc    Get paginated all matches with preference filters (caste, city, minAge, maxAge)
 * @access  Private / Public (Resilient)
 */
router.get("/all-matches", getAllMatchesFeed);

/**
 * @route   GET /api/v1/dashboard/new-matches
 * @desc    Get newly joined candidate profiles with joinedDaysAgo
 * @access  Private / Public (Resilient)
 */
router.get("/new-matches", getNewMatchesFeed);

/**
 * @route   GET /api/v1/dashboard/who-viewed-you
 * @desc    Get candidates who viewed the logged-in candidate's profile
 * @access  Private / Public (Resilient)
 */
router.get("/who-viewed-you", getWhoViewedYouFeed);

/**
 * @route   GET /api/v1/dashboard/profiles-you-viewed
 * @desc    Get candidate profiles that the logged-in candidate viewed
 * @access  Private / Public (Resilient)
 */
router.get("/profiles-you-viewed", getProfilesYouViewedFeed);

/**
 * @route   POST /api/v1/dashboard/profile-views/track
 * @desc    Atomically record/upsert a profile view and invalidate Redis cache in real-time
 * @access  Private (Candidate JWT Required)
 */
router.post("/profile-views/track", trackProfileView);

/**
 * @route   GET /api/v1/dashboard/success-stories
 * @desc    Get verified wedding success stories carousel (couples, quotes, photos)
 * @access  Public / Private
 */
router.get("/success-stories", getSuccessStoriesFeed);

/**
 * @route   GET /api/v1/dashboard/banners
 * @desc    Get promotional and trust banners (Celebrating, Silver Plan, Assisted, Limca)
 * @access  Public / Private
 */
router.get("/banners", getHomeBanners);

/**
 * @route   GET /api/v1/dashboard/support-info
 * @desc    Get customer support phone, WhatsApp, working hours, and wedding directory
 * @access  Public / Private
 */
router.get("/support-info", getSupportInfo);

export default router;

