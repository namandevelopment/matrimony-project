"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Sliders,
  Settings,
  HelpCircle,
  Trophy,
  PlusCircle,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import {
  CrownIcon,
  HoroscopeIcon,
  MaleSilhouetteAvatar,
  MatchAstroIcon,
  WeddingBazaarIcon,
  MandapIcon,
} from "./DashboardIcons";
import type { UserProfile } from "../types";

export interface ProfileDropdownProps {
  user: UserProfile;
  onLogout?: () => void;
  onUpgradeClick?: () => void;
}

// 1. User Info Header inside Dropdown
const DropdownUserInfo = memo<{ user: UserProfile }>(({ user }) => {
  return (
    <div className="flex flex-col items-center text-center pb-3">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-200 shadow-xs mb-2 bg-stone-100 flex items-center justify-center">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <MaleSilhouetteAvatar className="w-full h-full" />
        )}
      </div>
      <h3 className="text-base font-bold text-[#1A1A1A] leading-tight font-heading">
        {user.name}
      </h3>
      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#444444]">
        <MatrimonyHeartLogo size={14} className="w-3.5 h-3.5" color="#DB2F3C" />
        <span className="font-medium text-[#1A1A1A]">{user.community}</span>
      </div>
      <span className="text-xs font-semibold text-[#666666] tracking-wide mt-0.5">
        {user.matrimonyId}
      </span>
      <span className="text-[11px] text-[#888888] mt-0.5">
        {user.membershipStatus}
      </span>
    </div>
  );
});
DropdownUserInfo.displayName = "DropdownUserInfo";

// 2. Mini Upgrade Membership Card inside Dropdown
const DropdownUpgradeCard = memo<{ onUpgradeClick?: () => void }>(({ onUpgradeClick }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF7ED] via-[#FFF1F2] to-[#FFFBEB] border border-amber-200/80 p-3 my-2 shadow-xs">
      <div className="relative z-10">
        <p className="text-[11px] font-medium text-[#78350F] leading-snug">
          Upgrade membership to call/chat with matches
        </p>
        <button
          type="button"
          onClick={onUpgradeClick}
          className="mt-2 w-full py-1.5 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <CrownIcon size={13} color="#FFFFFF" />
          <span>Upgrade now</span>
        </button>
      </div>
      {/* Crown watermark in background */}
      <div className="absolute -bottom-2 -right-2 opacity-15 pointer-events-none">
        <CrownIcon size={52} color="#D97706" />
      </div>
    </div>
  );
});
DropdownUpgradeCard.displayName = "DropdownUpgradeCard";

// 3. Dropdown Menu Link item
interface DropdownLinkItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isRed?: boolean;
}

