export type NotificationCategory = 'LEAD' | 'PAYMENT' | 'SYSTEM' | 'SECURITY' | 'MATCH' | 'GENERAL';
export type NotificationPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  link?: string;
  actionLabel?: string;
}

const STORAGE_KEY = 'sindhi_matrimony_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') {
      this.notifications = [];
      return;
    }
    try {
      if (localStorage.getItem('sindi_notif_clean_v2') !== 'true') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem('sindi_notif_clean_v2', 'true');
        this.notifications = [];
        return;
      }
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.notifications = JSON.parse(data);
      } else {
        this.notifications = [];
      }
    } catch {
      this.notifications = [];
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch {
      // ignore write error
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('NotificationService subscriber error:', err);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveState();
  }

  public markAsUnread(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: false } : n
    );
    this.saveState();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.saveState();
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveState();
  }

  public clearAll(): void {
    this.notifications = [];
    this.saveState();
  }

  public resetToDefault(): void {
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.saveState();
  }

  public addNotification(
    data: Omit<AppNotification, 'id' | 'timestamp' | 'timeAgo' | 'isRead'> & {
      isRead?: boolean;
    }
  ): AppNotification {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: data.isRead ?? false,
      ...data,
    };
    this.notifications = [newNotif, ...this.notifications];
    this.saveState();
    return newNotif;
  }
}

export const notificationService = new NotificationService();
