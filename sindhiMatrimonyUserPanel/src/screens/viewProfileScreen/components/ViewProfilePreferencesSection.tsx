"use client";

import React, { memo, useState } from "react";
import { Sparkles } from "lucide-react";
import { MaleSilhouetteAvatar, FemaleSilhouetteAvatar } from "@/screens/dashboardScreen/components/DashboardIcons";
import { PartnerPreferencesData, PartnerPreferenceItem } from "../types";

export interface ViewProfilePreferencesSectionProps {
  preferences: PartnerPreferencesData;
  prospectPhotoUrl?: string;
  prospectName: string;
  prospectGender: "female" | "male";
  userPhotoUrl?: string;
  className?: string;
}

// Custom Green Circle Checkmark matching BrahminMatrimony screenshot
const MatchCheckCircle = memo(() => (
  <span
    className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-500 shadow-2xs shrink-0"
    title="Matches your preference"
  >
    <svg
      className="w-3 h-3 stroke-[2.6]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
));
MatchCheckCircle.displayName = "MatchCheckCircle";

// Custom Grey Circle Cross matching BrahminMatrimony screenshot
const MatchCrossCircle = memo(() => (
  <span
    className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 shadow-2xs shrink-0"
    title="Preference does not match"
  >
    <svg
      className="w-2.5 h-2.5 stroke-[2.6]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </span>
));
MatchCrossCircle.displayName = "MatchCrossCircle";

// Memoized individual preference row with expandable "more" support
interface PreferenceRowProps {
  item: PartnerPreferenceItem;
}

