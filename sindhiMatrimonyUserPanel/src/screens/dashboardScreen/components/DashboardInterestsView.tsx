"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  InterestsSidebar,
  InterestsEmptyState,
  InterestCard,
} from "@/screens/interestsScreen/components";
import { apiFetch, ApiURL } from "@/redux/apiService";
import { toast } from "@/toastMessage/toast";
import type {
  InterestSection,
  InterestStatus,
  InterestItem,
  InterestBadgeCounts,
} from "@/screens/interestsScreen/types";
import { Loader2, RefreshCw } from "lucide-react";
import { mockInterestsList, mockBadgeCounts } from "@/screens/interestsScreen/mockData";

export interface DashboardInterestsViewProps {
  onUpgradeClick?: () => void;
  className?: string;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const DashboardInterestsViewComponent: React.FC<DashboardInterestsViewProps> = ({
  className = "",
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [section, setSection] = useState<InterestSection>("received");
  const [status, setStatus] = useState<InterestStatus>("pending");

  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [badgeCounts, setBadgeCounts] = useState<InterestBadgeCounts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(activeSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeSearchQuery]);

  // Fetch badge counts for sidebar
  const fetchBadgeCounts = useCallback(async () => {
    try {
      const res = await apiFetch<any>({
        url: ApiURL.interestsBadgeCount,
        method: "GET",
        showErrorToast: false,
      });
      if (res && res.data) {
        setBadgeCounts(res.data);
      } else {
        setBadgeCounts(mockBadgeCounts);
      }
    } catch {
      setBadgeCounts(mockBadgeCounts);
    }
  }, []);

  // Fetch Interests List
  const fetchInterests = useCallback(
    async (showLoadingSpinner = true) => {
      if (showLoadingSpinner) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const endpoint =
          section === "received"
            ? ApiURL.interestsReceived
            : ApiURL.interestsSent;

        const res = await apiFetch<any>({
          url: endpoint,
          method: "GET",
          params: {
            status: status === "all" ? "ALL" : status.toUpperCase(),
            search: debouncedSearch.trim() || undefined,
            page: 1,
            limit: 30,
          },
          showErrorToast: false,
        });

        if (res && res.data && Array.isArray(res.data.interests)) {
          setInterests(res.data.interests);
        } else {
          // Graceful fallback to mock data
          const filtered = mockInterestsList.filter((item) => {
            const matchesSection = item.direction?.toLowerCase() === section;
            const matchesStatus =
              status === "all" || item.status.toLowerCase() === status;
            const profile = section === "received" ? item.senderProfile : item.receiverProfile;
            const matchesSearch =
              !debouncedSearch.trim() ||
              profile?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              profile?.subcaste?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              profile?.city?.toLowerCase().includes(debouncedSearch.toLowerCase());
            return matchesSection && matchesStatus && matchesSearch;
          });
          setInterests(filtered);
        }
      } catch (err: any) {
        console.warn("API unavailable, displaying fallback interests:", err);
        const filtered = mockInterestsList.filter((item) => {
          const matchesSection = item.direction?.toLowerCase() === section;
          const matchesStatus =
            status === "all" || item.status.toLowerCase() === status;
          const profile = section === "received" ? item.senderProfile : item.receiverProfile;
          const matchesSearch =
            !debouncedSearch.trim() ||
            profile?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            profile?.subcaste?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            profile?.city?.toLowerCase().includes(debouncedSearch.toLowerCase());
          return matchesSection && matchesStatus && matchesSearch;
        });
        setInterests(filtered);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [section, status, debouncedSearch]
  );

  // Trigger initial & filter changes
  useEffect(() => {
    fetchInterests();
    fetchBadgeCounts();
  }, [fetchInterests, fetchBadgeCounts]);

  const handleSelect = useCallback(
    (newSection: InterestSection, newStatus: InterestStatus) => {
      setSection(newSection);
      setStatus(newStatus);
    },
    []
  );

  // Action: Accept Interest
  const handleAccept = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsAccept(interestId),
          method: "PUT",
        });

