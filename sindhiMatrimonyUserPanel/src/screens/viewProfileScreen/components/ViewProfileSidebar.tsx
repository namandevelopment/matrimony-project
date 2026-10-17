"use client";

import React, { memo } from "react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";

export interface ViewProfileSidebarProps {
  onViewBranches?: () => void;
  onReadSuccessStory?: () => void;
  communityName?: string;
  className?: string;
}

// Branch Storefront Vector Illustration matching screenshot
const BranchStoreIllustration = memo(() => {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <div className="relative w-44 h-32 bg-sky-50/50 rounded-2xl flex items-center justify-center">
        {/* Building outline */}
        <div className="w-36 h-28 bg-white rounded-t-lg border-2 border-indigo-100 shadow-xs relative flex flex-col items-center">
          {/* Awning */}
          <div className="w-full h-4 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between px-1">
            <div className="w-3 h-2 bg-indigo-200 rounded-b-xs" />
            <div className="w-3 h-2 bg-indigo-200 rounded-b-xs" />
            <div className="w-3 h-2 bg-indigo-200 rounded-b-xs" />
            <div className="w-3 h-2 bg-indigo-200 rounded-b-xs" />
            <div className="w-3 h-2 bg-indigo-200 rounded-b-xs" />
          </div>

          {/* Logo sign on building */}
          <div className="mt-2 w-9 h-9 rounded-md bg-[#DB2F3C] flex items-center justify-center shadow-xs">
            <MatrimonyHeartLogo size={22} color="#FFFFFF" />
          </div>

          {/* Door and windows */}
          <div className="absolute bottom-0 inset-x-2 flex items-end justify-between px-2">
            {/* Left window */}
            <div className="w-5 h-6 bg-sky-100 border border-indigo-200 rounded-t-xs" />

            {/* Entrance Door */}
            <div className="w-7 h-10 bg-indigo-50 border-t border-x border-indigo-300 rounded-t-xs flex items-center justify-center">
              <div className="w-1 h-1 bg-stone-400 rounded-full ml-3" />
            </div>

            {/* Right window */}
            <div className="w-5 h-6 bg-sky-100 border border-indigo-200 rounded-t-xs" />
          </div>
        </div>
      </div>
    </div>
  );
});
BranchStoreIllustration.displayName = "BranchStoreIllustration";

const ViewProfileSidebarComponent: React.FC<ViewProfileSidebarProps> = ({
  onViewBranches,
  onReadSuccessStory,
  communityName = "SindhiMatrimony",
  className = "",
}) => {
  return (
    <aside
      className={`w-full lg:w-80 shrink-0 space-y-5 sticky top-20 self-start ${className}`}
      aria-label="Promotion and trust banners"
    >
      {/* 1. Card: Millions of happy marriages (Matched Through Matrimony) */}
      <div className="w-full bg-[#FFF9F5] border border-[#FDE5D6] rounded-2xl p-5 text-center shadow-2xs space-y-3">
        <div>
          <h3 className="text-base font-bold text-stone-900 tracking-tight leading-snug">
            Millions of happy marriages
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Matched Through {communityName}
          </p>
        </div>

        {/* Couple Photo Card */}
        <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-200 border border-stone-200 shadow-2xs relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/couple_1.jpg"
            alt="Happy married couple"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
        </div>

        <p className="text-xs sm:text-sm font-bold text-stone-900 pt-0.5">
          Saravana sharma & Srinika
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={onReadSuccessStory}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs sm:text-[13px] font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            Read Their Story
          </button>
        </div>
      </div>

      {/* 2. Card: 140+ Matrimony branches across India */}
      <div className="w-full bg-[#F4F9FD] border border-[#DEEDF8] rounded-2xl p-5 text-center shadow-2xs space-y-3">
        <div>
          <h3 className="text-base font-bold text-stone-900 tracking-tight leading-snug">
            140+ Matrimony branches across India
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            To serve you better
          </p>
        </div>

        {/* Storefront Illustration */}
        <BranchStoreIllustration />

        <p className="text-xs text-stone-700 font-medium px-2">
          Visit any of our 140+ Matrimony branches
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={onViewBranches}
            className="w-full sm:w-auto px-7 py-2 rounded-full border border-[#DB2F3C] bg-white text-[#DB2F3C] hover:bg-[#FDE8E9] text-xs sm:text-[13px] font-bold shadow-2xs active:scale-98 transition-all cursor-pointer"
          >
            View Branches
          </button>
        </div>
      </div>

      {/* 3. Reserved Ad Slot (For future Google AdSense / Sponsor Banners) */}
      <div
        id="sidebar-ad-placement"
        className="w-full rounded-2xl border border-dashed border-stone-200 bg-white/60 p-4 text-center transition-all hidden"
        aria-label="Sponsored Advertisement Space"
      >
        {/* Placeholder ready to plug in AdSense code or sponsor image */}
        <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
          Advertisement
        </p>
      </div>
    </aside>
  );
};

export const ViewProfileSidebar = memo(ViewProfileSidebarComponent);
ViewProfileSidebar.displayName = "ViewProfileSidebar";
