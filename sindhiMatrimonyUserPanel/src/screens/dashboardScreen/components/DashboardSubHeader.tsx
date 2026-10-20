"use client";

import React, { memo } from "react";
import { DashboardModeSwitcher } from "./DashboardModeSwitcher";
import type { DashboardMode } from "../types";

export interface DashboardSubHeaderProps {
  currentMode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  showModeSwitcher?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

const DashboardSubHeaderComponent: React.FC<DashboardSubHeaderProps> = ({
  currentMode,
  onModeChange,
  showModeSwitcher = true,
  leftContent,
  rightContent,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 ${className}`}>
      {/* Desktop view: Mode Switcher pinned to true center, right content on the right, line behind */}
      <div className="relative flex items-center justify-between min-h-[44px]">
        {/* Full-width continuous dividing line behind controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-stone-200 pointer-events-none" />

        {/* Left Slot (or balance spacer) */}
        {leftContent ? (
          <div className="hidden sm:flex items-center z-20 pointer-events-auto pr-4 bg-[#F8F9FA]">
            {leftContent}
          </div>
        ) : (
          <div className="hidden sm:flex items-center w-64 shrink-0 pointer-events-none" />
        )}

        {/* Center Slot: Mathematically 50% Centered */}
        {showModeSwitcher && (
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <DashboardModeSwitcher
              currentMode={currentMode}
              onModeChange={onModeChange}
              hideLine
              className="py-0"
            />
          </div>
        )}

        {/* Right Slot: e.g. MailboxSearchInput */}
        {rightContent ? (
          <div className="hidden sm:flex items-center justify-end z-20 pointer-events-auto ml-auto pl-4 bg-[#F8F9FA]">
            {rightContent}
          </div>
        ) : (
          <div className="hidden sm:flex items-center w-64 shrink-0 pointer-events-none ml-auto" />
        )}
      </div>

      {/* Mobile view: Stacked if rightContent exists */}
      <div className="sm:hidden flex flex-col items-center gap-2.5 py-1">
        {showModeSwitcher && (
          <DashboardModeSwitcher
            currentMode={currentMode}
            onModeChange={onModeChange}
            hideLine
            className="py-0"
          />
        )}
        {rightContent && (
          <div className="w-full flex justify-center z-10 pt-1">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export const DashboardSubHeader = memo(DashboardSubHeaderComponent);
DashboardSubHeader.displayName = "DashboardSubHeader";
export default DashboardSubHeader;
