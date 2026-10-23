import React, { lazy } from 'react';
import { AdminLayout } from '../components/AdminLayout';

export interface ScreenConfig {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  title: string;
  requiresAuth: boolean;
  layout?: React.ComponentType<any>;
}

export { AdminLayout };

const DashboardScreen = lazy(() => import('../screens/dashboardScreen/DashboardScreen'));
const LeadsScreen = lazy(() => import('../screens/leadsScreen/LeadsScreen'));
const MembersScreen = lazy(() => import('../screens/membersScreen/MembersScreen'));
const PaidMembersScreen = lazy(() => import('../screens/membersScreen/PaidMembersScreen'));
const InactiveMembersScreen = lazy(() => import('../screens/membersScreen/InactiveMembersScreen'));
const AddMemberScreen = lazy(() => import('../screens/membersScreen/AddMemberScreen'));
const ProfileDetailsByIdScreen = lazy(() => import('../screens/membersScreen/ProfileDetailsByIdScreen'));
const VerificationScreen = lazy(() => import('../screens/verificationScreen/VerificationScreen'));
const FinanceScreen = lazy(() => import('../screens/financeScreen/FinanceScreen'));
const EmployeeScreen = lazy(() => import('../screens/employeeScreen/EmployeeScreen'));
const Employee360Screen = lazy(() => import('../screens/employeeScreen/Employee360Screen'));
const MatchmakingScreen = lazy(() => import('../screens/matchmakingScreen/MatchmakingScreen'));
const MatchResponsesScreen = lazy(() => import('../screens/matchmakingScreen/MatchResponsesScreen'));
const TasksScreen = lazy(() => import('../screens/tasksScreen/TasksScreen'));
const SettingsScreen = lazy(() => import('../screens/settingsScreen/SettingsScreen'));
const SubcasteGotraScreen = lazy(() => import('../screens/settingsScreen/SubcasteGotraScreen'));
const ToolsScreen = lazy(() => import('../screens/toolsScreen/ToolsScreen'));
const MasterSettingsScreen = lazy(() => import('../screens/masterSettingsScreen/MasterSettingsScreen'));
const LoginScreen = lazy(() => import('../screens/authScreens/LoginScreen'));
const TeamChatScreen = lazy(() => import('../screens/chatsScreen/TeamChatScreen'));
const NotificationsScreen = lazy(() => import('../screens/notificationsScreen/NotificationsScreen'));
const HelpSupportScreen = lazy(() => import('../screens/helpSupportScreen/HelpSupportScreen'));
const HoroscopeScreen = lazy(() => import('../screens/horoscopeScreen/HoroscopeScreen'));
const SuccessStoriesScreen = lazy(() => import('../screens/successStoriesScreen/SuccessStoriesScreen'));
const ReviewsScreen = lazy(() => import('../screens/reviewsScreen/ReviewsScreen'));
const SafetyScreen = lazy(() => import('../screens/safetyScreen/SafetyScreen'));
const CampaignsScreen = lazy(() => import('../screens/campaignsScreen/CampaignsScreen'));

/**
 * Prefetch all screen chunks in the background so transitions are instant
 * and dynamic imports are already warm in memory.
 */
export const prefetchScreens = () => {
  if (typeof window === 'undefined') return;
  // Trigger non-blocking browser prefetch of all screen chunks
  setTimeout(() => {
    import('../screens/dashboardScreen/DashboardScreen');
    import('../screens/leadsScreen/LeadsScreen');
    import('../screens/membersScreen/MembersScreen');
    import('../screens/verificationScreen/VerificationScreen');
    import('../screens/financeScreen/FinanceScreen');
    import('../screens/employeeScreen/EmployeeScreen');
    import('../screens/employeeScreen/Employee360Screen');
    import('../screens/matchmakingScreen/MatchmakingScreen');
    import('../screens/matchmakingScreen/MatchResponsesScreen');
    import('../screens/tasksScreen/TasksScreen');
    import('../screens/settingsScreen/SettingsScreen');
    import('../screens/settingsScreen/ChangePasswordScreen');
    import('../screens/settingsScreen/SubcasteGotraScreen');
    import('../screens/toolsScreen/ToolsScreen');
    import('../screens/masterSettingsScreen/MasterSettingsScreen');
    import('../screens/notificationsScreen/NotificationsScreen');
    import('../screens/helpSupportScreen/HelpSupportScreen');
    import('../screens/horoscopeScreen/HoroscopeScreen');
    import('../screens/successStoriesScreen/SuccessStoriesScreen');
    import('../screens/reviewsScreen/ReviewsScreen');
    import('../screens/safetyScreen/SafetyScreen');
    import('../screens/campaignsScreen/CampaignsScreen');
  }, 100);
};

