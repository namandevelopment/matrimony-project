import React from 'react';
import { Inbox } from 'lucide-react';
import type { AppNotification } from '../../../services/notificationService';
import { memoWithDeepEqual } from '../../../utils/memoUtils';
import { NotificationCardItem } from './NotificationCardItem';

export interface NotificationListSectionProps {
  notifications: AppNotification[];
  searchQuery: string;
  onClearSearch: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (link: string) => void;
}

export const NotificationListSection: React.FC<NotificationListSectionProps> = memoWithDeepEqual(
  ({
    notifications,
    searchQuery,
    onClearSearch,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
    onNavigate,
  }) => {
    if (notifications.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No notifications found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No alerts matching "${searchQuery}". Try searching with different keywords.`
              : 'You have no alerts in this category right now.'}
          </p>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-[#88131B] bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((item) => (
          <NotificationCardItem
            key={item.id}
            item={item}
            onMarkAsRead={onMarkAsRead}
            onMarkAsUnread={onMarkAsUnread}
            onDelete={onDelete}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }
);

NotificationListSection.displayName = 'NotificationListSection';
