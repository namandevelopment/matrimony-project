"use client";

import React, { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/screens/dashboardScreen/components/DashboardHeader";
import { DashboardFooter } from "@/screens/dashboardScreen/components/DashboardFooter";
import { FloatingChatWidget } from "@/screens/matchesScreen/components";
import type { UserProfile, DashboardNavTab } from "@/screens/dashboardScreen/types";
import {
  ViewProfileHeaderNav,
  ViewProfileHeroCard,
  ViewProfileStickyHeader,
  ViewProfilePersonalInfoSection,
  ViewProfileContactInfoSection,
  ViewProfileAboutSection,
  ViewProfilePreferencesSection,
  ViewProfileSidebar,
  AssistedServiceBanner,
  UpgradeModal,
  HoroscopeRequestModal,
  ProfileContactModal,
  BranchesModal,
  ViewProfileScrollTopButton,
} from "./components";
import { ViewProfileScreenProps, ViewUserProfile } from "./types";
import { mapBackendToViewProfile } from "./viewProfileMapper";
import {
  useProfileQuery,
  useCandidateProfileQuery,
  useDashboardMatchesQuery,
  useSendInterestMutation,
  useShortlistMutation,
} from "@/tanstackQuery";
import apiFetch, { ApiURL } from "@/redux/apiService";

const ViewProfileScreenComponent: React.FC<ViewProfileScreenProps> = ({
  initialProfileId,
  onBackToMatches,
  onNavigateToNext,
  onUpgradeClick,
  className = "",
}) => {
  const router = useRouter();

  // 1. Live Backend Profile Queries
  const { data: candidateApiResponse, isLoading: isCandidateLoading } = useCandidateProfileQuery(
    initialProfileId,
    Boolean(initialProfileId)
  );

  const { data: selfApiResponse, isLoading: isSelfLoading } = useProfileQuery(!initialProfileId);
  const { data: dashboardMatchesData } = useDashboardMatchesQuery();
  const matchesFeed = useMemo(() => {
    if (!dashboardMatchesData) return [];
    const items =
      (dashboardMatchesData as any)?.items ||
      (Array.isArray(dashboardMatchesData)
        ? dashboardMatchesData
        : (dashboardMatchesData as any)?.data?.items ||
        (dashboardMatchesData as any)?.data ||
        []);
    return Array.isArray(items) && items.length > 0 ? items : [];
  }, [dashboardMatchesData]);

  // 2. Mutations
  const sendInterestMutation = useSendInterestMutation();
  const shortlistMutation = useShortlistMutation();

  // Live profile transformed from backend API
  const liveBackendProfile: ViewUserProfile | null = useMemo(() => {
    const rawData = initialProfileId ? candidateApiResponse : selfApiResponse;
    return mapBackendToViewProfile(rawData);
  }, [initialProfileId, candidateApiResponse, selfApiResponse]);

  // Current active profile directly from live API
  const currentProfile: ViewUserProfile | null = liveBackendProfile;

  // Current match index in matches feed
  const currentMatchIndex = useMemo(() => {
    if (!initialProfileId || matchesFeed.length === 0) return 0;
    const cleanId = initialProfileId.trim().toLowerCase();
    const idx = matchesFeed.findIndex((m: any) => {
      const mid = String(m._id || m.id || "").toLowerCase();
      const mMat = String(m.matrimonyId || "").toLowerCase();
      return mid === cleanId || mMat === cleanId || mid.includes(cleanId) || cleanId.includes(mid);
    });
    return idx >= 0 ? idx : 0;
  }, [initialProfileId, matchesFeed]);

  const totalMatchesCount = matchesFeed.length;

  // Next profile for pill preview & routing
  const nextProfileInfo = useMemo(() => {
    if (matchesFeed.length > 0) {
      const nextIdx = (currentMatchIndex + 1) % matchesFeed.length;
      const target = matchesFeed[nextIdx];
      return {
        id: target._id || target.id || "",
        matrimonyId: target.matrimonyId || target._id || target.id || "",
        name: target.name || "Next Match",
        photoUrl: target.photoUrl || target.avatar || target.photos?.[0] || (Array.isArray(target.photoUrls) ? target.photoUrls[0] : ""),
      };
    }
    return {
      id: "",
      matrimonyId: "",
      name: "",
      photoUrl: "",
    };
  }, [matchesFeed, currentMatchIndex]);

  // User interactions state (Sets for O(1) lookups)
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [interestSentIds, setInterestSentIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("sent_interests_cache");
        if (stored) {
          JSON.parse(stored).forEach((id: string) => initialSet.add(id));
        }
      } catch { }
    }
    return initialSet;
  });
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  // Synchronize with active profile when live API or cache arrives
  useEffect(() => {
    if (currentProfile?.id) {
      if (currentProfile.isShortlisted) {
        setShortlistedIds((prev) => new Set(prev).add(currentProfile.id));
      }
      if (currentProfile.interestSent) {
        setInterestSentIds((prev) => {
          const next = new Set(prev).add(currentProfile.id);
          if (currentProfile.matrimonyId) next.add(currentProfile.matrimonyId);
          return next;
        });
      }
    }
  }, [currentProfile]);

  // Track profile visit event with client-side deduplication
  const trackedViewsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const targetId = currentProfile?.id || initialProfileId;
    if (targetId && initialProfileId && !trackedViewsRef.current.has(targetId)) {
      trackedViewsRef.current.add(targetId);
      (async () => {
        try {
          await apiFetch({
            url: ApiURL.trackProfileView,
            method: "POST",
            data: {
              viewedProfileId: targetId,
              viewedUserId: (currentProfile as any)?.userId,
            },
          });
        } catch { }
      })();
    }
  }, [currentProfile?.id, currentProfile, initialProfileId]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Modal states
  const [upgradeField, setUpgradeField] = useState<string | null>(null);
  const [isHoroscopeModalOpen, setIsHoroscopeModalOpen] = useState(false);
  const [isHoroscopeSent, setIsHoroscopeSent] = useState(false);
  const [contactModalType, setContactModalType] = useState<"call" | "whatsapp" | null>(null);
  const [isBranchesModalOpen, setIsBranchesModalOpen] = useState(false);

  // Scroll & Sticky bar state
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // IntersectionObserver for Hero card to trigger sticky bar smoothly without scroll lag
  useEffect(() => {
    const heroElem = document.getElementById("profile-hero-card");
    if (!heroElem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero card is no longer intersecting the top of viewport, show sticky header
        setIsStickyHeaderVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "-60px 0px 0px 0px",
      }
    );

    observer.observe(heroElem);
    return () => observer.disconnect();
  }, []);

  // Monitor scroll for Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Action Callbacks with Live Mutations (Optimistic Updates in TanStack Query)
  const handleToggleShortlist = useCallback(
    async (id: string) => {
      const willShortlist = !shortlistedIds.has(id);
      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast(`Removed from your Shortlist.`);
        } else {
          next.add(id);
          showToast(`Added ${currentProfile?.name || "profile"} to your Shortlist.`);
        }
        return next;
      });

      try {
        await shortlistMutation.mutateAsync({
          url: ApiURL.shortlistCandidate(id),
          method: "POST",
          data: { candidateId: id, shortlist: willShortlist, action: willShortlist ? "ADD" : "REMOVE" },
        });
      } catch (e) {
        console.error("Shortlist mutation error:", e);
      }
    },
    [currentProfile?.name, shortlistedIds, showToast, shortlistMutation]
  );

  const handleSendInterest = useCallback(
    async (id: string) => {
      const targetId = id || currentProfile?.id || initialProfileId || "";
      const isAlreadySent =
        interestSentIds.has(targetId) ||
        (currentProfile?.matrimonyId ? interestSentIds.has(currentProfile.matrimonyId) : false);

      const willBeSent = !isAlreadySent;
      setInterestSentIds((prev) => {
        const next = new Set(prev);
        if (!willBeSent) {
          next.delete(targetId);
          if (currentProfile?.id) next.delete(currentProfile.id);
          if (currentProfile?.matrimonyId) next.delete(currentProfile.matrimonyId);
          if (initialProfileId) next.delete(initialProfileId);
          showToast(`Interest withdrawn.`);
        } else {
          next.add(targetId);
          if (currentProfile?.id) next.add(currentProfile.id);
          if (currentProfile?.matrimonyId) next.add(currentProfile.matrimonyId);
          if (initialProfileId) next.add(initialProfileId);
          showToast(`Interest sent to ${currentProfile?.name || "profile"}!`);
        }
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("sent_interests_cache", JSON.stringify(Array.from(next)));
          } catch { }
        }
        return next;
      });

      try {
        await sendInterestMutation.mutateAsync({
          url: ApiURL.interestsSend,
          method: "POST",
          data: {
            receiverProfileId: targetId,
            receiverCandidateId: targetId,
            candidateId: targetId,
            message: "Namaste, we liked your profile and would love to connect.",
          },
        });
      } catch (e) {
        console.error("Send interest mutation error:", e);
      }
    },
    [currentProfile?.name, currentProfile?.id, currentProfile?.matrimonyId, initialProfileId, interestSentIds, showToast, sendInterestMutation]
  );

  const handleNextProfile = useCallback(() => {
    const nextTargetId = nextProfileInfo.matrimonyId || nextProfileInfo.id;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onNavigateToNext) {
      onNavigateToNext(nextTargetId);
    } else if (nextTargetId && initialProfileId) {
      router.push(`/matches/viewprofile/${nextTargetId}`);
    }
  }, [nextProfileInfo, onNavigateToNext, initialProfileId, router]);

  const handleDontShow = useCallback(
    (id: string) => {
      setHiddenIds((prev) => new Set(prev).add(id));
      showToast(`${currentProfile?.name || "Profile"} won't be shown in your matches again.`);
      handleNextProfile();
    },
    [currentProfile?.name, showToast, handleNextProfile]
  );

  const handleBackToMatches = useCallback(() => {
    if (onBackToMatches) {
      onBackToMatches();
    } else {
      router.push("/matches");
    }
  }, [onBackToMatches, router]);

  const handleCallClick = useCallback(() => {
    setContactModalType("call");
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    setContactModalType("whatsapp");
  }, []);

  const handleUpgradeField = useCallback((field: string) => {
    setUpgradeField(field);
  }, []);

  const handleHoroscopeRequest = useCallback(() => {
    setIsHoroscopeSent(false);
    setIsHoroscopeModalOpen(true);
  }, []);

  const handleConfirmHoroscopeSend = useCallback(() => {
    setIsHoroscopeSent(true);
    showToast(`Horoscope request sent to ${currentProfile?.name || "profile"}.`);
  }, [currentProfile?.name, showToast]);

  const handleViewBranches = useCallback(() => {
    setIsBranchesModalOpen(true);
  }, []);

  const handleReadSuccessStory = useCallback(() => {
    router.push("/success-stories");
  }, [router]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const matchedFeedItem = useMemo(() => {
    if (!matchesFeed || matchesFeed.length === 0) return null;
    const cleanId = (initialProfileId || currentProfile?.id || "").toLowerCase();
    const cleanMat = (currentProfile?.matrimonyId || "").toLowerCase();
    return matchesFeed.find((m: any) => {
      const mid = String(m._id || m.id || "").toLowerCase();
      const mMat = String(m.matrimonyId || "").toLowerCase();
      return (
        (cleanId && (mid === cleanId || mMat === cleanId)) ||
        (cleanMat && (mid === cleanMat || mMat === cleanMat))
      );
    });
  }, [matchesFeed, currentProfile?.id, currentProfile?.matrimonyId, initialProfileId]);

  if (isCandidateLoading && !liveBackendProfile && initialProfileId) {
    return (
      <div className={`min-h-screen flex flex-col bg-[#F5F7F9] text-stone-900 ${className}`}>
        <DashboardHeader

          activeTab="matches"
          onUpgradeClick={onUpgradeClick || (() => setUpgradeField("premium features"))}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4" />
          <p className="text-stone-500 font-medium text-sm">Loading verified profile...</p>
        </main>
        <DashboardFooter />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className={`min-h-screen flex flex-col bg-[#F5F7F9] text-stone-900 ${className}`}>
        <DashboardHeader
          activeTab="matches"
          onUpgradeClick={onUpgradeClick || (() => setUpgradeField("premium features"))}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#DB2F3C] flex items-center justify-center font-bold text-2xl mb-4">
            !
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Profile Not Available</h2>
          <p className="text-stone-500 text-sm mb-6 max-w-md">
            This profile could not be loaded from the server or may no longer be active.
          </p>
          <button
            type="button"
            onClick={handleBackToMatches}
            className="px-6 py-2.5 rounded-full bg-[#DB2F3C] text-white text-sm font-semibold hover:bg-[#B71F2A] transition-colors cursor-pointer shadow-xs"
          >
            Explore All Matches
          </button>
        </main>
        <DashboardFooter />
      </div>
    );
  }

  const isShortlisted =
    shortlistedIds.has(currentProfile.id) ||
    (currentProfile.matrimonyId ? shortlistedIds.has(currentProfile.matrimonyId) : false) ||
    Boolean(initialProfileId && shortlistedIds.has(initialProfileId));

  const interestSent =
    interestSentIds.has(currentProfile.id) ||
    (currentProfile.matrimonyId ? interestSentIds.has(currentProfile.matrimonyId) : false) ||
    Boolean(initialProfileId && interestSentIds.has(initialProfileId)) ||
    Boolean(currentProfile.interestSent) ||
    Boolean(matchedFeedItem?.interestSent || matchedFeedItem?.sendIntrestSended);

  return (
    <div className={`min-h-screen flex flex-col bg-[#F5F7F9] text-stone-900 ${className}`}>
      {/* 1. Dashboard Navigation Header */}
      <DashboardHeader
        activeTab="matches"
        onUpgradeClick={onUpgradeClick || (() => setUpgradeField("premium features"))}
      />

      {/* 2. Sticky Subheader (Slides down when scrolling past hero card) */}
      <ViewProfileStickyHeader
        profile={currentProfile}
        interestSent={interestSent}
        isVisible={isStickyHeaderVisible}
        nextProfilePhotoUrl={nextProfileInfo.photoUrl}
        nextProfileName={nextProfileInfo.name}
        onSendInterest={handleSendInterest}
        onDontShow={handleDontShow}
        onNext={handleNextProfile}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Sub-navigation top bar: ← All Matches 1/23 + Next >> */}
        <ViewProfileHeaderNav
          currentIndex={currentMatchIndex}
          totalProfiles={totalMatchesCount}
          categoryLabel="All Matches"
          nextProfilePhotoUrl={nextProfileInfo.photoUrl}
          nextProfileName={nextProfileInfo.name}
          onBack={handleBackToMatches}
          onNext={handleNextProfile}
        />

        {/* 2-Column Responsive Layout matching BrahminMatrimony view profile page */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 pt-2">
          {/* Left / Main Profile Column */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* Main Profile Hero Card */}
            <ViewProfileHeroCard
              profile={currentProfile}
              isShortlisted={isShortlisted}
              interestSent={interestSent}
              onToggleShortlist={handleToggleShortlist}
              onSendInterest={handleSendInterest}
              onDontShow={handleDontShow}
              onCallClick={handleCallClick}
              onWhatsAppClick={handleWhatsAppClick}
              onSendMessage={handleCallClick}
              onPhotoClick={() => {
                showToast(`Viewing photo 1 of ${currentProfile.photoUrls.length}`);
              }}
              onShareProfile={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Profile link copied to clipboard!");
                }
              }}
              onReportProfile={() => {
                showToast("Report submitted to trust & safety team.");
              }}
              onBlockProfile={() => {
                handleDontShow(currentProfile.id);
              }}
            />

            {/* Personal Information Section */}
            <ViewProfilePersonalInfoSection
              personalInfo={currentProfile.personalInfo}
              onUpgradeClick={handleUpgradeField}
              onHoroscopeRequestClick={handleHoroscopeRequest}
            />

            {/* Contact Information Section */}
            <ViewProfileContactInfoSection
              contactInfo={currentProfile.contactInfo}
              onUpgradeClick={() => handleUpgradeField("contact details")}
            />

            {/* About Myself Section */}
            <ViewProfileAboutSection
              name={currentProfile.name}
              aboutText={currentProfile.aboutText}
            />

            {/* Her Partner Preferences Section */}
            <ViewProfilePreferencesSection
              preferences={currentProfile.partnerPreferences}
              prospectPhotoUrl={currentProfile.photoUrls?.[0]}
              prospectName={currentProfile.name}
              prospectGender={currentProfile.gender}
            />

            {/* Assisted Service Banner matching Screenshot 5 */}
            <AssistedServiceBanner
              onGetAssistedService={() => {
                handleUpgradeField("Dedicated Relationship Manager");
              }}
            />
          </div>

          {/* Right Sidebar Column (Sticky) */}
          <ViewProfileSidebar
            onViewBranches={handleViewBranches}
            onReadSuccessStory={handleReadSuccessStory}
            communityName="SindhiMatrimony"
          />
        </div>
      </main>

      {/* 4. Full Footer */}
      <DashboardFooter />

      {/* 5. Floating Controls */}
      <ViewProfileScrollTopButton
        isVisible={showScrollTop}
        onScrollToTop={handleScrollToTop}
      />
      <FloatingChatWidget />

      {/* 6. Interactive Modals */}
      <UpgradeModal
        isOpen={Boolean(upgradeField)}
        targetField={upgradeField || "contact details"}
        prospectName={currentProfile.name}
        prospectPhotoUrl={currentProfile.photoUrls?.[0]}
        maskedPhone={currentProfile.contactInfo?.phoneMasked || "+91 77XXXXXXXX"}
        onClose={() => setUpgradeField(null)}
        onUpgradeNow={() => {
          if (onUpgradeClick) onUpgradeClick();
          else router.push("/subscription");
        }}
      />

      <HoroscopeRequestModal
        isOpen={isHoroscopeModalOpen}
        isSent={isHoroscopeSent}
        prospectName={currentProfile.name}
        onClose={() => setIsHoroscopeModalOpen(false)}
        onConfirmSend={handleConfirmHoroscopeSend}
      />

      <ProfileContactModal
        isOpen={Boolean(contactModalType)}
        type={contactModalType}
        profile={currentProfile}
        onClose={() => setContactModalType(null)}
        onUpgradeClick={() => {
          setContactModalType(null);
          if (onUpgradeClick) onUpgradeClick();
          else router.push("/subscription");
        }}
      />

      <BranchesModal
        isOpen={isBranchesModalOpen}
        onClose={() => setIsBranchesModalOpen(false)}
      />

      {/* 7. Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const ViewProfileScreen = memo(ViewProfileScreenComponent);
ViewProfileScreen.displayName = "ViewProfileScreen";
export default ViewProfileScreen;
