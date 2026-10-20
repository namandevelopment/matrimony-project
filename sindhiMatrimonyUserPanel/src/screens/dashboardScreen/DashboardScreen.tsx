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
import type {
  UserProfile,
  DashboardNavTab,
  DashboardMode,
  DashboardScreenProps,
} from "./types";

const defaultUserProfile: UserProfile = {
  name: "Naman",
  matrimonyId: "BRH4517087",
  community: "BrahminMatrimony",
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
  const [user] = useState<UserProfile>(initialUser);
  const [activeTab, setActiveTab] = useState<DashboardNavTab["id"]>(initialTab);
  const [mode, setMode] = useState<DashboardMode>("regular");
  const [interestsSearchQuery, setInterestsSearchQuery] = useState("");
  const [messagesSearchQuery, setMessagesSearchQuery] = useState("");

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
              initialMatches={initialMatches}
              initialViewedProfiles={initialViewedProfiles}
              initialSuccessStories={initialSuccessStories}
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
