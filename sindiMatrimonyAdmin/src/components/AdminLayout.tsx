import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Phone,
  LayoutDashboard,
  Contact2,
  Users,
  ShieldCheck,
  Shield,
  HeartHandshake,
  UserSearch,
  Receipt,
  Settings,
  Wrench,
  Sliders,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Eye,
  Clock,
  HelpCircle,
  Sparkles,
  Award,
  Star,
  ShieldAlert,
  Megaphone,
} from 'lucide-react';
import { crmDataService } from '../services/crmDataService';
import { notificationService } from '../services/notificationService';
import {
  getStoredUser,
  setStoredUser,
  getSimulatedUser,
  clearSimulatedUser,
  getActiveRole,
  setActiveRole,
} from '../storage';
import { FloatingCallWidget } from './FloatingCallWidget';
import { PerformanceMonitorWidget } from './PerformanceMonitorWidget';
import { IMAGES } from './image';
import { memoWithDeepEqual } from '../utils/memoUtils';
import { CustomTextInput } from './CustomTextInput';
import { CustomDropDown } from './CustomDropDown';
import { canAccessRoute, ALL_ROLES, ROLE_DEFINITIONS, getDefaultAllowedSectionsForRole } from '../utils/rbac';
import type { Role } from '../types/auth.types';
import { useGlobalModal } from '../customModals/ModalContext';
import {
  type NavItemDef,
  isNavItemActive,
  isSubItemActive,
  getRouteNavigationInfo,
} from '../utils/navigationUtils';

// Local prefetch helper to avoid circular dependency with routes/screenConfig
const prefetchScreens = () => {
  if (typeof window === 'undefined') return;
  setTimeout(() => {
    import('../screens/dashboardScreen/DashboardScreen');
    import('../screens/leadsScreen/LeadsScreen');
    import('../screens/membersScreen/MembersScreen');
    import('../screens/verificationScreen/VerificationScreen');
    import('../screens/financeScreen/FinanceScreen');
    import('../screens/employeeScreen/EmployeeScreen');
    import('../screens/settingsScreen/SettingsScreen');
    import('../screens/notificationsScreen/NotificationsScreen');
    import('../screens/helpSupportScreen/HelpSupportScreen');
    import('../screens/horoscopeScreen/HoroscopeScreen');
    import('../screens/successStoriesScreen/SuccessStoriesScreen');
    import('../screens/reviewsScreen/ReviewsScreen');
    import('../screens/safetyScreen/SafetyScreen');
    import('../screens/campaignsScreen/CampaignsScreen');
  }, 100);
};

// Static Navigation Items hoisted to module scope to guarantee stable memory references across renders
export const ALL_NAV_ITEMS: NavItemDef[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'CRM Leads', path: '/leads', icon: Contact2 },
  { name: 'Team Chat', path: '/chat', icon: MessageSquare },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Employees & Access', path: '/employees', icon: ShieldCheck },
  { name: 'Assisted Matchmaking', path: '/matchmaking', icon: HeartHandshake },
  { name: 'Match Responses', path: '/match-responses', icon: HeartHandshake },
  { name: 'Horoscope & Kundli', path: '/horoscope', icon: Sparkles },
  { name: 'Success Stories', path: '/success-stories', icon: Award },
  { name: 'Reviews & Ratings', path: '/reviews', icon: Star },
  { name: 'Trust & Safety', path: '/safety', icon: ShieldAlert },
  { name: 'Tasks & Follow-ups', path: '/tasks', icon: Clock },
  { name: 'Member Search', path: '/members/search', icon: UserSearch },
  { name: 'Payment Report', path: '/finance', icon: Receipt },
  {
    name: 'Marketing & Engagement',
    icon: Megaphone,
    path: '/campaigns',
    subItems: [
      { name: 'Ads & Partner Deals', path: '/campaigns/ads' },
      { name: 'Notification Management', path: '/campaigns/notifications' },
      { name: 'Festival & Offer Management', path: '/campaigns/offers' },
      { name: 'Popup Management', path: '/campaigns/popups' },
      { name: 'Delivery Logs', path: '/campaigns/logs' },
      { name: 'Campaign Analytics', path: '/campaigns/analytics' },
    ],
  },
  {
    name: 'Members',
    icon: Users,
    path: '/members',
    subItems: [
      { name: 'All Members', path: '/members' },
      { name: 'Paid Members', path: '/members/paid' },
      { name: 'Inactive Members', path: '/members/inactive' },
      { name: 'Add Member', path: '/members/add' },
      { name: 'Male Profiles', path: '/members?gender=male' },
      { name: 'Female Profiles', path: '/members?gender=female' },
    ],
  },
  { name: 'Verification Desk', path: '/verifications', icon: ShieldCheck },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
    subItems: [
      { name: 'Membership Plan', path: '/settings/membership-plans' },
      { name: 'Admin Config', path: '/settings?tab=admin_config' },
      { name: 'Change Password', path: '/settings/password' },
      { name: 'Subcaste & Gotra', path: '/settings/gotras' },
    ],
  },
  { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
  { name: 'Admin Tools', path: '/tools', icon: Wrench },
  { name: 'Master Settings', path: '/master-settings', icon: Sliders },
];

