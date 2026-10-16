"use client";

import React, { memo } from "react";
import { DashboardProfileCard } from "./DashboardProfileCard";
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
      className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-4 ${className}`}
      aria-label="User Profile Sidebar"
    >
      <DashboardProfileCard
        user={user}
        onUpgradeClick={onUpgradeClick}
        onPhotoEditClick={onPhotoEditClick}
      />
    </aside>
  );
};

export const DashboardSidebar = memo(DashboardSidebarComponent);
DashboardSidebar.displayName = "DashboardSidebar";
export default DashboardSidebar;
