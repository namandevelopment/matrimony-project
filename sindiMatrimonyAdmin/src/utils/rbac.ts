import type { Role, RecordScope, EmployeePermissions, ModulePermission } from '../types/auth.types';

export interface RoleMeta {
  role: Role;
  label: string;
  department: string;
  defaultScope: RecordScope;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const ROLE_DEFINITIONS: Record<Role, RoleMeta> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Administrator',
    department: 'Executive Management',
    defaultScope: 'ALL',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-300',
    description: 'Full uninhibited system access, staff management, audit logs & view-as-employee.',
  },
  EMPLOYEE: {
    role: 'EMPLOYEE',
    label: 'CRM Employee',
    department: 'Sales & CRM',
    defaultScope: 'OWN',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    description: 'Assigned customer leads only, click-to-call, user response logging & chat with Super Admin.',
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Operations Admin',
    department: 'Operations',
    defaultScope: 'ALL',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    description: 'Full operations management, team assignments and system configurations.',
  },
  CRM_MANAGER: {
    role: 'CRM_MANAGER',
    label: 'CRM Team Lead',
    department: 'Sales & CRM',
    defaultScope: 'TEAM',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-300',
    description: 'Lead assignment, SLA monitoring, agent reassignments & conversion tracking.',
  },
  CRM_AGENT: {
    role: 'CRM_AGENT',
    label: 'CRM Relationship Exec',
    department: 'Sales & CRM',
    defaultScope: 'OWN',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    description: 'Assigned customer leads, click-to-call, follow-ups & matchmaking suggestions.',
  },
  FINANCE_MANAGER: {
    role: 'FINANCE_MANAGER',
    label: 'Finance Head',
    department: 'Accounts & Billing',
    defaultScope: 'ALL',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-300',
    description: 'Approve refund workflows, financial ledgers, invoice & subscription plan controls.',
  },
  FINANCE_STAFF: {
    role: 'FINANCE_STAFF',
    label: 'Accounts Associate',
    department: 'Accounts & Billing',
    defaultScope: 'ALL',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    description: 'View daily collections, reconciliations, and initiate refund requests.',
  },
  MODERATOR: {
    role: 'MODERATOR',
    label: 'Profile & KYC Moderator',
    department: 'Trust & Safety',
    defaultScope: 'ALL',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    description: 'Photo review, identity verification, Aadhaar KYC approval & user reports.',
  },
  AD_MANAGER: {
    role: 'AD_MANAGER',
    label: 'Growth & Ads Manager',
    department: 'Marketing',
    defaultScope: 'ALL',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    description: 'Campaign creatives, digital promotions, landing page UTMs & franchise feeds.',
  },
  SUPPORT_AGENT: {
    role: 'SUPPORT_AGENT',
    label: 'Support Specialist',
    department: 'Member Care',
    defaultScope: 'ASSIGNED',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    description: 'Inbox customer inquiries, real-time live chats and profile assistance.',
  },
  ANALYST: {
    role: 'ANALYST',
    label: 'BI & Growth Analyst',
    department: 'Analytics',
    defaultScope: 'ALL',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    description: 'View analytics, KPI reporting, and masked compliance-safe data exports.',
  },
};

export const ALL_ROLES = Object.keys(ROLE_DEFINITIONS) as Role[];

export const ROUTE_ALLOWED_ROLES: Record<string, Role[]> = {
  '/': ALL_ROLES,
  '/leads': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT'],
  '/chat': ALL_ROLES,
  '/inbox': ALL_ROLES,
  '/notifications': ALL_ROLES,
  '/help-support': ALL_ROLES,
  '/support': ALL_ROLES,
  '/members': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'MODERATOR', 'SUPPORT_AGENT', 'ANALYST'],
  '/members/paid': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'MODERATOR', 'SUPPORT_AGENT', 'ANALYST', 'FINANCE_MANAGER'],
  '/admin/paid-members': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'MODERATOR', 'SUPPORT_AGENT', 'ANALYST', 'FINANCE_MANAGER'],
  '/members/inactive': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'MODERATOR', 'SUPPORT_AGENT'],
  '/members/add': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'SUPPORT_AGENT'],
  '/members/search': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT', 'MODERATOR', 'SUPPORT_AGENT'],
  '/matchmaking': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT', 'SUPPORT_AGENT'],
  '/match-responses': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT', 'SUPPORT_AGENT'],
  '/horoscope': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT', 'SUPPORT_AGENT'],
  '/tasks': ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'CRM_MANAGER', 'CRM_AGENT', 'SUPPORT_AGENT'],
  '/verifications': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/finance': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'FINANCE_STAFF', 'ANALYST'],
  '/employees': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER'],
  '/settings': ['SUPER_ADMIN', 'ADMIN'],
  '/settings/membership-plans': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  '/admin/membership-plans': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  '/settings/password': ALL_ROLES,
  '/settings/gotras': ['SUPER_ADMIN', 'ADMIN'],
  '/tools': ['SUPER_ADMIN', 'ADMIN'],
  '/master-settings': ['SUPER_ADMIN'],
  '/success-stories': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'CRM_AGENT', 'MODERATOR'],
  '/reviews': ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'MODERATOR', 'SUPPORT_AGENT'],
  '/safety': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'CRM_MANAGER'],
  '/campaigns': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER', 'ANALYST', 'FINANCE_MANAGER'],
  '/campaigns/notifications': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER'],
  '/campaigns/offers': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER', 'FINANCE_MANAGER'],
  '/campaigns/popups': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER'],
  '/campaigns/logs': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER', 'ANALYST'],
  '/campaigns/analytics': ['SUPER_ADMIN', 'ADMIN', 'AD_MANAGER', 'CRM_MANAGER', 'ANALYST'],
};

