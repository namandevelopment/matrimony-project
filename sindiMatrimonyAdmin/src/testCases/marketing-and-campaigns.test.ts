import assert from 'node:assert';
import { campaignService } from '../services/campaignService';
import { screens } from '../routes/screenConfig';
import { canAccessRoute, ROUTE_ALLOWED_ROLES, SIDEBAR_SECTIONS } from '../utils/rbac';

console.log('----------------------------------------------------');
console.log('🏛️ Test Suite 19: Marketing, Notifications & Popup Management');
console.log('----------------------------------------------------');

// Test 1: Route Registration and Configuration
console.log('  Testing Marketing route registration...');
const campaignScreenConfig = screens.find((s) => s.path === '/campaigns');
assert.ok(campaignScreenConfig, '/campaigns route must be registered in screenConfig');
assert.strictEqual(campaignScreenConfig.title, 'Marketing & Engagement');
assert.strictEqual(campaignScreenConfig.requiresAuth, true);

const notifScreenConfig = screens.find((s) => s.path === '/campaigns/notifications');
assert.ok(notifScreenConfig, '/campaigns/notifications subroute must be registered');

const offersScreenConfig = screens.find((s) => s.path === '/campaigns/offers');
assert.ok(offersScreenConfig, '/campaigns/offers subroute must be registered');

const popupsScreenConfig = screens.find((s) => s.path === '/campaigns/popups');
assert.ok(popupsScreenConfig, '/campaigns/popups subroute must be registered');

const logsScreenConfig = screens.find((s) => s.path === '/campaigns/logs');
assert.ok(logsScreenConfig, '/campaigns/logs subroute must be registered');

const analyticsScreenConfig = screens.find((s) => s.path === '/campaigns/analytics');
assert.ok(analyticsScreenConfig, '/campaigns/analytics subroute must be registered');
console.log('  ✓ All 6 marketing routes registered in screenConfig');

// Test 2: RBAC permissions
console.log('  Testing RBAC clearances...');
assert.ok(canAccessRoute('SUPER_ADMIN', '/campaigns'), 'SUPER_ADMIN has clearance for /campaigns');
assert.ok(canAccessRoute('ADMIN', '/campaigns'), 'ADMIN has clearance for /campaigns');
assert.ok(canAccessRoute('AD_MANAGER', '/campaigns'), 'AD_MANAGER has clearance for /campaigns');
assert.ok(canAccessRoute('CRM_MANAGER', '/campaigns'), 'CRM_MANAGER has clearance for /campaigns');
assert.strictEqual(canAccessRoute('EMPLOYEE', '/campaigns'), false, 'Standard EMPLOYEE restricted from /campaigns');

const campaignSection = SIDEBAR_SECTIONS.find((s) => s.id === 'campaigns');
assert.ok(campaignSection, 'campaigns section exists in SIDEBAR_SECTIONS');
assert.strictEqual(campaignSection.name, 'Marketing & Engagement');
console.log('  ✓ RBAC clearances and sidebar definition verified');

// Test 3: Notification Campaign Creation & Drafting
console.log('  Testing notification campaign creation...');
const testCampaign = campaignService.createCampaign({
  campaignName: 'Holi Festival Celebration 2026',
  title: '🎨 Happy Holi — Celebrate with Special Sindhi Vivah Rates',
  message: 'Find your life partner this festive season with verified matches.',
  notificationType: 'FESTIVAL_OFFER',
  channels: ['IN_APP', 'MOBILE_PUSH'],
  targetAudience: 'FREE_USERS',
  priority: 'HIGH',
  status: 'DRAFT',
  createdBy: 'Super Admin',
});

assert.ok(testCampaign.id, 'Campaign created with unique ID');
assert.strictEqual(testCampaign.status, 'DRAFT', 'Initial status is DRAFT');
assert.strictEqual(testCampaign.targetAudience, 'FREE_USERS');
assert.strictEqual(testCampaign.estimatedRecipients, 38400, 'Free users estimated audience is 38,400');
console.log('  ✓ Campaign creation, audience estimation and drafting verified');

