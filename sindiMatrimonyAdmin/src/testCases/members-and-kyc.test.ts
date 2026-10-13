import assert from 'assert';

// ========================================================
// 💍 Test Suite 3: Members Directory, Sindhi Community & KYC
// ========================================================

const SINDHI_SUBCASTES = [
  'Amil',
  'Baibhand',
  'Sahiti',
  'Larkana',
  'Shikarpuri',
  'Dadu',
  'Sehwani',
  'Sindhi Sikh',
] as const;

// 1. Validate subcaste validity
function isValidSindhiSubcaste(subcaste: string): boolean {
  return SINDHI_SUBCASTES.includes(subcaste as any);
}

assert.strictEqual(isValidSindhiSubcaste('Amil'), true);
assert.strictEqual(isValidSindhiSubcaste('Baibhand'), true);
assert.strictEqual(isValidSindhiSubcaste('NonSindhiSubcaste'), false);

// 2. Profile Completion Score Calculator
interface CandidateProfile {
  fullName: string;
  dob: string;
  subcaste: string;
  gotra?: string;
  photos: string[];
  education: string;
  occupation: string;
  partnerPreferencesSet: boolean;
  kycDocUploaded: boolean;
}

function calculateProfileCompletion(profile: CandidateProfile): number {
  let score = 0;
  if (profile.fullName && profile.dob) score += 20; // Basic Details
  if (profile.subcaste) score += 15; // Community
  if (profile.education && profile.occupation) score += 20; // Career
  if (profile.photos.length >= 1) score += 20; // Photos
  if (profile.partnerPreferencesSet) score += 15; // Match Preferences
  if (profile.kycDocUploaded) score += 10; // KYC Verification
  return score;
}

const partialProfile: CandidateProfile = {
  fullName: 'Karan Advani',
  dob: '1996-05-12',
  subcaste: 'Amil',
  photos: ['photo1.jpg'],
  education: 'B.Tech',
  occupation: 'Software Engineer',
  partnerPreferencesSet: false,
  kycDocUploaded: false,
};

// Expected: 20 (basic) + 15 (subcaste) + 20 (career) + 20 (photos) = 75%
assert.strictEqual(calculateProfileCompletion(partialProfile), 75);

const fullProfile: CandidateProfile = {
  ...partialProfile,
  partnerPreferencesSet: true,
  kycDocUploaded: true,
};
assert.strictEqual(calculateProfileCompletion(fullProfile), 100);

// 3. KYC Approval & Verification State Transition
interface MemberRecord {
  id: string;
  isProfileVerified: boolean; // Blue Tick
  status: 'ACTIVE' | 'SUSPENDED';
}

function approveKycVerification(member: MemberRecord): MemberRecord {
  return {
    ...member,
    isProfileVerified: true,
  };
}

function rejectKycWithReason(
  member: MemberRecord,
  reason: string
): { updatedMember: MemberRecord; error?: string } {
  if (!reason || reason.trim().length < 8) {
    return {
      updatedMember: member,
      error: 'A mandatory rejection reason (min 8 chars) is required.',
    };
  }
  return {
    updatedMember: {
      ...member,
      isProfileVerified: false,
    },
  };
}

const unverifiedMember: MemberRecord = { id: 'SIND001', isProfileVerified: false, status: 'ACTIVE' };
const verifiedMember = approveKycVerification(unverifiedMember);
assert.strictEqual(verifiedMember.isProfileVerified, true, 'Blue tick should be issued');

// Test rejection without adequate reason fails
const invalidRejection = rejectKycWithReason(unverifiedMember, 'Blur');
assert.notStrictEqual(invalidRejection.error, undefined);
assert.strictEqual(invalidRejection.updatedMember.isProfileVerified, false);

// Test rejection with valid reason succeeds
const validRejection = rejectKycWithReason(unverifiedMember, 'Aadhaar copy is blurry and DOB is not legible');
assert.strictEqual(validRejection.error, undefined);

// 4. Paid Members Contract & Search Verification
import { memberDataService } from '../services/memberDataService';
import { screens } from '../routes/screenConfig';
import { canAccessRoute } from '../utils/rbac';

const paidMembers = memberDataService.getPaidMembers();
assert.strictEqual(Array.isArray(paidMembers), true);
assert.strictEqual(paidMembers.length >= 10, true, 'At least 10 paid members should exist from seed data');
paidMembers.forEach((m) => {
  assert.notStrictEqual(m.plan, 'FREE', 'Paid member cannot have FREE plan');
  assert.strictEqual(m.status, 'ACTIVE', 'Paid member in paid list must be active');
});

