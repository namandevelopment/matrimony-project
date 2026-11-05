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

const INITIAL_SESSIONS: UserSessionEvent[] = [];

class UserAnalyticsService {
  private sessions: UserSessionEvent[] = [];
  private backendSummaryByTimeframe: Record<string, UserAnalyticsSummary> = {};
  private listeners: (() => void)[] = [];

  constructor() {
    this.sessions = this.loadSessions();
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