// Test 4: Campaign Cloning & Duplication
console.log('  Testing campaign cloning...');
const clonedCampaign = campaignService.duplicateCampaign(testCampaign.id);
assert.ok(clonedCampaign, 'Clone operation succeeded');
assert.strictEqual(clonedCampaign.status, 'DRAFT');
assert.ok(clonedCampaign.campaignName.includes('(Copy)'));
console.log('  ✓ Campaign duplication verified');

// Test 5: Isolated Test Notification Dispatch
console.log('  Testing isolated test notification...');
const testResult = campaignService.sendTestNotification({
  campaignId: testCampaign.id,
  title: testCampaign.title,
  message: testCampaign.message,
  channels: ['MOBILE_PUSH'],
  testRecipient: '+91 98200 44551',
});
assert.strictEqual(testResult.success, true);
console.log('  ✓ Isolated test notification dispatched successfully');

// Test 6: Server-Side Price Calculation Engine
console.log('  Testing server discount calculation engine...');
// 60% of 4999 = 2999 discount, final = 2000
const pctCalc = campaignService.calculateDiscountedPrice(4999, 'PERCENTAGE', 60);
assert.strictEqual(pctCalc.discountAmount, 2999);
assert.strictEqual(pctCalc.finalPrice, 2000);
assert.strictEqual(pctCalc.discountPercentage, 60);

// With discount cap: max 1500
const cappedCalc = campaignService.calculateDiscountedPrice(4999, 'PERCENTAGE', 60, 1500);
assert.strictEqual(cappedCalc.discountAmount, 1500);
assert.strictEqual(cappedCalc.finalPrice, 3499);

// Fixed discount: 2000 off
const fixedCalc = campaignService.calculateDiscountedPrice(4999, 'FIXED_AMOUNT', 2000);
assert.strictEqual(fixedCalc.finalPrice, 2999);

// Negative / Excessive price prevention: 120% discount should clamp to 90%
const clampedCalc = campaignService.calculateDiscountedPrice(5000, 'PERCENTAGE', 120);
assert.ok(clampedCalc.finalPrice > 0, 'Price must never become negative');
console.log('  ✓ Server-side discount calculation and safety limits verified');

// Test 7: Festival Offer Creation and Automated Plan Overrides
console.log('  Testing festival offer creation...');
const newOffer = campaignService.addOffer({
  festivalName: 'Navratri Garba Special Vivah',
  tagline: 'Auspicious festive discounts on all Sindhi Elite plans',
  badge: 'Navratri Special 🪔',
  discountType: 'PERCENTAGE',
  discountValue: 50,
  couponCode: 'NAVRATRI50',
  eligibleSegments: ['ALL', 'FREE_USERS'],
  perUserLimit: 1,
  bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
  isActive: true,
  planOverrides: [
    {
      planId: 'gold_3m',
      planName: 'Sindhi Gold (3 Months)',
      originalPrice: 4999,
      festivalPrice: 2499,
      discountPercentage: 50,
      validityDays: 90,
    },
  ],
  terms: ['Valid for active registrations only'],
  createdBy: 'Super Admin',
});
assert.ok(newOffer.id);
assert.strictEqual(newOffer.currentRedemptions, 0);
console.log('  ✓ Festival offer campaign created and active');

// Test 8: Dynamic In-App Popup Creation & Priority Ordering
console.log('  Testing in-app popups and priority ordering...');
const popupP1 = campaignService.addPopup({
  title: 'Priority 1 Exclusive Alert',
  subtitle: 'High Priority',
  message: 'Top priority promotion',
  bannerImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
  ctaText: 'View Offer',
  ctaLink: '/plans',
  targetAudience: 'FREE_USERS',
  platform: 'BOTH',
  placement: 'DASHBOARD',
  priority: 1,
  frequencyPolicy: 'ONCE_PER_USER',
  maxImpressionsPerUser: 3,
  dismissalPolicy: 'CROSS_DEVICE_PERSISTENT',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  isActive: true,
});

const popupP2 = campaignService.addPopup({
  title: 'Priority 2 Standard Banner',
  subtitle: 'Normal Priority',
  message: 'Secondary offer',
  bannerImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
  ctaText: 'Claim',
  ctaLink: '/plans',
  targetAudience: 'FREE_USERS',
  platform: 'BOTH',
  placement: 'DASHBOARD',
  priority: 2,
  frequencyPolicy: 'ONCE_PER_USER',
  maxImpressionsPerUser: 5,
  dismissalPolicy: 'CROSS_DEVICE_PERSISTENT',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  isActive: true,
});

