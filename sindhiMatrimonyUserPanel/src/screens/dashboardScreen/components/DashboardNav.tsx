"use client";

import React, { memo, useCallback } from "react";
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
import { useDashboardNav, defaultNavContext } from "../context/DashboardNavContext";

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
  onSelect: (id: DashboardNavTab["id"], href: string, e: React.MouseEvent) => void;
}

const NavItem = memo<NavItemProps>(
  ({ id, label, href, icon, isActive, badgeCount, onSelect }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        onSelect(id, href, e);
      },
      [id, href, onSelect]
    );

    return (
      <Link
        href={href}
        onClick={handleClick}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
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
  },
  (prev, next) => {
    return (
      prev.id === next.id &&
      prev.label === next.label &&
      prev.href === next.href &&
      prev.isActive === next.isActive &&
      prev.badgeCount === next.badgeCount &&
      prev.onSelect === next.onSelect
    );
  }
);
NavItem.displayName = "NavItem";

// Static invariant icons
const HOME_ICON = <Home className="w-4 h-4 fill-current" />;
const MATCHES_ICON = <Users className="w-4 h-4" />;
const INTERESTS_ICON = <Heart className="w-4 h-4" />;
const MESSAGES_ICON = <MessageSquare className="w-4 h-4" />;
const SEARCH_ICON = <Search className="w-4 h-4" />;
const NOTIFICATIONS_ICON = <Bell className="w-4 h-4" />;

const DashboardNavComponent: React.FC<DashboardNavProps> = ({
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  notificationCount: propNotificationCount,
}) => {
  const context = useDashboardNav();

  const isInsideSPA = Boolean(context.isInsideProvider);
  const currentTab = propActiveTab ?? context.activeTab;
  const notificationCount = propNotificationCount ?? context.notificationCount ?? 0;

  const handleSelect = useCallback(
    (id: DashboardNavTab["id"], href: string, e: React.MouseEvent) => {
      // 1. If we are inside DashboardNavProvider (SPA mode on DashboardScreen):
      if (
        isInsideSPA &&
        context.onTabChange &&
        context.onTabChange !== defaultNavContext.onTabChange
      ) {
        e.preventDefault();
        context.onTabChange(id);
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", href);
        }
        return;
      }

      // 2. Standalone pages (e.g. /profile/edit, /profile/horoscope, /settings, /matches/viewprofile):
      // Do NOT preventDefault and do NOT call window.history.pushState!
      // Next.js Link natively performs smooth client-side navigation to href.
    },
    [isInsideSPA, context.onTabChange]
  );

  return (
    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Dashboard Navigation">
      <NavItem
        id="home"
        label="Home"
        href="/dashboard"
        icon={HOME_ICON}
        isActive={currentTab === "home"}
        onSelect={handleSelect}
      />
      <NavItem
        id="matches"
        label="Matches"
        href="/matches"
        icon={MATCHES_ICON}
        isActive={currentTab === "matches"}
        onSelect={handleSelect}
      />
      <NavItem
        id="interests"
        label="Interests"
        href="/interests"
        icon={INTERESTS_ICON}
        isActive={currentTab === "interests"}
        onSelect={handleSelect}
      />
      <NavItem
        id="messages"
        label="Messages"
        href="/messages"
        icon={MESSAGES_ICON}
        isActive={currentTab === "messages"}
        onSelect={handleSelect}
      />
      <NavItem
        id="search"
        label="Search"
        href="/search"
        icon={SEARCH_ICON}
        isActive={currentTab === "search"}
        onSelect={handleSelect}
      />
      <NavItem
        id="notifications"
        label="Notification"
        href="/notifications"
        icon={NOTIFICATIONS_ICON}
        isActive={currentTab === "notifications"}
        badgeCount={notificationCount}
        onSelect={handleSelect}
      />
    </nav>
  );
};

export const DashboardNav = memo(DashboardNavComponent);
DashboardNav.displayName = "DashboardNav";
export default DashboardNav;
