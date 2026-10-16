"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Heart,
  MessageSquare,
  Search,
  Bell,
} from "lucide-react";
import type { DashboardNavTab } from "../types";

export interface DashboardNavProps {
  activeTab?: DashboardNavTab["id"];
  onTabChange?: (tabId: DashboardNavTab["id"]) => void;
  notificationCount?: number;
}

interface NavItemProps {
  id: DashboardNavTab["id"];
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  badgeCount?: number;
  onClick?: () => void;
}

const NavItem = memo<NavItemProps>(
  ({ label, href, icon, isActive, badgeCount, onClick }) => {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? "text-[#DB2F3C] font-semibold"
            : "text-[#555555] hover:text-[#DB2F3C] hover:bg-stone-50"
        }`}
      >
        <span
          className={`shrink-0 transition-transform duration-150 ${
            isActive ? "text-[#DB2F3C] scale-105" : "text-[#666666]"
          }`}
        >
          {icon}
        </span>
        <span className="hidden md:inline">{label}</span>

        {/* Optional notification badge */}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#DB2F3C] text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}

        {/* Subtle active underline indicator */}
        {isActive && (
          <span className="absolute -bottom-1 left-2.5 right-2.5 h-0.5 bg-[#DB2F3C] rounded-full hidden md:block" />
        )}
      </Link>
    );
  }
);
NavItem.displayName = "NavItem";

const DashboardNavComponent: React.FC<DashboardNavProps> = ({
  activeTab = "home",
  onTabChange,
  notificationCount = 0,
}) => {
  return (
    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Dashboard Navigation">
      <NavItem
        id="home"
        label="Home"
        href="/dashboard"
        icon={<Home className="w-4 h-4 fill-current" />}
        isActive={activeTab === "home"}
        onClick={() => onTabChange?.("home")}
      />
      <NavItem
        id="matches"
        label="Matches"
        href="/matches"
        icon={<Users className="w-4 h-4" />}
        isActive={activeTab === "matches"}
        onClick={() => onTabChange?.("matches")}
      />
      <NavItem
        id="interests"
        label="Interests"
        href="/interests"
        icon={<Heart className="w-4 h-4" />}
        isActive={activeTab === "interests"}
        onClick={() => onTabChange?.("interests")}
      />
      <NavItem
        id="messages"
        label="Messages"
        href="/messages"
        icon={<MessageSquare className="w-4 h-4" />}
        isActive={activeTab === "messages"}
        onClick={() => onTabChange?.("messages")}
      />
      <NavItem
        id="search"
        label="Search"
        href="/search"
        icon={<Search className="w-4 h-4" />}
        isActive={activeTab === "search"}
        onClick={() => onTabChange?.("search")}
      />
      <NavItem
        id="notifications"
        label="Notification"
        href="/notifications"
        icon={<Bell className="w-4 h-4" />}
        isActive={activeTab === "notifications"}
        badgeCount={notificationCount}
        onClick={() => onTabChange?.("notifications")}
      />
    </nav>
  );
};

export const DashboardNav = memo(DashboardNavComponent);
DashboardNav.displayName = "DashboardNav";
export default DashboardNav;
