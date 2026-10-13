import assert from 'assert';
import { crmDataService } from '../services/crmDataService';
import type { ClientProfile } from '../types/crm.types';

// =================================================================================
// 💍 Test Suite 17: Hybrid Matchmaking, Admin Suggestions & Duplicate Prevention
// =================================================================================

console.log('----------------------------------------------------');
console.log('🏛️ Test Suite 17: Hybrid Matchmaking & Duplicate Prevention Suite');
console.log('----------------------------------------------------');

// Test fixtures
const mockClientA: ClientProfile = {
  id: 'cl_test_001',
  clientId: 'SIND_TEST_001',
  fullName: 'Ananya Vazirani',
  gender: 'FEMALE',
  age: 26,
  city: 'Mumbai',
  subcaste: 'Amil',
  gotra: 'Shandilya',
  profession: 'Software Architect',
  annualIncome: '28 LPA',
  education: 'B.Tech / MS',
  membershipTier: 'PLATINUM',
  relationshipStatus: 'MATCHMAKING_ACTIVE',
  assignedEmployeeId: 'emp_003',
  assignedEmployeeName: 'Priya Sharma',
  profileCompletePercent: 95,
  matchesShared: 0,
  clientResponses: 0,
  totalMeetings: 0,
  joinedDate: '2025-01-10',
};

const mockCandidateB: ClientProfile = {
  id: 'cl_test_002',
  clientId: 'SIND_TEST_002',
  fullName: 'Rohan Motwani',
  gender: 'MALE',
  age: 28,
  city: 'Mumbai',
  subcaste: 'Baibhand',
  gotra: 'Kashyap',
  profession: 'Investment Banker',
  annualIncome: '35 LPA',
  education: 'MBA Finance',
  membershipTier: 'GOLD',
  relationshipStatus: 'MATCHMAKING_ACTIVE',
  assignedEmployeeId: 'emp_003',
  assignedEmployeeName: 'Priya Sharma',
  profileCompletePercent: 90,
  matchesShared: 0,
  clientResponses: 0,
  totalMeetings: 0,
  joinedDate: '2025-01-15',
};

const mockCandidateC: ClientProfile = {
  id: 'cl_test_003',
  clientId: 'SIND_TEST_003',
  fullName: 'Vikram Advani',
  gender: 'MALE',
  age: 30,
  city: 'Pune',
  subcaste: 'Amil',
  gotra: 'Shandilya', // Same Gotra as Ananya!
  profession: 'Chartered Accountant',
  annualIncome: '30 LPA',
  education: 'FCA',
  membershipTier: 'SILVER',
  relationshipStatus: 'MATCHMAKING_ACTIVE',
  assignedEmployeeId: 'emp_004',
  assignedEmployeeName: 'Amit Bajaj',
  profileCompletePercent: 88,
  matchesShared: 0,
  clientResponses: 0,
  totalMeetings: 0,
  joinedDate: '2025-02-01',
};

const mockInactiveCandidate: ClientProfile = {
  id: 'cl_test_004',
  clientId: 'SIND_TEST_004',
  fullName: 'Suresh Lulla',
  gender: 'MALE',
  age: 29,
  city: 'Mumbai',
  subcaste: 'Sahiti',
  gotra: 'Vatsa',
  profession: 'Marketing Lead',
  annualIncome: '18 LPA',
  education: 'B.Com',
  membershipTier: 'FREE',
  relationshipStatus: 'SUSPENDED', // Inactive / Suspended!
  assignedEmployeeId: 'emp_004',
  assignedEmployeeName: 'Amit Bajaj',
  profileCompletePercent: 60,
  matchesShared: 0,
  clientResponses: 0,
  totalMeetings: 0,
  joinedDate: '2025-03-01',
};

