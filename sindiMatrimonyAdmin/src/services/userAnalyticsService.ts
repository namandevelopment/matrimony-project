/**
 * User Analytics & Engagement Service (Google / Firebase Analytics style)
 * Tracks user logins, logouts, session duration, screen paths, and payment intent.
 */

import { apiFetch, ApiURL } from '../redux/apiService';

export interface UserSessionEvent {
  id: string;
  userId: string;
  name: string;
  memberId: string;
  phone: string;
  avatar?: string;
  platform: 'MOBILE_APP' | 'WEB_PANEL';
  deviceInfo: string;
  loginTime: string;
  logoutTime: string | null;
  sessionDurationMinutes: number;
  screensVisited: string[];
  visitedPaymentScreen: boolean;
  viewedPlan?: string | null;
  engagementScore: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE_NOW' | 'LOGGED_OUT' | 'IDLE';
}

export interface UserAnalyticsSummary {
  activeUsersToday: number;
  totalLoginsToday: number;
  totalLogoutsToday: number;
  paymentScreenVisitsToday: number;
  avgEngagementMinutes: number;
  mobileCount: number;
  webCount: number;
  chartTitle?: string;
  hourlyActivity: { hour: string; logins: number; logouts: number; paymentVisits: number }[];
}

const STORAGE_KEY = 'sindhi_admin_user_analytics_sessions_v2';
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