const DropdownLinkItem = memo<DropdownLinkItemProps>(
  ({ icon, label, href = "#", onClick, isRed = false }) => {
    const content = (
      <div
        className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${
          isRed
            ? "text-[#DB2F3C] hover:bg-red-50"
            : "text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50"
        }`}
      >
        <span className="shrink-0 text-stone-500 group-hover:text-[#DB2F3C]">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
      </div>
    );

    if (onClick) {
      return (
        <button type="button" onClick={onClick} className="w-full text-left">
          {content}
        </button>
      );
    }

    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }
);
DropdownLinkItem.displayName = "DropdownLinkItem";

// 4. Accordion Section for Settings & Help
interface AccordionItemProps {
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const DropdownAccordion = memo<AccordionItemProps>(
  ({ icon, title, isOpen, onToggle, children }) => {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#333333] hover:text-[#DB2F3C] hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-stone-500">{icon}</span>
            <span>{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {isOpen && (
          <div className="pl-9 pr-3 py-1 space-y-1 bg-stone-50/60 rounded-lg my-1">
            {children}
          </div>
        )}
      </div>
    );
  }
);
DropdownAccordion.displayName = "DropdownAccordion";

// 5. External Services item
const OtherServiceItem = memo<{
  icon: React.ReactNode;
  label: string;
  url: string;
}>(({ icon, label, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-3 py-1.5 text-xs text-[#555555] hover:text-[#1A1A1A] hover:bg-stone-50 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ExternalLink className="w-3 h-3 text-stone-400" />
    </a>
  );
});
OtherServiceItem.displayName = "OtherServiceItem";

// ==========================================
// Main ProfileDropdown Component (Hover & Click)
// ==========================================
const ProfileDropdownComponent: React.FC<ProfileDropdownProps> = ({
  user,
  onLogout,
  onUpgradeClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse Enter with smooth delay cancellation
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  // Mouse Leave with 200ms grace period so dropdown does not vanish if cursor wanders slightly
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, []);

  // Click trigger (for mobile/touch or toggling)
  const handleTriggerClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close when clicking outside
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

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const toggleHelp = useCallback(() => {
    setIsHelpOpen((prev) => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Header Profile Trigger: Circular Avatar + Chevron */}
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User Profile Menu"
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DB2F3C]"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <MaleSilhouetteAvatar className="w-full h-full" />
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#DB2F3C]" : ""
          }`}
        />
      </button>

      {/* 2. Floating Dropdown Menu Card (Hover Triggered) */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-[82vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-4 transition-all duration-200 ease-out origin-top-right focus:outline-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          {/* Top User Info */}
          <DropdownUserInfo user={user} />

          {/* Mini Upgrade CTA Banner */}
          <DropdownUpgradeCard onUpgradeClick={onUpgradeClick} />

          {/* Quick Action Links */}
          <div className="space-y-0.5 border-t border-stone-100 pt-2">
            <DropdownLinkItem
              icon={<Edit3 className="w-4 h-4" />}
              label="Edit Profile"
              href="/profile/edit"
            />
            <DropdownLinkItem
              icon={<Sliders className="w-4 h-4" />}
              label="Edit Preferences"
              href="/profile/preferences"
            />
            <DropdownLinkItem
              icon={<HoroscopeIcon className="w-4 h-4" />}
              label="View/Edit Horoscope"
              href="/profile/horoscope"
            />
          </div>

          {/* Support & Feedback Section */}
          <div className="border-t border-stone-100 pt-3 mt-2">
            <span className="block px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Support & feedback
            </span>

            {/* Settings Accordion */}
            <DropdownAccordion
              icon={<Settings className="w-4 h-4" />}
              title="Settings"
              isOpen={isSettingsOpen}
              onToggle={toggleSettings}
            >
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
            </DropdownAccordion>

            {/* Help Accordion */}
            <DropdownAccordion
              icon={<HelpCircle className="w-4 h-4" />}
              title="Help"
              isOpen={isHelpOpen}
              onToggle={toggleHelp}
            >
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
              <Link
                href="/help/feedback"
                className="block py-1 px-2 text-xs text-stone-600 hover:text-[#DB2F3C] rounded transition-colors"
              >
                Feedback
              </Link>
            </DropdownAccordion>

            <DropdownLinkItem
              icon={<Trophy className="w-4 h-4" />}
              label="Success Stories"
              href="/success-stories"
            />
            <DropdownLinkItem
              icon={<PlusCircle className="w-4 h-4" />}
              label="More"
              href="/more"
            />
            <DropdownLinkItem
              icon={<LogOut className="w-4 h-4 text-[#DB2F3C]" />}
              label="Logout"
              onClick={onLogout}
              isRed
            />
          </div>

          {/* Matrimony.com - Other Services Section */}
          <div className="border-t border-stone-100 pt-3 mt-2">
            <span className="block px-3 pb-1 text-[11px] font-semibold text-stone-400">
              Matrimony.com - Other Services
            </span>
            <div className="space-y-0.5 mt-1">
              <OtherServiceItem
                icon={<MatchAstroIcon className="w-3.5 h-3.5" />}
                label="MatchAstro.com"
                url="https://www.matchastro.com"
              />
              <OtherServiceItem
                icon={<WeddingBazaarIcon className="w-3.5 h-3.5" />}
                label="WeddingBazaar.com"
                url="https://www.weddingbazaar.com"
              />
              <OtherServiceItem
                icon={<MandapIcon className="w-3.5 h-3.5" />}
                label="Mandap.com"
                url="https://www.mandap.com"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfileDropdown = memo(ProfileDropdownComponent);
ProfileDropdown.displayName = "ProfileDropdown";
export default ProfileDropdown;
