"use client";

import React, { memo } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

export interface ViewProfileHeaderNavProps {
  currentIndex: number;
  totalProfiles: number;
  categoryLabel?: string;
  nextProfilePhotoUrl?: string;
  nextProfileName?: string;
  onBack: () => void;
  onNext: () => void;
  className?: string;
}

const ViewProfileHeaderNavComponent: React.FC<ViewProfileHeaderNavProps> = ({
  currentIndex,
  totalProfiles,
  categoryLabel = "All Matches",
  nextProfilePhotoUrl,
  nextProfileName = "Next match",
  onBack,
  onNext,
  className = "",
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between py-3 sm:py-4 ${className}`}
    >
      {/* Left: Back to matches link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-stone-800 hover:text-[#DB2F3C] font-bold text-base sm:text-lg transition-colors cursor-pointer group"
        aria-label="Back to all matches"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 text-stone-700 group-hover:text-[#DB2F3C]" />
        <span>
          {categoryLabel} {currentIndex + 1}/{totalProfiles}
        </span>
      </button>

      {/* Right: Next Profile Pill Button */}
      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-2xs transition-all active:scale-97 cursor-pointer group"
        aria-label={`Go to next profile: ${nextProfileName}`}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
          {nextProfilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nextProfilePhotoUrl}
              alt={nextProfileName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-600 text-[10px] font-bold">
              {nextProfileName.charAt(0)}
            </div>
          )}
        </div>
        <span>Next</span>
        <div className="flex items-center -space-x-1 text-stone-600 group-hover:text-stone-900">
          <ChevronRight className="w-3.5 h-3.5" />
          <ChevronRight className="w-3.5 h-3.5 -ml-2" />
        </div>
      </button>
    </div>
  );
};

export const ViewProfileHeaderNav = memo(ViewProfileHeaderNavComponent);
ViewProfileHeaderNav.displayName = "ViewProfileHeaderNav";
