"use client";

import React, { memo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { SearchCriteriaState } from "../types";

export interface SearchBasicSectionProps {
  criteria: SearchCriteriaState;
  onChange: (updates: Partial<SearchCriteriaState>) => void;
  className?: string;
}

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(i + 18));
const HEIGHT_OPTIONS = [
  "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\""
];

const PROFILE_CREATED_BY_OPTIONS = [
  "Any",
  "Self",
  "Parents",
  "Sibling",
  "Relative / Friend",
];

const MARITAL_STATUS_OPTIONS = [
  "Doesn't Matter",
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
];

const SearchBasicSectionComponent: React.FC<SearchBasicSectionProps> = ({
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
          Basic Details
        </h3>
      </div>

      {/* Fields */}
      <div className="p-6 space-y-5 text-xs sm:text-[13px]">
        {/* Age */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Age
          </label>
          <div className="sm:col-span-9 flex items-center gap-2">
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={String(criteria.ageFrom)}
                onChange={(val) => onChange({ ageFrom: Number(val) })}
                options={AGE_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
            <span className="text-stone-500 px-1 text-xs font-medium">to</span>
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={String(criteria.ageTo)}
                onChange={(val) => onChange({ ageTo: Number(val) })}
                options={AGE_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
            <span className="text-stone-400 text-xs pl-1">Yrs</span>
          </div>
        </div>

        {/* Height */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Height
          </label>
          <div className="sm:col-span-9 flex items-center gap-2">
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.heightFrom}
                onChange={(val) => onChange({ heightFrom: val })}
                options={HEIGHT_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
            <span className="text-stone-500 px-1 text-xs font-medium">to</span>
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.heightTo}
                onChange={(val) => onChange({ heightTo: val })}
                options={HEIGHT_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Profile Created By */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Profile Created By
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.profileCreatedBy}
                onChange={(val) => onChange({ profileCreatedBy: val })}
                options={PROFILE_CREATED_BY_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Expandable View More */}
        {viewMore && (
          <div className="pt-2 space-y-4 border-t border-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <label className="sm:col-span-3 font-medium text-stone-700">
                Marital Status
              </label>
              <div className="sm:col-span-9">
                <div className="w-full sm:max-w-md">
                  <CustomDropDown
                    size="sm"
                    activeColor="brand"
                    value={criteria.maritalStatus || "Doesn't Matter"}
                    onChange={(val) => onChange({ maritalStatus: val })}
                    options={MARITAL_STATUS_OPTIONS}
                    triggerClassName="rounded-lg text-xs"
                  />
                </div>
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

export const SearchBasicSection = memo(SearchBasicSectionComponent);
SearchBasicSection.displayName = "SearchBasicSection";
export default SearchBasicSection;