const PreferenceRow = memo<PreferenceRowProps>(({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-start text-xs sm:text-[13.5px] py-2.5 sm:py-3 border-b border-stone-100 last:border-b-0">
      {/* Field Label (Left Column) */}
      <div className="w-40 sm:w-56 shrink-0 text-stone-600 font-normal">
        {item.label}
      </div>

      {/* Her Preference Value (Center Column) */}
      <div className="flex-1 min-w-0 pr-3 font-bold text-stone-900 break-words leading-relaxed">
        <span>{item.preferenceValue}</span>
        {item.moreValues && item.moreValues.length > 0 && (
          <div className="mt-0.5">
            {isExpanded && (
              <span className="text-stone-700 font-normal text-xs block mt-1 animate-in fade-in">
                {item.moreValues.join(", ")}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#DB2F3C] font-semibold text-xs hover:underline cursor-pointer inline-block mt-0.5"
            >
              {isExpanded ? "less" : "more"}
            </button>
          </div>
        )}
      </div>

      {/* Match Status Icon (Right Column) */}
      <div className="shrink-0 text-right pl-2 pt-0.5">
        {item.isMatched ? <MatchCheckCircle /> : <MatchCrossCircle />}
      </div>
    </div>
  );
});
PreferenceRow.displayName = "PreferenceRow";

// Decorative Floral Ornament Divider (as shown in Screenshot 4)
const FloralFlourishDivider = memo(() => (
  <div
    className="flex items-center justify-center py-6 px-4 select-none pointer-events-none"
    aria-hidden="true"
  >
    <svg
      className="w-60 sm:w-80 h-10 text-stone-300"
      viewBox="0 0 300 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central stylized lotus / floral petals */}
      <path
        d="M150 14 C148 24 144 32 150 36 C156 32 152 24 150 14 Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M150 20 C143 23 138 28 142 34 C146 34 148 30 150 28" />
      <path d="M150 20 C157 23 162 28 158 34 C154 34 152 30 150 28" />
      <path d="M150 24 C138 26 132 32 136 38 C142 38 146 34 150 32" />
      <path d="M150 24 C162 26 168 32 164 38 C158 38 154 34 150 32" />
      {/* Left decorative scroll flourish */}
      <path d="M130 33 C115 35 100 28 85 30 C72 32 60 38 48 34 C40 31 42 24 50 25 C58 26 65 33 55 37 C48 39 38 36 30 32 C22 28 15 22 20 18 C24 15 30 18 28 24 C26 29 20 33 12 34" />
      <path d="M125 31 C105 25 85 24 68 28 C56 31 48 35 40 33" />
      {/* Right decorative scroll flourish (mirrored) */}
      <path d="M170 33 C185 35 200 28 215 30 C228 32 240 38 252 34 C260 31 258 24 250 25 C242 26 235 33 245 37 C252 39 262 36 270 32 C278 28 285 22 280 18 C276 15 270 18 272 24 C274 29 280 33 288 34" />
      <path d="M175 31 C195 25 215 24 232 28 C244 31 252 35 260 33" />
    </svg>
  </div>
));
FloralFlourishDivider.displayName = "FloralFlourishDivider";

const ViewProfilePreferencesSectionComponent: React.FC<ViewProfilePreferencesSectionProps> = ({
  preferences,
  prospectPhotoUrl,
  prospectName,
  prospectGender,
  userPhotoUrl,
  className = "",
}) => {
  const isFemale = prospectGender !== "male";
  const pronoun = isFemale ? "her" : "his";

  return (
    <div
      id="partner-preferences-section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 transition-all space-y-6 ${className}`}
    >
      {/* Title with sparkles: ✨ Her Partner Preferences ✨ */}
      <div className="flex items-center justify-center gap-2 text-center pt-1">
        <Sparkles className="w-4 h-4 text-purple-500 fill-purple-100" />
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
          {isFemale ? "Her" : "His"} Partner Preferences
        </h2>
        <Sparkles className="w-4 h-4 text-purple-500 fill-purple-100" />
      </div>

      {/* Banner / Match Score Card */}
      <div className="w-full bg-gradient-to-r from-purple-50/70 via-fuchsia-50/40 to-purple-50/70 border border-purple-200/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs">
        {/* Left: Prospect Photo */}
        <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border-2 border-white shadow-xs">
          {prospectPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={prospectPhotoUrl}
              alt={prospectName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : isFemale ? (
            <FemaleSilhouetteAvatar className="w-full h-full" />
          ) : (
            <MaleSilhouetteAvatar className="w-full h-full" />
          )}
        </div>

        {/* Center: Match Ratio Text */}
        <div className="text-center flex-1 px-2">
          <p className="text-sm sm:text-base font-medium text-stone-800">
            You match{" "}
            <span className="font-extrabold text-[#7C3AED] text-base sm:text-lg">
              {preferences.matchCount}/{preferences.totalCount}
            </span>{" "}
            of {pronoun} preferences
          </p>
        </div>

        {/* Right: User Avatar Thumbnail */}
        <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl overflow-hidden bg-[#EBF3FB] shrink-0 border-2 border-white shadow-xs flex items-center justify-center">
          {userPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userPhotoUrl}
              alt="My Avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full p-1.5 flex items-center justify-center">
              <MaleSilhouetteAvatar className="w-full h-full text-stone-400" />
            </div>
          )}
        </div>
      </div>

      {/* 1. Basic Preferences */}
      {preferences.basicPreferences && preferences.basicPreferences.length > 0 && (
        <div className="pt-2">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Basic Preferences
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
              <span>You match</span>
              <MatchCheckCircle />
            </div>
          </div>

          <div className="divide-y divide-stone-50 px-1">
            {preferences.basicPreferences.map((item) => (
              <PreferenceRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 2. Religious Preferences */}
      {preferences.religiousPreferences && preferences.religiousPreferences.length > 0 && (
        <div className="pt-2">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 mb-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Religious Preferences
            </h3>
          </div>

          <div className="divide-y divide-stone-50 px-1">
            {preferences.religiousPreferences.map((item) => (
              <PreferenceRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Professional Preferences */}
      {preferences.professionalPreferences && preferences.professionalPreferences.length > 0 && (
        <div className="pt-2">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 mb-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Professional Preferences
            </h3>
          </div>

          <div className="divide-y divide-stone-50 px-1">
            {preferences.professionalPreferences.map((item) => (
              <PreferenceRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Location Preferences */}
      {preferences.locationPreferences && preferences.locationPreferences.length > 0 && (
        <div className="pt-2">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 mb-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Location Preferences
            </h3>
          </div>

          <div className="divide-y divide-stone-50 px-1">
            {preferences.locationPreferences.map((item) => (
              <PreferenceRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Ornamental Flourish Divider at bottom */}
      <FloralFlourishDivider />
    </div>
  );
};

export const ViewProfilePreferencesSection = memo(
  ViewProfilePreferencesSectionComponent
);
ViewProfilePreferencesSection.displayName = "ViewProfilePreferencesSection";

