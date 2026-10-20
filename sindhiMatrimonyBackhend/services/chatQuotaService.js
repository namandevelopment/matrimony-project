import mongoose from "mongoose";
import { User, Profile, UserSubscription } from "../models/index.js";
import { MEMBERSHIP_TIERS } from "../utils/variables.js";
import { logMessage } from "../utils/globalFunction.js";

export const FREE_TRIAL_MESSAGE_LIMIT = 5;

// In-memory fallback tracking for testing / disconnected DB states
const inMemoryUserTrialUsage = new Map();
const inMemoryUserSubscriptions = new Map();

/**
 * Helper to manually mock or set subscription for in-memory / testing
 */
export const setMockUserSubscription = (userId, subscriptionData) => {
  if (userId) {
    inMemoryUserSubscriptions.set(userId.toString(), subscriptionData);
  }
};

/**
 * 🔍 Inspect chat eligibility and quota balance for a user profile
 * @param {string} userId - Master user account ID
 * @param {string} [profileId] - Active candidate profile ID
 * @returns {Promise<Object>} Chat quota status details
 */
export const getChatQuotaStatus = async (userId, profileId = null) => {
  try {
    const now = Date.now();
    const isDbConnected = mongoose.connection?.readyState === 1;

    // 1. Check for an active paid subscription contract
    let activeSubscription = null;
    if (isDbConnected) {
      try {
        activeSubscription = await UserSubscription.findOne({
          userId,
          status: "ACTIVE",
          expiresAt: { $gt: now },
        })
          .sort({ expiresAt: -1 })
          .lean();
      } catch (dbErr) {
        logMessage("UserSubscription query error, falling back:", dbErr?.message, "warn");
      }
    } else {
      activeSubscription = inMemoryUserSubscriptions.get(userId.toString());
    }

    // 2. Check candidate profile membership tier (direct field fallback)
    let profile = null;
    if (profileId && isDbConnected) {
      try {
        profile = await Profile.findById(profileId).select("membershipTier name").lean();
      } catch (err) {
        logMessage("Profile query error in getChatQuotaStatus:", err?.message, "warn");
      }
    }

    const isPaidTier =
      (activeSubscription && activeSubscription.tier !== MEMBERSHIP_TIERS.FREE) ||
      (profile && profile.membershipTier && profile.membershipTier !== MEMBERSHIP_TIERS.FREE);

    // If User has an active paid plan -> Unlimited Chat Enabled
    if (isPaidTier) {
      return {
        canChat: true,
        isPaid: true,
        isUnlimited: true,
        tier: activeSubscription?.tier || profile?.membershipTier || "GOLD",
        planName: activeSubscription?.planName || `${profile?.membershipTier || "Premium"} Tier`,
        expiresAt: activeSubscription?.expiresAt || now + 86400000 * 90,
        trialMessagesLimit: FREE_TRIAL_MESSAGE_LIMIT,
        trialMessagesUsed: 0,
        remainingTrialMessages: 0,
        upgradeRequired: false,
        message: "Unlimited chatting is unlocked with your active membership plan.",
      };
    }

    // 3. Free Member -> Query trial messages counter
    let trialUsed = 0;
    if (isDbConnected) {
      try {
        const user = await User.findById(userId).select("chatTrialMessagesUsed").lean();
        if (user && typeof user.chatTrialMessagesUsed === "number") {
          trialUsed = user.chatTrialMessagesUsed;
        } else {
          trialUsed = inMemoryUserTrialUsage.get(userId.toString()) || 0;
        }
      } catch (_) {
        trialUsed = inMemoryUserTrialUsage.get(userId.toString()) || 0;
      }
    } else {
      trialUsed = inMemoryUserTrialUsage.get(userId.toString()) || 0;
    }

    const remainingTrial = Math.max(0, FREE_TRIAL_MESSAGE_LIMIT - trialUsed);

    if (remainingTrial > 0) {
      return {
        canChat: true,
        isPaid: false,
        isUnlimited: false,
        tier: MEMBERSHIP_TIERS.FREE,
        planName: "Free Trial",
        expiresAt: null,
        trialMessagesLimit: FREE_TRIAL_MESSAGE_LIMIT,
        trialMessagesUsed: trialUsed,
        remainingTrialMessages: remainingTrial,
        upgradeRequired: false,
        message: `You have ${remainingTrial} of ${FREE_TRIAL_MESSAGE_LIMIT} free trial messages remaining. Upgrade to Silver, Gold or Diamond for unlimited chat.`,
      };
    }

    // 4. Free trial exhausted -> Hard block until plan upgrade
    return {
      canChat: false,
      isPaid: false,
      isUnlimited: false,
      tier: MEMBERSHIP_TIERS.FREE,
      planName: "Free Tier",
      expiresAt: null,
      trialMessagesLimit: FREE_TRIAL_MESSAGE_LIMIT,
      trialMessagesUsed: FREE_TRIAL_MESSAGE_LIMIT,
      remainingTrialMessages: 0,
      upgradeRequired: true,
      code: "PLAN_REQUIRED_TO_CHAT",
      reason: "TRIAL_LIMIT_EXHAUSTED",
      message:
        "Your 5 free trial chat messages have ended! Please purchase a membership plan (Silver, Gold, or Diamond) to continue chatting and connect with matches.",
    };
  } catch (error) {
    logMessage("Error evaluating chat quota:", error, "error");
    return {
      canChat: true,
      isPaid: false,
      isUnlimited: false,
      tier: MEMBERSHIP_TIERS.FREE,
      planName: "Free Trial",
      expiresAt: null,
      trialMessagesLimit: FREE_TRIAL_MESSAGE_LIMIT,
      trialMessagesUsed: 0,
      remainingTrialMessages: FREE_TRIAL_MESSAGE_LIMIT,
      upgradeRequired: false,
      message: "Free trial chat active.",
    };
  }
};

