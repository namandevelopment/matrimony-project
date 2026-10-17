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
import { mockViewProfiles } from "./mockData";
import { ViewProfileScreenProps, ViewUserProfile } from "./types";

const defaultUser: UserProfile = {
  name: "Naman",
  matrimonyId: "BRH4517087",
  community: "SindhiMatrimony",
  membershipStatus: "Free member",
  completenessScore: 42,
};

const ViewProfileScreenComponent: React.FC<ViewProfileScreenProps> = ({
  initialProfileId,
  onBackToMatches,
  onNavigateToNext,
  onUpgradeClick,
  className = "",
}) => {
  const router = useRouter();

  // Find initial profile index
  const initialIndex = useMemo(() => {
    if (!initialProfileId) return 0;
    const idx = mockViewProfiles.findIndex(
      (p) =>
        p.id === initialProfileId ||
        p.matrimonyId.toLowerCase() === initialProfileId.toLowerCase()
    );
    return idx >= 0 ? idx : 0;
  }, [initialProfileId]);

  const [activeProfileIndex, setActiveProfileIndex] = useState(initialIndex);

  // Synchronize if initialProfileId changes
  useEffect(() => {
    setActiveProfileIndex(initialIndex);
  }, [initialIndex]);

  // Current active profile
  const currentProfile: ViewUserProfile = useMemo(() => {
    return mockViewProfiles[activeProfileIndex] || mockViewProfiles[0];
  }, [activeProfileIndex]);

  // Next profile for pill preview
  const nextIndex = (activeProfileIndex + 1) % mockViewProfiles.length;
  const nextProfile = mockViewProfiles[nextIndex];

  // User interactions state (Sets for O(1) lookups)
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    mockViewProfiles.forEach((p) => {
      if (p.isShortlisted) s.add(p.id);
    });
    return s;
  });

  const [interestSentIds, setInterestSentIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    mockViewProfiles.forEach((p) => {
      if (p.interestSent) s.add(p.id);
    });
    return s;
  });

  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

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
  }, [activeProfileIndex]);

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

  // Action Callbacks
  const handleToggleShortlist = useCallback(
    (id: string) => {
      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast(`Removed from your Shortlist.`);
        } else {
          next.add(id);
          showToast(`Added ${currentProfile.name} to your Shortlist.`);
        }
        return next;
      });
    },
    [currentProfile.name, showToast]
  );

  const handleSendInterest = useCallback(
    (id: string) => {
      setInterestSentIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast(`Interest withdrawn.`);
        } else {
          next.add(id);
          showToast(`Interest sent to ${currentProfile.name}!`);
        }
        return next;
      });
    },
    [currentProfile.name, showToast]
  );

  const handleDontShow = useCallback(
    (id: string) => {
      setHiddenIds((prev) => new Set(prev).add(id));
      showToast(`${currentProfile.name} won't be shown in your matches again.`);
      // Move to next profile
      setActiveProfileIndex((prev) => (prev + 1) % mockViewProfiles.length);
    },
    [currentProfile.name, showToast]
  );

  const handleNextProfile = useCallback(() => {
    const nextIdx = (activeProfileIndex + 1) % mockViewProfiles.length;
    setActiveProfileIndex(nextIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onNavigateToNext) {
      onNavigateToNext(mockViewProfiles[nextIdx].matrimonyId);
    }
  }, [activeProfileIndex, onNavigateToNext]);

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
    showToast(`Horoscope request sent to ${currentProfile.name}.`);
  }, [currentProfile.name, showToast]);

  const handleViewBranches = useCallback(() => {
    setIsBranchesModalOpen(true);
  }, []);

  const handleReadSuccessStory = useCallback(() => {
    router.push("/success-stories");
  }, [router]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isShortlisted = shortlistedIds.has(currentProfile.id);
  const interestSent = interestSentIds.has(currentProfile.id);

  return (
    <div className={`min-h-screen flex flex-col bg-[#F5F7F9] text-stone-900 ${className}`}>
      {/* 1. Dashboard Navigation Header */}
      <DashboardHeader
        user={defaultUser}
        activeTab="matches"
        onUpgradeClick={onUpgradeClick || (() => setUpgradeField("premium features"))}
      />

      {/* 2. Sticky Subheader (Slides down when scrolling past hero card) */}
      <ViewProfileStickyHeader
        profile={currentProfile}
        interestSent={interestSent}
        isVisible={isStickyHeaderVisible}
        nextProfilePhotoUrl={nextProfile?.photoUrls?.[0]}
        nextProfileName={nextProfile?.name}
        onSendInterest={handleSendInterest}
        onDontShow={handleDontShow}
        onNext={handleNextProfile}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Sub-navigation top bar: ← All Matches 1/23 + Next >> */}
        <ViewProfileHeaderNav
          currentIndex={activeProfileIndex}
          totalProfiles={mockViewProfiles.length}
          categoryLabel="All Matches"
          nextProfilePhotoUrl={nextProfile?.photoUrls?.[0]}
          nextProfileName={nextProfile?.name}
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