const INITIAL_SESSIONS: UserSessionEvent[] = [
  // Today's sessions
  {
    id: 'sess_1',
    userId: 'u_101',
    name: 'Simran Advani',
    memberId: 'SM-4821',
    phone: '+91 98201 54321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 14 (OnePlus 11)',
    loginTime: new Date(Date.now() - 3.8 * ONE_HOUR).toISOString(),
    logoutTime: new Date(Date.now() - 3.3 * ONE_HOUR).toISOString(),
    sessionDurationMinutes: 28,
    screensVisited: ['Home Feed', 'Daily Horoscope', 'Recommendations', 'Payment & Upgrade Plans'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Gold (3 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_2',
    userId: 'u_102',
    name: 'Rohan Chandiramani',
    memberId: 'SM-4932',
    phone: '+91 98233 87654',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Chrome on macOS (Desktop)',
    loginTime: new Date(Date.now() - 1.8 * ONE_HOUR).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 45,
    screensVisited: ['Dashboard', 'Member Search', 'Kundli Match', 'Festival Offers', 'Payment Checkout'],
    visitedPaymentScreen: true,
    viewedPlan: 'Royal Sindhi Platinum (6 Months)',
    engagementScore: 'HIGH',
    status: 'ACTIVE_NOW',
  },
  {
    id: 'sess_3',
    userId: 'u_103',
    name: 'Pooja Vazirani',
    memberId: 'SM-5104',
    phone: '+91 97112 34567',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'iOS 18.1 (iPhone 15 Pro)',
    loginTime: new Date(Date.now() - 1.5 * ONE_HOUR).toISOString(),
    logoutTime: new Date(Date.now() - 1.25 * ONE_HOUR).toISOString(),
    sessionDurationMinutes: 15,
    screensVisited: ['Home Feed', 'Interests Received', 'Chat Messaging'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'MEDIUM',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_4',
    userId: 'u_104',
    name: 'Karan Lulla',
    memberId: 'SM-5220',
    phone: '+91 99887 11223',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 13 (Samsung S23)',
    loginTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 22,
    screensVisited: ['Home Feed', 'Profile Edit', 'Upgrade Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Diamond VIP (12 Months)',
    engagementScore: 'HIGH',
    status: 'ACTIVE_NOW',
  },
  {
    id: 'sess_5',
    userId: 'u_105',
    name: 'Ananya Motwani',
    memberId: 'SM-5341',
    phone: '+91 98450 11998',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Safari on iPadOS',
    loginTime: new Date(Date.now() - 5 * ONE_HOUR).toISOString(),
    logoutTime: new Date(Date.now() - 4.8 * ONE_HOUR).toISOString(),
    sessionDurationMinutes: 12,
    screensVisited: ['Home Feed', 'Browse Profiles'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'LOW',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_6',
    userId: 'u_106',
    name: 'Deepak Chawla',
    memberId: 'SM-5490',
    phone: '+91 98110 55443',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 14 (Pixel 8)',
    loginTime: new Date(Date.now() - 6.5 * ONE_HOUR).toISOString(),
    logoutTime: new Date(Date.now() - 6.0 * ONE_HOUR).toISOString(),
    sessionDurationMinutes: 33,
    screensVisited: ['Home Feed', 'Kundli Report', 'Prime Plans', 'Payment Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Diwali Mahabachat Vivah (Flat 60% OFF)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_7',
    userId: 'u_107',
    name: 'Mehak Jagtiani',
    memberId: 'SM-5512',
    phone: '+91 98330 99881',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'iOS 18 (iPhone 14)',
    loginTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 18,
    screensVisited: ['Home Feed', 'Matches', 'Contact Info View', 'Upgrade Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Royal Sindhi Platinum (6 Months)',
    engagementScore: 'HIGH',
    status: 'ACTIVE_NOW',
  },
  {
    id: 'sess_8',
    userId: 'u_108',
    name: 'Naveen Bhambhani',
    memberId: 'SM-5601',
    phone: '+91 97654 32109',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Edge on Windows 11',
    loginTime: new Date(Date.now() - 8 * ONE_HOUR).toISOString(),
    logoutTime: new Date(Date.now() - 7.5 * ONE_HOUR).toISOString(),
    sessionDurationMinutes: 30,
    screensVisited: ['Dashboard', 'Shortlists', 'Settings'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'MEDIUM',
    status: 'LOGGED_OUT',
  },

  // Past 2 - 7 days sessions
  {
    id: 'sess_9',
    userId: 'u_109',
    name: 'Priyanka Malkani',
    memberId: 'SM-5710',
    phone: '+91 98211 44556',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 14 (Samsung S24)',
    loginTime: new Date(Date.now() - 1.2 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 1.15 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 40,
    screensVisited: ['Home Feed', 'Kundli Match', 'Pricing Plans', 'Payment Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Gold (3 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_10',
    userId: 'u_110',
    name: 'Sunil Wadhwa',
    memberId: 'SM-5822',
    phone: '+91 98920 66778',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Firefox on macOS',
    loginTime: new Date(Date.now() - 2.1 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 2.05 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 24,
    screensVisited: ['Dashboard', 'Matches', 'Chat'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'MEDIUM',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_11',
    userId: 'u_111',
    name: 'Ritu Chhabria',
    memberId: 'SM-5930',
    phone: '+91 98451 22334',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'iOS 17.5 (iPhone 13)',
    loginTime: new Date(Date.now() - 2.8 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 2.75 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 35,
    screensVisited: ['Home Feed', 'Festival Offers', 'Upgrade Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Cheti Chand Jhulelal Offer (50% OFF)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_12',
    userId: 'u_112',
    name: 'Manish Vaswani',
    memberId: 'SM-6011',
    phone: '+91 98222 77889',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Chrome on Windows 10',
    loginTime: new Date(Date.now() - 3.4 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 3.35 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 20,
    screensVisited: ['Dashboard', 'Kundli Match', 'Pricing Plans'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Diamond VIP (12 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_13',
    userId: 'u_113',
    name: 'Riya Keswani',
    memberId: 'SM-6124',
    phone: '+91 97118 88990',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 13 (Vivo V29)',
    loginTime: new Date(Date.now() - 4.2 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 4.15 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 18,
    screensVisited: ['Home Feed', 'Explore Profiles'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'LOW',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_14',
    userId: 'u_114',
    name: 'Harsh Gidwani',
    memberId: 'SM-6235',
    phone: '+91 98334 11223',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'iOS 18 (iPhone 15)',
    loginTime: new Date(Date.now() - 5.1 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 5.0 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 48,
    screensVisited: ['Home Feed', 'Chat', 'Festival Deals', 'Payment Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Royal Sindhi Platinum (6 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_15',
    userId: 'u_115',
    name: 'Divya Wadhwa',
    memberId: 'SM-6340',
    phone: '+91 98205 66779',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Safari on macOS',
    loginTime: new Date(Date.now() - 6.2 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 6.15 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 26,
    screensVisited: ['Dashboard', 'Shortlists', 'Profile Edit'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'MEDIUM',
    status: 'LOGGED_OUT',
  },

  // Past 8 - 30 days sessions
  {
    id: 'sess_16',
    userId: 'u_116',
    name: 'Gaurav Hiranandani',
    memberId: 'SM-6455',
    phone: '+91 99880 12345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 14 (OnePlus 12)',
    loginTime: new Date(Date.now() - 9.5 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 9.4 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 38,
    screensVisited: ['Home Feed', 'Recommendations', 'Payment Upgrade'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Gold (3 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_17',
    userId: 'u_117',
    name: 'Komal Rohra',
    memberId: 'SM-6560',
    phone: '+91 98114 55667',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Chrome on Windows 11',
    loginTime: new Date(Date.now() - 14.2 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 14.15 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 19,
    screensVisited: ['Dashboard', 'Kundli Match'],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: 'LOW',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_18',
    userId: 'u_118',
    name: 'Sanjay Asrani',
    memberId: 'SM-6672',
    phone: '+91 98223 99887',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    platform: 'MOBILE_APP',
    deviceInfo: 'Android 13 (Realme GT)',
    loginTime: new Date(Date.now() - 21.0 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 20.95 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 52,
    screensVisited: ['Home Feed', 'Matches', 'Pricing Plans', 'Payment Screen'],
    visitedPaymentScreen: true,
    viewedPlan: 'Sindhi Diamond VIP (12 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
  {
    id: 'sess_19',
    userId: 'u_119',
    name: 'Sapna Mirchandani',
    memberId: 'SM-6780',
    phone: '+91 98450 33221',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    platform: 'WEB_PANEL',
    deviceInfo: 'Chrome on macOS',
    loginTime: new Date(Date.now() - 26.5 * ONE_DAY).toISOString(),
    logoutTime: new Date(Date.now() - 26.45 * ONE_DAY).toISOString(),
    sessionDurationMinutes: 30,
    screensVisited: ['Dashboard', 'Browse', 'Upgrade Plans'],
    visitedPaymentScreen: true,
    viewedPlan: 'Royal Sindhi Platinum (6 Months)',
    engagementScore: 'HIGH',
    status: 'LOGGED_OUT',
  },
];

class UserAnalyticsService {
  private sessions: UserSessionEvent[] = [];
  private backendSummaryByTimeframe: Record<string, UserAnalyticsSummary> = {};
  private listeners: (() => void)[] = [];

  constructor() {
    this.sessions = this.loadSessions();
    this.fetchSessionsFromApi('TODAY');
  }

  public async fetchSessionsFromApi(timeframe: 'TODAY' | '7D' | '30D' = 'TODAY'): Promise<void> {
    try {
      const res = await apiFetch<any>({
        url: ApiURL.userAnalyticsSessions,
        params: { timeframe },
        isToken: true,
        showErrorToast: false,
      });

      if (res?.data) {
        if (Array.isArray(res.data.sessions) && res.data.sessions.length > 0) {
          // Merge or replace sessions
          const incomingIds = new Set(res.data.sessions.map((s: any) => s.id));
          const kept = this.sessions.filter((s) => !incomingIds.has(s.id));
          this.sessions = [...res.data.sessions, ...kept];
          this.saveSessions();
        }

        if (res.data.summary) {
          this.backendSummaryByTimeframe[timeframe] = res.data.summary;
        }
      }
    } catch {
      // Fallback: local session pool already present
    }
    this.listeners.forEach((l) => l());
  }

  private loadSessions(): UserSessionEvent[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_SESSIONS;
  }

  private saveSessions(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
    } catch {}
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public getSessions(timeframe: 'TODAY' | '7D' | '30D' = 'TODAY'): UserSessionEvent[] {
    const now = Date.now();
    let cutoff = now - ONE_DAY;
    if (timeframe === '7D') {
      cutoff = now - 7 * ONE_DAY;
    } else if (timeframe === '30D') {
      cutoff = now - 30 * ONE_DAY;
    }
    return this.sessions.filter((s) => new Date(s.loginTime).getTime() >= cutoff);
  }

  public getSummary(timeframe: 'TODAY' | '7D' | '30D' = 'TODAY'): UserAnalyticsSummary {
    if (this.backendSummaryByTimeframe[timeframe]) {
      return this.backendSummaryByTimeframe[timeframe];
    }

    const list = this.getSessions(timeframe);
    const activeUsersToday = list.filter((s) => s.status === 'ACTIVE_NOW').length;
    const paymentScreenVisitsToday = list.filter((s) => s.visitedPaymentScreen).length;
    const totalDuration = list.reduce((acc, s) => acc + (s.sessionDurationMinutes || 0), 0);
    const avgEngagementMinutes = list.length > 0 ? Math.round(totalDuration / list.length) : 0;
    const mobileCount = list.filter((s) => s.platform === 'MOBILE_APP').length;
    const webCount = list.filter((s) => s.platform === 'WEB_PANEL').length;

    let chartTitle = "Today's Hourly User Engagement & Traffic Spikes";
    let hourlyActivity: { hour: string; logins: number; logouts: number; paymentVisits: number }[] = [];

    const now = Date.now();
    if (timeframe === 'TODAY') {
      chartTitle = "Today's Hourly User Engagement & Traffic Spikes";
      const hourSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      hourlyActivity = hourSlots.map((h) => {
        const targetH = parseInt(h.split(':')[0], 10);
        const matches = list.filter((s) => {
          const d = new Date(s.loginTime);
          const sH = d.getHours();
          return sH >= targetH - 1 && sH <= targetH + 1;
        });
        return {
          hour: h,
          logins: matches.length,
          logouts: matches.filter((s) => s.status === 'LOGGED_OUT').length,
          paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
        };
      });
    } else if (timeframe === '7D') {
      chartTitle = 'Last 7 Days Daily User Engagement & Trend';
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * ONE_DAY);
        const dayName = days[d.getDay()];
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const dayEnd = dayStart + ONE_DAY;
        const matches = list.filter((s) => {
          const t = new Date(s.loginTime).getTime();
          return t >= dayStart && t < dayEnd;
        });
        hourlyActivity.push({
          hour: dayName,
          logins: matches.length,
          logouts: matches.filter((s) => s.status === 'LOGGED_OUT').length,
          paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
        });
      }
    } else {
      chartTitle = 'Last 30 Days Weekly User Traffic & Spikes';
      const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      for (let w = 3; w >= 0; w--) {
        const wStart = now - (w + 1) * 7.5 * ONE_DAY;
        const wEnd = now - w * 7.5 * ONE_DAY;
        const matches = list.filter((s) => {
          const t = new Date(s.loginTime).getTime();
          return t >= wStart && t < wEnd;
        });
        hourlyActivity.push({
          hour: weekLabels[3 - w],
          logins: matches.length,
          logouts: matches.filter((s) => s.status === 'LOGGED_OUT').length,
          paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
        });
      }
    }

    return {
      activeUsersToday,
      totalLoginsToday: list.length,
      totalLogoutsToday: list.filter((s) => s.status === 'LOGGED_OUT').length,
      paymentScreenVisitsToday,
      avgEngagementMinutes,
      mobileCount,
      webCount,
      chartTitle,
      hourlyActivity,
    };
  }
}

export const userAnalyticsService = new UserAnalyticsService();
export default userAnalyticsService;

