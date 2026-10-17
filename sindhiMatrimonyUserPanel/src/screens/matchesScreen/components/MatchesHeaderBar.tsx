"use client";

import React, { memo, useRef, useCallback, useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { FilterChipId, SortOption } from "../types";

export interface MatchesHeaderBarProps {
  totalMatchesCount: number;
  activeFilterChips: FilterChipId[];
  onToggleFilterChip: (chipId: FilterChipId) => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onOpenFilterModal: () => void;
  onOpenPreferencesModal: () => void;
  className?: string;
}

interface FilterChipDef {
  id: FilterChipId;
  label: string;
}

const FILTER_CHIPS: FilterChipDef[] = [
  { id: "newly_joined", label: "Newly joined" },
  { id: "not_seen", label: "Not seen" },
  { id: "with_photo", label: "Profiles with photo" },
  { id: "with_horoscope", label: "Profiles with horoscope" },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "newly_joined", label: "Newly joined" },
  { id: "last_seen", label: "Last active" },
  { id: "age_asc", label: "Age: Low to High" },
  { id: "age_desc", label: "Age: High to Low" },
];

const MatchesHeaderBarComponent: React.FC<MatchesHeaderBarProps> = ({
  totalMatchesCount,
  activeFilterChips,
  onToggleFilterChip,
  currentSort,
  onSelectSort,
  onOpenFilterModal,
  onOpenPreferencesModal,
  className = "",
}) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  }, []);

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === currentSort)?.label || "Sort by";

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* 1. Header Title */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">
          <span>{totalMatchesCount} Matches based on your </span>
          <button
            type="button"
            onClick={onOpenPreferencesModal}
            className="text-[#DB2F3C] underline underline-offset-4 decoration-[#DB2F3C] hover:text-[#B71F2A] font-bold cursor-pointer transition-colors"
          >
            preferences
          </button>
        </h1>
      </div>

      {/* 2. Controls Row: Filter button, Sort dropdown, and horizontal chip carousel */}
      <div className="flex items-center gap-2 overflow-x-hidden pt-1">
        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={onOpenFilterModal}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs sm:text-[13px] font-medium text-stone-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
          <span>Filter</span>
        </button>

        {/* Sort by Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs sm:text-[13px] font-medium text-stone-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
            aria-expanded={sortDropdownOpen}
          >
            <span>{currentSort === "relevance" ? "Sort by" : activeSortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </button>

          {sortDropdownOpen && (
            <>
              {/* Backdrop dismiss */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setSortDropdownOpen(false)}
              />
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl border border-stone-200 shadow-lg py-1.5 z-40 text-xs sm:text-[13px] divide-y divide-stone-100">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelectSort(opt.id);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 transition-colors flex items-center justify-between cursor-pointer ${
                      currentSort === opt.id
                        ? "bg-red-50 text-[#DB2F3C] font-semibold"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {currentSort === opt.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DB2F3C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Horizontal Chips Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeFilterChips.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onToggleFilterChip(chip.id)}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 border ${
                  isActive
                    ? "bg-[#FEF2F2] border-[#DB2F3C] text-[#DB2F3C] font-semibold"
                    : "bg-white hover:bg-stone-50 border-stone-300 text-stone-700"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll filter chips"
          className="shrink-0 w-7 h-7 rounded-full border border-stone-300 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const MatchesHeaderBar = memo(MatchesHeaderBarComponent);
MatchesHeaderBar.displayName = "MatchesHeaderBar";
export default MatchesHeaderBar;
