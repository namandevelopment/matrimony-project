"use client";

import React, { memo } from "react";
import { Monitor, Sparkles } from "lucide-react";
import { HoroscopeTimelineSection } from "./HoroscopeTimelineSection";
import { HoroscopeProfileData } from "../types";

export interface HoroscopeAstrologySectionProps {
  horoscopeInfo: HoroscopeProfileData["horoscopeInfo"];
  onViewHoroscope: () => void;
  onEdit?: () => void;
  className?: string;
}

const HoroscopeAstrologySectionComponent: React.FC<HoroscopeAstrologySectionProps> = ({
  horoscopeInfo,
  onViewHoroscope,
  onEdit,
  className = "",
}) => {
  return (
    <HoroscopeTimelineSection
      id="horoscope-timeline-section"
      icon={<Monitor className="w-5 h-5 text-white" />}
      iconBgColor="bg-[#78909C]"
      title="Horoscope"
      editSectionKey="horoscope"
      onEdit={onEdit}
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Key-Value fields */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Name</span>
            <span className="font-semibold text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.name}</span>
          </div>

          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Date of Birth</span>
            <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.dateOfBirth}</span>
          </div>

          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Time of Birth</span>
            <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.timeOfBirth}</span>
          </div>

          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Time Zone</span>
            <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.timeZone}</span>
          </div>

          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Time Correction</span>
            <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.timeCorrection}</span>
          </div>

          <div>
            <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Place of Birth</span>
            <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.placeOfBirth}</span>
          </div>

          {horoscopeInfo.moonSign && (
            <div>
              <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Raasi / Moon Sign</span>
              <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.moonSign}</span>
            </div>
          )}

          {horoscopeInfo.nakshatraPada && (
            <div>
              <span className="text-stone-400 block sm:inline sm:w-28 text-[13px] sm:text-[14px]">Star / Nakshatra</span>
              <span className="font-medium text-stone-800 ml-0 sm:ml-2">{horoscopeInfo.nakshatraPada}</span>
            </div>
          )}
        </div>

        {/* Right 4 cols: View Horoscope Button matching screenshot 3 */}
        <div className="md:col-span-4 flex md:justify-end items-center pt-2 md:pt-0">
          <button
            type="button"
            onClick={onViewHoroscope}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#DB2F3C] text-stone-700 hover:text-[#DB2F3C] text-[13.5px] font-semibold rounded-md shadow-xs transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-[#DB2F3C] group-hover:text-[#B71F2A] transition-colors" />
            <span>View Horoscope</span>
          </button>
        </div>
      </div>
    </HoroscopeTimelineSection>
  );
};

export const HoroscopeAstrologySection = memo(HoroscopeAstrologySectionComponent);
HoroscopeAstrologySection.displayName = "HoroscopeAstrologySection";
