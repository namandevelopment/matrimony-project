"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import {
  NotificationHeader,
  NotificationCategoryTabs,
  NotificationFilterBar,
  NotificationList,
  NotificationSettingsModal,
  NotificationActivityWidget,
} from "./components";
import {
  NotificationItem,
  NotificationCategory,
  NotificationFilter,
  NotificationSort,
  NotificationActionType,
  NotificationsScreenProps,
  NotificationPreferenceSetting,
} from "./types";
import { INITIAL_NOTIFICATIONS } from "./staticData";

const NotificationsScreenComponent: React.FC<NotificationsScreenProps> = ({
  onUpgradeClick,
  onViewProfile,
  onOpenChat,
  onNavigateToTab,
  className = "",
}) => {
  const router = useRouter();

  // Primary State
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] =
    useState<NotificationCategory>("all");
  const [currentFilter, setCurrentFilter] =
    useState<NotificationFilter>("all");
  const [currentSort, setCurrentSort] = useState<NotificationSort>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast message
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Compute counts per category using useMemo
  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationCategory, { total: number; unread: number }> =
      {
        all: { total: notifications.length, unread: 0 },
        interests: { total: 0, unread: 0 },
        matches: { total: 0, unread: 0 },
        messages: { total: 0, unread: 0 },
        system: { total: 0, unread: 0 },
      };

    notifications.forEach((item) => {
      const isUnread = !item.isRead;
      if (isUnread) {
        counts.all.unread += 1;
      }

      if (counts[item.category]) {
        counts[item.category].total += 1;
        if (isUnread) {
          counts[item.category].unread += 1;
        }
      }
    });

    return counts;
  }, [notifications]);

  // Compute action needed count using useMemo
  const actionRequiredCount = useMemo(() => {
    return notifications.filter((n) => n.isActionRequired && !n.isRead).length;
  }, [notifications]);

  // Filter and sort notifications using useMemo
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        // 1. Category filter
        if (activeCategory !== "all" && item.category !== activeCategory) {
          return false;
        }

        // 2. Read / Action needed filter
        if (currentFilter === "unread" && item.isRead) {
          return false;
        }
        if (currentFilter === "action_needed" && !item.isActionRequired) {
          return false;
        }

        // 3. Search query filter
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesMessage = item.message.toLowerCase().includes(q);
          const matchesActorName =
            item.actor?.name.toLowerCase().includes(q) || false;
          const matchesActorId =
            item.actor?.matrimonyId.toLowerCase().includes(q) || false;
          const matchesCity =
            item.actor?.city?.toLowerCase().includes(q) || false;

          if (
            !matchesTitle &&
            !matchesMessage &&
            !matchesActorName &&
            !matchesActorId &&
            !matchesCity
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return currentSort === "newest" ? timeB - timeA : timeA - timeB;
      });
  }, [notifications, activeCategory, currentFilter, currentSort, searchQuery]);

  // Handler: Toggle single notification read / unread
  const handleToggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  }, []);

  // Handler: Dismiss / Delete single notification
  const handleDismiss = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      showToast("Notification dismissed");
    },
    [showToast]
  );

  // Handler: Mark all notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => (item.isRead ? item : { ...item, isRead: true }))
    );
    showToast("All notifications marked as read");
  }, [showToast]);

  // Handler: Filter selection
  const handleFilterChange = useCallback((filter: NotificationFilter) => {
    setCurrentFilter(filter);
  }, []);

  // Handler: Sort selection
  const handleSortChange = useCallback((sort: NotificationSort) => {
    setCurrentSort(sort);
  }, []);

  // Handler: Category tab selection
  const handleSelectCategory = useCallback((category: NotificationCategory) => {
    setActiveCategory(category);
  }, []);

  // Handler: Search query input
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handler: Reset filters
  const handleResetFilters = useCallback(() => {
    setActiveCategory("all");
    setCurrentFilter("all");
    setSearchQuery("");
  }, []);

  // Handler: Action button click inside NotificationCard
  const handleAction = useCallback(
    (
      action: NotificationActionType,
      item: NotificationItem,
      e: React.MouseEvent
    ) => {
      // Mark notification as read when an action is executed
      if (!item.isRead) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
      }

      switch (action) {
        case "accept_interest":
          showToast(
            `Interest Accepted! ${item.actor?.name || "The member"} will be notified.`
          );
          break;
        case "decline_interest":
          showToast("Interest declined politely.");
          break;
        case "reply_message":
          if (onOpenChat && item.actor?.id) {
            onOpenChat(item.actor.id);
          } else {
            router.push("/messages");
          }
          break;
        case "view_profile":
          if (onViewProfile && item.actor) {
            onViewProfile(item.actor.id, item.actor.matrimonyId);
          } else {
            router.push(`/matches?id=${item.actor?.matrimonyId || ""}`);
          }
          break;
        case "view_matches":
          if (onNavigateToTab) {
            onNavigateToTab("matches");
          } else {
            router.push("/matches");
          }
          break;
        case "upgrade_plan":
          if (onUpgradeClick) {
            onUpgradeClick();
          } else {
            router.push("/subscription");
          }
          break;
        case "share_horoscope":
          showToast(
            `Horoscope shared with ${item.actor?.name || "the prospect"}.`
          );
          break;
        case "upload_photo":
          showToast("Redirecting to profile photo uploader...");
          break;
        case "complete_profile":
          showToast("Opening profile completion editor...");
          break;
        default:
          break;
      }
    },
    [onOpenChat, onViewProfile, onNavigateToTab, onUpgradeClick, router, showToast]
  );

  // Handler: Card click
  const handleCardClick = useCallback(
    (item: NotificationItem) => {
      if (!item.isRead) {
        handleToggleRead(item.id);
      }
      if (item.actor) {
        if (onViewProfile) {
          onViewProfile(item.actor.id, item.actor.matrimonyId);
        } else {
          router.push(`/matches?id=${item.actor.matrimonyId}`);
        }
      }
    },
    [handleToggleRead, onViewProfile, router]
  );

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleSaveSettings = useCallback(
    (prefs: NotificationPreferenceSetting[]) => {
      showToast("Notification preferences updated successfully");
    },
    [showToast]
  );

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* 1. Header with Title, Search, Mark as read & Settings */}
      <NotificationHeader
        unreadCount={categoryCounts.all.unread}
        totalCount={categoryCounts.all.total}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onMarkAllAsRead={handleMarkAllAsRead}
        onOpenSettings={handleOpenSettings}
      />

      {/* 2. Responsive 2-Column Grid Layout: Main Feed (left) + Activity & Tips (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Tabs, Filters, and Notification List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Tabs */}
          <NotificationCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            categoryCounts={categoryCounts}
          />

          {/* Filter Bar (Unread, Action Required, Sort) */}
          <NotificationFilterBar
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            totalFiltered={filteredNotifications.length}
            unreadCount={categoryCounts[activeCategory]?.unread || 0}
            actionRequiredCount={actionRequiredCount}
          />

          {/* Main List */}
          <NotificationList
            notifications={filteredNotifications}
            searchQuery={searchQuery}
            currentFilter={currentFilter}
            activeCategory={activeCategory}
            onToggleRead={handleToggleRead}
            onDismiss={handleDismiss}
            onAction={handleAction}
            onCardClick={handleCardClick}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right 4 Cols: Activity Pulse & Upgrade Banner */}
        <div className="lg:col-span-4 sticky top-20">
          <NotificationActivityWidget onUpgradeClick={onUpgradeClick} />
        </div>
      </div>

      {/* 3. Settings Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
      />

      {/* 4. Floating Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold shadow-xl border border-stone-800 animate-in slide-in-from-bottom-5 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-[#DB2F3C]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const NotificationsScreen = memo(NotificationsScreenComponent);
NotificationsScreen.displayName = "NotificationsScreen";
export default NotificationsScreen;
