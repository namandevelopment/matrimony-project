"use client";

import React, { memo, useCallback } from "react";
import { Heart, Users, MessageSquare, Bell, ShieldCheck } from "lucide-react";
import { NotificationCategory } from "../types";

export interface CategoryTabItem {
  id: NotificationCategory;
  label: string;
  count: number;
  unreadCount: number;
  icon: React.ReactNode;
}

export interface NotificationCategoryTabsProps {
  activeCategory: NotificationCategory;
  onSelectCategory: (category: NotificationCategory) => void;
  categoryCounts: Record<NotificationCategory, { total: number; unread: number }>;
  className?: string;
}

const NotificationCategoryTabsComponent: React.FC<NotificationCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  className = "",
}) => {
  const tabs: CategoryTabItem[] = [
    {
      id: "all",
      label: "All",
      count: categoryCounts.all?.total || 0,
      unreadCount: categoryCounts.all?.unread || 0,
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "interests",
      label: "Interests & Requests",
      count: categoryCounts.interests?.total || 0,
      unreadCount: categoryCounts.interests?.unread || 0,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: "matches",
      label: "Matches & Views",
      count: categoryCounts.matches?.total || 0,
      unreadCount: categoryCounts.matches?.unread || 0,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "messages",
      label: "Messages & Calls",
      count: categoryCounts.messages?.total || 0,
      unreadCount: categoryCounts.messages?.unread || 0,
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "system",
      label: "System & Safety",
      count: categoryCounts.system?.total || 0,
      unreadCount: categoryCounts.system?.unread || 0,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={`w-full overflow-x-auto scrollbar-none pb-1 ${className}`}
      role="tablist"
      aria-label="Notification Categories"
    >
      <div className="flex items-center gap-2 min-w-max p-1 bg-stone-100/80 rounded-2xl border border-stone-200/70">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const hasUnread = tab.unreadCount > 0;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
              }`}
            >
              <span
                className={`transition-colors duration-150 ${
                  isActive ? "text-[#DB2F3C]" : "text-stone-500"
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>

              {/* Count badge */}
              {tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                    isActive
                      ? hasUnread
                        ? "bg-red-50 text-[#DB2F3C]"
                        : "bg-stone-100 text-stone-700"
                      : hasUnread
                      ? "bg-red-100/80 text-[#DB2F3C]"
                      : "bg-stone-200/70 text-stone-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {/* Unread dot */}
              {hasUnread && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#DB2F3C]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const NotificationCategoryTabs = memo(
  NotificationCategoryTabsComponent,
  (prev, next) => {
    return (
      prev.activeCategory === next.activeCategory &&
      prev.className === next.className &&
      prev.onSelectCategory === next.onSelectCategory &&
      JSON.stringify(prev.categoryCounts) === JSON.stringify(next.categoryCounts)
    );
  }
);

NotificationCategoryTabs.displayName = "NotificationCategoryTabs";
export default NotificationCategoryTabs;
