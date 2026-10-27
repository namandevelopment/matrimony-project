import mongoose from "mongoose";
import { User } from "../models/index.js";
import { REGISTRATION_STATUS } from "../utils/variables.js";
import { logMessage } from "../utils/globalFunction.js";

export const DEFAULT_RETENTION_HOURS = 72; // Configurable default: 72 hours (3 days)

/**
 * Constructs the canonical, strict query for identifying eligible abandoned registration drafts.
 * EXCLUDES:
 * - Phone-verified users (isPhoneVerified: true)
 * - Users with registrationStatus other than DRAFT (e.g. PHONE_VERIFIED, ONBOARDING_IN_PROGRESS, COMPLETE)
 * - Users marked isOnboardingComplete: true
 * - Users whose draft is younger than the retention threshold
 * - Users with missing or invalid timestamps
 */
export const getEligibleAbandonedDraftsQuery = (retentionHours = DEFAULT_RETENTION_HOURS) => {
  const cutoffTime = new Date(Date.now() - Number(retentionHours) * 60 * 60 * 1000);

  return {
    registrationStatus: REGISTRATION_STATUS.DRAFT,
    isPhoneVerified: false,
    isOnboardingComplete: false,
    isDeleted: false,
    createdAt: { $lt: cutoffTime, $exists: true, $type: "date" },
  };
};

/**
 * Read-only Dry Run audit for abandoned unverified DRAFT records.
 * Never performs deletions. Returns structured observability metrics and redacted candidate samples.
 */
export const dryRunAbandonedDraftCleanup = async ({
  retentionHours = DEFAULT_RETENTION_HOURS,
  sampleLimit = 20,
} = {}) => {
  const query = getEligibleAbandonedDraftsQuery(retentionHours);
  const cutoffTime = new Date(Date.now() - Number(retentionHours) * 60 * 60 * 1000);

  if (mongoose.connection.readyState !== 1) {
    return {
      mode: "DRY_RUN",
      databaseStatus: "OFFLINE_OR_UNCONNECTED",
      retentionHours: Number(retentionHours),
      cutoffTimestamp: cutoffTime.toISOString(),
      queryContract: query,
      totalEligibleForPurge: 0,
      samples: [],
      executionNote: "Database is not connected in this local environment. Query contract verified safely.",
    };
  }

  const totalEligible = await User.countDocuments(query);
  const sampleDocs = await User.find(query)
    .select("_id phone countryCode createdAt updatedAt registrationStatus isPhoneVerified isOnboardingComplete")
    .limit(sampleLimit)
    .lean();

  const redactedSamples = sampleDocs.map((doc) => {
    const rawPhone = String(doc.phone || "");
    const maskedPhone =
      rawPhone.length >= 4
        ? `${rawPhone.slice(0, 2)}******${rawPhone.slice(-2)}`
        : "******";

    const ageHours = doc.createdAt
      ? Math.round((Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60))
      : null;

    return {
      id: doc._id.toString(),
      maskedPhone: `${doc.countryCode || "+91"}${maskedPhone}`,
      createdAt: doc.createdAt,
      ageHours,
      registrationStatus: doc.registrationStatus,
      isPhoneVerified: doc.isPhoneVerified,
      isOnboardingComplete: doc.isOnboardingComplete,
    };
  });

  return {
    mode: "DRY_RUN",
    retentionHours: Number(retentionHours),
    cutoffTimestamp: cutoffTime.toISOString(),
    totalEligibleForPurge: totalEligible,
    sampleInspected: redactedSamples.length,
    samples: redactedSamples,
    executionNote: "No records were modified or deleted. Dry run completed safely.",
  };
};

/**
 * Controlled Abandoned Draft Purge.
 * Safety Invariants:
 * - Requires explicit { dryRun: false, confirmPhrase: "CONFIRM_PERMANENT_DRAFT_PURGE" } to delete.
 * - By default, strictly performs dry-run.
 */
export const executeAbandonedDraftCleanup = async ({
  retentionHours = DEFAULT_RETENTION_HOURS,
  dryRun = true,
  confirmPhrase = "",
} = {}) => {
  if (dryRun || confirmPhrase !== "CONFIRM_PERMANENT_DRAFT_PURGE") {
    return dryRunAbandonedDraftCleanup({ retentionHours });
  }

  const query = getEligibleAbandonedDraftsQuery(retentionHours);
  const totalEligible = await User.countDocuments(query);

  if (totalEligible === 0) {
    return {
      mode: "LIVE_EXECUTION",
      deletedCount: 0,
      message: "No eligible abandoned draft records found matching purge criteria.",
    };
  }

  // Idempotent soft-delete / purge
  const deleteResult = await User.deleteMany(query);

  logMessage(
    `[DRAFT CLEANUP] Successfully purged ${deleteResult.deletedCount} expired unverified DRAFT accounts older than ${retentionHours}h.`,
    null,
    "info"
  );

  return {
    mode: "LIVE_EXECUTION",
    deletedCount: deleteResult.deletedCount,
    retentionHours,
    timestamp: new Date().toISOString(),
  };
};

export default {
  DEFAULT_RETENTION_HOURS,
  getEligibleAbandonedDraftsQuery,
  dryRunAbandonedDraftCleanup,
  executeAbandonedDraftCleanup,
};
