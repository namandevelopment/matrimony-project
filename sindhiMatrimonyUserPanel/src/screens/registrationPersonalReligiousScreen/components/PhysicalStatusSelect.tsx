"use client";

import React, { memo } from "react";
import { PhysicalStatus } from "../types";

export interface PhysicalStatusSelectProps {
  value: PhysicalStatus;
  onChange: (value: PhysicalStatus) => void;
  error?: string;
}

const OPTIONS: PhysicalStatus[] = ["Normal", "Physically challenged"];

export const PhysicalStatusSelect: React.FC<PhysicalStatusSelectProps> = memo(
  ({ value, onChange }) => {
    return (
      <div className="w-full text-left">
        <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
          Physical Status
        </label>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {OPTIONS.map((status) => {
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
    );
  }
);

PhysicalStatusSelect.displayName = "PhysicalStatusSelect";
