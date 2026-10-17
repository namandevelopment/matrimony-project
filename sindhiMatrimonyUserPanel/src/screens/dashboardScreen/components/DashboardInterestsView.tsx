"use client";

import React, { useState, useCallback, memo } from "react";
import {
  InterestsSidebar,
  InterestsEmptyState,
  MailboxSearchInput,
} from "@/screens/interestsScreen/components";
import { DashboardModeSwitcher } from "./DashboardModeSwitcher";
import type { InterestSection, InterestStatus } from "@/screens/interestsScreen/types";
import type { DashboardMode } from "../types";

export interface DashboardInterestsViewProps {
  onUpgradeClick?: () => void;
  className?: string;
}

const DashboardInterestsViewComponent: React.FC<DashboardInterestsViewProps> = ({
  className = "",
}) => {
  const [mode, setMode] = useState<DashboardMode>("regular");
  const [searchQuery, setSearchQuery] = useState("");
  const [section, setSection] = useState<InterestSection>("received");
  const [status, setStatus] = useState<InterestStatus>("pending");

  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setMode(newMode);
  }, []);

  const handleSelect = useCallback(
    (newSection: InterestSection, newStatus: InterestStatus) => {
      setSection(newSection);
      setStatus(newStatus);
    },
    []
  );

  const getHeadingInfo = () => {
    const isReceived = section === "received";
    const statusText =
      status === "pending"
        ? "Pending interests"
        : status === "accepted"
        ? "Accepted / replied interests"
        : status === "declined"
        ? "Declined interests"
        : "All interests";

    const subtitleText = isReceived
      ? "Interests from free members awaiting your response"
      : "Interests you have expressed to compatible members";

    return { statusText, subtitleText };
  };

  const { statusText, subtitleText } = getHeadingInfo();

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Subheader: Mode Switcher (center) & Search in Mailbox (right) */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        <div className="hidden sm:block w-48" /> {/* Balance spacer */}
        <div className="flex justify-center">
          <DashboardModeSwitcher currentMode={mode} onModeChange={handleModeChange} />
        </div>
        <div className="flex justify-end w-full sm:w-auto">
          <MailboxSearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left: Interests Sidebar */}
        <InterestsSidebar
          currentSection={section}
          currentStatus={status}
          onSelect={handleSelect}
        />

        {/* Right: Interests Content Card */}
        <div className="flex-1 w-full min-w-0 bg-white rounded-xl border border-stone-200 shadow-2xs p-6 sm:p-8 min-h-[480px]">
          {/* Header */}
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {statusText}
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-500 mt-1">
              {subtitleText}
            </p>
          </div>

          {/* Empty State / Content */}
          <InterestsEmptyState
            title={`You have no ${status === "all" ? "" : status} interests.`}
            subtitle="No pending conversations till now"
          />
        </div>
      </div>
    </div>
  );
};

export const DashboardInterestsView = memo(DashboardInterestsViewComponent);
DashboardInterestsView.displayName = "DashboardInterestsView";
export default DashboardInterestsView;