export const AdminLayout: React.FC = memoWithDeepEqual(() => {
  const { openUserProfile, openLogoutModal } = useGlobalModal();
  const [headerSearch, setHeaderSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile closed by default
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeCall, setActiveCall] = useState<{ active: boolean; name: string } | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Members: false,
    Settings: false,
    'Marketing & Engagement': false,
  });

  // Prefetch all admin screens on mount so subsequent route loads are instant
  useEffect(() => {
    prefetchScreens();
  }, []);

  const storedUser = useMemo(() => getStoredUser() || { fullName: 'Super Admin', role: 'SUPER_ADMIN' }, []);
  const simulatedUser = getSimulatedUser();
  const effectiveUser = simulatedUser || storedUser;
  const [activeRoleOverride, setActiveRoleOverride] = useState<string | null>(getActiveRole());
  const effectiveRole = (activeRoleOverride || effectiveUser.role || 'SUPER_ADMIN') as Role;

  const [unreadChatCount, setUnreadChatCount] = useState<number>(() =>
    crmDataService.getUnreadMessageCount(effectiveUser.id || 'emp_001')
  );

  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(() =>
    notificationService.getUnreadCount()
  );

  const [pendingStoriesCount, setPendingStoriesCount] = useState<number>(() =>
    crmDataService.getPendingSuccessStoriesCount()
  );
  const [pendingReviewsCount, setPendingReviewsCount] = useState<number>(() =>
    crmDataService.getPendingReviewsCount()
  );

  useEffect(() => {
    const unsub = crmDataService.subscribe(() => {
      setUnreadChatCount(crmDataService.getUnreadMessageCount(effectiveUser.id || 'emp_001'));
      setPendingStoriesCount(crmDataService.getPendingSuccessStoriesCount());
      setPendingReviewsCount(crmDataService.getPendingReviewsCount());
    });
    return unsub;
  }, [effectiveUser.id]);

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setUnreadNotificationCount(notificationService.getUnreadCount());
    });
    return unsub;
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    openLogoutModal();
  };

  const handleExitSimulation = () => {
    clearSimulatedUser();
    setActiveRole(null);
    window.location.reload();
  };

  const handleRoleChange = (newRole: string) => {
    setActiveRoleOverride(newRole);
    setActiveRole(newRole);
    const curUser = getStoredUser();
    if (curUser) {
      curUser.role = newRole;
      curUser.allowedSections = getDefaultAllowedSectionsForRole(newRole as Role);
      setStoredUser(curUser);
    }
    window.location.reload();
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) => {
      const isCurrentlyOpen = prev[menuName] ?? false;
      return { ...prev, [menuName]: !isCurrentlyOpen };
    });
  };

  // Dynamic route information for header breadcrumbs & active title
  const routeInfo = useMemo(() => {
    return getRouteNavigationInfo(ALL_NAV_ITEMS, location.pathname, location.search);
  }, [location.pathname, location.search]);

  // Automatically expand parent submenu if current route is within it
  useEffect(() => {
    ALL_NAV_ITEMS.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        if (isNavItemActive(item, location.pathname, location.search)) {
          setOpenSubmenus((prev) => {
            if (prev[item.name]) return prev;
            return { ...prev, [item.name]: true };
          });
        }
      }
    });
  }, [location.pathname, location.search]);

  // Allowed sidebar sections configured for this employee
  const userAllowedSections = effectiveUser.allowedSections;

  // RBAC & Section Filtered Navigation Items according to active role and user's allowedSections
  const navItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => {
      // If item has sub-items, check if any sub-item is accessible
      if (item.subItems && item.subItems.length > 0) {
        return item.subItems.some((sub) =>
          canAccessRoute(effectiveRole, sub.path, userAllowedSections)
        );
      }
      // If item has a path, check access
      if (item.path && !canAccessRoute(effectiveRole, item.path, userAllowedSections)) {
        return false;
      }
      return true;
    });
  }, [effectiveRole, userAllowedSections]);

  // Gracefully redirect employee if landing on "/" but Dashboard is not an allowed section
  useEffect(() => {
    if (location.pathname === '/') {
      const canAccessRoot = canAccessRoute(effectiveRole, '/', userAllowedSections);
      if (!canAccessRoot && navItems.length > 0) {
        const firstAllowed = navItems[0].path || (navItems[0].subItems && navItems[0].subItems[0]?.path);
        if (firstAllowed && firstAllowed !== '/') {
          navigate(firstAllowed, { replace: true });
        }
      }
    }
  }, [location.pathname, effectiveRole, userAllowedSections, navItems, navigate]);

  return (
    <div
      style={
        {
          '--admin-sidebar-width': isDesktopCollapsed ? '5rem' : '16rem',
        } as React.CSSProperties
      }
      className="min-h-screen bg-slate-50 flex flex-col relative"
    >
      {/* Simulation Top Bar (Active when impersonating or in preview mode) */}
      {simulatedUser && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between sticky top-0 z-60 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
            <span>
              Simulating Access for: <strong>{simulatedUser.fullName}</strong> ({simulatedUser.employeeId}) — Role:{' '}
              <span className="font-mono uppercase bg-black/20 px-1.5 py-0.5 rounded">
                {simulatedUser.role}
              </span>
              {simulatedUser.allowedSections && (
                <span className="ml-2 bg-black/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] font-bold">
                  {simulatedUser.allowedSections.length} Sections Granted
                </span>
              )}
            </span>
          </div>
          <button
            onClick={handleExitSimulation}
            className="px-2.5 py-1 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100 transition shadow-xs cursor-pointer"
          >
            Exit Simulation
          </button>
        </div>
      )}

      <div className="flex-1 flex relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-45 bg-slate-950/60 backdrop-blur-2xs md:hidden"
          />
        )}

        {/* ================= SIDEBAR (Royal Ruby Crimson Theme) ================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#88131B] via-[#7F1D1D] to-[#550A0F] text-white transition-all duration-300 flex flex-col shadow-2xl border-r border-red-900/50
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
            ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'}
          `}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 bg-black/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0">
                <img
                  src={IMAGES.logo}
                  alt="Sindhi Matrimony"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
              {(!isDesktopCollapsed || sidebarOpen) && (
                <div className="truncate">
                  <span className="font-extrabold text-sm tracking-wide text-white block leading-tight">
                    Sindhi Matrimony
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop collapse chevron or Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSub = Boolean(item.subItems && item.subItems.length > 0);
              const isActive = isNavItemActive(item, location.pathname, location.search);
              const isSubOpen = openSubmenus[item.name] ?? isActive;

              if (hasSub) {
                // Filter accessible sub-items
                const allowedSubItems = (item.subItems || []).filter((sub) =>
                  canAccessRoute(effectiveRole, sub.path, userAllowedSections)
                );

                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white/20 text-white font-bold ring-1 ring-white/25 shadow-xs'
                          : isSubOpen
                          ? 'bg-white/10 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-amber-300' : 'text-white/90'
                          }`}
                        />
                        {(!isDesktopCollapsed || sidebarOpen) && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </div>
                      {(!isDesktopCollapsed || sidebarOpen) && (
                        <span className="shrink-0 text-white/70">
                          {isSubOpen ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Submenu List */}
                    {isSubOpen && (!isDesktopCollapsed || sidebarOpen) && (
                      <div className="pl-9 pr-2 py-1 space-y-1 bg-black/15 rounded-xl">
                        {allowedSubItems.map((sub) => {
                          const isSubActive = isSubItemActive(
                            sub.path,
                            location.pathname,
                            location.search,
                            allowedSubItems
                          );
                          return (
                            <NavLink
                              key={sub.name}
                              to={sub.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`block py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition ${
                                isSubActive
                                  ? 'bg-white text-[#DB2F3C] font-bold shadow-xs'
                                  : 'text-white/70 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {sub.name}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.path || '#'}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#DB2F3C] font-extrabold shadow-lg shadow-black/10'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#DB2F3C]' : 'text-white/80'
                    }`}
                  />
                  {(!isDesktopCollapsed || sidebarOpen) && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {item.path === '/chat' && unreadChatCount > 0 && (!isDesktopCollapsed || sidebarOpen) && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-xs">
                      {unreadChatCount}
                    </span>
                  )}
                  {item.path === '/notifications' && unreadNotificationCount > 0 && (!isDesktopCollapsed || sidebarOpen) && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#DB2F3C] text-white shadow-xs">
                      {unreadNotificationCount}
                    </span>
                  )}
                  {item.path === '/success-stories' && pendingStoriesCount > 0 && (!isDesktopCollapsed || sidebarOpen) && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-xs" title={`${pendingStoriesCount} stories pending approval`}>
                      {pendingStoriesCount} new
                    </span>
                  )}
                  {item.path === '/reviews' && pendingReviewsCount > 0 && (!isDesktopCollapsed || sidebarOpen) && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-xs" title={`${pendingReviewsCount} reviews pending moderation`}>
                      {pendingReviewsCount} new
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* User Footer */}
          {(!isDesktopCollapsed || sidebarOpen) && (
            <div className="p-3.5 border-t border-white/10 bg-black/20 flex items-center justify-between">
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-white truncate">
                  {effectiveUser.fullName}
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-medium uppercase truncate">
                  {ROLE_DEFINITIONS[effectiveRole]?.label || effectiveRole}
                </div>
                {userAllowedSections && effectiveRole !== 'SUPER_ADMIN' && (
                  <div className="text-[9px] text-white/70 font-sans mt-0.5">
                    {userAllowedSections.length} Sections Accessible
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-xl shrink-0 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>

        {/* ================= MAIN CONTENT SHELL ================= */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isDesktopCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          {/* Responsive Header */}
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                className="hidden md:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Dynamic Breadcrumbs & Active Tab Title */}
              <div className="flex items-center gap-2 min-w-0">
                {routeInfo.parentTitle ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold truncate">
                    <span className="text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">
                      {routeInfo.parentTitle}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                      {routeInfo.activeTitle}
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                      {routeInfo.activeTitle}
                    </h1>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                      Live CRM
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Icons & Role Preview Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Input */}
              <div className="hidden md:block w-48 lg:w-64">
                <CustomTextInput
                  size="sm"
                  leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && headerSearch.trim()) {
                      openUserProfile(headerSearch.trim());
                      setHeaderSearch('');
                    }
                  }}
                  placeholder="Search User ID / Name (Enter)..."
                  title="Type User ID or Member Name and press Enter to view complete profile"
                  clearable
                  onClear={() => setHeaderSearch('')}
                />
              </div>

              {/* Live Role Switcher (RBAC Tester) */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-600 hidden sm:inline">
                  RBAC Role:
                </span>
                <div className="w-36 sm:w-52">
                  <CustomDropDown
                    size="sm"
                    icon={<Shield className="w-3.5 h-3.5 text-amber-600" />}
                    value={effectiveRole}
                    onChange={(val) => handleRoleChange(String(val))}
                    options={[
                      { label: '👑 Super Admin (Full Access)', value: 'SUPER_ADMIN' },
                      { label: '👤 CRM Employee (Assigned Leads Only)', value: 'EMPLOYEE' },
                      ...ALL_ROLES.filter((r) => r !== 'SUPER_ADMIN' && r !== 'EMPLOYEE').map((r) => ({
                        label: ROLE_DEFINITIONS[r]?.label || r,
                        value: r,
                      })),
                    ]}
                  />
                </div>
              </div>

              {/* Quick Staff Chat Button */}
              <button
                onClick={() => navigate('/chat')}
                title="Staff & Team Chat"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#88131B]" />
                {unreadChatCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DB2F3C] rounded-full border border-white" />
                )}
              </button>

              {/* Simulate VoIP Call */}
              <button
                onClick={() =>
                  setActiveCall({ active: true, name: 'Sanjay Chawla (+91 98****8901)' })
                }
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">Simulate Call</span>
              </button>

              <button
                onClick={() => navigate('/notifications')}
                title="View Notifications & System Alerts"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Profile Avatar */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                <img
                  src={IMAGES.userAvatar}
                  alt={effectiveUser.fullName}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </header>

          {/* Page Content Body */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 min-w-0 overflow-y-auto relative">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Floating VoIP Call Widget */}
      {activeCall && (
        <FloatingCallWidget
          leadName={activeCall.name}
          onEndCall={() => setActiveCall(null)}
        />
      )}

      {/* Floating Real-time Performance & Re-render Monitor */}
      <PerformanceMonitorWidget />
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';
export default AdminLayout;
