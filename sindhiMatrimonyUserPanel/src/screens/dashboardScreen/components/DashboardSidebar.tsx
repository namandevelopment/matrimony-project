"use client";

import React, { memo } from "react";
import { DashboardProfileCard } from "./DashboardProfileCard";
import { SidebarPartnerDealsWidget } from "./SidebarPartnerDealsWidget";
import type { UserProfile } from "../types";

export interface DashboardSidebarProps {
  user: UserProfile;
  onUpgradeClick?: () => void;
  onPhotoEditClick?: () => void;
  className?: string;
}

const DashboardSidebarComponent: React.FC<DashboardSidebarProps> = ({
  user,
  onUpgradeClick,
  onPhotoEditClick,
  className = "",
}) => {
  return (
    <aside
      className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-4 lg:sticky lg:top-20 self-start transition-all duration-200 ${className}`}
      aria-label="User Profile Sidebar"
    >
      {/* 1. Main User Profile Card */}
      <DashboardProfileCard
        user={user}
        onUpgradeClick={onUpgradeClick}
        onPhotoEditClick={onPhotoEditClick}
      />

      {/* 2. Exclusive Member Shopping & Monetization Deals (Amazon, Flipkart, Meesho) */}
      <SidebarPartnerDealsWidget
        onUpgradeClick={onUpgradeClick}
        isPaidMember={user.membershipStatus?.toLowerCase().includes("paid")}
      />
    </aside>
  );
};

export const DashboardSidebar = memo(DashboardSidebarComponent);
DashboardSidebar.displayName = "DashboardSidebar";
export default DashboardSidebar;
