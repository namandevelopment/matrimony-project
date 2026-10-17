"use client";

import React, { memo } from "react";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface NotificationActivityWidgetProps {
  onUpgradeClick?: () => void;
  className?: string;
}

const NotificationActivityWidgetComponent: React.FC<NotificationActivityWidgetProps> = ({
  onUpgradeClick,
  className = "",
}) => {
  return (
    <aside className={`space-y-4 ${className}`} aria-label="Activity & Tips">
      {/* 1. Activity Pulse Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-[#DB2F3C]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Activity Pulse</h3>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/40">
            +24% this week
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Profile Views</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900">48</span>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ 14</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Interests</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900">12</span>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ 3</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
              <span>Messages</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900">8</span>
              <span className="text-[10px] text-stone-400">active</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Match Score</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900">95%</span>
              <span className="text-[10px] text-stone-400">avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Upgrade to Prime / Assisted Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-5 shadow-sm border border-stone-800">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-[#DB2F3C]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
            Prime Gold
          </span>
          <span className="text-[11px] text-stone-400">Save 45%</span>
        </div>

        <h4 className="text-sm font-bold text-white tracking-tight">
          Never Miss a Sindhi Match
        </h4>
        <p className="text-xs text-stone-300 mt-1 leading-relaxed">
          Unlock unlimited direct contact numbers, instant WhatsApp chat, and 3x more interest responses.
        </p>

        <button
          type="button"
          onClick={onUpgradeClick}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#DB2F3C] hover:bg-[#b71f2a] text-white shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <span>Upgrade to Prime</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Safety & Trust Tip Card */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200/60 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">
              SindhiMatrimony Trust Guarantee
            </h4>
            <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
              All member profiles are verified with Government ID and phone verification to keep our Sindhi community 100% safe.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const NotificationActivityWidget = memo(
  NotificationActivityWidgetComponent,
  (prev, next) => {
    return (
      prev.className === next.className &&
      prev.onUpgradeClick === next.onUpgradeClick
    );
  }
);

NotificationActivityWidget.displayName = "NotificationActivityWidget";
export default NotificationActivityWidget;