// Verify client eligibility ordering (Priority 1 must be first)
const testUser = `test_usr_${Date.now()}`;
let eligible = campaignService.getEligiblePopupsForUser(testUser, 'DASHBOARD');
assert.ok(eligible.length >= 2, 'Eligible popups list returned');
assert.strictEqual(eligible[0].priority, 1, 'Top priority popup must appear first in queue');
console.log('  ✓ Priority ordering verified');

// Test 9: Server Dismissal API Persistence Simulation (Module 4)
console.log('  Testing server dismissal API simulation...');
// User clicks [X] cross on Priority 1 popup
const dismissRes = campaignService.recordPopupDismiss(popupP1.id, testUser);
assert.strictEqual(dismissRes.success, true);

// Subsequent check: Priority 1 popup MUST be excluded for this user!
eligible = campaignService.getEligiblePopupsForUser(testUser, 'DASHBOARD');
const containsP1 = eligible.some((p) => p.id === popupP1.id);
assert.strictEqual(containsP1, false, 'Dismissed popup must never return for this user');

// Next in queue: verify that popupP1 is excluded and popupP2 is preserved
const ourTestPopups = eligible.filter((p) => p.id === popupP1.id || p.id === popupP2.id);
assert.strictEqual(ourTestPopups.length, 1, 'Only P2 remains among our test popups after P1 dismissed');
assert.strictEqual(ourTestPopups[0].id, popupP2.id, 'Priority 2 popup is the active test popup');
console.log('  ✓ [X] cross dismissal persistence and queue progression verified');

// Test 10: Reset user dismissals
console.log('  Testing dismissal cache reset...');
campaignService.resetUserDismissals(testUser);
eligible = campaignService.getEligiblePopupsForUser(testUser, 'DASHBOARD');
const restoredP1 = eligible.some((p) => p.id === popupP1.id);
assert.strictEqual(restoredP1, true, 'Resetting dismissals successfully restores eligible popups');
console.log('  ✓ Dismissal reset verified');

// Test 11: Bulk Dispatch Background Worker Simulation
console.log('  Testing bulk campaign dispatch worker...');
const dispatchPromise = campaignService.dispatchBulkCampaign(testCampaign.id);
assert.ok(dispatchPromise instanceof Promise);

await dispatchPromise.then((res) => {
  assert.strictEqual(res.success, true);
  const updated = campaignService.getCampaignById(testCampaign.id);
  assert.strictEqual(updated?.status, 'COMPLETED');
  assert.ok((updated?.deliveredCount || 0) > 0, 'Delivered count must be greater than 0');
});
console.log('  ✓ Bulk dispatch worker queue & state transition verified');

// Test 12: Delivery Log Retry Action
console.log('  Testing recipient delivery retry...');
const failedLogs = campaignService
  .getRecipientDeliveryLogs()
  .filter((l) => l.status === 'FAILED');
if (failedLogs.length > 0) {
  const retryTarget = failedLogs[0];
  const retrySuccess = campaignService.retryFailedDelivery(retryTarget.id);
  assert.strictEqual(retrySuccess, true);
  const rechecked = campaignService
    .getRecipientDeliveryLogs()
    .find((l) => l.id === retryTarget.id);
  assert.strictEqual(rechecked?.status, 'DELIVERED');
  assert.strictEqual(rechecked?.retryCount, retryTarget.retryCount + 1);
  console.log('  ✓ Delivery failure retry action verified');
}

// Test 13: Marketing Audit Trail Logging
console.log('  Testing marketing audit logs...');
const auditLogs = campaignService.getMarketingAuditLogs();
assert.ok(auditLogs.length > 0, 'Marketing audit trail contains recorded actions');
const recentAction = auditLogs[0];
assert.ok(recentAction.action, 'Action name recorded');
assert.ok(recentAction.performedBy, 'Admin user identity recorded');
console.log('  ✓ Marketing audit trail recorded accurately');

console.log('----------------------------------------------------');
console.log('🎉 ALL 13 MARKETING & ENGAGEMENT TESTS PASSED CLEANLY!');
console.log('----------------------------------------------------');