// Search by Name, ID, Mobile
const manish = paidMembers.find((m) => m.fullName.includes('MANISH'));
assert.ok(manish, 'Manish Kumar must exist in paid members');
assert.strictEqual(manish.id, '101408');
assert.strictEqual(manish.mobile, '9818022636');
assert.strictEqual(manish.plan, 'PLATINUM');

const byMobile = paidMembers.filter((m) => m.mobile.includes('7043003073'));
assert.strictEqual(byMobile.length, 1);
assert.strictEqual(byMobile[0].fullName, 'RASHMI TEKCHANDANI');

// 5. Inactive Members Section Verification
const inactiveMembers = memberDataService.getInactiveMembers();
assert.strictEqual(Array.isArray(inactiveMembers), true);
assert.strictEqual(inactiveMembers.length >= 3, true, 'Inactive members should exist');
inactiveMembers.forEach((m) => {
  assert.strictEqual(
    m.status === 'INACTIVE' || m.status === 'SUSPENDED' || m.status === 'EXPIRED',
    true,
    'Must have inactive status'
  );
});

// 6. Direct Member Registration (Add Member) Contract
const initialTotal = memberDataService.getMembers().length;
const newMember = memberDataService.addMember({
  fullName: 'DINESH CHANDIRAMANI',
  mobile: '9822334455',
  gender: 'Male',
  age: 30,
  maritalStatus: 'Never Married',
  city: 'Mumbai',
  subcaste: 'Amil',
  plan: 'PLATINUM',
  status: 'ACTIVE',
  isVerified: true,
  aboutMe: 'Software Architect with strong family values and love for traveling.',
  desiredProfile: 'Educated, cultured partner from Sindhi community.',
  verifyEmail: 'Verified',
  verifyMobile: 'Verified',
  verifyAadhaar: 'Verified (UIDAI 2026)',
  adminComment: 'VIP Client referred by Mumbai community elders.',
});

assert.ok(newMember.id, 'New member must have generated ID');
assert.ok(newMember.uniqueId, 'New member must have unique alphanumeric ID');
assert.strictEqual(newMember.fullName, 'DINESH CHANDIRAMANI');
assert.strictEqual(newMember.aboutMe, 'Software Architect with strong family values and love for traveling.');
assert.strictEqual(newMember.desiredProfile, 'Educated, cultured partner from Sindhi community.');
assert.strictEqual(newMember.verifyEmail, 'Verified');
assert.strictEqual(newMember.verifyMobile, 'Verified');
assert.strictEqual(newMember.verifyAadhaar, 'Verified (UIDAI 2026)');
assert.strictEqual(newMember.adminComment, 'VIP Client referred by Mumbai community elders.');
assert.strictEqual(memberDataService.getMembers().length, initialTotal + 1);

// Verify newly created paid member immediately appears in Paid Members list
const updatedPaid = memberDataService.getPaidMembers();
const foundInPaid = updatedPaid.find((m) => m.id === newMember.id);
assert.ok(foundInPaid, 'Newly registered paid member must be present in Paid Members table');
assert.strictEqual(foundInPaid.adminComment, 'VIP Client referred by Mumbai community elders.');

// 7. Route and RBAC configuration verification
const paidRoute = screens.find((s) => s.path === '/members/paid');
assert.ok(paidRoute, '/members/paid route must be registered');
const inactiveRoute = screens.find((s) => s.path === '/members/inactive');
assert.ok(inactiveRoute, '/members/inactive route must be registered');
const addRoute = screens.find((s) => s.path === '/members/add');
assert.ok(addRoute, '/members/add route must be registered');

assert.strictEqual(canAccessRoute('SUPER_ADMIN', '/members/paid'), true);
assert.strictEqual(canAccessRoute('ADMIN', '/members/paid'), true);
assert.strictEqual(canAccessRoute('FINANCE_MANAGER', '/members/paid'), true);
assert.strictEqual(canAccessRoute('SUPER_ADMIN', '/members/add'), true);
assert.strictEqual(canAccessRoute('EMPLOYEE', '/members/add'), false);

console.log('✅ [3/6] members-and-kyc.test.ts: Passed all 25 member profile, paid members, inactive & registration scenarios successfully!');
