"use client";

import React, { memo, useState } from "react";
import { Search } from "lucide-react";

export interface SearchProfileIdViewProps {
  onSearchId: (id: string) => void;
  className?: string;
}

const SearchProfileIdViewComponent: React.FC<SearchProfileIdViewProps> = ({
  onSearchId,
  className = "",
}) => {
  const [profileId, setProfileId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileId.trim()) {
      onSearchId(profileId.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-8 sm:p-12 max-w-lg mx-auto text-center space-y-5 ${className}`}
    >
      <div className="space-y-1">
        <h3 className="text-base font-bold text-stone-900">
          Search by Matrimony ID
        </h3>
        <p className="text-xs text-stone-500">
          Enter the unique profile ID of the member you want to view
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          placeholder="e.g. BRH4498447"
          className="flex-1 px-4 py-2.5 text-xs sm:text-[13px] border border-stone-300 rounded-full focus:outline-hidden focus:ring-1 focus:ring-[#DB2F3C] uppercase font-medium text-stone-800"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find</span>
        </button>
      </div>
    </form>
  );
};

export const SearchProfileIdView = memo(SearchProfileIdViewComponent);
SearchProfileIdView.displayName = "SearchProfileIdView";
export default SearchProfileIdView;
