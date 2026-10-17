"use client";

import React, { memo } from "react";
import { Lock } from "lucide-react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { SearchCriteriaState } from "../types";

export interface SearchReligiousSectionProps {
  criteria: SearchCriteriaState;
  onChange: (updates: Partial<SearchCriteriaState>) => void;
  onUpgradeClick?: () => void;
  className?: string;
}

const SINDHI_CASTES = [
  "Any Caste",
  "Lohana",
  "Bhaiband",
  "Amil",
  "Sahiti",
  "Hyderabadi",
  "Shikarpuri",
  "Larkana",
  "Brahmin",
  "Khatri",
  "Dadu",
  "Sukkur",
  "Others",
];

const MANGLIK_OPTIONS = [
  "Doesn't Matter",
  "Manglik",
  "Non Manglik",
  "Anshik Manglik",
];

const GOTHRA_OPTIONS = [
  "All except my gothra",
  "Doesn't Matter",
  "Specific Gothra",
];

const SearchReligiousSectionComponent: React.FC<SearchReligiousSectionProps> = ({
  criteria,
  onChange,
  onUpgradeClick,
  className = "",
}) => {
  return (
    <div className={`w-full border-b border-stone-200 ${className}`}>
      {/* Section Header */}
      <div className="bg-[#F9FAFB] px-6 py-2.5 border-b border-stone-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Religious Details
        </h3>
      </div>

      <div className="p-6 space-y-5 text-xs sm:text-[13px]">
        {/* Caste */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Caste
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                searchable
                searchPlaceholder="Search caste..."
                value={criteria.caste}
                onChange={(val) => onChange({ caste: val })}
                options={SINDHI_CASTES}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Premium Filters Box matching Screenshot 3 & 4 */}
        <div className="relative border border-stone-200 rounded-2xl p-5 sm:p-6 bg-white my-3">
          {/* Centered Lock icon badge on top border */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-2">
            <div className="w-7 h-7 rounded-full border border-pink-300 bg-pink-50 text-pink-600 flex items-center justify-center shadow-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-4 pt-1 opacity-80 pointer-events-none">
            {/* Star */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <label className="sm:col-span-3 font-medium text-stone-500">
                Star
              </label>
              <div className="sm:col-span-9">
                <div className="w-full sm:max-w-md">
                  <CustomDropDown
                    size="sm"
                    disabled
                    placeholder="Select Star (Nakshatra)"
                    value={criteria.star}
                    options={["Select Star (Nakshatra)"]}
                    triggerClassName="rounded-lg text-xs bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Profiles with Horoscope */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <label className="sm:col-span-3 font-medium text-stone-500">
                Profiles with Horoscope
              </label>
              <div className="sm:col-span-9 flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 rounded text-stone-400 accent-stone-400"
                />
                <span className="text-xs text-stone-400 font-normal">
                  Matches who have added horoscope
                </span>
              </div>
            </div>
          </div>

          {/* CTA Row inside locked box */}
          <div className="pt-4 mt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <span className="text-xs text-stone-600 font-medium">
              To access these premium filters
            </span>
            <button
              type="button"
              onClick={onUpgradeClick}
              className="px-5 py-1.5 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Become a paid member
            </button>
          </div>
        </div>

        {/* Manglik */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Manglik
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.manglik}
                onChange={(val) => onChange({ manglik: val })}
                options={MANGLIK_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Gothra */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Gothra
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.gothra}
                onChange={(val) => onChange({ gothra: val })}
                options={GOTHRA_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchReligiousSection = memo(SearchReligiousSectionComponent);
SearchReligiousSection.displayName = "SearchReligiousSection";
export default SearchReligiousSection;
