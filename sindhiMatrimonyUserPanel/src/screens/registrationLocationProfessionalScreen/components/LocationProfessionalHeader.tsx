"use client";

import React, { memo } from "react";
import { ArrowLeft } from "lucide-react";

export interface LocationProfessionalHeaderProps {
  onBackClick?: () => void;
  title?: string;
  stepText?: string;
}

export const LocationProfessionalHeader: React.FC<LocationProfessionalHeaderProps> = memo(
  ({
    onBackClick,
    title = "Location and Professional Details",
    stepText = "Step 3/4",
  }) => {
    return (
      <div className="w-full flex items-center justify-between mb-4 sm:mb-5">
        {/* Left: Back Arrow + Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBackClick}
            aria-label="Go back to Personal and Religious Details"
            className="p-1 -ml-1 text-[#1A1A1A] hover:text-[#DB2F3C] rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right: Step Indicator */}
        <span className="text-sm sm:text-base font-semibold text-stone-600 tracking-wide">
          {stepText}
        </span>
      </div>
    );
  }
);

LocationProfessionalHeader.displayName = "LocationProfessionalHeader";
