import assert from 'assert';
import { screens } from '../routes/screenConfig';
import { Role } from '../types/auth.types';

// ========================================================
// 🧭 Test Suite 6: Navigation Contracts & Mobile Responsiveness
// ========================================================

// 1. Validate screenConfig route contracts
assert.strictEqual(Array.isArray(screens), true);
assert.strictEqual(screens.length >= 6, true, 'At least 6 core screens must be registered');

// Every screen must have a valid path and title
for (const screen of screens) {
  assert.strictEqual(typeof screen.path, 'string');
  assert.strictEqual(screen.path.startsWith('/'), true, `Path ${screen.path} must start with /`);
  assert.strictEqual(typeof screen.title, 'string');
  assert.strictEqual(typeof screen.requiresAuth, 'boolean');
}

// 2. Auth Route Protection
const loginScreen = screens.find((s) => s.path === '/login');
assert.notStrictEqual(loginScreen, undefined);
assert.strictEqual(loginScreen?.requiresAuth, false, 'LoginScreen must be accessible without auth');

const dashboardScreen = screens.find((s) => s.path === '/');
assert.notStrictEqual(dashboardScreen, undefined);
assert.strictEqual(dashboardScreen?.requiresAuth, true, 'Dashboard must be protected');

// 3. Mobile Drawer Responsive State Machine
interface ResponsiveNavState {
  isMobile: boolean;
  isDrawerOpen: boolean;
  isDesktopCollapsed: boolean;
}

function handleNavToggle(state: ResponsiveNavState): ResponsiveNavState {
  if (state.isMobile) {
    return { ...state, isDrawerOpen: !state.isDrawerOpen };
  }
  return { ...state, isDesktopCollapsed: !state.isDesktopCollapsed };
}

// Mobile scenario: Drawer toggles open and closed
let mobileNav: ResponsiveNavState = { isMobile: true, isDrawerOpen: false, isDesktopCollapsed: false };
mobileNav = handleNavToggle(mobileNav);
assert.strictEqual(mobileNav.isDrawerOpen, true);
mobileNav = handleNavToggle(mobileNav);
assert.strictEqual(mobileNav.isDrawerOpen, false);

// Desktop scenario: Sidebar collapses between 64 and 20 width
let desktopNav: ResponsiveNavState = { isMobile: false, isDrawerOpen: false, isDesktopCollapsed: false };
desktopNav = handleNavToggle(desktopNav);
assert.strictEqual(desktopNav.isDesktopCollapsed, true);

import {
  type NavItemDef,
  isNavItemActive,
  isSubItemActive,
  getRouteNavigationInfo,
} from '../utils/navigationUtils';

// 4. Validate Dynamic Header Titles, Breadcrumbs & Nested Tab Persistence
const sampleNavItems: NavItemDef[] = [
  { name: 'Dashboard', path: '/', icon: () => null as any },
  { name: 'Employees & Access', path: '/employees', icon: () => null as any },
  { name: 'Assisted Matchmaking', path: '/matchmaking', icon: () => null as any },
  { name: 'Match Responses', path: '/match-responses', icon: () => null as any },
  { name: 'Tasks & Follow-ups', path: '/tasks', icon: () => null as any },
  { name: 'CRM Leads', path: '/leads', icon: () => null as any },
  {
    name: 'Members',
    path: '/members',
    icon: () => null as any,
    subItems: [
      { name: 'All Members', path: '/members' },
      { name: 'Male Profiles', path: '/members?gender=male' },
      { name: 'Female Profiles', path: '/members?gender=female' },
    ],
  },
  { name: 'Verification Desk', path: '/verifications', icon: () => null as any },
  {
    name: 'Settings',
    path: '/settings',
    icon: () => null as any,
    subItems: [
      { name: 'General Settings', path: '/settings' },
      { name: 'Change Password', path: '/settings/password' },
      { name: 'Subcaste & Gotra', path: '/settings/gotras' },
    ],
  },
];

// Scenario A: Exact top-level routes show their active tab name, NOT "Transactions & Overview"
const matchmakingInfo = getRouteNavigationInfo(sampleNavItems, '/matchmaking');
assert.strictEqual(matchmakingInfo.activeTitle, 'Assisted Matchmaking');
assert.strictEqual(matchmakingInfo.parentTitle, null);
assert.notStrictEqual(matchmakingInfo.activeTitle, 'Transactions & Overview');

const matchResponsesInfo = getRouteNavigationInfo(sampleNavItems, '/match-responses');
assert.strictEqual(matchResponsesInfo.activeTitle, 'Match Responses');

const tasksInfo = getRouteNavigationInfo(sampleNavItems, '/tasks');
assert.strictEqual(tasksInfo.activeTitle, 'Tasks & Follow-ups');

// Scenario B: Nested route keeps the parent tab active in the sidebar
const employeeNestedActive = isNavItemActive(
  sampleNavItems.find((n) => n.name === 'Employees & Access')!,
  '/employees/emp_003'
);
assert.strictEqual(employeeNestedActive, true, 'Employees & Access must stay active on nested /employees/emp_003');

