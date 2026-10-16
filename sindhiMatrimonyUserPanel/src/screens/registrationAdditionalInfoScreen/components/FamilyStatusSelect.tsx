"use client";

import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import { FamilyStatus } from "../types";

export interface FamilyStatusSelectProps {
  value?: FamilyStatus;
  onChange: (value: FamilyStatus) => void;
  error?: string;
}

const OPTIONS: FamilyStatus[] = [
  "Middle class",
  "Upper middle class",
  "Rich / Affluent (Elite)",
];

export const FamilyStatusSelect: React.FC<FamilyStatusSelectProps> = memo(
  ({ value, onChange, error }) => {
    return (
      <div className="w-full text-left">
        {/* Simple Label on top */}
        <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2.5 select-none">
          Select family status
        </label>

        {/* 2-row layout matching reference Image 4 */}
        <div className="space-y-2.5">
          {/* Row 1: Middle class & Upper middle class */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {OPTIONS.slice(0, 2).map((status) => {
              const isSelected = value === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange(status)}
                  className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] shadow-xs"
                      : "bg-white border border-stone-400 text-stone-800 hover:border-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Row 2: Rich / Affluent (Elite) */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {OPTIONS.slice(2).map((status) => {
              const isSelected = value === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange(status)}
                  className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] shadow-xs"
                      : "bg-white border border-stone-400 text-stone-800 hover:border-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1.5 pl-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

FamilyStatusSelect.displayName = "FamilyStatusSelect";
