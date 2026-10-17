"use client";

import React, { memo } from "react";
import { UserRound, Lock, ChevronRight, Send } from "lucide-react";
import { ProfilePersonalInfo } from "../types";

export interface ViewProfilePersonalInfoSectionProps {
  personalInfo: ProfilePersonalInfo;
  onUpgradeClick: (field: string) => void;
  onHoroscopeRequestClick: () => void;
  className?: string;
}

// Memoized individual row for zero unnecessary re-renders
interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  isLocked?: boolean;
  isAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

const InfoRow = memo<InfoRowProps>(
  ({ label, value, isLocked = false, isAction = false, actionText, onAction }) => {
    return (
      <div className="flex items-start text-xs sm:text-[13.5px] py-2 sm:py-2.5 border-b border-stone-100 last:border-b-0">
        {/* Label (Left Column) */}
        <div className="w-36 sm:w-48 shrink-0 text-stone-600 font-normal">
          {label}
        </div>

        {/* Separator Colon */}
        <div className="w-4 shrink-0 text-stone-400 font-semibold select-none">
          :
        </div>

        {/* Value (Right Column) */}
        <div className="flex-1 min-w-0 pl-1">
          {isLocked ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 text-[#DB2F3C] hover:text-[#B71F2A] font-semibold transition-colors cursor-pointer group text-xs sm:text-[13px]"
            >
              <Lock className="w-3.5 h-3.5 stroke-2.5 text-[#DB2F3C]" />
              <span>{actionText || "Upgrade to view"}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : isAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 text-[#DB2F3C] hover:text-[#B71F2A] font-semibold transition-colors cursor-pointer group text-xs sm:text-[13px]"
            >
              <Send className="w-3 h-3 stroke-2 text-[#DB2F3C]" />
              <span>{actionText || "Send request"}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <span className="font-semibold text-stone-900 break-words">{value}</span>
          )}
        </div>
      </div>
    );
  }
);
InfoRow.displayName = "InfoRow";

const ViewProfilePersonalInfoSectionComponent: React.FC<ViewProfilePersonalInfoSectionProps> = ({
  personalInfo,
  onUpgradeClick,
  onHoroscopeRequestClick,
  className = "",
}) => {
  return (
    <div
      id="personal-information-section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Header with circular user icon and title */}
      <div className="flex items-center gap-3 pb-4 mb-2 border-b border-stone-100">
        <div className="w-9 h-9 rounded-full bg-[#FDE8E9] flex items-center justify-center text-[#DB2F3C] shrink-0">
          <UserRound className="w-5 h-5 stroke-2.5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
          Personal Information
        </h2>
      </div>

      {/* Attributes Table / Rows */}
      <div className="divide-y divide-stone-50">
        <InfoRow label="Age" value={personalInfo.age} />
        <InfoRow label="Height" value={personalInfo.height} />
        <InfoRow label="Mother Tongue" value={personalInfo.motherTongue} />
        <InfoRow label="Profile Created By" value={personalInfo.profileCreatedBy} />
        <InfoRow label="Marital Status" value={personalInfo.maritalStatus} />
        <InfoRow label="Lives In" value={personalInfo.livesIn} />
        <InfoRow label="Eating Habits" value={personalInfo.eatingHabits} />
        <InfoRow label="Religion" value={personalInfo.religion} />
        <InfoRow label="Caste" value={personalInfo.caste} />
        <InfoRow label="Subcaste" value={personalInfo.subcaste} />
        <InfoRow label="Gothra(m)" value={personalInfo.gothra} />
        <InfoRow label="Manglik" value={personalInfo.manglik} />
        <InfoRow
          label="Date Of Birth"
          isLocked
          actionText="Upgrade to view"
          onAction={() => onUpgradeClick("Date of Birth")}
        />
        <InfoRow
          label="Time Of Birth"
          isLocked
          actionText="Upgrade to view"
          onAction={() => onUpgradeClick("Time of Birth")}
        />
        <InfoRow
          label="Horoscope"
          isAction
          actionText="Send request"
          onAction={onHoroscopeRequestClick}
        />
        <InfoRow label="Employment" value={personalInfo.employment} />
        <InfoRow label="Education" value={personalInfo.education} />
        <InfoRow label="Occupation" value={personalInfo.occupation} />
      </div>
    </div>
  );
};

export const ViewProfilePersonalInfoSection = memo(ViewProfilePersonalInfoSectionComponent);
ViewProfilePersonalInfoSection.displayName = "ViewProfilePersonalInfoSection";
