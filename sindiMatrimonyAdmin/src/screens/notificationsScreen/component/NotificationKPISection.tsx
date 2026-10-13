import React from 'react';
import { Bell } from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface NotificationKPISectionProps {
  totalCount: number;
  unreadCount: number;
  urgentCount: number;
  archivedCount: number;
}

export const NotificationKPISection: React.FC<NotificationKPISectionProps> = memoWithDeepEqual(
  ({ totalCount, unreadCount, urgentCount, archivedCount }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Total Alerts
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Bell className="w-3 h-3 text-slate-400" /> Across all categories
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Unread Alerts
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {unreadCount}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-1 font-medium">
            Requires staff attention
          </div>
        </div>

        {/* Urgent SLA */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Urgent SLA
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {urgentCount}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1 font-medium">
            Customer follow-ups
          </div>
        </div>

        {/* Read & Archive */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Read & Archive
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {archivedCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1 font-medium">
            Processed notifications
          </div>
        </div>
      </div>
    );
  }
);

NotificationKPISection.displayName = 'NotificationKPISection';
