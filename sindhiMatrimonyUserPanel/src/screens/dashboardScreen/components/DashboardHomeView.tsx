"use client";

import React, { memo } from "react";
import { isDeepEqual } from "@/utils";
import {
  DashboardSidebar,
  ProfileCompletenessCard,
  DashboardMatchesSection,
  DashboardHoroscopeSection,
  PaidMemberBanner,
  AssistedServiceBanner,
  ProfilesViewedSection,
  HappyMarriagesSection,
  OtherServicesSection,
  HelpContactBanner,
} from "./";
import type {
  UserProfile,
  MatchProfile,
  ViewedProfile,
  MarriageSuccessStory,
} from "../types";
import { useProfileQuery } from "@/tanstackQuery";

export interface DashboardHomeViewProps {
  user: UserProfile;
  initialMatches?: MatchProfile[];
  initialViewedProfiles?: ViewedProfile[];
  initialSuccessStories?: MarriageSuccessStory[];
  onUpgradeClick?: () => void;
  onAssistedServiceClick?: () => void;
}

const DashboardHomeViewComponent: React.FC<DashboardHomeViewProps> = ({
  user,
  initialMatches,
  initialViewedProfiles,
  initialSuccessStories,
  onUpgradeClick,
  onAssistedServiceClick,
}) => {

  //  const { data: profileRes } = useProfileQuery();
  return (
    <div className="flex flex-col lg:flex-row items-start gap-6">
      {/* Left Column: Sidebar with Profile Card, Peach Promo & Settings */}
      <DashboardSidebar
        onUpgradeClick={onUpgradeClick}
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

        {/* 3. Daily Horoscope (दैनिक राशिफल & कुंडली मिलान) */}
        <DashboardHoroscopeSection />

        {/* 4. Become a Paid Member 71% OFF Banner */}
        <PaidMemberBanner
          discountPercent={71}
          onUpgradeClick={onUpgradeClick}
        />

        {/* 4. Assisted Service Luxury Banner (3X Faster with Relationship Manager) */}
        <AssistedServiceBanner
          onGetAssistedService={onAssistedServiceClick}
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
  );
};

export const DashboardHomeView = memo(
  DashboardHomeViewComponent,
  (prev, next) => isDeepEqual(prev, next)
);
DashboardHomeView.displayName = "DashboardHomeView";
export default DashboardHomeView;
