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

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_001',
    title: 'SLA Escalation Alert',
    message: 'High priority follow-up for Lead #LD-1042 (Rohit Vazirani) is due in 30 minutes. Customer requested call at 3:00 PM.',
    category: 'LEAD',
    priority: 'URGENT',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    timeAgo: '15 mins ago',
    isRead: false,
    link: '/leads',
    actionLabel: 'View Lead in CRM',
  },
  {
    id: 'notif_002',
    title: 'Payment Received via UPI',
    message: '₹15,000 received from Sangeeta Advani for Royal Sindhi Elite Plan (Invoice #INV-2026-089). Verification required.',
    category: 'PAYMENT',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timeAgo: '45 mins ago',
    isRead: false,
    link: '/finance',
    actionLabel: 'Verify Payment',
  },
  {
    id: 'notif_003',
    title: 'New Aadhaar KYC Documents',
    message: '3 candidates submitted identity documents for profile verification. Awaiting moderator review at Verification Desk.',
    category: 'SYSTEM',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    timeAgo: '2 hours ago',
    isRead: false,
    link: '/verifications',
    actionLabel: 'Review KYC Desk',
  },
  {
    id: 'notif_004',
    title: 'Mutual Match Request Approved',
    message: 'Client Jitamitra Dharmadhikary (#SM-8920) approved recommendation for Dr. Aarti Rohra (#SM-7741). Contact exchange requested.',
    category: 'MATCH',
    priority: 'NORMAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    timeAgo: '4 hours ago',
    isRead: false,
    link: '/match-responses',
    actionLabel: 'View Match Details',
  },
  {
    id: 'notif_005',
    title: 'New CRM Leads Allocated',
    message: '20 fresh website inquiries from Mumbai & Pune allocated to your bucket. Please review contact numbers and schedule intro calls.',
    category: 'LEAD',
    priority: 'NORMAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    timeAgo: '6 hours ago',
    isRead: true,
    link: '/leads',
    actionLabel: 'Open Leads Bucket',
  },
  {
    id: 'notif_006',
    title: 'Employee Session Login',
    message: 'CRM Relationship Exec Priya Sharma logged in from Mumbai IP (Chrome macOS). Two-factor authorization verified.',
    category: 'SECURITY',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    timeAgo: '12 hours ago',
    isRead: true,
    link: '/employees',
    actionLabel: 'View Staff Audit',
  },
  {
    id: 'notif_007',
    title: 'Automated Database Backup',
    message: 'Daily encrypted backup of verified member profiles (39,434 records) completed successfully to secure cloud vault.',
    category: 'SYSTEM',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    timeAgo: '1 day ago',
    isRead: true,
  },
];

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') {
      this.notifications = [...INITIAL_NOTIFICATIONS];
      return;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.notifications = JSON.parse(data);
      } else {
        this.notifications = [...INITIAL_NOTIFICATIONS];
        this.saveState();
      }
    } catch {
      this.notifications = [...INITIAL_NOTIFICATIONS];
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
