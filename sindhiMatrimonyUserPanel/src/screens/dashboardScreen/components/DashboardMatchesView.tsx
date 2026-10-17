"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
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
} from "@/screens/matchesScreen/components";
import { initialMatchesList, defaultPreferences } from "@/screens/matchesScreen/mockData";
import type {
  MatchDetailProfile,
  MatchCategoryType,
  FilterChipId,
  SortOption,
  PartnerPreferences,
} from "@/screens/matchesScreen/types";
import type { UserProfile } from "../types";

export interface DashboardMatchesViewProps {
  user: UserProfile;
  onUpgradeClick?: () => void;
  onAssistedServiceClick?: () => void;
}

const PAGE_SIZE = 5;

const DashboardMatchesViewComponent: React.FC<DashboardMatchesViewProps> = ({
  onUpgradeClick,
  onAssistedServiceClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<MatchCategoryType>("your_matches");
  const [activeFilterChips, setActiveFilterChips] = useState<FilterChipId[]>([]);
  const [currentSort, setCurrentSort] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // User interactions state
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    initialMatchesList.forEach((p) => {
      if (p.isShortlisted) initialSet.add(p.id);
    });
    return initialSet;
  });

  const [interestedIds, setInterestedIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    initialMatchesList.forEach((p) => {
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

  const [selectedProfileForContact, setSelectedProfileForContact] =
    useState<MatchDetailProfile | null>(null);
  const [contactModalType, setContactModalType] = useState<"call" | "whatsapp" | null>(null);
  const [selectedProfileForPhoto, setSelectedProfileForPhoto] =
    useState<MatchDetailProfile | null>(null);

  // Category select
  const handleSelectCategory = useCallback((category: MatchCategoryType) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  // Filter chips
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

  // Card actions
  const handleToggleShortlist = useCallback((id: string) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSendInterest = useCallback((id: string) => {
    setInterestedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDontShow = useCallback((id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  }, []);

  const handleRequestPhoto = useCallback((id: string) => {
    const profile = initialMatchesList.find((p) => p.id === id);
    if (profile) setSelectedProfileForPhoto(profile);
  }, []);

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

  const handleClosePhotoModal = useCallback(() => {
    setSelectedProfileForPhoto(null);
  }, []);

  // Counts
  const categoryCounts = useMemo<Partial<Record<MatchCategoryType, number>>>(() => {
    return {
      your_matches: initialMatchesList.filter((p) => !hiddenIds.has(p.id)).length,
      shortlisted_by_you: shortlistedIds.size,
      viewed_you: 4,
      shortlisted_you: 2,
      viewed_by_you: 6,
      newly_joined: initialMatchesList.filter(
        (p) => p.isNewlyJoined && !hiddenIds.has(p.id)
      ).length,
      nearby_matches: 8,
    };
  }, [hiddenIds, shortlistedIds]);

  // Filtered & Sorted
  const filteredProfiles = useMemo(() => {
    let result = initialMatchesList.filter((p) => !hiddenIds.has(p.id));

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

    if (currentSort === "newly_joined") {
      result = [...result].sort((a, b) => (b.isNewlyJoined ? 1 : 0) - (a.isNewlyJoined ? 1 : 0));
    } else if (currentSort === "age_asc") {
      result = [...result].sort((a, b) => a.age - b.age);
    } else if (currentSort === "age_desc") {
      result = [...result].sort((a, b) => b.age - a.age);
    }

    return result;
  }, [hiddenIds, activeCategory, shortlistedIds, activeFilterChips, currentSort]);

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
    <div className="flex flex-col lg:flex-row items-start gap-6">
      {/* Left Column: Matches Sidebar */}
      <MatchesSidebar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        counts={categoryCounts}
      />

      {/* Right Column: Header & Cards Feed */}
      <div className="flex-1 w-full min-w-0 space-y-5">
        <MatchesHeaderBar
          totalMatchesCount={filteredProfiles.length}
          activeFilterChips={activeFilterChips}
          onToggleFilterChip={handleToggleFilterChip}
          currentSort={currentSort}
          onSelectSort={handleSelectSort}
          onOpenFilterModal={() => setIsFilterModalOpen(true)}
          onOpenPreferencesModal={() => setIsPreferencesOpen(true)}
        />

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
                />

                {/* In-feed Assisted Service Banner after Card 3 */}
                {index === 2 && (
                  <AssistedServiceMatchCard
                    onGetAssistedService={onAssistedServiceClick}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {filteredProfiles.length > 0 && (
          <MatchesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modals */}
      <MatchesPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={setPreferences}
      />

      <MatchesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilterChips={activeFilterChips}
        onApplyChips={handleApplyFilterModalChips}
      />

      <RequestPhotoModal
        isOpen={Boolean(selectedProfileForPhoto)}
        profile={selectedProfileForPhoto}
        onClose={handleClosePhotoModal}
        onConfirmRequest={handleConfirmPhotoRequest}
      />

      <ContactDetailsModal
        isOpen={Boolean(selectedProfileForContact)}
        type={contactModalType}
        profile={selectedProfileForContact}
        onClose={handleCloseContactModal}
        onUpgradeClick={onUpgradeClick}
      />
    </div>
  );
};

export const DashboardMatchesView = memo(DashboardMatchesViewComponent);
DashboardMatchesView.displayName = "DashboardMatchesView";
export default DashboardMatchesView;
