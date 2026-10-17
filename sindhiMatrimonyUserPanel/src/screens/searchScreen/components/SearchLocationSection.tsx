"use client";

import React, { memo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { SearchCriteriaState } from "../types";

export interface SearchLocationSectionProps {
  criteria: SearchCriteriaState;
  onChange: (updates: Partial<SearchCriteriaState>) => void;
  className?: string;
}

const COUNTRIES = [
  "Any",
  "India",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
];

const STATES_INDIA = [
  "Any State",
  "Maharashtra",
  "Gujarat",
  "Delhi / NCR",
  "Karnataka",
  "Madhya Pradesh",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
];

const SearchLocationSectionComponent: React.FC<SearchLocationSectionProps> = ({
  criteria,
  onChange,
  className = "",
}) => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <div className={`w-full border-b border-stone-200 ${className}`}>
      {/* Section Header */}
      <div className="bg-[#F9FAFB] px-6 py-2.5 border-b border-stone-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Location Details
        </h3>
      </div>

      <div className="p-6 space-y-5 text-xs sm:text-[13px]">
        {/* Nearby Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Nearby Profiles
          </label>
          <div className="sm:col-span-9 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="nearby-check"
              checked={criteria.nearbyOnly}
              onChange={(e) => onChange({ nearbyOnly: e.target.checked })}
              className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
            />
            <label htmlFor="nearby-check" className="text-stone-700 font-medium cursor-pointer">
              Matches near your location
            </label>
          </div>
        </div>

        {/* Country */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Country
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                searchable
                searchPlaceholder="Search country..."
                value={criteria.country}
                onChange={(val) => onChange({ country: val })}
                options={COUNTRIES}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Expandable State Selection */}
        {viewMore && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
            <label className="sm:col-span-3 font-medium text-stone-700">
              State / Province
            </label>
            <div className="sm:col-span-9">
              <div className="w-full sm:max-w-md">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  searchable
                  searchPlaceholder="Search state..."
                  value={criteria.state || "Any State"}
                  onChange={(val) => onChange({ state: val })}
                  options={STATES_INDIA}
                  triggerClassName="rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setViewMore((prev) => !prev)}
            className="text-xs font-semibold text-[#DB2F3C] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{viewMore ? "View less" : "View more"}</span>
            {viewMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SearchLocationSection = memo(SearchLocationSectionComponent);
SearchLocationSection.displayName = "SearchLocationSection";
export default SearchLocationSection;