export interface SidebarSectionDef {
  id: string;
  name: string;
  path: string;
  category: 'CRM & Calling' | 'Members & Profiles' | 'Operations & Communication' | 'Administration & Settings';
  description: string;
  subPaths?: string[];
}

export const SIDEBAR_SECTIONS: SidebarSectionDef[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    category: 'CRM & Calling',
    description: 'System overview, KPIs, and daily business performance metrics',
  },
  {
    id: 'leads',
    name: 'CRM Leads',
    path: '/leads',
    category: 'CRM & Calling',
    description: 'Lead generation pipeline, 20-batch assignments & call actions',
  },
  {
    id: 'tasks',
    name: 'Tasks & Follow-ups',
    path: '/tasks',
    category: 'CRM & Calling',
    description: 'Scheduled reminders, pending customer follow-ups & SLA alerts',
  },
  {
    id: 'chat',
    name: 'Team Chat',
    path: '/chat',
    category: 'Operations & Communication',
    description: 'Internal real-time messaging between Super Admin and staff',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    path: '/notifications',
    category: 'Operations & Communication',
    description: 'System alerts, lead SLA escalations, payments & security audits',
  },
  {
    id: 'help_support',
    name: 'Help & Support',
    path: '/help-support',
    category: 'Operations & Communication',
    description: 'Direct phone hotline, WhatsApp chat, email, and staff query ticketing',
    subPaths: ['/help-support', '/support'],
  },
  {
    id: 'matchmaking',
    name: 'Assisted Matchmaking',
    path: '/matchmaking',
    category: 'Members & Profiles',
    description: 'Algorithmic matchmaking engine, client-candidate matching',
  },
  {
    id: 'match_responses',
    name: 'Match Responses',
    path: '/match-responses',
    category: 'Members & Profiles',
    description: 'Client approvals, rejections, and mutual match tracking',
  },
  {
    id: 'member_search',
    name: 'Member Search',
    path: '/members/search',
    category: 'Members & Profiles',
    description: 'Fast keyword search across all active & verified profiles',
  },
  {
    id: 'horoscope',
    name: 'Horoscope & Kundli',
    path: '/horoscope',
    category: 'Members & Profiles',
    description: '36 Guna Milan, Gotra-Kundli compatibility, and automated astrological notifications',
  },
  {
    id: 'members',
    name: 'Members Management',
    path: '/members',
    category: 'Members & Profiles',
    description: 'All, paid, inactive profiles and registration forms',
    subPaths: ['/members', '/members/paid', '/members/inactive', '/members/add', '/admin/paid-members'],
  },
  {
    id: 'verifications',
    name: 'Verification Desk',
    path: '/verifications',
    category: 'Members & Profiles',
    description: 'Photo review, Aadhaar KYC verification & trust approvals',
  },
  {
    id: 'finance',
    name: 'Payment Report',
    path: '/finance',
    category: 'Operations & Communication',
    description: 'Collections, invoice generation, reconciliation & refund processing',
  },
  {
    id: 'employees',
    name: 'Employees & Access',
    path: '/employees',
    category: 'Administration & Settings',
    description: 'Staff directory, role matrix, sidebar permissions & audit logs',
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    category: 'Administration & Settings',
    description: 'Membership plans, Gotras, password change & system configs',
    subPaths: ['/settings', '/settings/membership-plans', '/settings/password', '/settings/gotras', '/admin/membership-plans'],
  },
  {
    id: 'tools',
    name: 'Admin Tools',
    path: '/tools',
    category: 'Administration & Settings',
    description: 'System diagnostics, cache clearing & bulk data imports',
  },
  {
    id: 'master_settings',
    name: 'Master Settings',
    path: '/master-settings',
    category: 'Administration & Settings',
    description: 'Global portal configurations, SMTP, SMS gateway & currencies',
  },
  {
    id: 'success_stories',
    name: 'Success Stories',
    path: '/success-stories',
    category: 'Members & Profiles',
    description: 'Married couples registry, offboarded profiles, testimonials & website publishing',
  },
  {
    id: 'reviews',
    name: 'Reviews & Ratings',
    path: '/reviews',
    category: 'Operations & Communication',
    description: 'Member ratings, Google/In-App testimonials, moderation & sentiment tracking',
  },
  {
    id: 'safety',
    name: 'Trust & Safety',
    path: '/safety',
    category: 'Operations & Communication',
    description: 'Fraud reports, financial scam alerts, shadow freeze & permanent blacklist vault',
  },
  {
    id: 'campaigns',
    name: 'Marketing & Engagement',
    path: '/campaigns',
    category: 'Operations & Communication',
    description: 'Notification management, festival promotions, dynamic popups, delivery logs & campaign analytics',
    subPaths: [
      '/campaigns',
      '/campaigns/ads',
      '/ads',
      '/campaigns/notifications',
      '/campaigns/offers',
      '/campaigns/popups',
      '/campaigns/logs',
      '/campaigns/analytics',
    ],
  },
];

