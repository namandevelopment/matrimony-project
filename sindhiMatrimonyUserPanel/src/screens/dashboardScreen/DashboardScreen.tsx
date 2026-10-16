"use client";

import React, { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  DashboardModeSwitcher,
  DashboardSidebar,
  ProfileCompletenessCard,
  DashboardMatchesSection,
  PaidMemberBanner,
} from "./components";
import { FloatingChatWidget } from "@/components";
import type {
  UserProfile,
  DashboardNavTab,
  DashboardMode,
  DashboardScreenProps,
} from "./types";

const defaultUserProfile: UserProfile = {
  name: "Naman",
  matrimonyId: "SND4517087",
  community: "SindhiMatrimony",
  membershipStatus: "Free member",
  completenessScore: 41,
};

const DashboardScreenComponent: React.FC<DashboardScreenProps> = ({
  initialUser = defaultUserProfile,
  initialMatches,
  onLogout,
  onUpgradeClick,
}) => {
  const router = useRouter();
  const [user] = useState<UserProfile>(initialUser);
  const [activeTab, setActiveTab] = useState<DashboardNavTab["id"]>("home");
  const [mode, setMode] = useState<DashboardMode>("regular");

  const handleTabChange = useCallback((tabId: DashboardNavTab["id"]) => {
    setActiveTab(tabId);
  }, []);

  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setMode(newMode);
  }, []);

  const handleUpgrade = useCallback(() => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      router.push("/subscription");
    }
  }, [onUpgradeClick, router]);

  const handleLogoutAction = useCallback(() => {
    if (onLogout) {
      onLogout();
    } else {
      router.push("/");
    }
  }, [onLogout, router]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
      {/* 1. Sticky Header with Logo, Navigation, and Profile Hover Dropdown */}
      <DashboardHeader
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogoutAction}
        onUpgradeClick={handleUpgrade}
      />

      {/* 2. Mode Switcher (Regular vs PRIME*) */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardModeSwitcher
            currentMode={mode}
            onModeChange={handleModeChange}
          />
        </div>
      </div>

      {/* 3. Main Dashboard Body (2 Columns Layout) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Sidebar with Profile Card & Navigation */}
          <DashboardSidebar
            user={user}
            onUpgradeClick={handleUpgrade}
          />

          {/* Right Column: Profile Completeness + Matches Carousel + Upgrade Offer Banner */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* Complete Your Profile (Completeness Score & 3 Action Tiles) */}
            <ProfileCompletenessCard score={user.completenessScore} />

            {/* All Matches (28) Horizontal Carousel */}
            <DashboardMatchesSection
              matches={initialMatches}
              totalMatchesCount={28}
            />

            {/* Become a Paid Member 71% OFF Banner */}
            <PaidMemberBanner
              discountPercent={71}
              onUpgradeClick={handleUpgrade}
            />
          </div>
        </div>
      </main>

      {/* 4. Bottom Right Floating Support Chat / Feedback Widget with badge */}
      <FloatingChatWidget />
    </div>
  );
};

export const DashboardScreen = memo(DashboardScreenComponent);
DashboardScreen.displayName = "DashboardScreen";
export default DashboardScreen;
