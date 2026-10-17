"use client";

import React, { memo, useState } from "react";
import { X, Check } from "lucide-react";
import { FilterChipId } from "../types";

export interface MatchesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilterChips: FilterChipId[];
  onApplyChips: (chips: FilterChipId[]) => void;
}

const MatchesFilterModalComponent: React.FC<MatchesFilterModalProps> = ({
  isOpen,
  onClose,
  activeFilterChips,
  onApplyChips,
}) => {
  const [selectedChips, setSelectedChips] = useState<FilterChipId[]>(activeFilterChips);

  if (!isOpen) return null;

  const toggleChip = (id: FilterChipId) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedChips([]);
  };

  const handleApply = () => {
    onApplyChips(selectedChips);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
              Filter Matches
            </h3>
            <p className="text-xs text-stone-500">
              Refine results by your selected criteria
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-[13px]">
          <div>
            <h4 className="font-bold text-stone-800 mb-2">Profile Attributes</h4>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChips.includes("with_photo")}
                  onChange={() => toggleChip("with_photo")}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
                />
                <span className="text-stone-700 font-medium">Profiles with Photo</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChips.includes("with_horoscope")}
                  onChange={() => toggleChip("with_horoscope")}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
                />
                <span className="text-stone-700 font-medium">Profiles with Horoscope</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChips.includes("newly_joined")}
                  onChange={() => toggleChip("newly_joined")}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
                />
                <span className="text-stone-700 font-medium">Newly Joined (Last 30 Days)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedChips.includes("not_seen")}
                  onChange={() => toggleChip("not_seen")}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
                />
                <span className="text-stone-700 font-medium">Not Seen Yet</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
          >
            Reset All
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MatchesFilterModal = memo(MatchesFilterModalComponent);
MatchesFilterModal.displayName = "MatchesFilterModal";
export default MatchesFilterModal;