export function getSectionIdForPath(path: string): string | null {
  let basePath = path.split('?')[0].replace(/\/+$/, '') || '/';
  if (basePath.startsWith('/admin/')) {
    basePath = basePath.replace('/admin', '') || '/';
  }

  // Exact matches first
  if (basePath === '/') return 'dashboard';
  if (basePath === '/leads') return 'leads';
  if (basePath === '/chat') return 'chat';
  if (basePath === '/notifications') return 'notifications';
  if (basePath === '/help-support' || basePath === '/support') return 'help_support';
  if (basePath === '/employees') return 'employees';
  if (basePath === '/matchmaking') return 'matchmaking';
  if (basePath === '/match-responses') return 'match_responses';
  if (basePath === '/horoscope') return 'horoscope';
  if (basePath === '/tasks') return 'tasks';
  if (basePath === '/members/search') return 'member_search';
  if (basePath === '/finance') return 'finance';
  if (basePath === '/verifications') return 'verifications';
  if (basePath === '/tools') return 'tools';
  if (basePath === '/master-settings') return 'master_settings';
  if (basePath === '/success-stories') return 'success_stories';
  if (basePath === '/reviews') return 'reviews';
  if (basePath === '/safety') return 'safety';
  if (basePath === '/campaigns' || basePath.startsWith('/campaigns/')) return 'campaigns';

  // Subpath / prefix matches
  if (basePath.startsWith('/settings')) return 'settings';
  if (basePath.startsWith('/members')) return 'members';
  if (basePath.startsWith('/employees/')) return 'employees';

  return null;
}

export function getDefaultAllowedSectionsForRole(role: Role): string[] {
  switch (role) {
    case 'SUPER_ADMIN':
      return SIDEBAR_SECTIONS.map((s) => s.id);
    case 'ADMIN':
      return SIDEBAR_SECTIONS.filter((s) => s.id !== 'master_settings').map((s) => s.id);
    case 'CRM_MANAGER':
      return ['dashboard', 'leads', 'tasks', 'chat', 'matchmaking', 'match_responses', 'horoscope', 'member_search', 'members', 'employees', 'notifications', 'help_support', 'success_stories', 'reviews', 'safety', 'campaigns'];
    case 'CRM_AGENT':
    case 'EMPLOYEE':
      return ['dashboard', 'leads', 'tasks', 'chat', 'member_search', 'matchmaking', 'match_responses', 'horoscope', 'notifications', 'help_support', 'success_stories'];
    case 'FINANCE_MANAGER':
      return ['dashboard', 'finance', 'members', 'settings', 'notifications', 'help_support', 'reviews', 'campaigns'];
    case 'FINANCE_STAFF':
      return ['dashboard', 'finance', 'notifications', 'help_support'];
    case 'MODERATOR':
      return ['dashboard', 'verifications', 'members', 'member_search', 'notifications', 'help_support', 'success_stories', 'reviews', 'safety'];
    case 'AD_MANAGER':
      return ['dashboard', 'leads', 'member_search', 'notifications', 'help_support', 'reviews', 'campaigns'];
    case 'SUPPORT_AGENT':
      return ['dashboard', 'chat', 'member_search', 'horoscope', 'notifications', 'help_support', 'reviews'];
    case 'ANALYST':
      return ['dashboard', 'finance', 'leads', 'members', 'notifications', 'help_support', 'success_stories', 'reviews', 'campaigns'];
    default:
      return ['dashboard', 'leads', 'notifications', 'help_support'];
  }
}

