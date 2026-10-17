"use client";

import React, { memo } from "react";
import { Search } from "lucide-react";

export interface SearchBottomStickyBarProps {
  totalMatchesCount: number;
  onSearch: () => void;
  className?: string;
}

const SearchBottomStickyBarComponent: React.FC<SearchBottomStickyBarProps> = ({
  totalMatchesCount,
  onSearch,
  className = "",
}) => {
  return (
    <div
      className={`sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-stone-200 py-3.5 px-4 shadow-lg flex items-center justify-center gap-4 ${className}`}
    >
      <span className="text-xs sm:text-sm font-bold text-stone-900">
        {totalMatchesCount} matches based on your preferences
      </span>
      <button
        type="button"
        onClick={onSearch}
        className="px-8 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-red-500/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>
    </div>
  );
};

export const SearchBottomStickyBar = memo(SearchBottomStickyBarComponent);
SearchBottomStickyBar.displayName = "SearchBottomStickyBar";
export default SearchBottomStickyBar;
