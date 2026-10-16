"use client";

import React, { memo } from "react";
import { MaritalStatus } from "../types";

export interface MaritalStatusSelectProps {
  value: MaritalStatus;
  onChange: (value: MaritalStatus) => void;
  error?: string;
}

const OPTIONS: MaritalStatus[] = [
  "Never married",
  "Widower",
  "Awaiting divorce",
  "Divorced",
];

export const MaritalStatusSelect: React.FC<MaritalStatusSelectProps> = memo(
  ({ value, onChange }) => {
    return (
      <div className="w-full text-left">
        <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
          Marital Status
        </label>
        {/* 2-column or flex wrap grid matching Screenshot 1 */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-sm">
          {OPTIONS.map((status) => {
            const isSelected = value === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onChange(status)}
                className={`py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-sm sm:text-base text-center transition-all cursor-pointer font-medium ${
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
    );
  }
);

MaritalStatusSelect.displayName = "MaritalStatusSelect";
