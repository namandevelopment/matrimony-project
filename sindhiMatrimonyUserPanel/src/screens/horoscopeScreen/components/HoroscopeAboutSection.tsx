"use client";

import React, { memo } from "react";
import { GraduationCap } from "lucide-react";
import { HoroscopeTimelineSection } from "./HoroscopeTimelineSection";

export interface HoroscopeAboutSectionProps {
  name: string;
  aboutMe: string;
  onEdit?: () => void;
  className?: string;
}

const HoroscopeAboutSectionComponent: React.FC<HoroscopeAboutSectionProps> = ({
  name,
  aboutMe,
  onEdit,
  className = "",
}) => {
  return (
    <HoroscopeTimelineSection
      icon={<GraduationCap className="w-6 h-6 text-white" />}
      iconBgColor="bg-[#29B6F6]"
      title={`A Few Lines About ${name}`}
      editSectionKey="about"
      onEdit={onEdit}
      className={className}
    >
      <div className="py-2 text-[14.5px] leading-relaxed text-stone-700 flex items-start gap-2">
        <span className="text-3xl font-serif text-stone-400 select-none leading-none -translate-y-1">
          &ldquo;
        </span>
        <p className="flex-1 font-normal text-stone-700 italic">
          {aboutMe || "No description provided yet."}
        </p>
        <span className="text-3xl font-serif text-stone-400 select-none leading-none -translate-y-1">
          &rdquo;
        </span>
      </div>
    </HoroscopeTimelineSection>
  );
};

export const HoroscopeAboutSection = memo(HoroscopeAboutSectionComponent);
HoroscopeAboutSection.displayName = "HoroscopeAboutSection";
