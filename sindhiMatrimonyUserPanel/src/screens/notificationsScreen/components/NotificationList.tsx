"use client";

import React, { memo, useMemo } from "react";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmptyState } from "./NotificationEmptyState";
import {
  NotificationItem,
  NotificationActionType,
  NotificationCategory,
  NotificationFilter,
} from "../types";

export interface NotificationListProps {
  notifications: NotificationItem[];
  searchQuery: string;
  currentFilter: NotificationFilter;
  activeCategory: NotificationCategory;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onDismiss: (id: string, e: React.MouseEvent) => void;
  onAction: (
    action: NotificationActionType,
    item: NotificationItem,
    e: React.MouseEvent
  ) => void;
  onCardClick?: (item: NotificationItem) => void;
  onResetFilters: () => void;
  className?: string;
}

interface GroupedNotifications {
  label: string;
  items: NotificationItem[];
}

const NotificationListComponent: React.FC<NotificationListProps> = ({
  notifications,
  searchQuery,
  currentFilter,
  activeCategory,
  onToggleRead,
  onDismiss,
  onAction,
  onCardClick,
  onResetFilters,
  className = "",
}) => {
  // Group notifications chronologically by date
  const groupedNotifications: GroupedNotifications[] = useMemo(() => {
    if (notifications.length === 0) return [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

    const todayItems: NotificationItem[] = [];
    const yesterdayItems: NotificationItem[] = [];
    const thisWeekItems: NotificationItem[] = [];
    const olderItems: NotificationItem[] = [];

    notifications.forEach((item) => {
      const itemTime = new Date(item.createdAt).getTime();
      if (itemTime >= todayStart) {
        todayItems.push(item);
      } else if (itemTime >= yesterdayStart) {
        yesterdayItems.push(item);
      } else if (itemTime >= weekStart) {
        thisWeekItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    const groups: GroupedNotifications[] = [];
    if (todayItems.length > 0) groups.push({ label: "Today", items: todayItems });
    if (yesterdayItems.length > 0) groups.push({ label: "Yesterday", items: yesterdayItems });
    if (thisWeekItems.length > 0) groups.push({ label: "Earlier this week", items: thisWeekItems });
    if (olderItems.length > 0) groups.push({ label: "Older", items: olderItems });

    // Fallback if timestamps didn't hit groups
    if (groups.length === 0 && notifications.length > 0) {
      groups.push({ label: "All Notifications", items: notifications });
    }

    return groups;
  }, [notifications]);

  if (notifications.length === 0) {
    return (
      <NotificationEmptyState
        searchQuery={searchQuery}
        currentFilter={currentFilter}
        activeCategory={activeCategory}
        onResetFilters={onResetFilters}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groupedNotifications.map((group) => (
        <section key={group.label} className="space-y-3">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {group.label}
            </h3>
            <span className="text-xs font-medium text-stone-400">
              ({group.items.length})
            </span>
            <div className="flex-1 h-px bg-stone-200/80" />
          </div>

          {/* Cards */}
          <div className="space-y-2.5">
            {group.items.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onToggleRead={onToggleRead}
                onDismiss={onDismiss}
                onAction={onAction}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export const NotificationList = memo(NotificationListComponent);
NotificationList.displayName = "NotificationList";
export default NotificationList;
