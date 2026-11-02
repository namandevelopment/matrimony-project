import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  notificationService,
  type AppNotification,
  type NotificationCategory,
} from '../../services/notificationService';
import { toast } from '../../toastMessage/toast';
import { usePerformanceTracker } from '../../customHooks/usePerformanceTracker';
import { useInputs } from '../../customHooks/useInputs';
import { memoWithDeepEqual } from '../../utils/memoUtils';

interface NotificationFilterValues {
  activeTab: 'ALL' | 'UNREAD' | NotificationCategory;
  searchQuery: string;
}
import { apiFetch, ApiURL } from '../../redux/apiService';
import {
  NotificationsPageHeader,
  NotificationKPISection,
  NotificationFilterBar,
  NotificationListSection,
} from './component';

export const NotificationsScreen: React.FC = memoWithDeepEqual(() => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const {
    values: filterValues,
    setFieldValue: setFilterFieldValue,
  } = useInputs<NotificationFilterValues>({
    activeTab: 'ALL',
    searchQuery: '',
  });

  const fetchNotificationsFromBackend = useCallback(async () => {
    try {
      const res = await apiFetch.get<any>(ApiURL.adminNotifications, undefined, {
        isToken: true,
        showErrorToast: false,
      });
      const list = res?.data?.notifications || res?.data?.list || res?.data;
      if (Array.isArray(list)) {
        const mapped: AppNotification[] = list.map((n: any, idx: number) => ({
          id: n.id || n._id || `notif_${idx}`,
          title: n.title || 'Notification',
          message: n.message || '',
          category: (n.category?.toUpperCase() || 'GENERAL') as NotificationCategory,
          priority: (n.priority?.toUpperCase() || 'NORMAL') as NotificationPriority,
          timestamp: n.createdAt ? (typeof n.createdAt === 'string' ? n.createdAt : new Date(n.createdAt).toISOString()) : new Date().toISOString(),
          timeAgo: n.timeAgo || 'Recently',
          isRead: Boolean(n.isRead),
          link: n.actionRoute || n.link || '',
          actionLabel: n.actionLabel || '',
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsFromBackend();
  }, [fetchNotificationsFromBackend]);

  // Subscribe to live notification updates with cleanup
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setNotifications(notificationService.getNotifications());
    });
    return unsubscribe;
  }, []);

  // Single-pass computation for counts and KPI metrics (O(N) vs 7 filter loops)
  const summary = useMemo(() => {
    let unread = 0;
    let urgent = 0;
    let lead = 0;
    let payment = 0;
    let system = 0;
    let security = 0;

    for (let i = 0; i < notifications.length; i++) {
      const n = notifications[i];
      if (!n.isRead) {
        unread++;
        if (n.priority === 'URGENT') urgent++;
      }
      if (n.category === 'LEAD') lead++;
      else if (n.category === 'PAYMENT') payment++;
      else if (n.category === 'SYSTEM') system++;
      else if (n.category === 'SECURITY') security++;
    }

    return {
      unread,
      urgent,
      archived: notifications.length - unread,
      counts: {
        total: notifications.length,
        unread,
        lead,
        payment,
        system,
        security,
      },
    };
  }, [notifications]);

  // Track render performance in HUD with relevant state metadata
  usePerformanceTracker('NotificationsScreen', {
    activeTab: filterValues.activeTab,
    unreadCount: summary.unread,
    totalCount: notifications.length,
    searchActive: Boolean(filterValues.searchQuery),
  });

  // Filtered notifications with memoization
  const filteredNotifications = useMemo(() => {
    const trimmedQuery = filterValues.searchQuery.trim().toLowerCase();

    return notifications.filter((item) => {
      // Tab filter
      if (filterValues.activeTab === 'UNREAD' && item.isRead) return false;
      if (
        filterValues.activeTab !== 'ALL' &&
        filterValues.activeTab !== 'UNREAD' &&
        item.category !== filterValues.activeTab
      ) {
        return false;
      }

      // Search query filter
      if (trimmedQuery) {
        const matchesTitle = item.title.toLowerCase().includes(trimmedQuery);
        const matchesMessage = item.message.toLowerCase().includes(trimmedQuery);
        const matchesCategory = item.category.toLowerCase().includes(trimmedQuery);
        return matchesTitle || matchesMessage || matchesCategory;
      }

      return true;
    });
  }, [notifications, filterValues.activeTab, filterValues.searchQuery]);

  // Stable event handlers
  const handleMarkAsRead = useCallback(async (id: string) => {
    notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    toast.success('Notification marked as read');
    try {
      await apiFetch.put(`${ApiURL.adminNotifications}/${id}/read`, {}, { isToken: true, showErrorToast: false });
    } catch {}
  }, []);

  const handleMarkAsUnread = useCallback((id: string) => {
    notificationService.markAsUnread(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
    toast.info('Notification marked as unread');
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
    try {
      await apiFetch.put(`${ApiURL.adminNotifications}/mark-read`, {}, { isToken: true, showErrorToast: false });
    } catch {}
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification removed');
    try {
      await apiFetch.delete(`${ApiURL.adminNotifications}/${id}`, undefined, { isToken: true, showErrorToast: false });
    } catch {}
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notificationService.clearAll();
      setNotifications([]);
      toast.info('All notifications cleared');
    }
  }, []);

  const handleSimulateNewAlert = useCallback(() => {
    fetchNotificationsFromBackend();
    toast.info('Refreshed alerts from live backend');
  }, [fetchNotificationsFromBackend]);

  const handleNavigate = useCallback(
    (link: string) => {
      navigate(link);
    },
    [navigate]
  );

  const handleTabChange = useCallback(
    (tab: 'ALL' | 'UNREAD' | NotificationCategory) => {
      setFilterFieldValue('activeTab', tab);
    },
    [setFilterFieldValue]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setFilterFieldValue('searchQuery', query);
    },
    [setFilterFieldValue]
  );

  const handleClearSearch = useCallback(() => {
    setFilterFieldValue('searchQuery', '');
  }, [setFilterFieldValue]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with quick actions */}
      <NotificationsPageHeader
        unreadCount={summary.unread}
        hasNotifications={notifications.length > 0}
        onSimulateNewAlert={handleSimulateNewAlert}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      {/* 2. Top Summary KPI Cards */}
      <NotificationKPISection
        totalCount={notifications.length}
        unreadCount={summary.unread}
        urgentCount={summary.urgent}
        archivedCount={summary.archived}
      />

      {/* 3. Category Filter Tabs & Search Bar */}
      <NotificationFilterBar
        activeTab={filterValues.activeTab}
        onTabChange={handleTabChange}
        searchQuery={filterValues.searchQuery}
        onSearchChange={handleSearchChange}
        counts={summary.counts}
      />

      {/* 4. Notifications List */}
      <NotificationListSection
        notifications={filteredNotifications}
        searchQuery={filterValues.searchQuery}
        onClearSearch={handleClearSearch}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
        onDelete={handleDelete}
        onNavigate={handleNavigate}
      />
    </div>
  );
});

NotificationsScreen.displayName = 'NotificationsScreen';
export default NotificationsScreen;
