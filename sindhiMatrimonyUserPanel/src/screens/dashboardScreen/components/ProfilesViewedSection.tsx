"use client";

import React, { memo } from "react";
import Link from "next/link";
import type { ViewedProfile } from "../types";

export interface ProfilesViewedSectionProps {
  profiles?: ViewedProfile[];
  className?: string;
}

const ViewedProfileCard = memo<{ profile: ViewedProfile }>(({ profile }) => {
  const targetId = (profile as any)?.matrimonyId || (profile as any)?._id || profile?.id;
  return (
    <Link
      href={targetId ? `/matches/viewprofile/${targetId}` : "/matches"}
      className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer"
    >
      {/* Photo Container */}
      <div className="relative w-full aspect-4/5 sm:h-52 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Profile Info */}
      <div className="pt-2 px-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#DB2F3C] transition-colors truncate">
          {profile.name}
        </h4>
        <p className="text-[11px] text-[#666666] mt-0.5 truncate">
          {profile.age} Yrs, {profile.height}
        </p>
        <p className="text-[10px] text-stone-400 mt-1 truncate">
          Viewed on: {profile.viewedDate}
        </p>
      </div>
    </Link>
  );
});
ViewedProfileCard.displayName = "ViewedProfileCard";

const ProfilesViewedSectionComponent: React.FC<ProfilesViewedSectionProps> = ({
  profiles = [],
  className = "",
}: any) => {
  console.log("profilesprofilesprofilesprofilesuiuiuiu,", profiles);
  return (
    <section
      aria-label="Profiles You Viewed Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 ${className}`}
    >
      {/* Title & Subtitle */}
      <div className="pb-4">
        <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-heading">
          Profiles You Viewed ({profiles?.length || 0})
        </h3>
        <p className="text-xs text-[#666666] mt-0.5">
          Members that you have viewed
        </p>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
        {profiles?.map((profile: any, index: number) => (
          <ViewedProfileCard key={profile?._id || profile?.id || index} profile={profile} />
        ))}
      </div>
    </section>
  );
};

export const ProfilesViewedSection = memo(ProfilesViewedSectionComponent);
ProfilesViewedSection.displayName = "ProfilesViewedSection";
export default ProfilesViewedSection;
