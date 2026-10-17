"use client";

import React, { memo } from "react";
import { SearchTab } from "../types";

export interface SearchTabsBarProps {
  currentTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
  className?: string;
}

const SearchTabsBarComponent: React.FC<SearchTabsBarProps> = ({
  currentTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center border-b border-stone-200 px-6 pt-3 text-xs sm:text-[13px] font-semibold text-stone-600 bg-white ${className}`}
    >
      <button
        type="button"
        onClick={() => onTabChange("criteria")}
        className={`px-4 py-3 relative transition-colors cursor-pointer ${
          currentTab === "criteria"
            ? "text-[#DB2F3C] font-bold"
            : "hover:text-stone-900"
        }`}
      >
        <span>By Criteria</span>
        {currentTab === "criteria" && (
          <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("profile_id")}
        className={`px-4 py-3 relative transition-colors cursor-pointer ${
          currentTab === "profile_id"
            ? "text-[#DB2F3C] font-bold"
            : "hover:text-stone-900"
        }`}
      >
        <span>By Profile ID</span>
        {currentTab === "profile_id" && (
          <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("saved_search")}
        className={`px-4 py-3 relative transition-colors cursor-pointer ${
          currentTab === "saved_search"
            ? "text-[#DB2F3C] font-bold"
            : "hover:text-stone-900"
        }`}
      >
        <span>Saved Search</span>
        <span className="ml-1 text-[11px] font-normal text-stone-400">0</span>
        {currentTab === "saved_search" && (
          <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
        )}
      </button>
    </div>
  );
};

export const SearchTabsBar = memo(SearchTabsBarComponent);
SearchTabsBar.displayName = "SearchTabsBar";
export default SearchTabsBar;
