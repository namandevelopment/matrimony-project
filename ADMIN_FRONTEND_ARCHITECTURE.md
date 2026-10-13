# 💻 Sindhi Matrimony – Admin Portal Frontend Architecture
### Complete Frontend Technical Blueprint, UI/UX Structure, State Management & Component Guide
> **Directory:** `/Users/naman/Documents/CRM Landing Projects/Matrimony Project/sindiMatrimonyAdmin/`  
> **Target Audience:** Frontend Developers, UI/UX Engineers, Product Owners, QA Engineers  
> **Companion Docs:** `ADMIN_COMPLETE_ARCHITECTURE.md` (Backend) & `ADMIN_SCREENS_API_MAPPING.md` (APIs)

---

## 📋 Table of Contents
1. [Tech Stack & Library Selection](#1-tech-stack)
2. [Frontend Architecture Overview](#2-architecture-overview)
3. [Complete Folder Structure](#3-folder-structure)
4. [Design System & UI Tokens](#4-design-system)
5. [Layouts, Navigation & Responsive Shell](#5-layouts-navigation)
6. [RBAC Permission System in Frontend](#6-rbac-frontend)
7. [State Management & Server State Caching](#7-state-management)
8. [Real-time System & Floating Call Widget](#8-real-time-call-widget)
9. [Detailed Screen Component Breakdowns](#9-screen-components)
10. [Forms, Validation & Reason Modals](#10-forms-validation)
11. [Data Tables, Filtering & Export Specs](#11-tables-export)
12. [Performance, Security & Build Config](#12-performance-security)

---

## 1. Tech Stack & Library Selection

| Category | Technology | Version | Purpose & Rationale |
|:---|:---|:---|:---|
| **Core Framework** | React + TypeScript | React 18+ / TS 5+ | Type safety, performant DOM rendering, strong ecosystem |
| **Build Tool** | Vite | 5.x+ | Lightning-fast HMR, optimized production chunks |
| **Styling** | Tailwind CSS + Lucide Icons | 3.4+ | Utility-first CSS, high consistency, lightweight SVG icons |
| **Headless UI** | Radix UI / Headless UI | Latest | Accessible primitives (Dialogs, Dropdowns, Popovers, Tooltips) |
| **State Management** | Redux Toolkit (RTK) | Latest | Global auth state, session management, active calls, sound alerts |
| **Server State & Caching** | TanStack Query (React Query) | v5 | Automated caching, background refetching, optimistic mutations |
| **Routing** | React Router DOM | v6.20+ | Nested routes, route-level permission guards, URL query synchronization |
| **Data Tables** | TanStack Table | v8 | Virtualized tables, column sorting, filtering, selection, resizing |
| **Forms & Validation** | React Hook Form + Zod | Latest | High performance (no re-renders on keystroke), strict schema validation |
| **Charts & Visualization** | Recharts / Chart.js | Latest | Responsive SVG charts (Funnel, Line, Bar, Pie, Heatmap) |
| **Real-time Client** | Socket.io Client | 4.x | Real-time push notifications, chat, live call status updates |
| **HTTP Client** | Axios | 1.6+ | Interceptors for auto-refreshing JWTs, CSRF, response formatting |
| **Date Utilities** | date-fns | Latest | Lightweight timezone-aware date formatting and math |
| **Audio / Notifications** | Howler.js + Web Audio API | Latest | Ringing tones, alert chimes for new leads and incoming calls |

---

## 2. Frontend Architecture Overview

```
                                  [ Browser / Admin User ]
                                             │
                                   [ React Router v6 ]
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
      [ Public Route ]                                               [ Protected Route ]
      - /login                                                       (Wrapped with RBACGuard)
      - /forgot-password                                                     │
                                                                             ▼
                                                                     [ AdminLayout Shell ]
                                                 ┌───────────────────────────┴───────────────────────────┐
                                                 ▼                                                       ▼
                                     [ TopNav + Global Search ]                              [ Collapsible Sidebar ]
                                     - Profile Dropdown                                      - Dynamic role-filtered
                                     - Notification Center                                     menu hierarchy
                                     - Global Status (Available/Busy)
                                                 │
                                                 ▼
                                     [ Main Page Content Area ]
                                     (Breadcrumbs + Content View)
                                                 │
              ┌──────────────────────────────────┼──────────────────────────────────┐
              ▼                                  ▼                                  ▼
      [ TanStack Query ]                 [ Redux Toolkit ]                  [ Socket.io Client ]
      - Server State Cache               - Client Auth State                - 'lead:assigned'
      - Infinite lists                   - Token / Refresh logic            - 'call:status_update'
      - Stale-while-revalidate           - Active Call Overlay              - 'chat:message'
      - Auto-invalidation on mutate      - Sidebar Collapse state           - Desktop notifications
              │                                  │                                  │
              └──────────────────────────────────┼──────────────────────────────────┘
                                                 ▼
                                     [ Axios HTTP Client ]
                                     - JWT Bearer Header
                                     - 401 Auto-refresh Token queue
                                     - Global Error Toasts
                                                 │
                                                 ▼
                                     [ Backend REST API /v1 ]
```

---

## 3. Complete Folder Structure

```
sindiMatrimonyAdmin/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .env.example
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── sounds/                      # Alert chimes & ringtones
│       ├── lead-alert.mp3
│       ├── call-incoming.mp3
│       └── notification.mp3
│
└── src/
    ├── main.tsx                     # Vite entry point + Providers
    ├── App.tsx                      # Root component + Toast container
    │
    ├── assets/                      # Static brand assets & illustrations
    │   ├── brand/
    │   └── illustrations/
    │
    ├── config/                      # Environment variables & constants
    │   ├── env.ts                   # Type-safe env wrappers
    │   ├── constants.ts             # Roles, lead stages, payment statuses
    │   └── queryClient.ts           # React Query configuration
    │
    ├── routes/                      # Routing & Permission guards
    │   ├── AppRoutes.tsx            # Central route definition
    │   ├── ProtectedRoute.tsx       # Authentication & role guard
    │   ├── PermissionGate.tsx       # Component-level permission wrapper
    │   └── routePaths.ts            # Strongly typed path constants
    │
    ├── layouts/                     # Layout shells
    │   ├── AdminLayout.tsx          # Full dashboard layout
    │   ├── AuthLayout.tsx           # Login / Centered card layout
    │   ├── components/
    │   │   ├── Sidebar.tsx          # Dynamic role-filtered navigation
    │   │   ├── Header.tsx           # Topbar with profile & alerts
    │   │   ├── Breadcrumb.tsx       # Dynamic path breadcrumbs
    │   │   ├── NotificationBell.tsx # Popover with live unread alerts
    │   │   └── UserMenu.tsx         # Account settings & logout
    │
    ├── store/                       # Global Client State (Redux Toolkit)
    │   ├── index.ts                 # Store configuration
    │   ├── hooks.ts                 # useAppDispatch & useAppSelector
    │   └── slices/
    │       ├── authSlice.ts         # User session, tokens & permissions
    │       ├── uiSlice.ts           # Sidebar state, theme, modals
    │       ├── callSlice.ts         # Active floating call state & timer
    │       └── notificationSlice.ts # Socket alerts & unread counter
    │
    ├── services/                    # API Integration Layer
    │   ├── axiosInstance.ts         # Interceptors, token refresh queue
    │   ├── socket.ts                # Socket.io connection manager
    │   ├── endpoints.ts             # API URL constants
    │   └── api/                     # Domain-specific API services
    │       ├── auth.api.ts
    │       ├── dashboard.api.ts
    │       ├── employee.api.ts
    │       ├── lead.api.ts
    │       ├── call.api.ts
    │       ├── member.api.ts
    │       ├── verification.api.ts
    │       ├── finance.api.ts
    │       ├── subscription.api.ts
    │       ├── campaign.api.ts
    │       ├── report.api.ts
    │       ├── audit.api.ts
    │       └── masterData.api.ts
    │
    ├── hooks/                       # Custom React Hooks
    │   ├── useAuth.ts               # Current user, permissions helpers
    │   ├── usePermission.ts         # checkPermission(module, action)
    │   ├── useSocket.ts             # Listen to domain socket events
    │   ├── useDebounce.ts           # Debounce input for table search
    │   ├── useAudio.ts              # Play alert & ringtone chimes
    │   └── usePagination.ts         # Manage URL-synced page & limit
    │
    ├── components/                  # Reusable UI Component Library
    │   ├── common/                  # Primitives & generic widgets
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Badge.tsx            # Status & role color badges
    │   │   ├── Modal.tsx            # Accessible modal dialog
    │   │   ├── Drawer.tsx           # Side slide-out panel
    │   │   ├── Tooltip.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── Skeleton.tsx         # Skeleton loading states
    │   │   └── EmptyState.tsx       # Clean zero-data illustrations
    │   │
    │   ├── feedback/
    │   │   ├── ReasonModal.tsx      # Mandatory justification modal
    │   │   ├── ConfirmDialog.tsx    # Destructive action confirmation
    │   │   └── Toast.tsx
    │   │
    │   ├── dataDisplay/
    │   │   ├── DataTable/           # Virtualized TanStack Table wrapper
    │   │   │   ├── DataTable.tsx
    │   │   │   ├── TablePagination.tsx
    │   │   │   ├── TableToolbar.tsx
    │   │   │   ├── ColumnFilter.tsx
    │   │   │   └── ColumnVisibility.tsx
    │   │   ├── StatCard.tsx         # KPI card with delta indicator
    │   │   ├── Timeline.tsx         # Lead & Audit activity stream
    │   │   ├── AudioPlayer.tsx      # Waveform player for call recordings
    │   │   └── ImageViewer.tsx      # Lightbox for KYC & member photos
    │   │
    │   └── widgets/
    │       ├── FloatingCallWidget.tsx # In-progress call widget
    │       ├── CallDispositionModal.tsx # Post-call form modal
    │       └── QuickSearchDialog.tsx  # Cmd+K Spotlight search
    │
    ├── pages/                       # Screen Implementations
    │   ├── auth/
    │   │   ├── LoginPage.tsx
    │   │   └── MfaVerificationPage.tsx
    │   │
    │   ├── dashboard/
    │   │   ├── DashboardPage.tsx
    │   │   └── components/
    │   │       ├── KpiMetricsRow.tsx
    │   │       ├── RegistrationChart.tsx
    │   │       ├── ConversionFunnelChart.tsx
    │   │       ├── TopAgentsTable.tsx
    │   │       └── TodayFollowupsList.tsx
    │   │
    │   ├── employees/
    │   │   ├── EmployeeListPage.tsx
    │   │   ├── EmployeeDetailPage.tsx
    │   │   └── components/
    │   │       ├── PermissionMatrixEditor.tsx
    │   │       ├── ShiftScheduleForm.tsx
    │   │       └── AccessPreviewModal.tsx
    │   │
    │   ├── leads/
    │   │   ├── LeadListPage.tsx
    │   │   ├── LeadDetailPage.tsx
    │   │   ├── BulkAssignModal.tsx
    │   │   └── components/
    │   │       ├── LeadTimelineFeed.tsx
    │   │       ├── AddNoteForm.tsx
    │   │       ├── SetFollowupModal.tsx
    │   │       └── LeadStatusBadge.tsx
    │   │
    │   ├── members/
    │   │   ├── MemberListPage.tsx
    │   │   ├── MemberDetailPage.tsx
    │   │   └── components/
    │   │       ├── Member360ProfileTab.tsx
    │   │       ├── PartnerPreferenceTab.tsx
    │   │       ├── VerificationBadge.tsx
    │   │       └── MemberEditHistoryTab.tsx
    │   │
    │   ├── verifications/
    │   │   ├── VerificationQueuePage.tsx
    │   │   └── components/
    │   │       ├── PhotoModerationCard.tsx
    │   │       └── KycDocumentReviewCard.tsx
    │   │
    │   ├── calls/
    │   │   └── CallReportsPage.tsx
    │   │
    │   ├── chats/
    │   │   ├── ChatManagementPage.tsx
    │   │   └── components/
    │   │       ├── ChatConversationList.tsx
    │   │       └── ChatTranscriptView.tsx
    │   │
    │   ├── subscriptions/
    │   │   ├── PlansManagementPage.tsx
    │   │   └── SubscriptionsListPage.tsx
    │   │
    │   ├── finance/
    │   │   ├── FinanceSummaryPage.tsx
    │   │   ├── TransactionLedgerPage.tsx
    │   │   ├── RefundManagementPage.tsx
    │   │   └── components/
    │   │       ├── TransactionDetailDrawer.tsx
    │   │       └── RefundApprovalModal.tsx
    │   │
    │   ├── campaigns/
    │   │   ├── CampaignListPage.tsx
    │   │   ├── CampaignDetailPage.tsx
    │   │   └── components/
    │   │       ├── CampaignDevicePreview.tsx
    │   │       └── CampaignAnalyticsView.tsx
    │   │
    │   ├── reports/
    │   │   └── ReportsExportPage.tsx
    │   │
    │   ├── audit/
    │   │   └── AuditLogPage.tsx
    │   │
    │   └── settings/
    │       ├── MasterDataPage.tsx
    │       └── SystemSettingsPage.tsx
    │
    ├── types/                       # Shared TypeScript Interfaces
    │   ├── auth.types.ts
    │   ├── employee.types.ts
    │   ├── lead.types.ts
    │   ├── member.types.ts
    │   ├── call.types.ts
    │   ├── finance.types.ts
    │   ├── campaign.types.ts
    │   └── common.types.ts
    │
    └── utils/                       # Helpers & Formatters
        ├── formatters.ts            # INR Currency, Dates, Phone masking
        ├── validators.ts            # Custom Zod schemas
        ├── exportToCsv.ts           # Client-side table CSV trigger
        └── storage.ts               # Local/Session storage abstractions
```

---

## 4. Design System & UI Tokens

### 4.1 Color Palette
Designed for high trust, executive elegance, and Sindhi cultural affinity (Royal Navy + Emerald Green + Gold accents):

```javascript
// tailwind.config.js - Theme Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          900: '#0C4A6E', // Royal Navy primary
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFFBEA',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04', // Cultural Gold accent
        },
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    }
  }
}
```

### 4.2 Status Color Mapping

| Entity | Status Value | Background Class | Text Class | Icon |
|:---|:---|:---|:---|:---|
| **Lead** | `NEW` | `bg-blue-50` | `text-blue-700` | Sparkles |
| **Lead** | `ASSIGNED` | `bg-indigo-50` | `text-indigo-700` | UserCheck |
| **Lead** | `CONTACTED` | `bg-purple-50` | `text-purple-700` | PhoneCall |
| **Lead** | `CONVERTED` | `bg-emerald-50` | `text-emerald-700` | Award |
| **Lead** | `LOST` | `bg-neutral-100` | `text-neutral-600` | XCircle |
| **Member** | `ACTIVE` | `bg-emerald-50` | `text-emerald-700` | CheckCircle2 |
| **Member** | `SUSPENDED` | `bg-rose-50` | `text-rose-700` | Ban |
| **KYC** | `VERIFIED` | `bg-sky-50` | `text-sky-700` | ShieldCheck |
| **Payment**| `SUCCESS` | `bg-emerald-50` | `text-emerald-700` | Check |
| **Payment**| `REFUNDED` | `bg-amber-50` | `text-amber-700` | RotateCcw |

---

## 5. Layouts, Navigation & Responsive Shell

### 5.1 Dynamic Sidebar Structure
The sidebar automatically renders menu items based on the employee's role and granular permissions:

```typescript
// src/config/navigationConfig.ts
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  requiredRole?: Role[];
  requiredPermission?: { module: string; action: string };
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    requiredRole: ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ANALYST'],
  },
  {
    name: 'CRM Leads',
    href: '/leads',
    icon: Contact2,
    requiredPermission: { module: 'leads', action: 'view' },
  },
  {
    name: 'Telephony & Calls',
    href: '/calls/reports',
    icon: PhoneForwarded,
    requiredPermission: { module: 'leads', action: 'call' },
  },
  {
    name: 'Members',
    href: '/members',
    icon: Users,
    requiredPermission: { module: 'members', action: 'view' },
  },
  {
    name: 'Verifications',
    href: '/verifications',
    icon: ShieldCheck,
    requiredRole: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  },
  {
    name: 'Finance & Accounts',
    href: '/finance',
    icon: IndianRupee,
    requiredPermission: { module: 'finance', action: 'view' },
    children: [
      { name: 'Summary', href: '/finance', icon: PieChart },
      { name: 'Transactions', href: '/finance/transactions', icon: Receipt },
      { name: 'Refund Approvals', href: '/finance/refunds', icon: RotateCcw },
    ]
  },
  {
    name: 'Subscriptions & Plans',
    href: '/subscriptions',
    icon: Crown,
    requiredPermission: { module: 'finance', action: 'view' },
  },
  {
    name: 'Ad Campaigns',
    href: '/campaigns',
    icon: Megaphone,
    requiredPermission: { module: 'ads', action: 'view' },
  },
  {
    name: 'Live Chat Queue',
    href: '/chats',
    icon: MessagesSquare,
    requiredPermission: { module: 'chat', action: 'receive' },
  },
  {
    name: 'Reports & Exports',
    href: '/reports',
    icon: FileSpreadsheet,
    requiredPermission: { module: 'reports', action: 'view' },
  },
  {
    name: 'Employee Access',
    href: '/employees',
    icon: ShieldAlert,
    requiredRole: ['SUPER_ADMIN'],
  },
  {
    name: 'Audit Logs',
    href: '/audit-logs',
    icon: History,
    requiredRole: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    name: 'System Settings',
    href: '/settings',
    icon: Settings,
    requiredRole: ['SUPER_ADMIN'],
  }
];
```

### 5.2 Header Shell Features
1. **Collapsible Sidebar Trigger:** Toggle between 260px expanded and 72px icon-only state.
2. **Global Spotlight (Cmd+K / Ctrl+K):** Instant modal search to jump directly to any Lead ID, Member Profile ID, or Page.
3. **Agent Status Selector:** Available (Green) / Busy (Yellow) / Offline (Gray) - controls inbound chat/call routing.
4. **Notification Center Bell:** Shows unread badge count with audio ping for new assigned leads.
5. **Employee Profile Dropdown:** Displays Employee Name, Role Badge, Department, and Logout button.

---

## 6. RBAC Permission System in Frontend

Even though the backend strictly blocks unauthorized API calls (HTTP 403), the frontend must provide clean UX by **hiding buttons and blocking route transitions** without unexpected visual flashes.

### 6.1 `usePermission` Hook Implementation

```typescript
// src/hooks/usePermission.ts
import { useAppSelector } from '../store/hooks';
import { Role } from '../types/auth.types';

export const usePermission = () => {
  const { user } = useAppSelector((state) => state.auth);

  const hasRole = (...roles: Role[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true; // Super Admin has all access
    return roles.includes(user.role);
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return Boolean(user.permissions?.[module]?.[action]);
  };

  return { hasRole, hasPermission, role: user?.role, recordScope: user?.recordScope };
};
```

### 6.2 `PermissionGate` Component
Used to conditionally wrap buttons, tabs, or action menus:

```tsx
// src/routes/PermissionGate.tsx
interface Props {
  role?: Role[];
  module?: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<Props> = ({ role, module, action, children, fallback = null }) => {
  const { hasRole, hasPermission } = usePermission();

  if (role && !hasRole(...role)) return <>{fallback}</>;
  if (module && action && !hasPermission(module, action)) return <>{fallback}</>;

  return <>{children}</>;
};

// Usage Example in LeadDetailPage:
<PermissionGate module="leads" action="call">
  <Button onClick={handleInitiateCall} variant="primary">
    <Phone className="w-4 h-4 mr-2" /> Click to Call
  </Button>
</PermissionGate>
```

---

## 7. State Management & Server State Caching

### 7.1 Division of State

| Type | Store Layer | Examples |
|:---|:---|:---|
| **Global Client State** | Redux Toolkit | Current User, JWT Tokens, Sidebar Open/Close, Active In-Call State |
| **Server State (Remote)** | TanStack Query v5 | Leads List, Member Profiles, Dashboard KPIs, Transaction Ledger |
| **Local Form State** | React Hook Form | Lead Note Input, Campaign Creation Multi-step wizard |
| **URL State** | React Router (`useSearchParams`) | Active Tab, Page Number, Filter queries, Sort columns |

### 7.2 TanStack Query Cache Keys & Mutation Invalidation

```typescript
// Cache Key Factory
export const queryKeys = {
  dashboardStats: (filters: Record<string, any>) => ['dashboard', 'stats', filters],
  leads: (params: Record<string, any>) => ['leads', 'list', params],
  leadDetail: (id: string) => ['leads', 'detail', id],
  leadTimeline: (id: string) => ['leads', 'timeline', id],
  members: (params: Record<string, any>) => ['members', 'list', params],
  memberDetail: (id: string) => ['members', 'detail', id],
  pendingVerifications: ['verifications', 'pending'],
  transactions: (params: Record<string, any>) => ['finance', 'transactions', params],
  refundQueue: ['finance', 'refunds', 'pending'],
  campaigns: (status?: string) => ['campaigns', status],
};
```

**Mutation Invalidation Pattern:**
```typescript
// When a lead status is changed or note is added:
const queryClient = useQueryClient();

const updateStatusMutation = useMutation({
  mutationFn: updateLeadStatusApi,
  onSuccess: (_, variables) => {
    // Invalidate lead detail & timeline
    queryClient.invalidateQueries({ queryKey: queryKeys.leadDetail(variables.id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.leadTimeline(variables.id) });
    // Invalidate main lead table
    queryClient.invalidateQueries({ queryKey: ['leads', 'list'] });
    toast.success('Lead status updated successfully');
  }
});
```

---

## 8. Real-time System & Floating Call Widget

### 8.1 Floating Call Widget UX
When an employee clicks **"Click to Call"** on any lead or member:
1. `callSlice.ts` transitions state to `CALL_INITIATED`.
2. A floating widget mounts in the bottom-right corner of the browser (`z-50`).
3. Widget persists even if the employee navigates to other screens (e.g., checks Member profile or pricing plans while talking!).
4. Webhooks sent via Socket.io update the widget in real-time:
   - `status: RINGING` → Audio chime + pulsating animation.
   - `status: CONNECTED` → Call duration timer starts (`00:01`, `00:02`...).
   - `status: COMPLETED` → Duration stops, call ends.
5. **Critical Feature: Mandatory Disposition Modal**
   - The moment the call ends, a modal appears blocking the screen until the agent selects an outcome (Interested, Call back, Not interested, etc.) and enters notes.
   - The floating widget will NOT close until the disposition is submitted.

```
┌─────────────────────────────────────────────────────────────┐
│ 📞 IN PROGRESS CALL: Rajesh Hingorani (+91 98****5678)      │
│ Lead: LEAD-2024-0012   |  Duration: 02:45  [CONNECTED]       │
│                                                             │
│ [ Mute ]       [ Open Profile ]            [ End Call 🔴 ]  │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Socket Listener Hook Setup
```typescript
// src/hooks/useSocketNotifications.ts
export const useSocketNotifications = () => {
  const dispatch = useAppDispatch();
  const { playLeadAlert, playNotification } = useAudio();

  useEffect(() => {
    const socket = getSocketInstance();

    socket.on('lead:assigned', (data) => {
      playLeadAlert();
      dispatch(addNotification({
        id: data.leadId,
        title: 'New Lead Assigned',
        message: `${data.name} from ${data.source} assigned to you.`,
        link: `/leads/${data.leadId}`,
      }));
      toast.info(`🔔 New Lead Assigned: ${data.name}`);
    });

    socket.on('call:status_update', (data) => {
      dispatch(updateCallStatus(data));
    });

    return () => {
      socket.off('lead:assigned');
      socket.off('call:status_update');
    };
  }, []);
};
```

---

## 9. Detailed Screen Component Breakdowns

---

### SCREEN 1 & 2: Dashboard & Overview
- **Header:** Date presets (Today, Yesterday, Last 7 Days, Month, Custom Datepicker).
- **KPI Metrics Grid (6 Cards):**
  - Registrations, Active Users, Revenue, Active Subscriptions, New Leads, SLA Breaches.
  - Component: `<StatCard title="Total Revenue" value="₹4,85,000" delta="+18.4%" icon={IndianRupee} />`
- **Charts Row 1 (2 Columns):**
  - *Left:* Registration Growth & Active Trend (Area chart / Line).
  - *Right:* Conversion Funnel Chart (Horizontal bar / Stepped funnel).
- **Charts Row 2 (3 Columns):**
  - *Left:* Lead Status Distribution (Donut chart).
  - *Center:* Revenue by Plan Tier (Bar chart: Silver vs Gold vs Platinum).
  - *Right:* Lead Intake Heatmap (7x24 grid: peak inquiry hours).
- **Live Widgets:**
  - *Top 10 CRM Agents by Conversions* (Mini leaderboard table).
  - *Today's Pending Follow-ups* (Clickable list with direct phone triggers).

---

### SCREEN 3 & 4: CRM Lead Management
- **List Page (`/leads`):**
  - **Saved View Tabs:** `[My Leads (47)]` `[Unassigned (12)]` `[Today's Follow-ups (8)]` `[Overdue SLA (3)]` `[Converted (89)]`.
  - **Filter Bar:** Multi-select (Status, Priority, Source, Subcaste, Budget, Date range).
  - **Batch Action Floating Toolbar:** Appears when 1+ checkboxes are checked → `[Assign Selected]` `[Export Selected]` `[Mark Status]`.
- **Lead 360° Detail Page (`/leads/:id`):**
  - **Left Sidebar:** Lead identity, phone (with masked/unmasked toggle depending on role), email, source, campaign name, assigned owner, SLA countdown badge.
  - **Center Panel (Activity Stream):** Chronological timeline containing:
    - Call logs with duration badge and audio recording playback.
    - Notes added (Internal vs Public tags).
    - Status changes with previous → new badge indicator.
    - Automated system events (e.g., "Assigned via Round-Robin rule").
  - **Right Panel (Action Deck):**
    - Click-to-call button.
    - Quick Note Form (Markdown-supported).
    - Set Next Follow-up Date & Time Picker with channel selector (Call / WhatsApp).
    - Reassign Lead dropdown with mandatory reason.

---

### SCREEN 5 & 6: Member Management (Matrimony Profiles)
- **Member Directory (`/members`):**
  - Specialized filters for Sindhi community:
    - Subcaste (Amil, Baibhand, Sahiti, Larkana, Shikarpuri, etc.).
    - Manglik status (Yes / No / Don't Know / Anshik).
    - Annual income range & Country/City.
    - Verification state (Verified Blue Tick vs Pending).
- **Member 360° Detail View (`/members/:id`):**
  - **Tab 1: Matrimony Profile:** Photo gallery with moderation indicators, basic details, horoscope upload link, family details, education & career.
  - **Tab 2: Partner Preferences:** Matching criteria configured by candidate.
  - **Tab 3: CRM & Calls:** Linked lead history, support notes, agent interactions.
  - **Tab 4: Subscriptions & Invoices:** Active package, remaining contact views, past transaction invoices.
  - **Tab 5: Audit Log:** Field-by-field diff viewer showing who modified what and when.

---

### SCREEN 7: Verification & Moderation Desk (`/verifications`)
- **Split View Queue:**
  - *Section A: Member Photos Queue:*
    - 4-column card grid showing newly uploaded user photos.
    - Candidate name, age, subcaste, upload timestamp.
    - Actions: `[Approve (Green)]` or `[Reject (Red)]`.
    - Clicking Reject opens `<ReasonModal>` with preset reasons ("Blurry", "Group photo", "Watermark", "Celebrity image").
  - *Section B: KYC Documents Queue (Aadhaar / Passport):*
    - Document image viewer with high-res zoom & pan controls.
    - Compare uploaded document name & DOB against registered profile data side-by-side.
    - Action: `[Verify Profile (Issues Blue Tick)]` or `[Reject with Feedback]`.

---

### SCREEN 8 & 9: Finance, Ledger & Refunds
- **Transaction Ledger (`/finance/transactions`):**
  - TanStack Table displaying: Transaction ID, Member Name, Plan, Amount, Gateway (Razorpay), Gateway Payment ID, Invoice Link.
  - Row click opens `<TransactionDetailDrawer>` showing raw webhook payloads and signature verification logs.
- **Refund Approval Center (`/finance/refunds`):**
  - Two-stage workflow:
    - *Finance Staff View:* Form to submit a refund request with justification and attachment upload.
    - *Finance Manager View:* Queue of pending refund requests with **Approve** and **Reject** buttons.
    - Clicking Approve triggers the backend Razorpay Refund API call and revokes member plan privileges automatically.

---

### SCREEN 10: Campaign & Ad Management (`/campaigns`)
- **Campaign Pipeline:** Kanban board or filtered table (`Review` → `Approved` → `Live` → `Paused` → `Completed`).
- **Campaign Builder Wizard (`/campaigns/new`):**
  - *Step 1:* Advertiser Details & Billing Info.
  - *Step 2:* Creative Upload (Image/Video) with auto-dimension validation check (e.g. 1200x628).
  - *Step 3:* Placement Selector (Home Popup, Search Banner, App Modal).
  - *Step 4:* Targeting Rules (Locations, Login status, Device).
  - *Step 5:* Live Device Preview (Desktop browser preview / Mobile App preview simulator).
- **Live Performance Tab:** Real-time impressions, CTR, CTA conversions, and leads generated.

---

## 10. Forms, Validation & Reason Modals

### 10.1 React Hook Form + Zod Integration Pattern
All forms use declarative Zod schemas to ensure type-safe submissions without manual validations:

```typescript
// src/pages/leads/components/SetFollowupModal.tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const followupSchema = z.object({
  followUpDate: z.string().min(1, 'Date and time is required'),
  channel: z.enum(['CALL', 'WHATSAPP', 'EMAIL', 'CHAT']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  reason: z.string().min(5, 'Please provide context for this follow-up (min 5 chars)'),
});

type FollowupFormValues = z.infer<typeof followupSchema>;
```

### 10.2 Mandatory Reason Modal (`ReasonModal.tsx`)
Crucial requirement from the specifications: **Any sensitive administrative action (suspending members, changing roles, overriding permissions, processing refunds, deleting records) MUST enforce a mandatory written reason.**

```tsx
// src/components/feedback/ReasonModal.tsx
interface ReasonModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  isDestructive?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen, title, description, confirmText = 'Confirm', isDestructive = false, onClose, onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.length < 10) {
      toast.error('A detailed reason (at least 10 characters) is mandatory.');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-neutral-600">{description}</p>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
            Mandatory Justification / Reason *
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this action is being taken (logged in immutable audit)..."
            className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={isDestructive ? 'danger' : 'primary'} type="submit" isLoading={loading}>
            {confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

---

## 11. Data Tables, Filtering & Export Specs

### 11.1 TanStack Table v8 Core Wrapper Features
- **URL Parameter Synchronization:** Page, limit, search query, and active filters are mirrored in `window.location.search`. (Copy-pasting the URL retains the exact table state!).
- **Column Visibility Selector:** Allows CRM agents to show/hide columns (e.g., hide Subcaste or SLA timer when viewing on smaller laptop screens).
- **Sticky Headers & Virtual Scrolling:** Smooth scrolling across large datasets (10,000+ leads) without DOM lag.
- **Bulk Checkbox Selection:** Multi-row selection with indeterminate state header checkbox.

### 11.2 Asynchronous Export Workflow
For large datasets (>1,000 records), the client triggers an async backend job rather than freezing the browser:
```
Client clicks [Export to CSV]
       ↓
POST /api/v1/admin/reports/export { reportType: "LEADS", filters }
       ↓
Backend responds with { jobId: "job_987", status: "QUEUED" }
       ↓
Frontend shows persistent toast: "Generating your export..."
       ↓
Poller checks status every 3 seconds
       ↓
Status = DONE → S3 pre-signed download link received
       ↓
Browser auto-triggers file download + Toast: "Export ready!"
```

---

## 12. Performance, Security & Build Config

### 12.1 Security Standards (Frontend)
- **Token Handling:** Access tokens (15-min expiry) stored in memory / secure state; Refresh tokens stored in `httpOnly` secure cookies.
- **XSS Prevention:** Zero usage of `dangerouslySetInnerHTML`. All user bio strings and chat content sanitized via DOMPurify before rendering.
- **Sensitive Data Masking:** Mobile numbers and email addresses automatically masked (`+91 98****5678`) on the UI for lower-tier roles (`CRM_AGENT`, `ANALYST`).
- **Session Auto-lock:** Detect 15 minutes of inactivity (no mouse/keyboard events) → Prompt for re-authentication or lock screen.

### 12.2 Vite Production Build Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          tables: ['@tanstack/react-table', '@tanstack/react-query'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
```

---

## 🏁 Summary & Developer Handoff

| Artifact | File Path | Focus |
|:---|:---|:---|
| **Frontend Architecture** | [ADMIN_FRONTEND_ARCHITECTURE.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/ADMIN_FRONTEND_ARCHITECTURE.md) | UI/UX, React+Vite, Tailwind, Redux, TanStack, Components |
| **Screen API Mapping** | [ADMIN_SCREENS_API_MAPPING.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/ADMIN_SCREENS_API_MAPPING.md) | 25 Screens, Endpoints, Payloads, Responses, Sockets |
| **Backend & DB Spec** | [ADMIN_COMPLETE_ARCHITECTURE.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/ADMIN_COMPLETE_ARCHITECTURE.md) | Node+Express, 13 Mongoose Models, RBAC, Workflows |

