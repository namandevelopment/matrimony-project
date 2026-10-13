import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { CustomTextInput } from '../../../components/CustomTextInput';
import type { NotificationCategory } from '../../../services/notificationService';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface NotificationTabCounts {
  total: number;
  unread: number;
  lead: number;
  payment: number;
  system: number;
  security: number;
}

export interface NotificationFilterBarProps {
  activeTab: 'ALL' | 'UNREAD' | NotificationCategory;
  onTabChange: (tab: 'ALL' | 'UNREAD' | NotificationCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: NotificationTabCounts;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = memoWithDeepEqual(
  ({ activeTab, onTabChange, searchQuery, onSearchChange, counts }) => {
    // Memoized static tab configuration populated from counts prop
    const tabs = useMemo(
      () => [
        { id: 'ALL' as const, label: 'All Alerts', count: counts.total },
        { id: 'UNREAD' as const, label: 'Unread', count: counts.unread },
        { id: 'LEAD' as const, label: 'CRM & Leads', count: counts.lead },
        { id: 'PAYMENT' as const, label: 'Payments', count: counts.payment },
        { id: 'SYSTEM' as const, label: 'System & KYC', count: counts.system },
        { id: 'SECURITY' as const, label: 'Security', count: counts.security },
      ],
      [counts]
    );

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Scrollable Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#88131B] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="w-full sm:w-64">
            <CustomTextInput
              size="sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search alerts..."
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              clearable
              onClear={() => onSearchChange('')}
            />
          </div>
        </div>
      </div>
    );
  }
);

NotificationFilterBar.displayName = 'NotificationFilterBar';
