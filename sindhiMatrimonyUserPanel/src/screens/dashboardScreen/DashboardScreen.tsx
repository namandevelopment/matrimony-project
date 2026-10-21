"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  DashboardSubHeader,
  DashboardHomeView,
  DashboardMatchesView,
  DashboardInterestsView,
  DashboardMessagesView,
  DashboardSearchView,
  DashboardFooter,
} from "./components";
import { MailboxSearchInput } from "@/screens/interestsScreen/components";
import { DashboardNavProvider } from "./context/DashboardNavContext";
import { FloatingChatWidget } from "@/screens/matchesScreen/components";
import { NotificationsScreen } from "@/screens/notificationsScreen";
import { apiFetch, ApiURL } from "@/redux/apiService";
import { useDashboardFeedQuery } from "@/tanstackQuery";
import type {
  UserProfile,
  DashboardNavTab,
  DashboardMode,
  DashboardScreenProps,
  MatchProfile,
  ViewedProfile,
  MarriageSuccessStory,
} from "./types";

const defaultUserProfile: UserProfile = {
  name: "Naman",
  matrimonyId: "SM4517087",
  community: "SindhiMatrimony",
  membershipStatus: "Free member",
  completenessScore: 42,
};

const DashboardScreenComponent: React.FC<DashboardScreenProps> = ({
  initialTab = "home",
  initialUser = defaultUserProfile,
  initialMatches,
  initialViewedProfiles,
  initialSuccessStories,
  onLogout,
  onUpgradeClick,
  onAssistedServiceClick,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            name: parsed.name || parsed.fullName || initialUser.name,
            matrimonyId: parsed.matrimonyId || parsed.id || initialUser.matrimonyId,
            community: parsed.community || "SindhiMatrimony",
            membershipStatus: parsed.membershipStatus || (parsed.plan ? "Paid member" : "Free member"),
            completenessScore: parsed.completenessScore ?? 42,
            avatarUrl: parsed.avatar || parsed.avatarUrl || parsed.photoUrl || "",
          };
        }
      } catch {}
    }
    return initialUser;
  });

  const [matches, setMatches] = useState<MatchProfile[]>(initialMatches || []);
  const [viewedProfiles, setViewedProfiles] = useState<ViewedProfile[]>(initialViewedProfiles || []);
  const [successStories, setSuccessStories] = useState<MarriageSuccessStory[]>(initialSuccessStories || []);
  const [activeTab, setActiveTab] = useState<DashboardNavTab["id"]>(initialTab);
  const [mode, setMode] = useState<DashboardMode>("regular");
  const [interestsSearchQuery, setInterestsSearchQuery] = useState("");
  const [messagesSearchQuery, setMessagesSearchQuery] = useState("");

  // Live consolidated dashboard API integration via TanStack Query (cached 5 mins, zero duplicate flight)
  const { data: dashboardRes } = useDashboardFeedQuery();

  useEffect(() => {
    if (!dashboardRes) return;
    const d = (dashboardRes as any)?.data || dashboardRes;

    // 1. Sync User Profile
    if (d.user) {
      setUser({
        name: d.user.name || "Member",
        matrimonyId: d.user.matrimonyId || "SM4517087",
        community: d.user.community || "SindhiMatrimony",
        membershipStatus: d.user.membershipStatus || "Free member",
        completenessScore: d.completeness?.score ?? d.user.completenessScore ?? 42,
        avatarUrl: d.user.avatarUrl || d.user.avatar || "",
      });
    }

    // 2. Sync Matches Carousel
    const loadedMatches = d.matches?.items || (Array.isArray(d.matches) ? d.matches : []);
    if (Array.isArray(loadedMatches) && loadedMatches.length > 0) {
      const mappedMatches: MatchProfile[] = loadedMatches.map((m: any, idx: number) => ({
        id: m.id || m._id || m.matrimonyId || `match_${idx}`,
        name: m.name || "Sindhi Match",
        age: Number(m.age) || 25,
        height: m.height || m.heightFormatted || "5'4\"",
        city: m.city || m.location?.city || "Mumbai",
        caste: m.caste || m.subcaste || "Bhaiband",
        education: m.education?.degree || m.education || "Graduate / Professional",
        photoUrl: m.photoUrl || m.avatar || "",
        isSilhouette: m.isSilhouette ?? !m.photoUrl,
      }));
      setMatches(mappedMatches);
    }

    // 3. Sync Viewed Profiles
    if (Array.isArray(d.viewedProfiles) && d.viewedProfiles.length > 0) {
      setViewedProfiles(
        d.viewedProfiles.map((p: any, idx: number) => ({
          id: p.id || p._id || `vp_${idx}`,
          name: p.name || "Sindhi Member",
          age: Number(p.age) || 25,
          height: p.height || "5'4\"",
          viewedDate: p.viewedDate || "Recently",
          photoUrl: p.photoUrl || p.avatar || "",
        }))
      );
    }

    // 4. Sync Success Stories
    const loadedStories = d.successStories || d.stories;
    if (Array.isArray(loadedStories) && loadedStories.length > 0) {
      setSuccessStories(
        loadedStories.map((s: any, idx: number) => ({
          id: s.id || s._id || `story_${idx}`,
          coupleNames: s.coupleNames || s.coupleName || "Sindhi Couple",
          photoUrl: s.photoUrl || s.imageUrl || "/images/dashboard/couple_1.jpg",
          photoUrls: Array.isArray(s.photoUrls) ? s.photoUrls : [s.photoUrl || s.imageUrl || ""].filter(Boolean),
          weddingDate: s.weddingDate || "Recently",
          postedDate: s.postedDate || "Recently",
          testimonial: s.testimonial || s.storySnippet || "Blessed union on SindhiMatrimony.",
          location: s.location || (s.city ? `${s.city}, India` : "India"),
          isVerified: s.isVerified !== false,
          likesCount: Number(s.likesCount) || 120,
        }))
      );
    }
  }, [dashboardRes]);

  // Synchronize activeTab on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("matches")) {
        setActiveTab("matches");
      } else if (path.includes("interests")) {
        setActiveTab("interests");
      } else if (path.includes("messages")) {
        setActiveTab("messages");
      } else if (path.includes("search")) {
        setActiveTab("search");
      } else if (path.includes("notifications")) {
        setActiveTab("notifications");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
    <DashboardNavProvider activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="relative min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
        {/* 1. Sticky Header - DOES NOT RE-RENDER ON TAB CHANGE */}
        <DashboardHeader
          user={user}
          onLogout={handleLogoutAction}
          onUpgradeClick={handleUpgrade}
        />

        {/* 2. Unified Sub-Header across Dashboard tabs */}
        <DashboardSubHeader
          currentMode={mode}
          onModeChange={handleModeChange}
          showModeSwitcher={activeTab !== "notifications"}
          rightContent={
            activeTab === "interests" ? (
              <MailboxSearchInput
                value={interestsSearchQuery}
                onChange={setInterestsSearchQuery}
                placeholder="Search in Mailbox"
              />
            ) : activeTab === "messages" ? (
              <MailboxSearchInput
                value={messagesSearchQuery}
                onChange={setMessagesSearchQuery}
                placeholder="Search conversations"
              />
            ) : null
          }
        />

        {/* 3. Main Dashboard Body: Switches between all 5 screens with ZERO Header re-render */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === "matches" ? (
            <DashboardMatchesView
              user={user}
              onUpgradeClick={handleUpgrade}
              onAssistedServiceClick={handleAssistedService}
            />
          ) : activeTab === "interests" ? (
            <DashboardInterestsView
              searchQuery={interestsSearchQuery}
              onSearchQueryChange={setInterestsSearchQuery}
              onUpgradeClick={handleUpgrade}
            />
          ) : activeTab === "messages" ? (
            <DashboardMessagesView
              searchQuery={messagesSearchQuery}
              onSearchQueryChange={setMessagesSearchQuery}
              onUpgradeClick={handleUpgrade}
            />
          ) : activeTab === "search" ? (
            <DashboardSearchView
              onUpgradeClick={handleUpgrade}
            />
          ) : activeTab === "notifications" ? (
            <NotificationsScreen
              onUpgradeClick={handleUpgrade}
            />
          ) : (
            <DashboardHomeView
              user={user}
              initialMatches={matches.length > 0 ? matches : initialMatches}
              initialViewedProfiles={viewedProfiles.length > 0 ? viewedProfiles : initialViewedProfiles}
              initialSuccessStories={successStories.length > 0 ? successStories : initialSuccessStories}
              onUpgradeClick={handleUpgrade}
              onAssistedServiceClick={handleAssistedService}
            />
          )}
        </main>

        {/* 4. Full-Width Footer */}
        <DashboardFooter />

        {/* 5. Floating Chat Widget */}
        <FloatingChatWidget />
      </div>
    </DashboardNavProvider>
  );
};

export const DashboardScreen = memo(DashboardScreenComponent);
DashboardScreen.displayName = "DashboardScreen";
export default DashboardScreen;
