import React from 'react';
import {
  TrendingUp,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';
import { campaignService } from '../../../services/campaignService';

export const CampaignAnalyticsSection: React.FC = () => {
  const summary = campaignService.getAnalyticsSummary();

  const channelBreakdown = [
    { name: 'Mobile Push (FCM)', share: 58, count: 42100, color: 'bg-[#C81E28]' },
    { name: 'In-App Bell Drawer', share: 24, count: 18200, color: 'bg-amber-500' },
    { name: 'Web Push Notifications', share: 12, count: 9100, color: 'bg-blue-600' },
    { name: 'Email Digest Alerts', share: 6, count: 4500, color: 'bg-purple-600' },
  ];

  const audiencePerformance = [
    { segment: 'Free Non-Subscribers', ctr: '8.4%', conversions: '312 plans', engagement: 'High' },
    { segment: 'Expired VIP Profiles', ctr: '14.2%', conversions: '189 plans', engagement: 'Very High' },
    { segment: 'Unverified KYC Users', ctr: '6.1%', conversions: '142 verified', engagement: 'Moderate' },
    { segment: 'Inactive 30+ Days', ctr: '3.8%', conversions: '48 plans', engagement: 'Low' },
  ];

  // Daily simulated engagement trend for the last 7 days
  const dailyTrends = [
    { day: 'Mon', impressions: 4200, dismissals: 1100, clicks: 820 },
    { day: 'Tue', impressions: 5100, dismissals: 1350, clicks: 990 },
    { day: 'Wed', impressions: 6800, dismissals: 1800, clicks: 1340 },
    { day: 'Thu', impressions: 7900, dismissals: 2100, clicks: 1620 },
    { day: 'Fri', impressions: 9400, dismissals: 2600, clicks: 1980 },
    { day: 'Sat', impressions: 12200, dismissals: 3100, clicks: 2540 },
    { day: 'Sun', impressions: 14850, dismissals: 3820, clicks: 2940 },
  ];

  const maxImpression = 15000;

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Impressions
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {summary.totalPopupImpressions.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4% this week
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Overall CTR %
          </span>
          <div className="text-xl font-black text-[#C81E28] mt-1">{summary.overallCtr}%</div>
          <span className="text-[11px] text-slate-500 font-medium">Click-Through Rate</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Delivered Broadcasts
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">{summary.deliveryRate}%</div>
          <span className="text-[11px] text-slate-500 font-medium">Delivery Reliability</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Open Rate
          </span>
          <div className="text-xl font-black text-blue-700 mt-1">{summary.openRate}%</div>
          <span className="text-[11px] text-slate-500 font-medium">Open & Tap Through</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total CTA Clicks
          </span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {summary.totalPopupCtaClicks.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Claim / Buy Actions</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Campaigns
          </span>
          <div className="text-xl font-black text-purple-700 mt-1">
            {summary.activeOffersCount + summary.activePopupsCount}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Offers + Popups</span>
        </div>
      </div>

      {/* 2. Visual Graphs: Daily Trends & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C81E28]" />
                Daily Impression & Dismissal Trends (7-Day Curve)
              </h3>
              <p className="text-xs text-slate-400">
                Tracking view impressions, [X] user dismissals and positive CTA clicks
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C81E28]" />
                Impressions
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-300" />
                Dismissals
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                CTA Clicks
              </span>
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 border-b border-slate-100">
            {dailyTrends.map((t) => {
              const impHeight = Math.round((t.impressions / maxImpression) * 100);
              const disHeight = Math.round((t.dismissals / maxImpression) * 100);
              const clickHeight = Math.round((t.clicks / maxImpression) * 100);

              return (
                <div key={t.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Impressions Bar */}
                    <div
                      className="w-3 sm:w-4 bg-[#C81E28] rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${impHeight}%` }}
                      title={`Impressions: ${t.impressions}`}
                    />
                    {/* Dismissals Bar */}
                    <div
                      className="w-3 sm:w-4 bg-rose-300 rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${disHeight}%` }}
                      title={`Dismissals: ${t.dismissals}`}
                    />
                    {/* Clicks Bar */}
                    <div
                      className="w-3 sm:w-4 bg-emerald-500 rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${clickHeight}%` }}
                      title={`CTA Clicks: ${t.clicks}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{t.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Deduplication &amp; Rate-limiting active</span>
            <span className="font-bold text-slate-800">Peak Volume: Sunday (14,850 impressions)</span>
          </div>
        </div>

        {/* Channel Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-500" />
              Delivery Channels Share
            </h3>
            <p className="text-xs text-slate-400">Total volume across integrated providers</p>
          </div>

          <div className="space-y-3 pt-2">
            {channelBreakdown.map((item) => (
              <div key={item.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{item.name}</span>
                  <span className="font-mono text-slate-600">
                    {item.count.toLocaleString('en-IN')} ({item.share}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Optimal Dispatch Time:</strong> 18:00 — 21:00 IST delivers 2.8x higher open rate compared to morning dispatches.
          </div>
        </div>
      </div>

      {/* 3. Conversion Funnel & Audience Segment Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Marketing Conversion Funnel
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { stage: '1. Targeted Audience', count: '48,500', pct: '100%', bg: 'bg-slate-900 text-white' },
              { stage: '2. Sent to Provider (FCM / In-App)', count: '48,500', pct: '100%', bg: 'bg-[#991B1B] text-white' },
              { stage: '3. Confirmed Delivered', count: '46,560', pct: '96.0%', bg: 'bg-[#C81E28] text-white' },
              { stage: '4. Opened / Viewed Modal', count: '19,550', pct: '42.0%', bg: 'bg-amber-500 text-slate-950 font-black' },
              { stage: '5. Positive CTA Clicked', count: '5,510', pct: '11.8%', bg: 'bg-emerald-600 text-white font-black' },
              { stage: '6. Plan Purchased / Upgraded', count: '691', pct: '1.4%', bg: 'bg-emerald-700 text-white font-black' },
            ].map((st) => (
              <div
                key={st.stage}
                className={`p-3 rounded-2xl flex items-center justify-between ${st.bg} shadow-2xs`}
              >
                <span className="font-bold">{st.stage}</span>
                <span className="font-mono">
                  {st.count} ({st.pct})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Segment Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Audience Segment Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Segment</th>
                  <th className="py-2.5 px-3">Engagement Level</th>
                  <th className="py-2.5 px-3">Click-Through Rate</th>
                  <th className="py-2.5 px-3">Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audiencePerformance.map((row) => (
                  <tr key={row.segment} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.segment}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.engagement === 'Very High'
                            ? 'bg-purple-100 text-purple-800'
                            : row.engagement === 'High'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.engagement === 'Moderate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {row.engagement}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-800 font-mono">
                      {row.ctr}
                    </td>
                    <td className="py-3 px-3 font-black text-emerald-700">{row.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
