"use client";

import React, { memo, useCallback } from "react";
import { Filter, ArrowUpDown, Sparkles, CheckCircle2 } from "lucide-react";
import { NotificationFilter, NotificationSort } from "../types";

export interface NotificationFilterBarProps {
  currentFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  currentSort: NotificationSort;
  onSortChange: (sort: NotificationSort) => void;
  totalFiltered: number;
  unreadCount: number;
  actionRequiredCount: number;
  className?: string;
}

const NotificationFilterBarComponent: React.FC<NotificationFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
  totalFiltered,
  unreadCount,
  actionRequiredCount,
  className = "",
}) => {
  const handleToggleSort = useCallback(() => {
    onSortChange(currentSort === "newest" ? "oldest" : "newest");
  }, [currentSort, onSortChange]);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 ${className}`}
    >
      {/* Left: Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <span className="text-xs font-medium text-stone-400 flex items-center gap-1 shrink-0 mr-1 hidden sm:flex">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>

        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            currentFilter === "all"
              ? "bg-stone-900 text-white shadow-xs"
              : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("unread")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            currentFilter === "unread"
              ? "bg-[#DB2F3C] text-white shadow-xs"
              : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentFilter === "unread"
                  ? "bg-white/20 text-white"
                  : "bg-red-50 text-[#DB2F3C]"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("action_needed")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
            currentFilter === "action_needed"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Action Required</span>
          {actionRequiredCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentFilter === "action_needed"
                  ? "bg-white/20 text-white"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {actionRequiredCount}
            </span>
          )}
        </button>
      </div>

      {/* Right: Count and Sort */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-800">{totalFiltered}</strong>{" "}
          notification{totalFiltered === 1 ? "" : "s"}
        </span>

        <button
          type="button"
          onClick={handleToggleSort}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 transition-colors cursor-pointer"
          title="Toggle sort order"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <span>{currentSort === "newest" ? "Newest First" : "Oldest First"}</span>
        </button>
      </div>
    </div>
  );
};

export const NotificationFilterBar = memo(
  NotificationFilterBarComponent,
  (prev, next) => {
    return (
      prev.currentFilter === next.currentFilter &&
      prev.currentSort === next.currentSort &&
      prev.totalFiltered === next.totalFiltered &&
      prev.unreadCount === next.unreadCount &&
      prev.actionRequiredCount === next.actionRequiredCount &&
      prev.className === next.className &&
      prev.onFilterChange === next.onFilterChange &&
      prev.onSortChange === next.onSortChange
    );
  }
);

NotificationFilterBar.displayName = "NotificationFilterBar";
export default NotificationFilterBar;
