"use client";

import React, { memo } from "react";
import { ChevronRight } from "lucide-react";

export interface OnboardingSubHeaderProps {
  title: string;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const OnboardingSubHeader: React.FC<OnboardingSubHeaderProps> = memo(
  ({ title, onSkip, showSkip = true }) => {
    return (
      <div className="w-full flex items-center justify-between mb-4 sm:mb-5 select-none">
        {/* Left: Section Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">
          {title}
        </h1>

        {/* Right: Skip for now > link */}
        {showSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:text-[#B71F2A] hover:underline cursor-pointer transition-colors"
          >
            <span>Skip for now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

OnboardingSubHeader.displayName = "OnboardingSubHeader";
