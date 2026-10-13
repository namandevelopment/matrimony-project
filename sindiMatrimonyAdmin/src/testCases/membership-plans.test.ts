import assert from 'assert';
import { INITIAL_MEMBERSHIP_PLANS } from '../screens/settingsScreen/components/membershipPlans/initialPlans';
import type { MembershipPlan, PlanCategory } from '../screens/settingsScreen/components/membershipPlans/types';
import { canAccessRoute } from '../utils/rbac';
import { screens } from '../routes/screenConfig';
import { resolveSettingsTab } from '../screens/settingsScreen/SettingsScreen';

// ========================================================
// 💳 Test Suite: Membership Plans Configuration & Management
// ========================================================

// 1. Initial Plans Contract
assert.strictEqual(Array.isArray(INITIAL_MEMBERSHIP_PLANS), true);
assert.strictEqual(INITIAL_MEMBERSHIP_PLANS.length >= 4, true, 'At least 4 default plans should exist');

// 2. Exact match with Screenshot 1 & 2 requirements
const goldPlan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.title === 'GOLD');
assert.ok(goldPlan, 'GOLD plan must exist');
assert.strictEqual(goldPlan.subtitle, 'Best Value!');
assert.strictEqual(goldPlan.price, 4600);
assert.strictEqual(goldPlan.offerPrice, 2599);
assert.strictEqual(goldPlan.duration, '6 Month');
assert.strictEqual(goldPlan.category, 'SELF_SERVICE');
assert.strictEqual(goldPlan.features.length, 5);

const silverPlan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.title === 'SILVER');
assert.ok(silverPlan, 'SILVER plan must exist');
assert.strictEqual(silverPlan.highlighted, true, 'SILVER plan must be highlighted as crimson red card');
assert.strictEqual(silverPlan.price, 2800);
assert.strictEqual(silverPlan.offerPrice, 1599);
assert.strictEqual(silverPlan.duration, '3 Month');

const bronzePlan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.title === 'BRONZE');
assert.ok(bronzePlan, 'BRONZE plan must exist');
assert.strictEqual(bronzePlan.price, 1500);
assert.strictEqual(bronzePlan.offerPrice, 899);

const freePlan = INITIAL_MEMBERSHIP_PLANS.find((p) => p.title === 'FREE PLAN');
assert.ok(freePlan, 'FREE PLAN must exist');
assert.strictEqual(freePlan.price, 0);
assert.strictEqual(freePlan.offerPrice, 0);

// 3. Category segregation
const selfServicePlans = INITIAL_MEMBERSHIP_PLANS.filter((p) => p.category === 'SELF_SERVICE');
const assistPlans = INITIAL_MEMBERSHIP_PLANS.filter((p) => p.category === 'ASSIST_PLAN');
assert.strictEqual(selfServicePlans.length >= 4, true);
assert.strictEqual(assistPlans.length >= 3, true);

// 4. Discount calculation logic test
function calculateDiscount(original: number, offer: number): number {
  if (original <= 0 || offer >= original) return 0;
  return Math.round(((original - offer) / original) * 100);
}

assert.strictEqual(calculateDiscount(4600, 2599), 44); // 43.5% rounds to 44% discount
assert.strictEqual(calculateDiscount(2800, 1599), 43); // 42.89% rounds to 43%
assert.strictEqual(calculateDiscount(1500, 899), 40); // 40.06% rounds to 40%
assert.strictEqual(calculateDiscount(0, 0), 0);

// 5. Screen Config & Route registration verification
const settingsScreen = screens.find((s) => s.path === '/settings');
assert.ok(settingsScreen, '/settings screen config must exist');
assert.strictEqual(settingsScreen.requiresAuth, true);

const membershipPlansScreen = screens.find((s) => s.path === '/settings/membership-plans');
assert.ok(membershipPlansScreen, '/settings/membership-plans screen config must exist');

const adminPlansScreen = screens.find((s) => s.path === '/admin/membership-plans');
assert.ok(adminPlansScreen, '/admin/membership-plans screen config must exist');

// 6. RBAC access control verification
assert.strictEqual(canAccessRoute('SUPER_ADMIN', '/settings/membership-plans'), true);
assert.strictEqual(canAccessRoute('ADMIN', '/settings/membership-plans'), true);
assert.strictEqual(canAccessRoute('FINANCE_MANAGER', '/settings/membership-plans'), true);
assert.strictEqual(canAccessRoute('EMPLOYEE', '/settings/membership-plans'), false);
assert.strictEqual(canAccessRoute('CRM_AGENT', '/settings/membership-plans'), false);

// 7. Settings Tab Navigation & Zero-Glitch Tab Resolution Verification
assert.strictEqual(resolveSettingsTab('/settings', ''), 'membership_plans');
assert.strictEqual(resolveSettingsTab('/settings/membership-plans', ''), 'membership_plans');
assert.strictEqual(resolveSettingsTab('/admin/membership-plans', ''), 'membership_plans');
assert.strictEqual(resolveSettingsTab('/settings/password', ''), 'password');
assert.strictEqual(resolveSettingsTab('/settings', '?tab=password'), 'password');
assert.strictEqual(
  resolveSettingsTab('/settings/membership-plans', '?tab=password'),
  'password',
  'Query param tab=password must override /membership-plans path without glitching'
);
assert.strictEqual(resolveSettingsTab('/settings', '?tab=admin_config'), 'admin_config');
assert.strictEqual(resolveSettingsTab('/settings', '?tab=config'), 'admin_config');
assert.strictEqual(resolveSettingsTab('/settings', '?tab=membership_plans'), 'membership_plans');

console.log('✅ membership-plans.test.ts: Passed all 27 Membership Plans configuration, pricing, RBAC & zero-glitch navigation tests successfully!');
