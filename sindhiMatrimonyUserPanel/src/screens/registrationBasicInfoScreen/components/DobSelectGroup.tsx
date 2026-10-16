"use client";

import React, { memo, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { CustomDropDown } from "@/components";
import { MonthAbbr } from "../types";

export interface DobSelectGroupProps {
  day: string;
  month: string;
  year: string;
  onChange: (field: "day" | "month" | "year", value: string) => void;
  error?: string;
}

const MONTHS: MonthAbbr[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Generate 01 to 31
const DAYS: string[] = Array.from({ length: 31 }, (_, i) => {
  const d = i + 1;
  return d < 10 ? `0${d}` : `${d}`;
});

// Generate years: currentYear - 18 down to 1950 (so minimum legal age is 18)
const currentYear = new Date().getFullYear();
const maxYear = currentYear - 18;
const minYear = 1950;
const YEARS: string[] = Array.from(
  { length: maxYear - minYear + 1 },
  (_, i) => `${maxYear - i}`
);

export const DobSelectGroup: React.FC<DobSelectGroupProps> = memo(
  ({ day, month, year, onChange, error }) => {
    // Calculate age dynamically
    const ageInfo = useMemo(() => {
      if (!day || !month || !year) return null;
      const monthIdx = MONTHS.indexOf(month as MonthAbbr);
      if (monthIdx === -1) return null;

      const birthDate = new Date(parseInt(year, 10), monthIdx, parseInt(day, 10));
      const today = new Date();

      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      return calculatedAge;
    }, [day, month, year]);

    return (
      <div className="w-full text-left">
        <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
          Date of birth
        </label>

        {/* 3 Dropdown Columns using reusable CustomDropDown */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {/* 1. Day Dropdown */}
          <CustomDropDown
            placeholder="Day"
            value={day}
            onChange={(val) => onChange("day", val)}
            options={DAYS}
          />

          {/* 2. Month Dropdown */}
          <CustomDropDown
            placeholder="Month"
            value={month}
            onChange={(val) => onChange("month", val)}
            options={MONTHS}
          />

          {/* 3. Year Dropdown */}
          <CustomDropDown
            placeholder="Year"
            value={year}
            onChange={(val) => onChange("year", val)}
            options={YEARS}
          />
        </div>

        {/* Live Age Calculation Pill (Matches Screenshot 3 & 4) */}
        {ageInfo !== null && (
          <div className="mt-3.5 inline-flex items-center px-3.5 py-1.5 bg-[#FFF6F0] border border-[#FED7AA] rounded-md text-sm text-[#1A1A1A] animate-in fade-in duration-200">
            <span>
              You are <strong className="font-bold text-[#1A1A1A]">{ageInfo} years</strong> old
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

DobSelectGroup.displayName = "DobSelectGroup";
