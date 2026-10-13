import React, { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  KeyRound,
  Sliders,
  ShieldCheck,
  Settings,
  GitBranch,
} from 'lucide-react';
import { MembershipPlansSection } from './components/membershipPlans';
import { AdminConfigSection } from './components/AdminConfigSection';
import { ChangePasswordScreen } from './ChangePasswordScreen';
import { SubcasteGotraSection } from './components/SubcasteGotraSection';
import { getStoredUser, getSimulatedUser, getActiveRole } from '../../storage';
import { canAccessRoute } from '../../utils/rbac';

export type SettingsTab = 'membership_plans' | 'password' | 'admin_config' | 'gotras';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  routePath: string;
}

/**
 * Pure helper function to resolve the active settings tab from current location.
 * Explicit query parameters take precedence, followed by canonical route pathnames.
 */
export function resolveSettingsTab(pathname: string, search: string): SettingsTab {
  const cleanPath = (pathname || '').toLowerCase();
  const searchParams = new URLSearchParams(search || '');
  const tabParam = searchParams.get('tab')?.toLowerCase();

  // 1. Explicit query param takes top priority
  if (tabParam === 'password') return 'password';
  if (tabParam === 'admin_config' || tabParam === 'config') return 'admin_config';
  if (tabParam === 'membership_plans' || tabParam === 'plans' || tabParam === 'membership') return 'membership_plans';
  if (tabParam === 'gotras' || tabParam === 'gotra' || tabParam === 'subcaste' || tabParam === 'subcastes') return 'gotras';

  // 2. Canonical pathname matching
  if (cleanPath.includes('/password')) return 'password';
  if (cleanPath.includes('/membership-plans') || cleanPath.includes('/plans')) return 'membership_plans';
  if (cleanPath.includes('/admin-config') || cleanPath.includes('/config')) return 'admin_config';
  if (cleanPath.includes('/gotras') || cleanPath.includes('/subcaste')) return 'gotras';

  // 3. Default fallback
  return 'membership_plans';
}

// Memoized section components to eliminate child re-renders on tab toggle
const MemoizedMembershipPlans = React.memo(MembershipPlansSection);
const MemoizedChangePassword = React.memo(ChangePasswordScreen);
const MemoizedAdminConfig = React.memo(AdminConfigSection);
const MemoizedSubcasteGotra = React.memo(SubcasteGotraSection);

export const SettingsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine effective RBAC role
  const user = getSimulatedUser() || getStoredUser() || { role: 'SUPER_ADMIN' };
  const effectiveRole = getActiveRole() || user.role || 'SUPER_ADMIN';

  const canAccessPlans = canAccessRoute(effectiveRole, '/settings/membership-plans');
  const canAccessPassword = canAccessRoute(effectiveRole, '/settings/password');
  const canAccessConfig = canAccessRoute(effectiveRole, '/settings');
  const canAccessGotras = canAccessRoute(effectiveRole, '/settings/gotras');

  // Master tab configuration
  const allTabs: TabItem[] = useMemo(
    () => [
      {
        id: 'membership_plans',
        label: 'Membership Plans',
        icon: CreditCard,
        description: 'Pricing tiers, quotas & matchmaking packages',
        badge: 'Tiers',
        routePath: '/settings/membership-plans',
      },
      {
        id: 'password',
        label: 'Change Password',
        icon: KeyRound,
        description: 'Update admin credentials & MFA preferences',
        badge: 'Security',
        routePath: '/settings/password',
      },
      {
        id: 'admin_config',
        label: 'Admin Config',
        icon: Sliders,
        description: 'System policies, helpline & verification rules',
        badge: 'Portal',
        routePath: '/settings?tab=admin_config',
      },
      {
        id: 'gotras',
        label: 'Subcaste & Gotra',
        icon: GitBranch,
        description: 'Vedic gotra exogamy rules, Sindhi subcastes & surname directory',
        badge: 'Heritage',
        routePath: '/settings/gotras',
      },
    ],
    []
  );

  // Filter tabs by RBAC clearance
  const visibleTabs = useMemo(() => {
    return allTabs.filter((tab) => {
      if (tab.id === 'membership_plans') return canAccessPlans;
      if (tab.id === 'password') return canAccessPassword;
      if (tab.id === 'admin_config') return canAccessConfig;
      if (tab.id === 'gotras') return canAccessGotras;
      return true;
    });
  }, [allTabs, canAccessPlans, canAccessPassword, canAccessConfig, canAccessGotras]);

  // Derive active tab directly from URL without state de-sync or bounce-back glitch
  const activeTab: SettingsTab = useMemo(() => {
    const resolved = resolveSettingsTab(location.pathname, location.search);
    const isVisible = visibleTabs.some((t) => t.id === resolved);
    if (!isVisible && visibleTabs.length > 0) {
      return visibleTabs[0].id;
    }
    return resolved;
  }, [location.pathname, location.search, visibleTabs]);

  // Handle immediate tab navigation with no lag or double-render
  const handleTabChange = useCallback(
    (tabId: SettingsTab) => {
      const selected = allTabs.find((t) => t.id === tabId);
      if (!selected) return;

      const currentRoute = location.pathname + location.search;
      if (currentRoute === selected.routePath) return;

      navigate(selected.routePath);
    },
    [allTabs, location.pathname, location.search, navigate]
  );

  // Find active tab info for display
  const currentTabMeta = useMemo(() => {
    return allTabs.find((t) => t.id === activeTab) || allTabs[0];
  }, [allTabs, activeTab]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation Hub */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#88131B] via-[#C81E28] to-[#DB2F3C] flex items-center justify-center text-white shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Settings & Administration
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldCheck className="w-3 h-3 text-[#C81E28]" />
                  RBAC Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTabMeta.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div
          role="tablist"
          aria-label="Settings navigation tabs"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1 bg-slate-50/80 rounded-2xl border border-slate-200/60"
        >
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer select-none active:scale-[0.98] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C81E28] to-[#B91C1C] text-white shadow-md shadow-red-950/20 ring-1 ring-red-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-white scale-110' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels - Rendered with O(1) visibility toggle to prevent DOM remount latency */}
      <div className="relative">
        {canAccessPlans && (
          <div
            role="tabpanel"
            id="panel-membership_plans"
            aria-labelledby="tab-membership_plans"
            className={activeTab === 'membership_plans' ? 'block animate-in fade-in duration-150' : 'hidden'}
          >
            <MemoizedMembershipPlans />
          </div>
        )}

        {canAccessPassword && (
          <div
            role="tabpanel"
            id="panel-password"
            aria-labelledby="tab-password"
            className={activeTab === 'password' ? 'block animate-in fade-in duration-150' : 'hidden'}
          >
            <MemoizedChangePassword />
          </div>
        )}

        {canAccessConfig && (
          <div
            role="tabpanel"
            id="panel-admin_config"
            aria-labelledby="tab-admin_config"
            className={activeTab === 'admin_config' ? 'block animate-in fade-in duration-150' : 'hidden'}
          >
            <MemoizedAdminConfig />
          </div>
        )}

        {canAccessGotras && (
          <div
            role="tabpanel"
            id="panel-gotras"
            aria-labelledby="tab-gotras"
            className={activeTab === 'gotras' ? 'block animate-in fade-in duration-150' : 'hidden'}
          >
            <MemoizedSubcasteGotra />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
