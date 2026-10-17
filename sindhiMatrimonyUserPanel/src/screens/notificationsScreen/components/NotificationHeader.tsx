"use client";

import React, { memo, useCallback } from "react";
import { Bell, CheckCheck, Settings, Search, X } from "lucide-react";

export interface NotificationHeaderProps {
  unreadCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMarkAllAsRead: () => void;
  onOpenSettings: () => void;
  className?: string;
}

const NotificationHeaderComponent: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  totalCount,
  searchQuery,
  onSearchChange,
  onMarkAllAsRead,
  onOpenSettings,
  className = "",
}) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 sm:p-6 transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Unread Count Badge */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#DB2F3C] shrink-0">
            <Bell className="w-5 h-5 fill-red-100/70" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#DB2F3C] text-[10px] font-bold text-white items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-heading">
                Notifications
              </h1>
              {unreadCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#DB2F3C] border border-red-200/60">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                  All caught up
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Track interests, profile views, messages, and match recommendations in real-time
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C]/20 cursor-pointer"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all as read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C]/20 cursor-pointer"
            title="Notification Preferences"
          >
            <Settings className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search notifications by member name, matrimony ID, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C]/20 focus:border-[#DB2F3C] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationHeader = memo(
  NotificationHeaderComponent,
  (prev, next) => {
    return (
      prev.unreadCount === next.unreadCount &&
      prev.totalCount === next.totalCount &&
      prev.searchQuery === next.searchQuery &&
      prev.className === next.className &&
      prev.onSearchChange === next.onSearchChange &&
      prev.onMarkAllAsRead === next.onMarkAllAsRead &&
      prev.onOpenSettings === next.onOpenSettings
    );
  }
);

NotificationHeader.displayName = "NotificationHeader";
export default NotificationHeader;
