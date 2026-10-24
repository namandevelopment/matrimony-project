"use client";

import React, { memo, useState, useCallback } from "react";
import { isDeepEqual } from "@/utils";
import Link from "next/link";
import { Camera, ChevronDown, ChevronUp } from "lucide-react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import {
  MaleSilhouetteAvatar,
  UpgradeCrownArt,
  EditProfileMenuIcon,
  EditPreferencesMenuIcon,
  HoroscopeMenuIcon,
  SettingsMenuIcon,
  HelpMenuIcon,
  SuccessStoriesMenuIcon,
  MoreMenuIcon,
  MatchAstroBrandIcon,
  WeddingBazaarBrandIcon,
  MandapBrandIcon,
} from "./DashboardIcons";
import type { UserProfile } from "../types";
import { useProfileQuery } from "@/tanstackQuery";

export interface DashboardProfileCardProps {
  onUpgradeClick?: () => void;
  onPhotoEditClick?: () => void;
  onLogout?: () => void;
  className?: string;
  defaultSettingsOpen?: boolean;
  defaultHelpOpen?: boolean;
}

const DashboardProfileCardComponent: React.FC<DashboardProfileCardProps> = ({

  onUpgradeClick,
  onPhotoEditClick,
  className = "",
  defaultSettingsOpen = false,
  defaultHelpOpen = false,
}) => {
  const { data: profile } = useProfileQuery();
  const user = profile?.profile || null;
  console.log('useroyeroyeyuerieuwy', user)
  const [isSettingsOpen, setIsSettingsOpen] = useState(defaultSettingsOpen);
  const [isHelpOpen, setIsHelpOpen] = useState(defaultHelpOpen);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const toggleHelp = useCallback(() => {
    setIsHelpOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 sm:p-5 flex flex-col ${className}`}
    >
      {/* 1. Avatar + Camera Upload Button */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-[88px] h-[88px] rounded-full overflow-hidden border border-stone-200 bg-[#CBD5E1] flex items-center justify-center shadow-xs">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <MaleSilhouetteAvatar className="w-full h-full" />
            )}
          </div>
          {/* Circular Camera Badge Button */}
          <button
            type="button"
            onClick={onPhotoEditClick}
            aria-label="Change profile photo"
            className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-white border border-stone-300 shadow-xs flex items-center justify-center text-[#1E293B] hover:text-[#DB2F3C] transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Name */}
        <h2 className="mt-3 text-[22px] font-bold text-[#111827] leading-tight font-heading">
          {user?.name}
        </h2>

        {/* Community Badge */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <MatrimonyHeartLogo size={18} className="w-4 h-4 shrink-0" color="#E53935" />
          <span className="text-[15px] font-semibold text-[#111827]">
            {user?.community || "BrahminMatrimony"}
          </span>
        </div>

        {/* Matrimony ID */}
        <p className="mt-1 text-[17px] font-bold text-[#111827] tracking-normal">
          {user?.matrimonyId || "BRH4517087"}
        </p>

        {/* Membership Tier */}
        <p className="mt-0.5 text-[14px] text-stone-500 font-normal">
          {user?.membershipStatus || "Free member"}
        </p>
      </div>

      {/* 2. Upgrade Membership Peach Banner Card */}
      <div className="relative mt-4 mb-3 overflow-hidden rounded-2xl bg-[#FFF5EE] border border-[#FFE4D6] p-4 flex items-center justify-between">
        <div className="flex-1 pr-2 z-10">
          <p className="text-[13.5px] font-bold text-[#111827] leading-[1.25]">
            Upgrade membership to call/chat with matches
          </p>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#E54848] text-white text-[13px] font-semibold hover:bg-[#D93D3D] active:scale-[0.98] shadow-xs transition-all cursor-pointer"
          >
            Upgrade now
          </button>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <UpgradeCrownArt className="w-24 h-18 text-[#EEA47F]" />
        </div>
      </div>

      {/* 3. Profile Edit Links with Clean Separator Lines */}
      <div className="mt-1">
        {/* Edit Profile */}
        <Link
          href="/profile/edit"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <EditProfileMenuIcon className="w-5 h-5 shrink-0" />
          <span>Edit Profile</span>
        </Link>
        <div className="border-b border-stone-200/70" />

        {/* Edit Preferences */}
        <Link
          href="/profile/preferences"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <EditPreferencesMenuIcon className="w-5 h-5 shrink-0" />
          <span>Edit Preferences</span>
        </Link>
        <div className="border-b border-stone-200/70" />

        {/* View/Edit Horoscope */}
        <Link
          href="/profile/horoscope"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <HoroscopeMenuIcon className="w-5 h-5 shrink-0" />
          <span>View/Edit Horoscope</span>
        </Link>
        <div className="border-b border-stone-200/70" />
      </div>

      {/* 4. Support & feedback Section */}
      <div className="mt-2">
        <h3 className="pt-4 pb-2 text-[16px] font-bold text-[#111827]">
          Support & feedback
        </h3>

        {/* Settings Accordion */}
        <button
          type="button"
          onClick={toggleSettings}
          className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <SettingsMenuIcon className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </div>
          {isSettingsOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {isSettingsOpen && (
          <div className="pl-9 pb-2 space-y-2">
            <Link
              href="/settings/account"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              Account Settings
            </Link>
            <Link
              href="/settings/communication"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              Communication Settings
            </Link>
            <Link
              href="/settings/privacy"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              Privacy Settings
            </Link>
            <Link
              href="/settings/ignored"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              Ignored Profiles
            </Link>
            <Link
              href="/settings/blocked"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              Blocked Profiles
            </Link>
          </div>
        )}
        <div className="border-b border-stone-200/70" />

        {/* Help Accordion */}
        <button
          type="button"
          onClick={toggleHelp}
          className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <HelpMenuIcon className="w-5 h-5 shrink-0" />
            <span>Help</span>
          </div>
          {isHelpOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {isHelpOpen && (
          <div className="pl-9 pb-2 space-y-2">
            <Link
              href="/help/faqs"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              FAQ&apos;s
            </Link>
            <Link
              href="/help/24x7"
              className="block text-[14.5px] text-[#111827] hover:text-[#DB2F3C] transition-colors py-1"
            >
              24x7 Help Center
            </Link>
          </div>
        )}
        <div className="border-b border-stone-200/70" />

        {/* Success Stories */}
        <Link
          href="/success-stories"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <SuccessStoriesMenuIcon className="w-5 h-5 shrink-0" />
          <span>Success Stories</span>
        </Link>
        <div className="border-b border-stone-200/70" />

        {/* More */}
        <Link
          href="/more"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <MoreMenuIcon className="w-5 h-5 shrink-0" />
          <span>More</span>
        </Link>
        <div className="border-b border-stone-200/70" />
      </div>

      {/* 5. Matrimony.com - Other Services Section */}
      <div className="mt-2">
        <h3 className="pt-4 pb-2 text-[16px] font-bold text-[#111827]">
          Matrimony.com - Other Services
        </h3>

        {/* MatchAstro.com */}
        <a
          href="https://www.matchastro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <MatchAstroBrandIcon className="w-5 h-5 shrink-0" />
          <span>MatchAstro.com</span>
        </a>
        <div className="border-b border-stone-200/70" />

        {/* WeddingBazaar.com */}
        <a
          href="https://www.weddingbazaar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <WeddingBazaarBrandIcon className="w-5 h-5 shrink-0" />
          <span>WeddingBazaar.com</span>
        </a>
        <div className="border-b border-stone-200/70" />

        {/* Mandap.com */}
        <a
          href="https://www.mandap.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 py-3 text-[15px] font-medium text-[#111827] hover:text-[#DB2F3C] transition-colors"
        >
          <MandapBrandIcon className="w-5 h-5 shrink-0" />
          <span>Mandap.com</span>
        </a>
        <div className="border-b border-stone-200/70" />
      </div>
    </div>
  );
};

export const DashboardProfileCard = memo(
  DashboardProfileCardComponent,
  (prev, next) => isDeepEqual(prev, next)
);
DashboardProfileCard.displayName = "DashboardProfileCard";
export default DashboardProfileCard;
