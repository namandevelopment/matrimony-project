"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { SearchCriteriaState } from "../types";

export interface SearchProfessionalSectionProps {
  criteria: SearchCriteriaState;
  onChange: (updates: Partial<SearchCriteriaState>) => void;
  className?: string;
}

const INCOME_OPTIONS = [
  "Any",
  "₹ 3 Lakh",
  "₹ 5 Lakh",
  "₹ 7 Lakh",
  "₹ 10 Lakh",
  "₹ 15 Lakh",
  "₹ 20 Lakh",
  "₹ 30 Lakh",
  "₹ 50 Lakh & above",
];

const OCCUPATION_OPTIONS = [
  "Any",
  "Software Professional",
  "Executive",
  "Manager",
  "Business / Entrepreneur",
  "Doctor / Healthcare",
  "Civil Services / Govt",
  "Chartered Accountant / Finance",
  "Architect / Designer",
  "Professor / Teacher",
  "Student",
  "Not Working",
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Any",
  "Private Sector",
  "Government / Public Sector",
  "Business / Self Employed",
  "Not Working",
];

const EDUCATION_OPTIONS = [
  "Bachelors - Engineering / Technology",
  "Masters - Engineering / Technology",
  "Bachelors - Computers / IT (BCA/B.Sc)",
  "Masters - Computers / IT (MCA/M.Sc)",
  "Bachelors - Management (BBA/BMS)",
  "Masters - Management (MBA/PGDM)",
  "Medicine - MBBS / MD / MS",
  "Bachelors - Commerce / Finance",
  "Masters - Commerce / Finance",
  "Bachelors - Arts / Science",
  "Doctorate - Ph.D.",
  "Any Education",
];

const SearchProfessionalSectionComponent: React.FC<SearchProfessionalSectionProps> = ({
  criteria,
  onChange,
  className = "",
}) => {
  return (
    <div className={`w-full border-b border-stone-200 ${className}`}>
      {/* Section Header */}
      <div className="bg-[#F9FAFB] px-6 py-2.5 border-b border-stone-100">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Professional Details
        </h3>
      </div>

      <div className="p-6 space-y-5 text-xs sm:text-[13px]">
        {/* Occupation */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Occupation
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                searchable
                searchPlaceholder="Search occupation..."
                value={criteria.occupation}
                onChange={(val) => onChange({ occupation: val })}
                options={OCCUPATION_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Annual Income */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Annual Income
          </label>
          <div className="sm:col-span-9 flex items-center gap-2">
            <div className="w-32 sm:w-36">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.incomeFrom}
                onChange={(val) => onChange({ incomeFrom: val })}
                options={INCOME_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
            <span className="text-stone-500 px-1 text-xs font-medium">to</span>
            <div className="w-32 sm:w-36">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.incomeTo}
                onChange={(val) => onChange({ incomeTo: val })}
                options={INCOME_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Employment Type */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Employment Type
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={criteria.employmentType}
                onChange={(val) => onChange({ employmentType: val })}
                options={EMPLOYMENT_TYPE_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <label className="sm:col-span-3 font-medium text-stone-700">
            Education
          </label>
          <div className="sm:col-span-9">
            <div className="w-full sm:max-w-md">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                searchable
                searchPlaceholder="Search education..."
                value={criteria.education}
                onChange={(val) => onChange({ education: val })}
                options={EDUCATION_OPTIONS}
                triggerClassName="rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchProfessionalSection = memo(SearchProfessionalSectionComponent);
SearchProfessionalSection.displayName = "SearchProfessionalSection";
export default SearchProfessionalSection;