/**
 * 🔒 Verify and deduct 1 message from trial quota (or pass freely if paid)
 * @param {string} userId
 * @param {string} [profileId]
 * @returns {Promise<Object>} Verification outcome with allowed flag
 */
export const verifyAndConsumeChatQuota = async (userId, profileId = null) => {
  const status = await getChatQuotaStatus(userId, profileId);

  if (!status.canChat) {
    return {
      allowed: false,
      status,
      code: status.code || "PLAN_REQUIRED_TO_CHAT",
      message: status.message,
    };
  }

  // If user is already on a paid plan, no quota deduction needed
  if (status.isPaid) {
    return {
      allowed: true,
      isTrial: false,
      isUnlimited: true,
      status,
    };
  }

  // User is on free trial -> Increment used counter
  const isDbConnected = mongoose.connection?.readyState === 1;
  if (isDbConnected) {
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { chatTrialMessagesUsed: 1 },
      });
    } catch (_) {
      const current = inMemoryUserTrialUsage.get(userId.toString()) || 0;
      inMemoryUserTrialUsage.set(userId.toString(), current + 1);
    }
  } else {
    const current = inMemoryUserTrialUsage.get(userId.toString()) || 0;
    inMemoryUserTrialUsage.set(userId.toString(), current + 1);
  }

  const updatedRemaining = Math.max(0, status.remainingTrialMessages - 1);

  return {
    allowed: true,
    isTrial: true,
    isUnlimited: false,
    remainingTrialMessages: updatedRemaining,
    status: {
      ...status,
      trialMessagesUsed: status.trialMessagesUsed + 1,
      remainingTrialMessages: updatedRemaining,
    },
  };
};

export default {
  FREE_TRIAL_MESSAGE_LIMIT,
  getChatQuotaStatus,
  verifyAndConsumeChatQuota,
  setMockUserSubscription,
};
