import React from 'react';
import { UserPlus, Download, Users, Shield } from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface DashboardHeroBannerProps {
  adminName?: string;
  totalMembers?: number | string;
  onAddMember?: () => void;
  onExportCsv?: () => void;
}

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = memoWithDeepEqual(({
  adminName = 'Admin',
  totalMembers = '39,434',
  onAddMember,
  onExportCsv,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DB2F3C] via-[#B71F2A] to-[#88131B] text-white p-6 sm:p-8 shadow-xl shadow-red-950/15">
      {/* Decorative background radial glows */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      <div className="absolute right-40 -bottom-20 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none blur-3xl" />
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute right-24 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Greeting & Actions */}
        <div className="space-y-3 max-w-xl">
          {/* Admin Panel Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase border border-white/20 text-white">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            ADMIN PANEL
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Welcome back, {adminName} <span className="inline-block animate-bounce">👋</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-red-100/90 font-medium">
            Here's an overview of Sindhi Matrimony community activity and growth metrics.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onAddMember}
              className="px-4 py-2.5 rounded-xl bg-white text-rose-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-lg shadow-black/10 transition-transform active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-rose-700" />
              Add Member
            </button>

            <button
              onClick={onExportCsv}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 border border-white/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Right Column: Quick Metric Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-red-100">Total Community Profiles</div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{totalMembers}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardHeroBanner.displayName = 'DashboardHeroBanner';
