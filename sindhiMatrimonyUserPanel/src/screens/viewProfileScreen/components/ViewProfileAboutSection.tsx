"use client";

import React, { memo } from "react";
import { UserRound } from "lucide-react";

export interface ViewProfileAboutSectionProps {
  name: string;
  aboutText: string;
  className?: string;
}

const ViewProfileAboutSectionComponent: React.FC<ViewProfileAboutSectionProps> = ({
  name,
  aboutText,
  className = "",
}) => {
  return (
    <div
      id="about-myself-section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Header with circular user icon and title */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-100">
        <div className="w-9 h-9 rounded-full bg-[#FDE8E9] flex items-center justify-center text-[#DB2F3C] shrink-0">
          <UserRound className="w-5 h-5 stroke-2.5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
          About Myself
        </h2>
      </div>

      {/* Subtitle and Bio Text */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-stone-900">
          About {name}
        </h3>
        <p className="text-xs sm:text-[13.5px] text-stone-700 leading-relaxed font-normal">
          {aboutText}
        </p>
      </div>
    </div>
  );
};

export const ViewProfileAboutSection = memo(ViewProfileAboutSectionComponent);
ViewProfileAboutSection.displayName = "ViewProfileAboutSection";
