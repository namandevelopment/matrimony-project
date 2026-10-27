"use client";

import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { isDeepEqual } from "@/utils";
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
import { useGlobalModal } from "@/customModals";
import { useProfileQuery } from "@/tanstackQuery";
import type {
  UserProfile,
  DashboardNavTab,
  DashboardMode,
  DashboardScreenProps,
  MatchProfile,
  ViewedProfile,
  MarriageSuccessStory,
} from "./types";


const DashboardScreenComponent: React.FC<DashboardScreenProps> = ({
  initialTab = "home",
  initialUser,
  initialMatches,
  initialViewedProfiles,
  initialSuccessStories,
  onLogout,
  onUpgradeClick,
  onAssistedServiceClick,
}: any) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardNavTab["id"]>(initialTab);
  const [mode, setMode] = useState<DashboardMode>("regular");
  const [interestsSearchQuery, setInterestsSearchQuery] = useState("");
  const [messagesSearchQuery, setMessagesSearchQuery] = useState("");

  const { data: profileRes } = useProfileQuery();
  const p = (profileRes as any)?.profile || (profileRes as any)?.data?.profile;
  const u = (profileRes as any)?.user || (profileRes as any)?.data?.user;

  const user: UserProfile = useMemo(() => {
    return {
      name: p?.name || u?.name || initialUser?.name || "",
      matrimonyId: p?.matrimonyId || (p?._id ? `SM${p._id.toString().slice(-7).toUpperCase()}` : (initialUser?.matrimonyId || "")),
      community: p?.subcaste ? `Sindhi (${p.subcaste})` : "SindhiMatrimony",
      membershipStatus: p?.membershipTier ? "Paid member" : (initialUser?.membershipStatus || "Free member"),
      completenessScore: p?.completenessScore ?? initialUser?.completenessScore ?? 0,
      avatarUrl: p?.avatar || (typeof p?.photos?.[0] === "string" ? p.photos[0] : p?.photos?.[0]?.url) || initialUser?.avatarUrl || "",
    };
  }, [p, u, initialUser]);

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

  const { openLogoutModal } = useGlobalModal();

  const handleLogoutAction = useCallback(() => {
    if (onLogout) {
      onLogout();
    } else {
      openLogoutModal({
        userName: user?.name,
        userMatrimonyId: user?.matrimonyId,
        userAvatar: user?.avatarUrl,
      });
    }
  }, [onLogout, openLogoutModal, user?.name, user?.matrimonyId, user?.avatarUrl]);

  return (
    <DashboardNavProvider activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="relative min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
        {/* 1. Sticky Header - DOES NOT RE-RENDER ON TAB CHANGE */}
        <DashboardHeader
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

export const DashboardScreen = memo(
  DashboardScreenComponent,
  (prev, next) => isDeepEqual(prev, next)
);
DashboardScreen.displayName = "DashboardScreen";
export default DashboardScreen;