export function canAccessRoute(
  role: Role | string | undefined,
  path: string,
  allowedSections?: string[]
): boolean {
  if (!role) return false;
  const normalizedRole = role as Role;
  if (normalizedRole === 'SUPER_ADMIN') return true;

  // 1. If explicit allowedSections array is provided, enforce section clearance
  if (allowedSections && Array.isArray(allowedSections)) {
    if (allowedSections.length === 0) return false;

    const sectionId = getSectionIdForPath(path);
    if (sectionId) {
      return allowedSections.includes(sectionId);
    }
  }

  // 2. Clean trailing queries/params for role-based route check
  let basePath = path.split('?')[0].replace(/\/+$/, '') || '/';
  if (basePath.startsWith('/admin/')) {
    basePath = basePath.replace('/admin', '') || '/';
  }

  // Exact match
  if (ROUTE_ALLOWED_ROLES[basePath]) {
    return ROUTE_ALLOWED_ROLES[basePath].includes(normalizedRole);
  }

  // Prefix match (e.g., /employees/emp_001 matches /employees)
  for (const routePattern of Object.keys(ROUTE_ALLOWED_ROLES)) {
    if (routePattern !== '/' && (basePath === routePattern || basePath.startsWith(routePattern + '/'))) {
      return ROUTE_ALLOWED_ROLES[routePattern].includes(normalizedRole);
    }
  }

  return true;
}

export function getDefaultPermissionsForRole(role: Role): EmployeePermissions {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        leads: { view: true, edit: true, create: true, assign: true, call: true, export: true },
        members: { view: true, edit: true, verify: true, delete: true },
        finance: { view: true, refund: true, export: true },
        ads: { view: true, create: true, publish: true, pause: true },
        reports: { view: true, export: true },
        chat: { receive: true, initiate: true, viewHistory: true },
        settings: { manage: true },
        employees: { view: true, edit: true, create: true, delete: true },
      };
    case 'EMPLOYEE':
    case 'CRM_AGENT':
      return {
        leads: { view: true, edit: true, call: true },
        members: { view: true },
        chat: { receive: true, initiate: true, viewHistory: true },
      };
    case 'ADMIN':
      return {
        leads: { view: true, edit: true, create: true, assign: true, call: true, export: true },
        members: { view: true, edit: true, verify: true },
        finance: { view: true, refund: true, export: true },
        ads: { view: true, create: true, publish: true, pause: true },
        reports: { view: true, export: true },
        chat: { receive: true, initiate: true, viewHistory: true },
        settings: { manage: true },
        employees: { view: true, edit: true, create: true },
      };
    case 'CRM_MANAGER':
      return {
        leads: { view: true, edit: true, create: true, assign: true, call: true, export: true },
        members: { view: true },
        reports: { view: true },
        chat: { receive: true, initiate: true, viewHistory: true },
      };
    case 'CRM_AGENT':
      return {
        leads: { view: true, edit: true, call: true },
        members: { view: true },
        chat: { receive: true, initiate: true },
      };
    case 'FINANCE_MANAGER':
      return {
        finance: { view: true, refund: true, export: true },
        reports: { view: true, export: true },
      };
    case 'FINANCE_STAFF':
      return {
        finance: { view: true },
        reports: { view: true },
      };
    case 'MODERATOR':
      return {
        members: { view: true, edit: true, verify: true },
        reports: { view: true },
      };
    case 'AD_MANAGER':
      return {
        ads: { view: true, create: true, publish: true, pause: true },
        reports: { view: true },
      };
    case 'SUPPORT_AGENT':
      return {
        chat: { receive: true, initiate: true, viewHistory: true },
        members: { view: true },
      };
    case 'ANALYST':
      return {
        reports: { view: true, export: true },
        leads: { view: true },
        finance: { view: true },
      };
    default:
      return {};
  }
}

export function hasPermission(
  permissions: EmployeePermissions | undefined,
  moduleName: string,
  action: keyof ModulePermission
): boolean {
  if (!permissions) return false;
  const mod = permissions[moduleName];
  if (!mod) return false;
  return Boolean(mod[action]);
}
