/**
 * REAL DATA SERVICE (DEPRECATED & DRAINED)
 * All data now resides exclusively in MongoDB collections.
 * In-memory fallback arrays have been completely drained to prevent fake/mock data leakage.
 */

export const SEED_CANDIDATE_POOL = [];
export const STAFF_EMPLOYEES = [];
export const IN_MEMORY_LEADS = [];
export const IN_MEMORY_VERIFICATIONS = [];
export const IN_MEMORY_TRANSACTIONS = [];

export function registerCandidateInMemory() {
  return { user: null, profile: null };
}

export function findUserByPhoneInMemory() {
  return null;
}

export function findProfileByIdInMemory() {
  return null;
}

export function getMembersInMemory() {
  return { members: [], total: 0 };
}

export function getLeadsInMemory() {
  return { leads: [], total: 0 };
}

export function getDashboardStatsInMemory() {
  return {};
}

export function getDashboardActionQueuesInMemory() {
  return {};
}

export function getDashboardChartsDataInMemory() {
  return {};
}
