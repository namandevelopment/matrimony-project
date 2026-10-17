"use client";

import React, { memo } from "react";
import { Phone, Lock, ChevronRight } from "lucide-react";
import { ProfileContactInfo } from "../types";

export interface ViewProfileContactInfoSectionProps {
  contactInfo: ProfileContactInfo;
  onUpgradeClick: () => void;
  className?: string;
}

const ViewProfileContactInfoSectionComponent: React.FC<ViewProfileContactInfoSectionProps> = ({
  contactInfo,
  onUpgradeClick,
  className = "",
}) => {
  return (
    <div
      id="contact-information-section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Header with circular phone icon and title */}
      <div className="flex items-center gap-3 pb-4 mb-2 border-b border-stone-100">
        <div className="w-9 h-9 rounded-full bg-[#FDE8E9] flex items-center justify-center text-[#DB2F3C] shrink-0">
          <Phone className="w-4.5 h-4.5 stroke-2.5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
          Contact Information
        </h2>
      </div>

      {/* Row with Contact Details and Lock Upgrade Link */}
      <div className="flex items-start text-xs sm:text-[13.5px] py-3">
        <div className="w-36 sm:w-48 shrink-0 text-stone-600 font-normal">
          Contact Details
        </div>
        <div className="w-4 shrink-0 text-stone-400 font-semibold select-none">
          :
        </div>
        <div className="flex-1 min-w-0 pl-1 flex flex-wrap items-center gap-2">
          {contactInfo.isUnlocked ? (
            <span className="font-bold text-stone-900 text-sm">
              {contactInfo.phoneMasked}
            </span>
          ) : (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="inline-flex items-center gap-1.5 text-stone-800 hover:text-[#DB2F3C] transition-colors cursor-pointer group text-xs sm:text-[13.5px]"
            >
              <Lock className="w-3.5 h-3.5 stroke-2 text-[#DB2F3C]" />
              <span className="font-semibold">{contactInfo.phoneMasked}</span>
              <span className="text-[#DB2F3C] font-semibold hover:underline flex items-center ml-1">
                Upgrade to view
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ViewProfileContactInfoSection = memo(ViewProfileContactInfoSectionComponent);
ViewProfileContactInfoSection.displayName = "ViewProfileContactInfoSection";
