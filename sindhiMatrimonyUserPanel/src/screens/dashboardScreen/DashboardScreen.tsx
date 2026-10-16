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
  AssistedServiceBanner,
  ProfilesViewedSection,
  HappyMarriagesSection,
  OtherServicesSection,
  HelpContactBanner,
  DashboardFooter,
} from "./components";
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
  completenessScore: 42,
};

const DashboardScreenComponent: React.FC<DashboardScreenProps> = ({
  initialUser = defaultUserProfile,
  initialMatches,
  initialViewedProfiles,
  initialSuccessStories,
  onLogout,
  onUpgradeClick,
  onAssistedServiceClick,
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

  const handleAssistedService = useCallback(() => {
    if (onAssistedServiceClick) {
      onAssistedServiceClick();
    } else {
      router.push("/subscription?plan=assisted");
    }
  }, [onAssistedServiceClick, router]);

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

      {/* 2. Sub-Header Mode Switcher (Regular vs PRIME*) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <DashboardModeSwitcher
          currentMode={mode}
          onModeChange={handleModeChange}
        />
      </div>

      {/* 3. Main Dashboard Body (2 Columns Responsive Layout) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Sidebar with Profile Card, Peach Promo & Settings */}
          <DashboardSidebar
            user={user}
            onUpgradeClick={handleUpgrade}
          />

          {/* Right Column: All Member Sections */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* 1. Complete Your Profile (Completeness Score & 3 Action Tiles) */}
            <ProfileCompletenessCard score={user.completenessScore} />

            {/* 2. All Matches (23) Horizontal Carousel */}
            <DashboardMatchesSection
              matches={initialMatches}
              totalMatchesCount={23}
            />

            {/* 3. Become a Paid Member 71% OFF Banner */}
            <PaidMemberBanner
              discountPercent={71}
              onUpgradeClick={handleUpgrade}
            />

            {/* 4. Assisted Service Luxury Banner (3X Faster with Relationship Manager) */}
            <AssistedServiceBanner
              onGetAssistedService={handleAssistedService}
            />

            {/* 5. Profiles You Viewed (3) */}
            <ProfilesViewedSection
              profiles={initialViewedProfiles}
            />

            {/* 6. Lakhs of Happy Marriages! (Limca Book of Records & View Success Stories) */}
            <HappyMarriagesSection
              stories={initialSuccessStories}
            />

            {/* 7. Matrimony.com - Other Services (AstroFreeChat, Mandap.com, WeddingBazaar) */}
            <OtherServicesSection />

            {/* 8. Need help in using SindhiMatrimony? (Call now & Chat with us) */}
            <HelpContactBanner />
          </div>
        </div>
      </main>

      {/* 4. Full-Width Footer with About Us, Other Services, Help, Quick Links, Limca badge & Socials */}
      <DashboardFooter />
    </div>
  );
};

export const DashboardScreen = memo(DashboardScreenComponent);
DashboardScreen.displayName = "DashboardScreen";
export default DashboardScreen;
