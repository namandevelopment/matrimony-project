"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  AddPhotoTileIcon,
  FamilyDetailsTileIcon,
  AddHobbiesTileIcon,
} from "./DashboardIcons";

export interface ProfileCompletenessCardProps {
  score?: number; // e.g. 41
  className?: string;
}

interface ActionTileProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const ActionTile = memo<ActionTileProps>(({ icon, label, href }) => {
  return (
    <Link
      href={href}
      className="flex-1 min-w-[140px] p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 bg-white hover:border-[#DB2F3C]/50 hover:shadow-sm active:scale-[0.99] transition-all duration-200 flex items-center gap-3.5 group cursor-pointer"
    >
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>
      <span className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] group-hover:text-[#DB2F3C] transition-colors leading-snug">
        {label}
      </span>
    </Link>
  );
});
ActionTile.displayName = "ActionTile";

const ProfileCompletenessCardComponent: React.FC<ProfileCompletenessCardProps> = ({
  score = 42,
  className = "",
}) => {
  return (
    <section
      aria-label="Profile Completeness Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 ${className}`}
    >
      {/* Title & Progress Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-heading">
            Complete Your Profile
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#666666]">
              Profile completeness score <strong className="text-[#1A1A1A]">{score}%</strong>
            </span>
            {/* Segmented / Smooth progress bar */}
            <div className="w-24 sm:w-32 h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200 flex">
              <div
                className="h-full bg-gradient-to-r from-[#FF7A00] to-[#DB2F3C] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <ActionTile
          icon={<AddPhotoTileIcon size={34} />}
          label="Add Photo(s)"
          href="/profile/edit?tab=photos"
        />
        <ActionTile
          icon={<FamilyDetailsTileIcon size={34} />}
          label="Family Details"
          href="/profile/edit?tab=family"
        />
        <ActionTile
          icon={<AddHobbiesTileIcon size={34} />}
          label="Add Hobbies"
          href="/profile/edit?tab=hobbies"
        />
      </div>
    </section>
  );
};

export const ProfileCompletenessCard = memo(ProfileCompletenessCardComponent);
ProfileCompletenessCard.displayName = "ProfileCompletenessCard";
export default ProfileCompletenessCard;
