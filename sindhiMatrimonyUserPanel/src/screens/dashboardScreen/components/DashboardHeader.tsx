"use client";

import React, { memo } from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import { DashboardNav } from "./DashboardNav";
import { ProfileDropdown } from "./ProfileDropdown";
import type { UserProfile, DashboardNavTab } from "../types";

export interface DashboardHeaderProps {
  user: UserProfile;
  activeTab?: DashboardNavTab["id"];
  onTabChange?: (tabId: DashboardNavTab["id"]) => void;
  onLogout?: () => void;
  onUpgradeClick?: () => void;
  subtitle?: string;
  className?: string;
}

const DashboardHeaderComponent: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab = "home",
  onTabChange,
  onLogout,
  onUpgradeClick,
  subtitle = "From Matrimony.com Group",
  className = "",
}) => {
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-[#E9E9E9] shadow-xs ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          href="/dashboard"
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
              Sindhi<span className="text-[#DB2F3C]">Matrimony</span>.com
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#666666] font-normal tracking-wide">
              {subtitle}
            </span>
          </div>
        </Link>

        {/* Right: Nav Links + Profile Avatar Trigger (Hoverable) */}
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Main Navigation Links */}
          <DashboardNav
            activeTab={activeTab}
            onTabChange={onTabChange}
            notificationCount={0}
          />

          {/* Profile Hover Dropdown Trigger */}
          <div className="border-l border-stone-200 pl-2 sm:pl-3">
            <ProfileDropdown
              user={user}
              onLogout={onLogout}
              onUpgradeClick={onUpgradeClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export const DashboardHeader = memo(DashboardHeaderComponent);
DashboardHeader.displayName = "DashboardHeader";
export default DashboardHeader;