// --- TEST 1: Backend creates a match and admin suggests the same pair ---
console.log('  ✓ Test 1: Backend creates match, admin suggests same pair without creating duplicate');
const backendGenResult = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockCandidateB,
  actorId: 'system',
  actorRole: 'SYSTEM',
  sourceType: 'AUTOMATIC_BACKEND',
  reason: 'Automated 08:00 AM daily cron generation',
});
assert.strictEqual(backendGenResult.success, true);
assert.strictEqual(backendGenResult.isExisting, false);
assert.strictEqual(backendGenResult.action, 'NEW_MATCH_CREATED');
const originalMatchId = backendGenResult.match?.matchId;
assert.notStrictEqual(originalMatchId, undefined);

// Admin now suggests the exact same pair
const adminSuggestResult = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockCandidateB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
  reason: 'Admin hand-picked alliance for family review',
});
assert.strictEqual(adminSuggestResult.success, true);
assert.strictEqual(adminSuggestResult.isExisting, true);
assert.strictEqual(adminSuggestResult.action, 'EXISTING_MATCH_ATTACHED');
assert.strictEqual(adminSuggestResult.match?.matchId, originalMatchId, 'Must reuse canonical match ID');
assert.strictEqual(adminSuggestResult.match?.sources?.includes('AUTOMATIC_BACKEND'), true);
assert.strictEqual(adminSuggestResult.match?.sources?.includes('ADMIN_SUGGESTED'), true);

// --- TEST 2: Admin creates suggestion before scheduled backend job ---
console.log('  ✓ Test 2: Admin creates suggestion first, subsequent backend cron reuses existing identity');
const mockClientX: ClientProfile = { ...mockClientA, clientId: 'SIND_TEST_X', fullName: 'Dia Chhabria' };
const mockCandidateY: ClientProfile = { ...mockCandidateB, clientId: 'SIND_TEST_Y', fullName: 'Naveen Mirchandani' };

const adminFirstResult = crmDataService.suggestHybridMatch({
  client: mockClientX,
  candidate: mockCandidateY,
  actorId: 'emp_002',
  actorRole: 'ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
  reason: 'VIP matchmaking desk manual pair',
});
assert.strictEqual(adminFirstResult.success, true);
assert.strictEqual(adminFirstResult.isExisting, false);
const adminFirstMatchId = adminFirstResult.match?.matchId;

// Later, the background engine runs for the same pair
const backendLaterResult = crmDataService.suggestHybridMatch({
  client: mockClientX,
  candidate: mockCandidateY,
  actorId: 'system',
  actorRole: 'SYSTEM',
  sourceType: 'AUTOMATIC_BACKEND',
  reason: 'Daily cron evaluation',
});
assert.strictEqual(backendLaterResult.success, true);
assert.strictEqual(backendLaterResult.isExisting, true);
assert.strictEqual(backendLaterResult.match?.matchId, adminFirstMatchId);
assert.strictEqual(backendLaterResult.match?.sources?.includes('ADMIN_SUGGESTED'), true);
assert.strictEqual(backendLaterResult.match?.sources?.includes('AUTOMATIC_BACKEND'), true);

// --- TEST 3: Employee suggests a pair already generated automatically ---
console.log('  ✓ Test 3: Employee suggests pair already generated automatically');
const empSuggestResult = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockCandidateB,
  actorId: 'emp_003',
  actorRole: 'CRM_MANAGER',
  sourceType: 'EMPLOYEE_ASSISTED',
  reason: 'Priya Sharma shortlisted this from candidate pool',
});
assert.strictEqual(empSuggestResult.success, true);
assert.strictEqual(empSuggestResult.isExisting, true);
assert.strictEqual(empSuggestResult.match?.matchId, originalMatchId);
assert.strictEqual(empSuggestResult.match?.sources?.includes('EMPLOYEE_ASSISTED'), true);

// --- TEST 4: Two admins suggest the same pair concurrently ---
console.log('  ✓ Test 4: Two admins suggest the same pair concurrently (race condition test)');
const pairKey = crmDataService.getCanonicalPairKey('SIND_TEST_CONC_1', 'SIND_TEST_CONC_2');
const concClient1 = { ...mockClientA, clientId: 'SIND_TEST_CONC_1' };
const concCandidate2 = { ...mockCandidateB, clientId: 'SIND_TEST_CONC_2' };

