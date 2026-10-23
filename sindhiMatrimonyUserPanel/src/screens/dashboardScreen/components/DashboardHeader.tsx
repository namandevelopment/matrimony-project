"use client";

import React, { memo } from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import { DashboardNav } from "./DashboardNav";
import { ProfileDropdown } from "./ProfileDropdown";
import { useGlobalModal } from "@/customModals";
import type { UserProfile, DashboardNavTab } from "../types";

import { useDashboardNav } from "../context/DashboardNavContext";

export interface DashboardHeaderProps {
  user: UserProfile;
  activeTab?: DashboardNavTab["id"];
  onTabChange?: (tabId: DashboardNavTab["id"]) => void;
  onLogout?: () => void;
  onUpgradeClick?: () => void;
  subtitle?: string;
  className?: string;
}

const HeaderLogo = memo<{ subtitle?: string; onLogoClick?: (e: React.MouseEvent) => void }>(
  ({ subtitle = "From Matrimony.com Group", onLogoClick }) => {
    return (
      <Link
        href="/dashboard"
        onClick={onLogoClick}
        className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DB2F3C] rounded-lg p-1 transition-opacity hover:opacity-95"
        aria-label="Sindhi Matrimony Home"
      >
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <MatrimonyHeartLogo
            size={38}
            className="w-9 h-9 sm:w-10 sm:h-10"
            color="#DB2F3C"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-xl font-bold tracking-tight text-[#1A1A1A] leading-tight font-heading">
            Sindhi<span className="text-[#DB2F3C]">marriage</span>.in
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#666666] font-normal tracking-wide">
            {subtitle}
          </span>
        </div>
      </Link>
    );
  }
);
HeaderLogo.displayName = "HeaderLogo";

const DashboardHeaderComponent: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
  onUpgradeClick,
  subtitle = "From Matrimony.com Group",
  className = "",
}) => {
  const context = useDashboardNav();
  const { openLogoutModal } = useGlobalModal();
  const effectiveLogout = onLogout || openLogoutModal;

  const handleLogoClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-[#E9E9E9] shadow-xs ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo (Fully isolated and memoized) */}
        <HeaderLogo subtitle={subtitle} onLogoClick={handleLogoClick} />

        {/* Right: Nav Links + Profile Avatar Trigger (Hoverable) */}
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Main Navigation Links (reads active tab via context or props) */}
          <DashboardNav
            activeTab={activeTab}
            onTabChange={onTabChange}
            notificationCount={0}
          />

          {/* Profile Hover Dropdown Trigger */}
          <div className="border-l border-stone-200 pl-2 sm:pl-3">
            <ProfileDropdown
              user={user}
              onLogout={effectiveLogout}
              onUpgradeClick={onUpgradeClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export const DashboardHeader = memo(
  DashboardHeaderComponent,
  (prevProps, nextProps) => {
    // Custom memo comparator:
    // Header does NOT need to re-render when switching tabs because DashboardNav
    // handles activeTab updates via DashboardNavContext without re-rendering the header.
    return (
      prevProps.user === nextProps.user &&
      prevProps.activeTab === nextProps.activeTab &&
      prevProps.onTabChange === nextProps.onTabChange &&
      prevProps.onLogout === nextProps.onLogout &&
      prevProps.onUpgradeClick === nextProps.onUpgradeClick &&
      prevProps.subtitle === nextProps.subtitle &&
      prevProps.className === nextProps.className
    );
  }
);
DashboardHeader.displayName = "DashboardHeader";
export default DashboardHeader;