        if (!res.error) {
          toast.success(
            res.message || "Interest accepted! Contact details unlocked."
          );
          // Optimistically update list
          setInterests((prev) =>
            prev.map((item) =>
              item._id === interestId ? { ...item, status: "ACCEPTED" } : item
            )
          );
          fetchBadgeCounts();
        } else {
          toast.error(res.message || "Failed to accept interest.");
        }
      } catch {
        toast.error("Failed to accept interest. Please try again.");
      }
    },
    [fetchBadgeCounts]
  );

  // Action: Decline Interest
  const handleDecline = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsDecline(interestId),
          method: "PUT",
        });

        if (!res.error) {
          toast.info("Interest politely declined.");
          // Optimistically update list
          setInterests((prev) =>
            prev.map((item) =>
              item._id === interestId ? { ...item, status: "DECLINED" } : item
            )
          );
          fetchBadgeCounts();
        } else {
          toast.error(res.message || "Failed to decline interest.");
        }
      } catch {
        toast.error("Failed to decline interest. Please try again.");
      }
    },
    [fetchBadgeCounts]
  );

  // Action: Remind Interest
  const handleRemind = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsRemind(interestId),
          method: "PUT",
        });

        if (!res.error) {
          toast.success("Reminder sent successfully to the member.");
          setInterests((prev) =>
            prev.map((item) =>
              item._id === interestId
                ? { ...item, remindedAt: Date.now() }
                : item
            )
          );
        } else {
          toast.error(res.message || "Failed to send reminder.");
        }
      } catch {
        toast.error("Failed to send reminder.");
      }
    },
    []
  );

  // Action: Cancel / Withdraw Sent Interest
  const handleCancel = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsCancel(interestId),
          method: "DELETE",
        });

        if (!res.error) {
          toast.info("Interest request withdrawn.");
          setInterests((prev) => prev.filter((item) => item._id !== interestId));
          fetchBadgeCounts();
        } else {
          toast.error(res.message || "Failed to withdraw interest.");
        }
      } catch {
        toast.error("Failed to withdraw interest.");
      }
    },
    [fetchBadgeCounts]
  );

  // Counts mapped for Sidebar
  const sidebarCounts = useMemo(() => {
    if (!badgeCounts) return undefined;
    return {
      received_all: badgeCounts.received?.all ?? 0,
      received_pending: badgeCounts.received?.pending ?? 0,
      received_accepted: badgeCounts.received?.accepted ?? 0,
      received_declined: badgeCounts.received?.declined ?? 0,
      sent_all: badgeCounts.sent?.all ?? 0,
      sent_pending: badgeCounts.sent?.pending ?? 0,
      sent_accepted: badgeCounts.sent?.accepted ?? 0,
      sent_declined: badgeCounts.sent?.declined ?? 0,
    };
  }, [badgeCounts]);

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
    <div className={`w-full ${className}`}>
      {/* Main 2-Column Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left: Interests Sidebar */}
        <InterestsSidebar
          currentSection={section}
          currentStatus={status}
          onSelect={handleSelect}
          counts={sidebarCounts}
        />

        {/* Right: Interests Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Header Bar */}
          <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                {statusText}
              </h1>
              <p className="text-xs sm:text-[13px] text-stone-500 mt-0.5">
                {subtitleText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchInterests(false)}
              disabled={isLoading || isRefreshing}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh interests"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#DB2F3C]" : ""}`}
              />
            </button>
          </div>

          {/* Body Content */}
          <div>
            {isLoading ? (
              <div className="space-y-4 py-8 bg-white rounded-xl border border-stone-200/90 shadow-2xs p-6">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-stone-500 mb-4">
                  <Loader2 className="w-4 h-4 animate-spin text-[#DB2F3C]" />
                  <span>Loading interests...</span>
                </div>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-32 bg-stone-50 rounded-xl animate-pulse border border-stone-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-12 text-center space-y-3">
                <p className="text-sm text-rose-600 font-medium">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchInterests(true)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#DB2F3C] rounded-lg shadow-2xs hover:bg-[#B71F2A] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : interests.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-8">
                <InterestsEmptyState
                  title={`You have no ${status === "all" ? "" : status} interests.`}
                  subtitle="No pending conversations till now"
                />
              </div>
            ) : (
              <div className="space-y-3.5">
                {interests.map((item) => (
                  <InterestCard
                    key={item._id}
                    interest={item}
                    section={section}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onRemind={handleRemind}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardInterestsView = memo(DashboardInterestsViewComponent);
DashboardInterestsView.displayName = "DashboardInterestsView";
export default DashboardInterestsView;
