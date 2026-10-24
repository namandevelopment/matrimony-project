"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import { isDeepEqual } from "@/utils";
import Link from "next/link";
import { ChevronDown, ChevronUp, LogOut, Star } from "lucide-react";
import {
  MaleSilhouetteAvatar,
  EditProfileMenuIcon,
  EditPreferencesMenuIcon,
  HoroscopeMenuIcon,
  SettingsMenuIcon,
  HelpMenuIcon,
  SafeMatrimonyMenuIcon,
  SuccessStoriesMenuIcon,
} from "./DashboardIcons";
import type { UserProfile } from "../types";
import { useGlobalModal } from "@/customModals";
import { useProfileQuery } from "@/tanstackQuery";

export interface ProfileDropdownProps {
  onLogout?: () => void;
  onUpgradeClick?: () => void;
}

const ProfileDropdownComponent: React.FC<ProfileDropdownProps> = ({
  onLogout,
  onUpgradeClick,
}) => {
  const { data: profileRes } = useProfileQuery();
  const profileRef = useRef<any>(null);

  if (!isDeepEqual(profileRef.current, profileRes?.profile)) {
    profileRef.current = profileRes?.profile;
    if (profileRes?.profile) {
      console.log('yieyriweyriewyiryeiryiewyriweyriwyeri', profileRef.current);
    }
  }
  const profile = profileRef.current ?? {};

  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { openLogoutModal } = useGlobalModal();

  const handleLogoutClick = useCallback(() => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      openLogoutModal();
    }
  }, [onLogout, openLogoutModal]);

  // Mouse Enter with smooth delay cancellation
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  // Mouse Leave with 300ms grace period to guarantee zero jitter when cursor moves across boundary
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  // Click trigger (for touch devices, mobile screens, or deliberate toggle)
  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen((prev) => !prev);
  }, []);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Accordion toggle handlers
  const toggleSettings = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const toggleHelp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHelpOpen((prev) => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Header Profile Trigger: Avatar circle + Chevron */}
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User Profile Menu"
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DB2F3C]"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0 shadow-2xs">
          {profile?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile?.avatar}
              alt={profile?.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <MaleSilhouetteAvatar className="w-full h-full" />
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#DB2F3C]" : ""
            }`}
        />
      </button>

      {/* 2. Floating Dropdown Menu (1:1 with Screenshot Architecture) */}
      {isOpen && (
        <div
          className="absolute right-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-150 focus:outline-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Caret / Upward Pointing Arrow directly under the circular avatar */}
          <div
            className="absolute top-[2px] right-[37px] sm:right-[39px] w-3.5 h-3.5 bg-white border-t border-l border-stone-200/90 rotate-45 z-20 shadow-[-2px_-2px_4px_rgba(0,0,0,0.03)]"
            aria-hidden="true"
          />

          {/* Main Dropdown Card */}
          <div
            className="relative w-[295px] sm:w-[315px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-[0_16px_40px_-6px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.06)] border border-stone-200/90 p-4 sm:p-4.5 z-10"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E1 transparent",
            }}
          >
            {/* Top User Details */}
            <div className="flex flex-col items-center text-center pt-1 pb-1">
              <h2 className="text-[19px] sm:text-[20px] font-bold text-stone-900 leading-tight tracking-tight font-heading">
                {profile?.name}
              </h2>

              <p className="mt-1 text-[15px] font-semibold text-stone-700 tracking-wide">
                {profile?.matrimonyId || "BRH4517087"}
              </p>

              <p className="mt-0.5 text-[13px] text-stone-500 font-normal">
                {profile?.membershipStatus || "Free member"}
              </p>
            </div>

            {/* Upgrade Membership Banner Card */}
            <div className="mt-3.5 mb-2.5 p-3.5 rounded-xl bg-gradient-to-b from-[#FFF5F2] to-[#FFF0EC] border border-[#FFE2DC] text-center shadow-2xs">
              <p className="text-[13.5px] font-bold text-stone-900 leading-snug">
                Upgrade membership to
                <br />
                call/chat with matches
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onUpgradeClick) onUpgradeClick();
                }}
                className="mt-2.5 inline-flex items-center justify-center px-6 py-1.5 rounded-full bg-[#E54848] hover:bg-[#D93838] active:scale-95 text-white text-[12.5px] font-bold shadow-xs hover:shadow-md hover:shadow-red-500/20 transition-all cursor-pointer"
              >
                Upgrade now
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200/70 my-2" />

            {/* 3 Top Primary Action Links */}
            <div className="space-y-0.5">
              <Link
                href="/profile/edit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
              >
                <EditProfileMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <span>Edit Profile</span>
              </Link>

              <Link
                href="/profile/preferences"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
              >
                <EditPreferencesMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <span>Edit Preferences</span>
              </Link>

              <Link
                href="/profile/horoscope"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
              >
                <HoroscopeMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <span>View/Edit Horoscope</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200/70 my-2" />

            {/* Accordion 1: Settings (Expandable / Collapsible) */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={toggleSettings}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <SettingsMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                  <span>Settings</span>
                </div>
                {isSettingsOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 group-hover:text-[#DB2F3C] transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 group-hover:text-[#DB2F3C] transition-colors" />
                )}
              </button>

              {/* Sub-menu items when Settings is expanded */}
              {isSettingsOpen && (
                <div className="pl-10.5 pr-2 pt-0.5 pb-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/settings/account"
                    onClick={() => setIsOpen(false)}
                    className="block text-[13.5px] font-medium text-stone-700 hover:text-[#DB2F3C] hover:translate-x-1 py-1 transition-all"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/settings/communication"
                    onClick={() => setIsOpen(false)}
                    className="block text-[13.5px] font-medium text-stone-700 hover:text-[#DB2F3C] hover:translate-x-1 py-1 transition-all"
                  >
                    Communication Settings
                  </Link>
                  <Link
                    href="/settings/privacy"
                    onClick={() => setIsOpen(false)}
                    className="block text-[13.5px] font-medium text-stone-700 hover:text-[#DB2F3C] hover:translate-x-1 py-1 transition-all"
                  >
                    Privacy Settings
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 2: Help (Expandable / Collapsible) */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={toggleHelp}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <HelpMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                  <span>Help</span>
                </div>
                {isHelpOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 group-hover:text-[#DB2F3C] transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 group-hover:text-[#DB2F3C] transition-colors" />
                )}
              </button>

              {/* Sub-menu items when Help is expanded */}
              {isHelpOpen && (
                <div className="pl-10.5 pr-2 pt-0.5 pb-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/help"
                    onClick={() => setIsOpen(false)}
                    className="block text-[13.5px] font-medium text-stone-700 hover:text-[#DB2F3C] hover:translate-x-1 py-1 transition-all"
                  >
                    24x7 Help Center
                  </Link>
                  <Link
                    href="/help#faqs"
                    onClick={() => setIsOpen(false)}
                    className="block text-[13.5px] font-medium text-stone-700 hover:text-[#DB2F3C] hover:translate-x-1 py-1 transition-all"
                  >
                    FAQ&apos;s
                  </Link>
                </div>
              )}
            </div>

            {/* Safe Matrimony Link */}
            <Link
              href="/safety-tips"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
            >
              <SafeMatrimonyMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
              <span>Safe Matrimony</span>
            </Link>

            {/* Success Stories Link */}
            <Link
              href="/success-stories"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
            >
              <SuccessStoriesMenuIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
              <span>Success Stories</span>
            </Link>

            {/* Member Reviews & Ratings Link */}
            <Link
              href="/reviews"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] sm:text-[14.5px] font-medium text-stone-800 hover:text-[#DB2F3C] hover:bg-stone-50 transition-colors group"
            >
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0 transition-transform group-hover:scale-105" />
              <span>Member Reviews</span>
            </Link>

            {/* Universal Clean Logout Link */}
            <div className="border-t border-stone-200/70 my-2" />
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3.5 px-2 py-2 rounded-lg text-[14px] font-semibold text-[#DB2F3C] hover:bg-red-50/80 transition-colors cursor-pointer group"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfileDropdown = memo(
  ProfileDropdownComponent,
  (prevProps, nextProps) => isDeepEqual(prevProps, nextProps)
);
ProfileDropdown.displayName = "ProfileDropdown";
export default ProfileDropdown;
