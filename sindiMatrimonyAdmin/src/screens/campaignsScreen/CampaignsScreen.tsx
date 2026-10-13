import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Gift,
  Sparkles,
  ListOrdered,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { NotificationManagementSection } from './sections/NotificationManagementSection';
import { FestivalOffersSection } from './sections/FestivalOffersSection';
import { PopupManagementSection } from './sections/PopupManagementSection';
import { DeliveryLogsSection } from './sections/DeliveryLogsSection';
import { CampaignAnalyticsSection } from './sections/CampaignAnalyticsSection';
import { MarketingAuditLogModal } from './components/MarketingAuditLogModal';
import { campaignService } from '../../services/campaignService';
import { memoWithDeepEqual } from '../../utils/memoUtils';

export type CampaignTab =
  | 'NOTIFICATIONS'
  | 'FESTIVAL_OFFERS'
  | 'POPUPS'
  | 'DELIVERY_LOGS'
  | 'ANALYTICS';

interface TabItem {
  id: CampaignTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  routePath: string;
}

export function resolveCampaignTab(pathname: string, search: string): CampaignTab {
  const cleanPath = (pathname || '').toLowerCase();
  const searchParams = new URLSearchParams(search || '');
  const tabParam = searchParams.get('tab')?.toUpperCase();

  // 1. Explicit query parameter
  if (
    tabParam === 'NOTIFICATIONS' ||
    tabParam === 'FESTIVAL_OFFERS' ||
    tabParam === 'OFFERS' ||
    tabParam === 'POPUPS' ||
    tabParam === 'DELIVERY_LOGS' ||
    tabParam === 'LOGS' ||
    tabParam === 'ANALYTICS'
  ) {
    if (tabParam === 'OFFERS') return 'FESTIVAL_OFFERS';
    if (tabParam === 'LOGS') return 'DELIVERY_LOGS';
    return tabParam as CampaignTab;
  }

  // 2. Canonical route pathnames
  if (cleanPath.includes('/notifications')) return 'NOTIFICATIONS';
  if (cleanPath.includes('/offers')) return 'FESTIVAL_OFFERS';
  if (cleanPath.includes('/popups')) return 'POPUPS';
  if (cleanPath.includes('/logs')) return 'DELIVERY_LOGS';
  if (cleanPath.includes('/analytics')) return 'ANALYTICS';

  // 3. Default fallback
  return 'NOTIFICATIONS';
}

export const CampaignsScreen: React.FC = memoWithDeepEqual(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<CampaignTab>(() =>
    resolveCampaignTab(location.pathname, location.search)
  );

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  // Subscribe to campaign updates
  useEffect(() => {
    const unsub = campaignService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Sync state if URL changes externally
  useEffect(() => {
    const resolved = resolveCampaignTab(location.pathname, location.search);
    if (resolved !== activeTab) {
      setActiveTab(resolved);
    }
  }, [location.pathname, location.search, activeTab]);

  const summary = useMemo(() => {
    return campaignService.getAnalyticsSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 'NOTIFICATIONS',
        label: 'Notification Management',
        icon: Bell,
        badge: summary.totalCampaigns,
        routePath: '/campaigns/notifications',
      },
      {
        id: 'FESTIVAL_OFFERS',
        label: 'Festival & Offer Management',
        icon: Gift,
        badge: summary.activeOffersCount > 0 ? `${summary.activeOffersCount} Active` : undefined,
        routePath: '/campaigns/offers',
      },
      {
        id: 'POPUPS',
        label: 'Popup Management',
        icon: Sparkles,
        badge: summary.activePopupsCount > 0 ? `${summary.activePopupsCount} Active` : undefined,
        routePath: '/campaigns/popups',
      },
      {
        id: 'DELIVERY_LOGS',
        label: 'Delivery Logs',
        icon: ListOrdered,
        routePath: '/campaigns/logs',
      },
      {
        id: 'ANALYTICS',
        label: 'Campaign Analytics',
        icon: TrendingUp,
        routePath: '/campaigns/analytics',
      },
    ],
    [summary]
  );

  const handleTabChange = useCallback(
    (tabId: CampaignTab) => {
      setActiveTab(tabId);
      const target = tabs.find((t) => t.id === tabId);
      if (target) {
        navigate(target.routePath);
      }
    },
    [navigate, tabs]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-[#991B1B] border border-rose-200 uppercase tracking-wider">
              Marketing &amp; Engagement
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Automated Dispatch Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Marketing &amp; Engagement Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-channel notifications, festival discounts, dynamic in-app popups &amp; delivery logs
          </p>
        </div>

        {/* Audit Trail Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 transition shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Marketing Audit Trail</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] text-white shadow-md shadow-rose-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
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

      {/* 3. Tab Section Content */}
      <div className="transition-all duration-200">
        {activeTab === 'NOTIFICATIONS' && <NotificationManagementSection />}
        {activeTab === 'FESTIVAL_OFFERS' && <FestivalOffersSection />}
        {activeTab === 'POPUPS' && <PopupManagementSection />}
        {activeTab === 'DELIVERY_LOGS' && <DeliveryLogsSection />}
        {activeTab === 'ANALYTICS' && <CampaignAnalyticsSection />}
      </div>

      {/* Audit Log Modal */}
      <MarketingAuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
});

CampaignsScreen.displayName = 'CampaignsScreen';
export default CampaignsScreen;
