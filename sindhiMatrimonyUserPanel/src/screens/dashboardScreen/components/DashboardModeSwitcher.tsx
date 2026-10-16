"use client";

import React, { memo } from "react";
import type { DashboardMode } from "../types";

export interface DashboardModeSwitcherProps {
  currentMode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  className?: string;
}

const DashboardModeSwitcherComponent: React.FC<DashboardModeSwitcherProps> = ({
  currentMode,
  onModeChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full py-4 flex items-center justify-center ${className}`}>
      {/* Background horizontal line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-stone-200" />

      {/* Center Pill Switcher */}
      <div className="relative z-10 inline-flex items-center bg-white p-1 rounded-full border border-stone-200 shadow-xs">
        {/* Regular Tab */}
        <button
          type="button"
          onClick={() => onModeChange("regular")}
          className={`px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
            currentMode === "regular"
              ? "bg-gradient-to-r from-[#FF525F] via-[#DB2F3C] to-[#B71F2A] text-white shadow-xs"
              : "text-[#555555] hover:text-[#1A1A1A]"
          }`}
        >
          Regular
        </button>

        {/* PRIME Tab */}
        <button
          type="button"
          onClick={() => onModeChange("prime")}
          className={`px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
            currentMode === "prime"
              ? "bg-gradient-to-r from-[#FF525F] via-[#DB2F3C] to-[#B71F2A] text-white shadow-xs"
              : "text-[#555555] hover:text-[#1A1A1A]"
          }`}
        >
          <span>PRIME</span>
          <span className={`${currentMode === "prime" ? "text-white" : "text-[#DB2F3C]"} text-xs font-bold leading-none`}>*</span>
        </button>
      </div>
    </div>
  );
};

export const DashboardModeSwitcher = memo(DashboardModeSwitcherComponent);
DashboardModeSwitcher.displayName = "DashboardModeSwitcher";
export default DashboardModeSwitcher;