export const screens: ScreenConfig[] = [
  {
    name: 'DashboardScreen',
    path: '/',
    component: DashboardScreen,
    layout: AdminLayout,
    title: 'Dashboard',
    requiresAuth: true,
  },
  {
    name: 'LeadsScreen',
    path: '/leads',
    component: LeadsScreen,
    layout: AdminLayout,
    title: 'CRM Leads',
    requiresAuth: true,
  },
  {
    name: 'MembersScreen',
    path: '/members',
    component: MembersScreen,
    title: 'Members Directory',
    requiresAuth: true,
  },
  {
    name: 'MemberSearchScreen',
    path: '/members/search',
    component: MembersScreen,
    title: 'Member Search',
    requiresAuth: true,
  },
  {
    name: 'PaidMembersScreen',
    path: '/members/paid',
    component: PaidMembersScreen,
    title: 'Paid Members',
    requiresAuth: true,
  },
  {
    name: 'AdminPaidMembersScreen',
    path: '/admin/paid-members',
    component: PaidMembersScreen,
    title: 'Paid Members',
    requiresAuth: true,
  },
  {
    name: 'InactiveMembersScreen',
    path: '/members/inactive',
    component: InactiveMembersScreen,
    title: 'Inactive Members',
    requiresAuth: true,
  },
  {
    name: 'AddMemberScreen',
    path: '/members/add',
    component: AddMemberScreen,
    title: 'Add Member',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsByIdScreen',
    path: '/members/profile-details-by-id/:id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details by ID',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsByIdDefault',
    path: '/members/profile-details-by-id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details by ID',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsByIdDirect',
    path: '/profile-details-by-id/:id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details by ID',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsByIdSimple',
    path: '/profile-details/:id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsScreen',
    path: '/members/profile/:id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details',
    requiresAuth: true,
  },
  {
    name: 'ProfileDetailsDefaultScreen',
    path: '/members/profile',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details',
    requiresAuth: true,
  },
  {
    name: 'ShowMemberScreen',
    path: '/admin/showmember/:id',
    component: ProfileDetailsByIdScreen,
    title: 'Profile Details',
    requiresAuth: true,
  },
  {
    name: 'MatchMakingScreen',
    path: '/matchmaking',
    component: MatchmakingScreen,
    title: 'Assisted Match Making Engine',
    requiresAuth: true,
  },
  {
    name: 'MatchResponsesScreen',
    path: '/match-responses',
    component: MatchResponsesScreen,
    title: 'Match Responses',
    requiresAuth: true,
  },
  {
    name: 'HoroscopeScreen',
    path: '/horoscope',
    component: HoroscopeScreen,
    title: 'Horoscope & Kundli Milan',
    requiresAuth: true,
  },
  {
    name: 'TasksScreen',
    path: '/tasks',
    component: TasksScreen,
    title: 'Tasks & Follow-ups',
    requiresAuth: true,
  },
  {
    name: 'VerificationScreen',
    path: '/verifications',
    component: VerificationScreen,
    title: 'Verification Desk',
    requiresAuth: true,
  },
  {
    name: 'FinanceScreen',
    path: '/finance',
    component: FinanceScreen,
    title: 'Finance & Ledger',
    requiresAuth: true,
  },
  {
    name: 'EmployeeScreen',
    path: '/employees',
    component: EmployeeScreen,
    title: 'Employee Access & RBAC',
    requiresAuth: true,
  },
  {
    name: 'Employee360Screen',
    path: '/employees/:id',
    component: Employee360Screen,
    title: 'Employee 360° Management',
    requiresAuth: true,
  },
  {
    name: 'Employee360AdminScreen',
    path: '/admin/employees/:id',
    component: Employee360Screen,
    title: 'Employee 360° Management',
    requiresAuth: true,
  },
  {
    name: 'TeamChatScreen',
    path: '/chat',
    component: TeamChatScreen,
    title: 'Staff & Team Chat',
    requiresAuth: true,
  },
  {
    name: 'SettingsScreen',
    path: '/settings',
    component: SettingsScreen,
    title: 'Settings',
    requiresAuth: true,
  },
  {
    name: 'MembershipPlansScreen',
    path: '/settings/membership-plans',
    component: SettingsScreen,
    title: 'Membership Plans',
    requiresAuth: true,
  },
  {
    name: 'AdminMembershipPlansScreen',
    path: '/admin/membership-plans',
    component: SettingsScreen,
    title: 'Membership Plans',
    requiresAuth: true,
  },
  {
    name: 'ChangePasswordScreen',
    path: '/settings/password',
    component: SettingsScreen,
    title: 'Change Password',
    requiresAuth: true,
  },
  {
    name: 'SubcasteGotraScreen',
    path: '/settings/gotras',
    component: SubcasteGotraScreen,
    title: 'Subcaste & Gotra',
    requiresAuth: true,
  },
  {
    name: 'ToolsScreen',
    path: '/tools',
    component: ToolsScreen,
    title: 'Admin Tools & Diagnostics',
    requiresAuth: true,
  },
  {
    name: 'MasterSettingsScreen',
    path: '/master-settings',
    component: MasterSettingsScreen,
    title: 'Master Settings',
    requiresAuth: true,
  },
  {
    name: 'NotificationsScreen',
    path: '/notifications',
    component: NotificationsScreen,
    title: 'Notifications & Alerts',
    requiresAuth: true,
  },
  {
    name: 'HelpSupportScreen',
    path: '/help-support',
    component: HelpSupportScreen,
    title: 'Help & Direct Support',
    requiresAuth: true,
  },
  {
    name: 'HelpSupportAliasScreen',
    path: '/support',
    component: HelpSupportScreen,
    title: 'Help & Direct Support',
    requiresAuth: true,
  },
  {
    name: 'SuccessStoriesScreen',
    path: '/success-stories',
    component: SuccessStoriesScreen,
    title: 'Success Stories & Vivah Registry',
    requiresAuth: true,
  },
  {
    name: 'ReviewsScreen',
    path: '/reviews',
    component: ReviewsScreen,
    title: 'Reviews & Ratings Desk',
    requiresAuth: true,
  },
  {
    name: 'SafetyScreen',
    path: '/safety',
    component: SafetyScreen,
    title: 'Trust & Safety / Abuse Moderation',
    requiresAuth: true,
  },
  {
    name: 'CampaignsScreen',
    path: '/campaigns',
    component: CampaignsScreen,
    title: 'Marketing & Engagement',
    requiresAuth: true,
  },
  {
    name: 'CampaignAdsScreen',
    path: '/campaigns/ads',
    component: CampaignsScreen,
    title: 'Ads & Partner Deals',
    requiresAuth: true,
  },
  {
    name: 'DirectAdsScreen',
    path: '/ads',
    component: CampaignsScreen,
    title: 'Ads & Partner Deals',
    requiresAuth: true,
  },
  {
    name: 'CampaignNotificationsScreen',
    path: '/campaigns/notifications',
    component: CampaignsScreen,
    title: 'Notification Management',
    requiresAuth: true,
  },
  {
    name: 'CampaignOffersScreen',
    path: '/campaigns/offers',
    component: CampaignsScreen,
    title: 'Festival & Offer Management',
    requiresAuth: true,
  },
  {
    name: 'CampaignPopupsScreen',
    path: '/campaigns/popups',
    component: CampaignsScreen,
    title: 'Popup Management',
    requiresAuth: true,
  },
  {
    name: 'CampaignLogsScreen',
    path: '/campaigns/logs',
    component: CampaignsScreen,
    title: 'Delivery Logs',
    requiresAuth: true,
  },
  {
    name: 'CampaignAnalyticsScreen',
    path: '/campaigns/analytics',
    component: CampaignsScreen,
    title: 'Campaign Analytics',
    requiresAuth: true,
  },
  {
    name: 'LoginScreen',
    path: '/login',
    component: LoginScreen,
    title: 'Employee Login',
    requiresAuth: false,
  },
];
