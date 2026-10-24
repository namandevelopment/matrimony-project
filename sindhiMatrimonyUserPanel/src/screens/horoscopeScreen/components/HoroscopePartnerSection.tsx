"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { Pencil, HelpCircle, X } from "lucide-react";
import { HoroscopeProfileData } from "../types";

export interface HoroscopePartnerSectionProps {
  preferences: HoroscopeProfileData["partnerPreference"];
  className?: string;
}

const PREFERENCE_ROWS: Array<{ key: keyof HoroscopeProfileData["partnerPreference"]; label: string }> = [
  { key: "maritalStatus", label: "Marital Status" },
  { key: "haveChildren", label: "Have Children" },
  { key: "age", label: "Age" },
  { key: "height", label: "Height" },
  { key: "motherTongue", label: "Mother Tongue" },
  { key: "physicalStatus", label: "Physical Status" },
  { key: "eatingHabits", label: "Eating Habits" },
  { key: "drinkingHabits", label: "Drinking Habits" },
  { key: "smokingHabits", label: "Smoking Habits" },
  { key: "casteDivision", label: "Caste / Division" },
  { key: "subcaste", label: "Subcaste" },
  { key: "star", label: "Star" },
  { key: "manglik", label: "Manglik" },
  { key: "education", label: "Education" },
];

const HoroscopePartnerSectionComponent: React.FC<HoroscopePartnerSectionProps> = ({
  preferences,
  className = "",
}) => {
  const [showCompulsoryModal, setShowCompulsoryModal] = useState(false);

  return (
    <div id="partner-preference-section" className={`pt-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <h2 className="text-[19px] sm:text-[20px] font-bold text-stone-900 tracking-tight">
            Partner Preference
          </h2>

          <Link
            href="/profile/preferences"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#DB2F3C] hover:text-[#B71F2A] transition-colors py-0.5 px-2 rounded-md hover:bg-red-50"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
        </div>

        {/* Compulsory Filters help link */}
        <button
          type="button"
          onClick={() => setShowCompulsoryModal(true)}
          className="inline-flex items-center gap-1 text-[13px] text-[#DB2F3C] hover:text-[#B71F2A] hover:underline cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#DB2F3C]" />
          <span>Compulsory Filters</span>
        </button>
      </div>

      {/* Info paragraph matching screenshots 4 & 5 */}
      <div className="pt-3 pb-5">
        <p className="text-[13.5px] text-stone-500 leading-relaxed max-w-3xl">
          Matches are recommended to you based on your preferences and profile information.
          To see matches exactly based on your preferences, turn on the &apos;Compulsory&apos; toggle
          beside the required preference. Your profile will not be shown to matches who do not fit
          your &apos;Compulsory&apos; filters, hence you will miss out on potential matches.
        </p>
      </div>

      {/* Preferences List matching screenshots */}
      <div className="space-y-3.5 max-w-2xl text-[14px]">
        {PREFERENCE_ROWS.map((row) => (
          <div key={row.key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-stone-500 sm:w-44 shrink-0 text-[13.5px]">
              {row.label}
            </span>
            <span className="hidden sm:inline text-stone-400">-</span>
            <span className="font-semibold text-stone-800 text-[14px]">
              {preferences?.[row.key] || "Any"}
            </span>
          </div>
        ))}
      </div>

      {/* Compulsory Filters Explanation Modal */}
      {showCompulsoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setShowCompulsoryModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-[#DB2F3C] mb-3">
              <HelpCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-stone-900">What are Compulsory Filters?</h3>
            </div>

            <p className="text-[14px] text-stone-600 leading-relaxed mb-4">
              When a filter is marked as <strong>Compulsory</strong>, the algorithm strictly excludes any matches that do not meet this criterion. Profiles that don’t match won’t be shown to you, and your profile won’t appear in their recommendations.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[13px] text-amber-800">
              💡 <strong>Tip:</strong> Keep filters flexible for non-critical criteria (like height or education) to see a wider pool of compatible prospects.
            </div>

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setShowCompulsoryModal(false)}
                className="px-4 py-2 bg-[#DB2F3C] text-white text-[13.5px] font-semibold rounded-md hover:bg-[#B71F2A] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HoroscopePartnerSection = memo(HoroscopePartnerSectionComponent);
HoroscopePartnerSection.displayName = "HoroscopePartnerSection";
