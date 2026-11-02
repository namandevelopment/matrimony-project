import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  LogIn,
  LogOut,
  CreditCard,
  Clock,
  Smartphone,
  Globe,
  Search,
  Filter,
  RefreshCw,
  Flame,
  ArrowUpRight,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  type UserSessionEvent,
  userAnalyticsService,
} from '../../services/userAnalyticsService';
import { CustomTextInput } from '../../components/CustomTextInput';
import { toast } from '../../toastMessage/toast';

export const UserAnalyticsScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState<UserSessionEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'MOBILE_APP' | 'WEB_PANEL'>('ALL');
  const [eventFilter, setEventFilter] = useState<'ALL' | 'ACTIVE_NOW' | 'LOGGED_OUT' | 'PAYMENT_VISITED'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'TODAY' | '7D' | '30D'>('TODAY');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'payments') {
      setEventFilter('PAYMENT_VISITED');
    } else if (tab === 'sessions') {
      setEventFilter('ALL');
    }
  }, [searchParams]);

  useEffect(() => {
    const update = () => setSessions(userAnalyticsService.getSessions());
    update();
    const unsub = userAnalyticsService.subscribe(update);
    return () => unsub();
  }, []);

  const summary = useMemo(() => {
    return userAnalyticsService.getSummary();
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sessions.filter((s) => {
      if (platformFilter !== 'ALL' && s.platform !== platformFilter) return false;
      if (eventFilter === 'ACTIVE_NOW' && s.status !== 'ACTIVE_NOW') return false;
      if (eventFilter === 'LOGGED_OUT' && s.status !== 'LOGGED_OUT') return false;
      if (eventFilter === 'PAYMENT_VISITED' && !s.visitedPaymentScreen) return false;

      if (q) {
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesMemberId = s.memberId.toLowerCase().includes(q);
        const matchesPhone = s.phone.includes(q);
        if (!matchesName && !matchesMemberId && !matchesPhone) return false;
      }
      return true;
    });
  }, [sessions, searchQuery, platformFilter, eventFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await userAnalyticsService.fetchSessionsFromApi();
    setSessions(userAnalyticsService.getSessions());
    setIsRefreshing(false);
    toast.success('Analytics telemetry refreshed from server.');
  };

  const totalClients = summary.mobileCount + summary.webCount;
  const mobilePct = totalClients > 0 ? Math.round((summary.mobileCount / totalClients) * 100) : 0;
  const webPct = 100 - mobilePct;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-[#991B1B] border border-rose-200 uppercase tracking-wider">
              Firebase &amp; User Telemetry
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live User Tracking Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Analytics &amp; Engagement Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics across Mobile App &amp; Web Panel: login/logout timestamps, screen journeys &amp; payment intent
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === 'TODAY' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('7D')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === '7D' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('30D')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === '30D' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-2xs"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Google / Firebase Analytics Style KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Active Right Now</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{summary.activeUsersToday}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Logged in currently</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Total Logins</span>
            <LogIn className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{summary.totalLoginsToday}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Unique sign-in sessions</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Total Logouts</span>
            <LogOut className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-700">{summary.totalLogoutsToday}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Clean session exits</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Payment Intent</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{summary.paymentScreenVisitsToday}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Explored pricing screen</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Avg Engagement</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{summary.avgEngagementMinutes}m</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Average time in app</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold">Platform Ratio</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-sm font-black text-slate-900 mt-1">
            <span className="text-rose-600">{mobilePct}% Mobile</span> / <span className="text-blue-600">{webPct}% Web</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden flex">
            <div className="bg-rose-500 h-full" style={{ width: `${mobilePct}%` }} />
            <div className="bg-blue-500 h-full" style={{ width: `${webPct}%` }} />
          </div>
        </div>
      </div>

      {/* 3. Hourly Activity Trend Chart & Platform Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Today&apos;s Hourly User Engagement &amp; Traffic Spikes</h3>
              <p className="text-[11px] text-slate-500">Distribution of logins, logouts, and payment screen visits across 24 hours</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Logins
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Payment Visits
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-slate-400" /> Logouts
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 px-2">
            {summary.hourlyActivity.map((item) => {
              const maxVal = 12;
              const loginHeight = Math.max(8, (item.logins / maxVal) * 100);
              const logoutHeight = Math.max(4, (item.logouts / maxVal) * 100);
              const paymentHeight = Math.max(2, (item.paymentVisits / maxVal) * 100);

              return (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Logins bar */}
                    <div
                      style={{ height: `${loginHeight}%` }}
                      className="w-2.5 bg-blue-500 rounded-t group-hover:bg-blue-600 transition"
                      title={`${item.hour}: ${item.logins} logins`}
                    />
                    {/* Payment Intent bar */}
                    <div
                      style={{ height: `${paymentHeight}%` }}
                      className="w-2.5 bg-amber-400 rounded-t group-hover:bg-amber-500 transition"
                      title={`${item.hour}: ${item.paymentVisits} payment screen views`}
                    />
                    {/* Logouts bar */}
                    <div
                      style={{ height: `${logoutHeight}%` }}
                      className="w-2.5 bg-slate-300 rounded-t group-hover:bg-slate-400 transition"
                      title={`${item.hour}: ${item.logouts} logouts`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Breakdown Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Platform &amp; Client Distribution</h3>
            <p className="text-[11px] text-slate-500">Live breakdown between Mobile Application and Web Panel</p>

            <div className="mt-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    <span>Mobile App (Android / iOS)</span>
                  </span>
                  <span>{summary.mobileCount} Sessions ({mobilePct}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full" style={{ width: `${mobilePct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>User Web Panel (Next.js)</span>
                  </span>
                  <span>{summary.webCount} Sessions ({webPct}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${webPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Average Session: <strong>{summary.avgEngagementMinutes} Minutes</strong></span>
            <span className="text-emerald-700 font-bold">100% Tracking Active</span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <CustomTextInput
              placeholder="Search member name, ID, phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Platform Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPlatformFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  platformFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Platforms
              </button>
              <button
                type="button"
                onClick={() => setPlatformFilter('MOBILE_APP')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  platformFilter === 'MOBILE_APP' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                type="button"
                onClick={() => setPlatformFilter('WEB_PANEL')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  platformFilter === 'WEB_PANEL' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Web
              </button>
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setEventFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  eventFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setEventFilter('ACTIVE_NOW')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  eventFilter === 'ACTIVE_NOW' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Now
              </button>
              <button
                type="button"
                onClick={() => setEventFilter('PAYMENT_VISITED')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  eventFilter === 'PAYMENT_VISITED' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payment Visited
              </button>
              <button
                type="button"
                onClick={() => setEventFilter('LOGGED_OUT')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  eventFilter === 'LOGGED_OUT' ? 'bg-white text-slate-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Logged Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detailed User Activity Session Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No session events found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No matching user analytics sessions match your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Platform &amp; Device</th>
                  <th className="py-3 px-4">Login Time</th>
                  <th className="py-3 px-4">Logout Time</th>
                  <th className="py-3 px-4">Engagement Duration</th>
                  <th className="py-3 px-4">Screen Journey &amp; Payment Intent</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSessions.map((s) => {
                  const loginDate = new Date(s.loginTime);
                  const loginFormatted = loginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  let logoutFormatted = 'Active Now';
                  if (s.logoutTime) {
                    const logoutDate = new Date(s.logoutTime);
                    logoutFormatted = logoutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      {/* User Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-600 text-xs border border-slate-300 shadow-2xs">
                            {s.avatar ? (
                              <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                            ) : (
                              s.name.slice(0, 1).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{s.name}</span>
                              <span className="font-mono text-rose-700 text-xs font-bold">({s.memberId})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Platform & Device */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              s.platform === 'MOBILE_APP'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {s.platform === 'MOBILE_APP' ? (
                              <Smartphone className="w-3 h-3" />
                            ) : (
                              <Globe className="w-3 h-3" />
                            )}
                            <span>{s.platform === 'MOBILE_APP' ? 'Mobile App' : 'Web Panel'}</span>
                          </span>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{s.deviceInfo}</p>
                        </div>
                      </td>

                      {/* Login Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <LogIn className="w-3.5 h-3.5 text-blue-500" />
                          <span>{loginFormatted}</span>
                        </div>
                      </td>

                      {/* Logout Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {s.status === 'ACTIVE_NOW' ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Active Now
                            </span>
                          ) : (
                            <span className="text-slate-600 flex items-center gap-1">
                              <LogOut className="w-3.5 h-3.5 text-slate-400" />
                              {logoutFormatted}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Engagement Duration */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-900 font-bold">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{s.sessionDurationMinutes} mins</span>
                        </div>
                      </td>

                      {/* Screen Journey & Payment Intent */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-xs">
                          {s.visitedPaymentScreen && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                              <Flame className="w-3 h-3 text-amber-600" />
                              Payment Screen Visited
                            </span>
                          )}
                          <div className="text-[11px] text-slate-600 truncate">
                            {s.screensVisited.join(' ➔ ')}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            s.status === 'ACTIVE_NOW'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {s.status === 'ACTIVE_NOW' ? 'Active Now' : 'Logged Out'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalyticsScreen;

