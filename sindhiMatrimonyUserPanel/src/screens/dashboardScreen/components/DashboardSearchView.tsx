"use client";

import React, { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import {
  SearchTabsBar,
  SearchBasicSection,
  SearchReligiousSection,
  SearchProfessionalSection,
  SearchLocationSection,
  SearchLifestyleSection,
  SearchProfileIdView,
  SearchSavedView,
  SearchBottomStickyBar,
} from "@/screens/searchScreen/components";
import type { SearchTab, SearchCriteriaState } from "@/screens/searchScreen/types";

export interface DashboardSearchViewProps {
  onUpgradeClick?: () => void;
  className?: string;
}

const defaultCriteria: SearchCriteriaState = {
  ageFrom: 20,
  ageTo: 27,
  heightFrom: "4'0\"",
  heightTo: "4'7\"",
  profileCreatedBy: "Any",
  caste: "Any Caste",
  star: "",
  withHoroscopeOnly: false,
  manglik: "Doesn't Matter",
  gothra: "All except my gothra",
  occupation: "Any",
  incomeFrom: "Any",
  incomeTo: "Any",
  employmentType: "Any",
  education: "Bachelors - Engineering / Technology",
  nearbyOnly: false,
  country: "Any",
  mutualHobbiesOnly: false,
  eatingHabits: "Non-vegetarian, Eggetarian, Vegetarian",
  maritalStatus: "Doesn't Matter",
  state: "Any State",
};

const DashboardSearchViewComponent: React.FC<DashboardSearchViewProps> = ({
  onUpgradeClick,
  className = "",
}) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<SearchTab>("criteria");
  const [criteria, setCriteria] = useState<SearchCriteriaState>(defaultCriteria);

  const handleTabChange = useCallback((newTab: SearchTab) => {
    setCurrentTab(newTab);
  }, []);

  const handleCriteriaUpdate = useCallback((updates: Partial<SearchCriteriaState>) => {
    setCriteria((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSearchSubmit = useCallback(() => {
    // Navigates to matches with applied criteria
    router.push("/matches");
  }, [router]);

  const handleSearchIdSubmit = useCallback((id: string) => {
    router.push(`/matches/viewprofile/${id}`);
  }, [router]);

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Main Search Criteria Card matching Screenshots 3, 4, 5 */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs">
        {/* 1. Tabs Bar */}
        <SearchTabsBar currentTab={currentTab} onTabChange={handleTabChange} />

        {/* 2. Top Title */}
        <div className="px-6 py-4 border-b border-stone-100 bg-white">
          <h1 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            Search profiles using the below criteria
          </h1>
        </div>

        {/* 3. Tab Contents */}
        {currentTab === "criteria" && (
          <div>
            <SearchBasicSection
              criteria={criteria}
              onChange={handleCriteriaUpdate}
            />

            <SearchReligiousSection
              criteria={criteria}
              onChange={handleCriteriaUpdate}
              onUpgradeClick={onUpgradeClick}
            />

            <SearchProfessionalSection
              criteria={criteria}
              onChange={handleCriteriaUpdate}
            />

            <SearchLocationSection
              criteria={criteria}
              onChange={handleCriteriaUpdate}
            />

            <SearchLifestyleSection
              criteria={criteria}
              onChange={handleCriteriaUpdate}
            />

            {/* Bottom Sticky Search Bar matching Screenshots 3, 4, 5 */}
            <SearchBottomStickyBar
              totalMatchesCount={23}
              onSearch={handleSearchSubmit}
            />
          </div>
        )}

        {currentTab === "profile_id" && (
          <SearchProfileIdView onSearchId={handleSearchIdSubmit} />
        )}

        {currentTab === "saved_search" && <SearchSavedView />}
      </div>
    </div>
  );
};

export const DashboardSearchView = memo(DashboardSearchViewComponent);
DashboardSearchView.displayName = "DashboardSearchView";
export default DashboardSearchView;
