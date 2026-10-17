"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { SearchCriteriaState } from "../types";

export interface SearchLifestyleSectionProps {
  criteria: SearchCriteriaState;
  onChange: (updates: Partial<SearchCriteriaState>) => void;
  className?: string;
}

const EATING_HABITS = [
  "Non-vegetarian, Eggetarian, Vegetarian",
  "Vegetarian only",
  "Eggetarian only",
  "Non-vegetarian only",
  "Jain vegetarian",
  "Vegan",
];

const SearchLifestyleSectionComponent: React.FC<SearchLifestyleSectionProps> = ({
  criteria,
  onChange,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Section Header */}
      <div className="bg-[#F9FAFB] px-6 py-2.5 border-b border-stone-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Lifestyle
        </h3>
      </div>

      <div className="p-6 space-y-5 text-xs sm:text-[13px]">
        {/* Mutual Hobbies */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Mutual Hobbies
          </label>
          <div className="sm:col-span-9 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="hobbies-check"
              checked={criteria.mutualHobbiesOnly}
              onChange={(e) => onChange({ mutualHobbiesOnly: e.target.checked })}
              className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] accent-[#DB2F3C]"
            />
            <label htmlFor="hobbies-check" className="text-stone-700 font-medium cursor-pointer">
              Matches who have similar hobbies as you
            </label>
          </div>
        </div>

        {/* Eating Habits */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Eating Habits
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.eatingHabits}
                onChange={(val) => onChange({ eatingHabits: val })}
                options={EATING_HABITS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchLifestyleSection = memo(SearchLifestyleSectionComponent);
SearchLifestyleSection.displayName = "SearchLifestyleSection";
export default SearchLifestyleSection;
