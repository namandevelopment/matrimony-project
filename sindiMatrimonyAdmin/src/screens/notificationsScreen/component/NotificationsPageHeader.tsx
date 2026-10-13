import React from 'react';
import { CheckCheck, Trash2, Sparkles } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface NotificationsPageHeaderProps {
  unreadCount: number;
  hasNotifications: boolean;
  onSimulateNewAlert: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsPageHeader: React.FC<NotificationsPageHeaderProps> = memoWithDeepEqual(
  ({
    unreadCount,
    hasNotifications,
    onSimulateNewAlert,
    onMarkAllAsRead,
    onClearAll,
  }) => {
    return (
      <PageHeader
        title="Notifications & Alerts"
        description="Real-time portal updates, CRM lead escalations, payment events, and security audits"
        badge={
          unreadCount > 0 ? (
            <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              {unreadCount} Unread
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              All Caught Up
            </span>
          )
        }
        actions={
          <>
            <button
              onClick={onSimulateNewAlert}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Generate a simulated test notification"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Simulate Test Alert
            </button>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                Mark All as Read
              </button>
            )}
            {hasNotifications && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Clear All
              </button>
            )}
          </>
        }
      />
    );
  }
);

NotificationsPageHeader.displayName = 'NotificationsPageHeader';
