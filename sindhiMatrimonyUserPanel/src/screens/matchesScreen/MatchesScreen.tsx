"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  DashboardModeSwitcher,
  DashboardFooter,
} from "@/screens/dashboardScreen/components";
import { DashboardNavProvider } from "@/screens/dashboardScreen/context/DashboardNavContext";
import type { UserProfile, DashboardMode, DashboardNavTab } from "@/screens/dashboardScreen/types";
import {
  MatchesSidebar,
  MatchesHeaderBar,
  MatchDetailCard,
  AssistedServiceMatchCard,
  MatchesPagination,
  MatchesPreferencesModal,
  MatchesFilterModal,
  RequestPhotoModal,
  ContactDetailsModal,
  FloatingChatWidget,
} from "./components";
import { initialMatchesList, defaultPreferences } from "./mockData";
import {
  MatchDetailProfile,
  MatchCategoryType,
  FilterChipId,
  SortOption,
  PartnerPreferences,
  MatchesScreenProps,
} from "./types";

const defaultUser: UserProfile = {
  name: "Naman",
  matrimonyId: "BRH4517087",
  community: "BrahminMatrimony",
  membershipStatus: "Free member",
  completenessScore: 42,
};

const PAGE_SIZE = 5;

const MatchesScreenComponent: React.FC<MatchesScreenProps> = ({
  initialProfiles = initialMatchesList,
  initialCategory = "your_matches",
  initialMode = "regular",
  onUpgradeClick,
  onAssistedServiceClick,
}) => {
  const router = useRouter();

  // Mode & Tabs
  const [mode, setMode] = useState<DashboardMode>(initialMode);
  const [activeCategory, setActiveCategory] = useState<MatchCategoryType>(initialCategory);

  // Filters & Sorting
  const [activeFilterChips, setActiveFilterChips] = useState<FilterChipId[]>([]);
  const [currentSort, setCurrentSort] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // User interactions state (Sets for O(1) lookups)
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    initialProfiles.forEach((p) => {
      if (p.isShortlisted) initialSet.add(p.id);
    });
    return initialSet;
  });

  const [interestedIds, setInterestedIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    initialProfiles.forEach((p) => {
      if (p.interestSent) initialSet.add(p.id);
    });
    return initialSet;
  });

  const [requestedPhotoIds, setRequestedPhotoIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  // Preferences & Modals
  const [preferences, setPreferences] = useState<PartnerPreferences>(defaultPreferences);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Contact / Request Photo Modals
  const [selectedProfileForContact, setSelectedProfileForContact] =
    useState<MatchDetailProfile | null>(null);
  const [contactModalType, setContactModalType] = useState<"call" | "whatsapp" | null>(null);

  const [selectedProfileForPhoto, setSelectedProfileForPhoto] =
    useState<MatchDetailProfile | null>(null);

  // Navigation handlers
  const handleNavTabChange = useCallback(
    (tabId: DashboardNavTab["id"]) => {
      if (tabId === "home") {
        router.push("/dashboard");
      } else if (tabId === "matches") {
        setActiveCategory("your_matches");
      } else {
        router.push(`/${tabId}`);
      }
    },
    [router]
  );

  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setMode(newMode);
  }, []);

  const handleSelectCategory = useCallback((category: MatchCategoryType) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  // Filter & Sort callbacks
  const handleToggleFilterChip = useCallback((chipId: FilterChipId) => {
    setActiveFilterChips((prev) =>
      prev.includes(chipId) ? prev.filter((id) => id !== chipId) : [...prev, chipId]
    );
    setCurrentPage(1);
  }, []);

  const handleApplyFilterModalChips = useCallback((chips: FilterChipId[]) => {
    setActiveFilterChips(chips);
    setCurrentPage(1);
  }, []);

  const handleSelectSort = useCallback((sort: SortOption) => {
    setCurrentSort(sort);
  }, []);

  // Card action callbacks
  const handleToggleShortlist = useCallback((id: string) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSendInterest = useCallback((id: string) => {
    setInterestedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDontShow = useCallback((id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  }, []);

  const handleRequestPhoto = useCallback(
    (id: string) => {
      const profile = initialProfiles.find((p) => p.id === id);
      if (profile) {
        setSelectedProfileForPhoto(profile);
      }
    },
    [initialProfiles]
  );

  const handleConfirmPhotoRequest = useCallback((id: string) => {
    setRequestedPhotoIds((prev) => new Set(prev).add(id));
  }, []);

  const handleCallClick = useCallback((profile: MatchDetailProfile) => {
    setSelectedProfileForContact(profile);
    setContactModalType("call");
  }, []);

  const handleWhatsAppClick = useCallback((profile: MatchDetailProfile) => {
    setSelectedProfileForContact(profile);
    setContactModalType("whatsapp");
  }, []);

  const handleCloseContactModal = useCallback(() => {
    setSelectedProfileForContact(null);
    setContactModalType(null);
  }, []);

  const handleViewProfile = useCallback(
    (profile: MatchDetailProfile) => {
      router.push(`/matches/viewprofile/${profile.matrimonyId}`);
    },
    [router]
  );

  const handleClosePhotoModal = useCallback(() => {
    setSelectedProfileForPhoto(null);
  }, []);

  const handleAssistedService = useCallback(() => {
    if (onAssistedServiceClick) {
      onAssistedServiceClick();
    } else {
      router.push("/subscription?plan=assisted");
    }
  }, [onAssistedServiceClick, router]);

  const handleUpgrade = useCallback(() => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      router.push("/subscription");
    }
  }, [onUpgradeClick, router]);

  // Dynamic category counts
  const categoryCounts = useMemo<Partial<Record<MatchCategoryType, number>>>(() => {
    return {
      your_matches: initialProfiles.filter((p) => !hiddenIds.has(p.id)).length,
      shortlisted_by_you: shortlistedIds.size,
      viewed_you: 4,
      shortlisted_you: 2,
      viewed_by_you: 6,
      newly_joined: initialProfiles.filter(
        (p) => p.isNewlyJoined && !hiddenIds.has(p.id)
      ).length,
      nearby_matches: 8,
    };
  }, [initialProfiles, hiddenIds, shortlistedIds]);

  // Compute filtered & sorted profiles
  const filteredProfiles = useMemo(() => {
    let result = initialProfiles.filter((p) => !hiddenIds.has(p.id));

    // Filter by category
    if (activeCategory === "shortlisted_by_you") {
      result = result.filter((p) => shortlistedIds.has(p.id));
    } else if (activeCategory === "newly_joined") {
      result = result.filter((p) => p.isNewlyJoined);
    } else if (activeCategory === "viewed_you") {
      result = result.slice(0, 4);
    } else if (activeCategory === "shortlisted_you") {
      result = result.slice(1, 3);
    } else if (activeCategory === "viewed_by_you") {
      result = result.slice(0, 6);
    } else if (activeCategory === "nearby_matches") {
      result = result.filter(
        (p) => p.state === "Maharashtra" || p.state === "Gujarat" || p.state === "Delhi"
      );
    }

    // Filter chips
    if (activeFilterChips.includes("newly_joined")) {
      result = result.filter((p) => p.isNewlyJoined);
    }
    if (activeFilterChips.includes("not_seen")) {
      result = result.filter((p) => p.isNotSeen);
    }
    if (activeFilterChips.includes("with_photo")) {
      result = result.filter((p) => Boolean(p.photoUrl));
    }
    if (activeFilterChips.includes("with_horoscope")) {
      result = result.filter((p) => p.hasHoroscope);
    }

    // Sort order
    if (currentSort === "newly_joined") {
      result = [...result].sort((a, b) => (b.isNewlyJoined ? 1 : 0) - (a.isNewlyJoined ? 1 : 0));
    } else if (currentSort === "age_asc") {
      result = [...result].sort((a, b) => a.age - b.age);
    } else if (currentSort === "age_desc") {
      result = [...result].sort((a, b) => b.age - a.age);
    }

    return result;
  }, [
    initialProfiles,
    hiddenIds,
    activeCategory,
    shortlistedIds,
    activeFilterChips,
    currentSort,
  ]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / PAGE_SIZE));
  const paginatedProfiles = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filteredProfiles.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredProfiles, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <DashboardNavProvider activeTab="matches" onTabChange={handleNavTabChange}>
      <div className="relative min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
        {/* 1. Header with Matches tab active */}
        <DashboardHeader
          user={defaultUser}
          onUpgradeClick={handleUpgrade}
        />

      {/* 2. Mode Switcher (Regular vs PRIME*) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <DashboardModeSwitcher
          currentMode={mode}
          onModeChange={handleModeChange}
        />
      </div>

      {/* 3. Main 2-Column Matches Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Matches Sidebar */}
          <MatchesSidebar
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            counts={categoryCounts}
          />

          {/* Right Column: Header & Cards Feed */}
          <div className="flex-1 w-full min-w-0 space-y-5">
            {/* Top Bar: Title + Filter / Sort Chips */}
            <MatchesHeaderBar
              totalMatchesCount={filteredProfiles.length}
              activeFilterChips={activeFilterChips}
              onToggleFilterChip={handleToggleFilterChip}
              currentSort={currentSort}
              onSelectSort={handleSelectSort}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onOpenPreferencesModal={() => setIsPreferencesOpen(true)}
            />

            {/* Profiles Feed */}
            {paginatedProfiles.length === 0 ? (
              <div className="w-full p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
                <p className="text-base font-bold text-stone-800">
                  No profiles match the selected criteria
                </p>
                <p className="text-xs text-stone-500">
                  Try clearing some filter tags or updating your partner preferences.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilterChips([]);
                    setCurrentSort("relevance");
                  }}
                  className="px-5 py-2 rounded-full bg-[#DB2F3C] text-white text-xs font-semibold hover:bg-[#B71F2A] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProfiles.map((profile, index) => (
                  <React.Fragment key={profile.id}>
                    <MatchDetailCard
                      profile={profile}
                      isShortlisted={shortlistedIds.has(profile.id)}
                      interestSent={interestedIds.has(profile.id)}
                      photoRequested={requestedPhotoIds.has(profile.id)}
                      onToggleShortlist={handleToggleShortlist}
                      onSendInterest={handleSendInterest}
                      onDontShow={handleDontShow}
                      onRequestPhoto={handleRequestPhoto}
                      onCallClick={handleCallClick}
                      onWhatsAppClick={handleWhatsAppClick}
                      onViewProfile={handleViewProfile}
                    />

                    {/* In-feed Assisted Service Banner: Inserted after card 3 or 4 */}
                    {index === 2 && (
                      <AssistedServiceMatchCard
                        onGetAssistedService={handleAssistedService}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProfiles.length > 0 && (
              <MatchesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>

      {/* 4. Full-Width Footer matching screenshot */}
      <DashboardFooter />

      {/* 5. Floating Chat Widget */}
      <FloatingChatWidget />

      {/* 6. Preferences Modal */}
      <MatchesPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={setPreferences}
      />

      {/* 7. Advanced Filter Modal */}
      <MatchesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilterChips={activeFilterChips}
        onApplyChips={handleApplyFilterModalChips}
      />

      {/* 8. Request Photo Confirmation Modal */}
      <RequestPhotoModal
        isOpen={Boolean(selectedProfileForPhoto)}
        profile={selectedProfileForPhoto}
        onClose={handleClosePhotoModal}
        onConfirmRequest={handleConfirmPhotoRequest}
      />

      {/* 9. Contact Details Modal */}
      <ContactDetailsModal
        isOpen={Boolean(selectedProfileForContact)}
        type={contactModalType}
        profile={selectedProfileForContact}
        onClose={handleCloseContactModal}
        onUpgradeClick={handleUpgrade}
      />
      </div>
    </DashboardNavProvider>
  );
};

export const MatchesScreen = memo(MatchesScreenComponent);
MatchesScreen.displayName = "MatchesScreen";
export default MatchesScreen;
