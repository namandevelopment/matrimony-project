import React, { memo } from 'react';
import {
  Bell,
  Contact2,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  HeartHandshake,
  Clock,
  ArrowRight,
  Check,
  Trash2,
} from 'lucide-react';
import type {
  AppNotification,
  NotificationCategory,
  NotificationPriority,
} from '../../../services/notificationService';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface NotificationCardItemProps {
  item: AppNotification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (link: string) => void;
}

// Static category icon lookup to prevent dynamic JSX recreations
const CategoryIcon: React.FC<{ category: NotificationCategory }> = memo(({ category }) => {
  switch (category) {
    case 'LEAD':
      return <Contact2 className="w-5 h-5 text-amber-600" />;
    case 'PAYMENT':
      return <Receipt className="w-5 h-5 text-emerald-600" />;
    case 'SYSTEM':
      return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    case 'SECURITY':
      return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    case 'MATCH':
      return <HeartHandshake className="w-5 h-5 text-pink-600" />;
    default:
      return <Bell className="w-5 h-5 text-slate-600" />;
  }
});
CategoryIcon.displayName = 'CategoryIcon';

// Static priority badge lookup
const PriorityBadge: React.FC<{ priority: NotificationPriority }> = memo(({ priority }) => {
  switch (priority) {
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          URGENT SLA
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          HIGH PRIORITY
        </span>
      );
    case 'NORMAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          NORMAL
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
          INFO
        </span>
      );
  }
});
PriorityBadge.displayName = 'PriorityBadge';

export const NotificationCardItem: React.FC<NotificationCardItemProps> = memoWithDeepEqual(
  ({ item, onMarkAsRead, onMarkAsUnread, onDelete, onNavigate }) => {
    return (
      <div
        className={`bg-white rounded-2xl border transition-all p-4 shadow-2xs hover:shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          !item.isRead
            ? 'border-l-4 border-l-[#DB2F3C] border-slate-200/90 bg-rose-50/15'
            : 'border-slate-200/80 opacity-90'
        }`}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Category Icon */}
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <CategoryIcon category={item.category} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                {item.title}
              </h4>
              <PriorityBadge priority={item.priority} />
              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.message}
            </p>

            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.timeAgo}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-500 uppercase text-[10px]">
                {item.category}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
          {item.link && (
            <button
              onClick={() => onNavigate(item.link!)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#88131B] text-white hover:bg-[#6c0f15] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <span>{item.actionLabel || 'View Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {item.isRead ? (
            <button
              onClick={() => onMarkAsUnread(item.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Mark as unread"
            >
              <Check className="w-4 h-4 text-emerald-600" />
            </button>
          ) : (
            <button
              onClick={() => onMarkAsRead(item.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

NotificationCardItem.displayName = 'NotificationCardItem';