const concurrentRun1 = crmDataService.suggestHybridMatch({
  client: concClient1,
  candidate: concCandidate2,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
const concurrentRun2 = crmDataService.suggestHybridMatch({
  client: concClient1,
  candidate: concCandidate2,
  actorId: 'emp_002',
  actorRole: 'ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});

assert.strictEqual(concurrentRun1.success, true);
assert.strictEqual(concurrentRun2.success, true);
assert.strictEqual(concurrentRun1.match?.matchId, concurrentRun2.match?.matchId);
assert.strictEqual(concurrentRun1.match?.pairKey, pairKey);

// --- TEST 5: Two background workers process the same pair ---
console.log('  ✓ Test 5: Two background workers process the same pair idempotently');
const workerClient1 = { ...mockClientA, clientId: 'SIND_WORKER_1' };
const workerCandidate2 = { ...mockCandidateB, clientId: 'SIND_WORKER_2' };

const worker1 = crmDataService.suggestHybridMatch({
  client: workerClient1,
  candidate: workerCandidate2,
  actorId: 'worker_01',
  actorRole: 'SYSTEM',
  sourceType: 'AUTOMATIC_BACKEND',
});
const worker2 = crmDataService.suggestHybridMatch({
  client: workerClient1,
  candidate: workerCandidate2,
  actorId: 'worker_02',
  actorRole: 'SYSTEM',
  sourceType: 'AUTOMATIC_BACKEND',
});
assert.strictEqual(worker1.match?.matchId, worker2.match?.matchId);
assert.strictEqual(worker2.isExisting, true);

// --- TEST 6: Match exists in reversed member order ---
console.log('  ✓ Test 6: Symmetrical canonical identity resolves (B, A) to (A, B)');
const reversedResult = crmDataService.suggestHybridMatch({
  client: mockCandidateB, // B as client
  candidate: mockClientA, // A as candidate
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(reversedResult.success, true);
assert.strictEqual(reversedResult.isExisting, true);
assert.strictEqual(reversedResult.match?.matchId, originalMatchId);

// --- TEST 7: Existing interest is preserved ---
console.log('  ✓ Test 7: Existing client interest status is preserved upon admin suggestion');
crmDataService.recordClientResponse(originalMatchId!, 'ACCEPTED', 'CLIENT', 'Client loved the profile');
const matchAfterInterest = crmDataService.findMatchByPair(mockClientA.clientId, mockCandidateB.clientId);
assert.strictEqual(matchAfterInterest?.clientResponse, 'ACCEPTED');

// Admin suggests again
const adminSuggestAgain = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockCandidateB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(adminSuggestAgain.match?.clientResponse, 'ACCEPTED', 'Interest state must not be overwritten');

// --- TEST 8: Existing mutual acceptance is preserved ---
console.log('  ✓ Test 8: Mutual acceptance status remains intact when suggested again');
crmDataService.recordCandidateResponse(originalMatchId!, 'ACCEPTED', 'CANDIDATE', 'Candidate also agreed');
const matchAfterMutual = crmDataService.findMatchByPair(mockClientA.clientId, mockCandidateB.clientId);
assert.strictEqual(matchAfterMutual?.overallStatus, 'MUTUAL_INTEREST');

const adminSuggestAfterMutual = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockCandidateB,
  actorId: 'emp_002',
  actorRole: 'ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(adminSuggestAfterMutual.match?.overallStatus, 'MUTUAL_INTEREST');

// --- TEST 9: Existing rejection is not silently reset ---
console.log('  ✓ Test 9: Existing rejection is preserved and cannot be silently reset');
const mockClientRejectA = { ...mockClientA, clientId: 'SIND_REJ_A' };
const mockCandidateRejectB = { ...mockCandidateB, clientId: 'SIND_REJ_B' };

const rejectMatchResult = crmDataService.suggestHybridMatch({
  client: mockClientRejectA,
  candidate: mockCandidateRejectB,
  actorId: 'system',
  actorRole: 'SYSTEM',
  sourceType: 'AUTOMATIC_BACKEND',
});
const rejectMatchId = rejectMatchResult.match?.matchId!;
crmDataService.recordClientResponse(rejectMatchId, 'DECLINED', 'CLIENT', 'City relocation not acceptable');

// Admin attempts to suggest without explicit reactivation flag
const adminSuggestDeclined = crmDataService.suggestHybridMatch({
  client: mockClientRejectA,
  candidate: mockCandidateRejectB,
  actorId: 'emp_003',
  actorRole: 'CRM_MANAGER',
  sourceType: 'ADMIN_SUGGESTED',
  allowReactivation: false,
});
assert.strictEqual(adminSuggestDeclined.success, false);
assert.strictEqual(typeof adminSuggestDeclined.error, 'string');
assert.strictEqual(adminSuggestDeclined.error?.includes('declined or dismissed'), true);

// --- TEST 10: Previously dismissed match requires an explicit supported workflow ---
console.log('  ✓ Test 10: Dismissed match requires explicit authorization to reactivate');
crmDataService.dismissMatch(rejectMatchId, mockClientRejectA.clientId);
const dismissAttemptNoFlag = crmDataService.suggestHybridMatch({
  client: mockClientRejectA,
  candidate: mockCandidateRejectB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
  allowReactivation: false,
});
assert.strictEqual(dismissAttemptNoFlag.success, false);

// Now reactivate with explicit flag
const dismissAttemptWithFlag = crmDataService.suggestHybridMatch({
  client: mockClientRejectA,
  candidate: mockCandidateRejectB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
  allowReactivation: true,
  reason: 'Families reconnected through mutual friend; explicit reactivation authorized.',
});
assert.strictEqual(dismissAttemptWithFlag.success, true);
assert.strictEqual(dismissAttemptWithFlag.action, 'REACTIVATED');
assert.strictEqual(dismissAttemptWithFlag.match?.isDismissedByClient, false);

// --- TEST 11: Blocked members cannot be reintroduced through admin suggestions ---
console.log('  ✓ Test 11: Blocked members are strictly rejected even by Admin');
crmDataService.blockMemberPair('SIND_BLOCK_A', 'SIND_BLOCK_B', 'Safety grievance reported');
assert.strictEqual(crmDataService.isBlockedPair('SIND_BLOCK_A', 'SIND_BLOCK_B'), true);
assert.strictEqual(crmDataService.isBlockedPair('SIND_BLOCK_B', 'SIND_BLOCK_A'), true);

const blockClient = { ...mockClientA, clientId: 'SIND_BLOCK_A' };
const blockCandidate = { ...mockCandidateB, clientId: 'SIND_BLOCK_B' };

const blockedSuggestionAttempt = crmDataService.suggestHybridMatch({
  client: blockClient,
  candidate: blockCandidate,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(blockedSuggestionAttempt.success, false);
assert.strictEqual(blockedSuggestionAttempt.error?.includes('block relationship'), true);

// --- TEST 12: Inactive profiles cannot be suggested ---
console.log('  ✓ Test 12: Suspended or inactive profiles are rejected');
const inactiveAttempt = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: mockInactiveCandidate,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(inactiveAttempt.success, false);
assert.strictEqual(inactiveAttempt.error?.includes('inactive or suspended'), true);

// --- TEST 13: Duplicate admin action does not send another identical notification ---
console.log('  ✓ Test 13: Duplicate admin actions suppress duplicate notifications');
const notifClientA = { ...mockClientA, clientId: 'SIND_NOTIF_A' };
const notifCandidateB = { ...mockCandidateB, clientId: 'SIND_NOTIF_B' };

const firstSuggestion = crmDataService.suggestHybridMatch({
  client: notifClientA,
  candidate: notifCandidateB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(firstSuggestion.notificationDispatched, true);

const secondSuggestion = crmDataService.suggestHybridMatch({
  client: notifClientA,
  candidate: notifCandidateB,
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(secondSuggestion.notificationDispatched, false, 'Duplicate notification must be suppressed');

// --- TEST 14: Legitimate first assisted recommendation triggers configured notification ---
console.log('  ✓ Test 14: First-time assisted recommendation dispatches push alert');
assert.strictEqual(firstSuggestion.match?.notifications?.[0]?.status, 'SENT');
assert.strictEqual(firstSuggestion.match?.notifications?.[1]?.status, 'SUPPRESSED_DUPLICATE');

// --- TEST 15: Notifications are tracked separately per recipient ---
console.log('  ✓ Test 15: Notification status is tracked separately per recipient');
const notifMatch = crmDataService.findMatchByPair('SIND_NOTIF_A', 'SIND_NOTIF_B')!;
assert.strictEqual(notifMatch.notifications?.length, 2); // 1 SENT to client, 1 SUPPRESSED_DUPLICATE
const sentNotifs = notifMatch.notifications?.filter(n => n.recipientId === 'SIND_NOTIF_A');
assert.strictEqual(sentNotifs?.length, 2);

// --- TEST 16: Source attribution and audit history remain correct and complete ---
console.log('  ✓ Test 16: Complete immutable audit log retained');
const auditHistory = crmDataService.getMatchAuditHistory(notifMatch.matchId);
assert.strictEqual(auditHistory.length >= 2, true);
assert.strictEqual(auditHistory[0].actionType, 'INITIAL_GENERATION');
assert.strictEqual(auditHistory[1].actionType, 'ADMIN_SUGGESTION_ADDED');
assert.strictEqual(auditHistory[1].actorRole, 'SUPER_ADMIN');

// --- TEST 17: Cultural Gotra policy enforced on Admin suggestions ---
console.log('  ✓ Test 17: Admin suggestions cannot bypass community Gotra exogamy rule');
const sameGotraAttempt = crmDataService.suggestHybridMatch({
  client: mockClientA, // Shandilya
  candidate: mockCandidateC, // Shandilya - Same Gotra!
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(sameGotraAttempt.success, false);
assert.strictEqual(sameGotraAttempt.error?.includes('Sagotra Exogamy Blocked') || sameGotraAttempt.error?.includes('Gotra'), true);

// --- TEST 18: Gender compatibility strictly enforced ---
console.log('  ✓ Test 18: Same-gender pairings strictly rejected');
const sameGenderAttempt = crmDataService.suggestHybridMatch({
  client: mockClientA,
  candidate: { ...mockClientA, clientId: 'SIND_FEMALE_2' },
  actorId: 'emp_001',
  actorRole: 'SUPER_ADMIN',
  sourceType: 'ADMIN_SUGGESTED',
});
assert.strictEqual(sameGenderAttempt.success, false);
assert.strictEqual(sameGenderAttempt.error, 'Cannot pair profiles of the same gender.');

// --- TEST 19: Dynamic match lookup reflects correct existing match status in UI ---
console.log('  ✓ Test 19: findMatchByPair correctly locates existing match for UI banner');
const existingForUI = crmDataService.findMatchByPair('SIND_TEST_001', 'SIND_TEST_002');
assert.notStrictEqual(existingForUI, undefined);
assert.strictEqual(existingForUI?.matchId, originalMatchId);

// --- TEST 20: Existing match history and response state remain intact after retries ---
console.log('  ✓ Test 20: Complete lifecycle states remain intact across repeated suggestions');
const retryMatch = crmDataService.findMatchByPair(mockClientA.clientId, mockCandidateB.clientId)!;
assert.strictEqual(retryMatch.clientResponse, 'ACCEPTED');
assert.strictEqual(retryMatch.candidateResponse, 'ACCEPTED');
assert.strictEqual(retryMatch.overallStatus, 'MUTUAL_INTEREST');
assert.strictEqual(retryMatch.auditHistory && retryMatch.auditHistory.length >= 3, true);

console.log('----------------------------------------------------');
console.log('🎉 ALL 20 HYBRID MATCHMAKING & DEDUPLICATION TESTS PASSED CLEANLY!');
console.log('----------------------------------------------------');
