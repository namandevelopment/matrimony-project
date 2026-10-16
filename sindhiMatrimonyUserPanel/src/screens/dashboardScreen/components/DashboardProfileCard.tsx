"use client";

import React, { memo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Camera,
  Edit3,
  Sliders,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import {
  CrownIcon,
  HoroscopeIcon,
  MaleSilhouetteAvatar,
} from "./DashboardIcons";
import type { UserProfile } from "../types";

export interface DashboardProfileCardProps {
  user: UserProfile;
  onUpgradeClick?: () => void;
  onPhotoEditClick?: () => void;
  className?: string;
}

const DashboardProfileCardComponent: React.FC<DashboardProfileCardProps> = ({
  user,
  onUpgradeClick,
  onPhotoEditClick,
  className = "",
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const toggleHelp = useCallback(() => {
    setIsHelpOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col ${className}`}
    >
      {/* 1. User Avatar + Camera Badge */}
      <div className="flex flex-col items-center text-center pb-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 bg-stone-100 flex items-center justify-center shadow-xs">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <MaleSilhouetteAvatar className="w-full h-full" />
            )}
          </div>
          {/* Camera upload badge */}
          <button
            type="button"
            onClick={onPhotoEditClick}
            aria-label="Change Profile Photo"
            className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-stone-300 shadow-xs flex items-center justify-center text-stone-600 hover:text-[#DB2F3C] hover:border-[#DB2F3C] transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Info */}
        <h2 className="mt-3 text-lg font-bold text-[#1A1A1A] leading-tight font-heading">
          {user.name}
        </h2>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#444444]">
          <MatrimonyHeartLogo size={14} className="w-3.5 h-3.5" color="#DB2F3C" />
          <span className="font-medium text-[#1A1A1A]">{user.community}</span>
        </div>
        <span className="text-xs font-semibold text-[#666666] tracking-wide mt-1">
          {user.matrimonyId}
        </span>
        <span className="text-xs text-[#888888] mt-0.5">
          {user.membershipStatus}
        </span>
      </div>

      {/* 2. Upgrade Membership Banner Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF7ED] via-[#FFF1F2] to-[#FFFBEB] border border-amber-200/80 p-3.5 my-2 shadow-xs">
        <div className="relative z-10">
          <p className="text-xs font-medium text-[#78350F] leading-snug">
            Upgrade membership to call/chat with matches
          </p>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="mt-2.5 w-full py-1.5 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CrownIcon size={13} color="#FFFFFF" />
            <span>Upgrade now</span>
          </button>
        </div>
        {/* Crown watermark illustration in corner */}
        <div className="absolute -bottom-3 -right-3 opacity-15 pointer-events-none">
          <CrownIcon size={64} color="#D97706" />
        </div>
      </div>

      {/* 3. Action Links */}
      <div className="space-y-1 border-t border-stone-100 pt-3 mt-1">
        <Link
          href="/profile/edit"
          className="flex items-center gap-3 px-3 py-2 text-xs sm:text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4 text-stone-500" />
          <span>Edit Profile</span>
        </Link>
        <Link
          href="/profile/preferences"
          className="flex items-center gap-3 px-3 py-2 text-xs sm:text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors"
        >
          <Sliders className="w-4 h-4 text-stone-500" />
          <span>Edit Preferences</span>
        </Link>
        <Link
          href="/profile/horoscope"
          className="flex items-center gap-3 px-3 py-2 text-xs sm:text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors"
        >
          <HoroscopeIcon className="w-4 h-4 text-stone-500" />
          <span>View/Edit Horoscope</span>
        </Link>
      </div>

      {/* 4. Support & Feedback Section */}
      <div className="border-t border-stone-100 pt-3 mt-2">
        <span className="block px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          Support & feedback
        </span>

        {/* Settings Accordion */}
        <div className="w-full">
          <button
            type="button"
            onClick={toggleSettings}
            className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-stone-500" />
              <span>Settings</span>
            </div>
            {isSettingsOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>
          {isSettingsOpen && (
            <div className="pl-9 pr-3 py-1 space-y-1 bg-stone-50/60 rounded-lg my-1">
              <Link
                href="/settings/account"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Account Settings
              </Link>
              <Link
                href="/settings/communication"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Communication Settings
              </Link>
              <Link
                href="/settings/privacy"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Privacy Settings
              </Link>
              <Link
                href="/settings/ignored"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Ignored Profiles
              </Link>
              <Link
                href="/settings/blocked"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Blocked Profiles
              </Link>
            </div>
          )}
        </div>

        {/* Help Accordion */}
        <div className="w-full">
          <button
            type="button"
            onClick={toggleHelp}
            className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-stone-500" />
              <span>Help</span>
            </div>
            {isHelpOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>
          {isHelpOpen && (
            <div className="pl-9 pr-3 py-1 space-y-1 bg-stone-50/60 rounded-lg my-1">
              <Link
                href="/help"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                24x7 Help Centre
              </Link>
              <Link
                href="/help/contact"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/safety-tips"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Safety Tips
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DashboardProfileCard = memo(DashboardProfileCardComponent);
DashboardProfileCard.displayName = "DashboardProfileCard";
export default DashboardProfileCard;
