"use client";

import React, { memo } from "react";
import {
  BellOff,
  SearchX,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  Users,
  RotateCcw,
} from "lucide-react";
import { NotificationCategory, NotificationFilter } from "../types";

export interface NotificationEmptyStateProps {
  searchQuery: string;
  currentFilter: NotificationFilter;
  activeCategory: NotificationCategory;
  onResetFilters: () => void;
  className?: string;
}

const NotificationEmptyStateComponent: React.FC<NotificationEmptyStateProps> = ({
  searchQuery,
  currentFilter,
  activeCategory,
  onResetFilters,
  className = "",
}) => {
  // 1. Search Query active with no results
  if (searchQuery.trim().length > 0) {
    return (
      <div
        className={`bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          No notifications match your search
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
          We couldn&apos;t find any notifications matching &ldquo;
          <span className="font-semibold text-stone-800">{searchQuery}</span>
          &rdquo;. Try searching with a different name or keyword.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Search
        </button>
      </div>
    );
  }

  // 2. Filtered by Unread and none left
  if (currentFilter === "unread") {
    return (
      <div
        className={`bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          You&apos;re completely caught up!
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
          There are no unread notifications in this category. We&apos;ll notify you when prospective matches reach out.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
        >
          View All Notifications
        </button>
      </div>
    );
  }

  // 3. Filtered by Action Needed
  if (currentFilter === "action_needed") {
    return (
      <div
        className={`bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          No pending actions
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
          You have responded to all received interests, horoscope requests, and messages. Great job!
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
        >
          View All Notifications
        </button>
      </div>
    );
  }

  // 4. Category-specific empty state
  const getCategoryContent = () => {
    switch (activeCategory) {
      case "interests":
        return {
          icon: <HeartHandshake className="w-8 h-8" />,
          title: "No interest notifications yet",
          desc: "When prospective matches express interest or accept your interests, you'll see them here.",
        };
      case "matches":
        return {
          icon: <Users className="w-8 h-8" />,
          title: "No match alerts yet",
          desc: "Curated daily recommendations and members who view or shortlist your profile will appear here.",
        };
      case "messages":
        return {
          icon: <MessageSquare className="w-8 h-8" />,
          title: "No messages or call alerts",
          desc: "Connect with mutual matches to start real-time conversations and secure calls.",
        };
      case "system":
        return {
          icon: <CheckCircle2 className="w-8 h-8" />,
          title: "No system alerts",
          desc: "Account security, profile verification badges, and exclusive offers will show up here.",
        };
      case "all":
      default:
        return {
          icon: <BellOff className="w-8 h-8" />,
          title: "No notifications found",
          desc: "You don't have any notifications at the moment. Check back soon for updates!",
        };
    }
  };

  const content = getCategoryContent();

  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
        {content.icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-stone-900">
        {content.title}
      </h3>
      <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
        {content.desc}
      </p>
      {activeCategory !== "all" && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
        >
          View All Notifications
        </button>
      )}
    </div>
  );
};

export const NotificationEmptyState = memo(
  NotificationEmptyStateComponent,
  (prev, next) => {
    return (
      prev.searchQuery === next.searchQuery &&
      prev.currentFilter === next.currentFilter &&
      prev.activeCategory === next.activeCategory &&
      prev.className === next.className &&
      prev.onResetFilters === next.onResetFilters
    );
  }
);

NotificationEmptyState.displayName = "NotificationEmptyState";
export default NotificationEmptyState;
