import express from "express";
import {
  getMatchmakingFeed,
  searchCandidates,
  quickSearch,
  getViewedMyProfile,
  toggleShortlist,
  getMyShortlist,
  getMutualMatches,
} from "../../controllers/matchmaking/matchmakingController.js";
import {
  sendInterest,
  acceptInterest,
  declineInterest,
  remindInterest,
  cancelInterest,
  getReceivedInterests,
  getSentInterests,
  getInterestsBadgeCount,
} from "../../controllers/matchmaking/interestsController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 💍 CANDIDATE MATCHMAKING & DISCOVERY ENGINE
 * --------------------------------------------------------------------------
 */
router.get("/feed", getMatchmakingFeed);
router.post("/search", searchCandidates);
router.get("/quick-search", quickSearch);
router.get("/viewed-my-profile", getViewedMyProfile);
router.post("/shortlist/:candidateId", toggleShortlist);
router.get("/shortlist", getMyShortlist);
router.get("/mutual-matches", getMutualMatches);

/**
 * --------------------------------------------------------------------------
 * 💌 CONNECT REQUESTS & RISHTA INTERESTS
 * --------------------------------------------------------------------------
 */
router.post("/interests/send", sendInterest);
router.put("/interests/:interestId/accept", acceptInterest);
router.put("/interests/:interestId/decline", declineInterest);
router.put("/interests/:interestId/remind", remindInterest);
router.delete("/interests/:interestId/cancel", cancelInterest);
router.get("/interests/received", getReceivedInterests);
router.get("/interests/sent", getSentInterests);
router.get("/interests/badge-count", getInterestsBadgeCount);

export default router;