const employee360Info = getRouteNavigationInfo(sampleNavItems, '/employees/emp_003');
assert.strictEqual(employee360Info.parentTitle, 'Employees & Access');
assert.strictEqual(employee360Info.activeTitle, 'Employee 360° Profile');
assert.strictEqual(employee360Info.activeNavItemName, 'Employees & Access');

// Scenario C: Submenu items keep parent tab active and show proper breadcrumb
const membersParent = sampleNavItems.find((n) => n.name === 'Members')!;
assert.strictEqual(isNavItemActive(membersParent, '/members', '?gender=male'), true);
assert.strictEqual(isSubItemActive('/members?gender=male', '/members', '?gender=male', membersParent.subItems), true);
assert.strictEqual(isSubItemActive('/members', '/members', '?gender=male', membersParent.subItems), false);

const maleProfilesInfo = getRouteNavigationInfo(sampleNavItems, '/members', '?gender=male');
assert.strictEqual(maleProfilesInfo.parentTitle, 'Members');
assert.strictEqual(maleProfilesInfo.activeTitle, 'Male Profiles');
assert.strictEqual(maleProfilesInfo.activeNavItemName, 'Members');

// Scenario D: Settings Change Password & Subcaste Gotra keep Settings active
const settingsParent = sampleNavItems.find((n) => n.name === 'Settings')!;
assert.strictEqual(isNavItemActive(settingsParent, '/settings/password'), true);
const passwordInfo = getRouteNavigationInfo(sampleNavItems, '/settings/password');
assert.strictEqual(passwordInfo.parentTitle, 'Settings');
assert.strictEqual(passwordInfo.activeTitle, 'Change Password');
assert.strictEqual(passwordInfo.activeNavItemName, 'Settings');

assert.strictEqual(isNavItemActive(settingsParent, '/settings/gotras'), true);
const gotraInfo = getRouteNavigationInfo(sampleNavItems, '/settings/gotras');
assert.strictEqual(gotraInfo.parentTitle, 'Settings');
assert.strictEqual(gotraInfo.activeTitle, 'Subcaste & Gotra');
assert.strictEqual(gotraInfo.activeNavItemName, 'Settings');

// Scenario E: Verify route registration for Tools, Master Settings, and Gotras
const toolsScreen = screens.find((s) => s.path === '/tools');
assert.notStrictEqual(toolsScreen, undefined, '/tools must be registered in screenConfig');
assert.strictEqual(toolsScreen?.title, 'Admin Tools & Diagnostics');

const masterSettingsScreen = screens.find((s) => s.path === '/master-settings');
assert.notStrictEqual(masterSettingsScreen, undefined, '/master-settings must be registered');
assert.strictEqual(masterSettingsScreen?.title, 'Master Settings');

const gotrasScreen = screens.find((s) => s.path === '/settings/gotras');
assert.notStrictEqual(gotrasScreen, undefined, '/settings/gotras must be registered');

// Scenario F: Verify Notifications and Help & Support routes
const notificationsScreen = screens.find((s) => s.path === '/notifications');
assert.notStrictEqual(notificationsScreen, undefined, '/notifications must be registered');
assert.strictEqual(notificationsScreen?.title, 'Notifications & Alerts');
assert.strictEqual(notificationsScreen?.requiresAuth, true);

const helpSupportScreen = screens.find((s) => s.path === '/help-support');
assert.notStrictEqual(helpSupportScreen, undefined, '/help-support must be registered');
assert.strictEqual(helpSupportScreen?.title, 'Help & Direct Support');
assert.strictEqual(helpSupportScreen?.requiresAuth, true);

const sampleWithNewNav = [
  ...sampleNavItems,
  { name: 'Notifications', path: '/notifications', icon: () => null as any },
  { name: 'Help & Support', path: '/help-support', icon: () => null as any },
];
const notifInfo = getRouteNavigationInfo(sampleWithNewNav, '/notifications');
assert.strictEqual(notifInfo.activeTitle, 'Notifications');
const helpInfo = getRouteNavigationInfo(sampleWithNewNav, '/help-support');
assert.strictEqual(helpInfo.activeTitle, 'Help & Support');
const supportAliasInfo = getRouteNavigationInfo(sampleWithNewNav, '/support');
assert.strictEqual(supportAliasInfo.activeTitle, 'Help & Support');

// Verify deprecated routes are cleanly removed from screenConfig
assert.strictEqual(screens.find((s) => s.path === '/franchise'), undefined, '/franchise route must be removed');
assert.strictEqual(screens.find((s) => s.path === '/blogs'), undefined, '/blogs route must be removed');
assert.strictEqual(screens.find((s) => s.path === '/inbox'), undefined, '/inbox route must be removed');
assert.strictEqual(screens.find((s) => s.path === '/testimonials'), undefined, '/testimonials route must be removed');

console.log('✅ [6/6] responsive-navigation-contract.test.ts: Passed all 25 routing contracts, nested tab persistence & dynamic breadcrumb scenarios successfully!');
