"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  Zap,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Tag,
  ArrowRight,
  ExternalLink,
  Gift,
  Heart,
  Star,
} from "lucide-react";
import { useDashboardAdsQuery } from "@/tanstackQuery";
import { isDeepEqual } from "@/utils";

export interface EditProfileAdsSectionProps {
  className?: string;
  onUpgradeClick?: () => void;
}

const EditProfileAdsSectionComponent: React.FC<EditProfileAdsSectionProps> = ({
  className = "",
  onUpgradeClick,
}) => {
  const { data: adsRes } = useDashboardAdsQuery();
  const adsData = (adsRes as any)?.data || adsRes;

  const paidPromo = adsData?.paidMember || {
    discountPercent: 71,
    title: "Become a Paid Member & Save 71%",
    subtitle: "Get up to 71% OFF on premium membership plans!",
    perks: [
      "Call/WhatsApp matches directly",
      "Unlimited messaging & chat",
      "View and match horoscopes",
      "Higher chances of quick response",
    ],
    ctaText: "See membership plans",
    upgradeUrl: "/subscription",
  };

  const assistedPromo = adsData?.assistedServiceBanner || {
    title: "Assisted Service Luxury",
    subtitle: "Find matches 3X faster with a dedicated Relationship Manager",
    badge: "Personalized VIP Service",
    benefits: [
      "Dedicated Matchmaker handpicks curated profiles",
      "Facilitates family introductions & meetings",
      "100% Confidential and background-verified",
    ],
    ctaText: "Explore Assisted",
    ctaUrl: "/subscription?plan=assisted",
  };

  const [activeTab, setActiveTab] = useState<"membership" | "assisted">("membership");

  return (
    <section
      aria-label="Promotional Offers & Upgrades"
      className={`w-full rounded-2xl overflow-hidden border border-stone-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-md ${className}`}
    >
      {/* Top Banner Navigation / Tabs Header */}
      <div className="bg-gradient-to-r from-[#FFF5F6] via-[#FFF9F9] to-[#FFF0F2] border-b border-[#FCEAEF] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DB2F3C] to-[#B71F2A] flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-heading tracking-tight flex items-center gap-1.5">
              <span>Exclusive Member Privileges</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DB2F3C] text-white px-2 py-0.5 rounded-full">
                {paidPromo.discountPercent || 71}% OFF
              </span>
            </h3>
            <p className="text-[11.5px] text-stone-500">
              Accelerate your partner search with verified contact numbers & matchmaking
            </p>
          </div>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center bg-white/80 p-0.5 rounded-xl border border-stone-200/80 shadow-2xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("membership")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "membership"
                ? "bg-[#DB2F3C] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Premium Membership</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assisted")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "assisted"
                ? "bg-[#1A1A1A] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Assisted Service</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Premium Membership Ad Content */}
      {activeTab === "membership" && (
        <div className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white via-[#FFFBFB] to-[#FFF5F6]">
          {/* Left Column: Heading, Subtitle & Features */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[#DB2F3C] text-[11px] font-bold mb-2">
                <Tag className="w-3 h-3" />
                <span>Limited Time Festive Discount • Save {paidPromo.discountPercent || 71}%</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
                {paidPromo.title}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-600 mt-1">
                {paidPromo.subtitle}
              </p>
            </div>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <PhoneCall className="w-3 h-3" />
                </div>
                <span>Call & WhatsApp verified matches</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <MessageCircle className="w-3 h-3" />
                </div>
                <span>Send unlimited direct messages</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>Match Vedic Kundli & Horoscopes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Zap className="w-3 h-3" />
                </div>
                <span>3X higher chances of quick response</span>
              </div>
            </div>

            {/* CTA Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/subscription"
                onClick={onUpgradeClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF4D5A] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-sm shadow-red-500/20 transition-all cursor-pointer"
              >
                <span>Upgrade to Paid Membership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11.5px] text-stone-400">
                Plans start at just ₹990/month • Cancel anytime
              </span>
            </div>
          </div>

          {/* Right Column: Hero Graphic Image */}
          <div className="relative shrink-0 w-44 sm:w-52 h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF0F2] to-[#FCEAEF] border border-stone-200/80 flex items-center justify-center p-2 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dashboard/paid_member_woman.jpg"
              alt="Paid Member Benefits"
              className="w-full h-full object-contain object-bottom transition-transform duration-300 hover:scale-105 drop-shadow-sm"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-200/80 text-[10px] font-bold text-[#DB2F3C] shadow-2xs">
              {paidPromo.discountPercent || 71}% OFF
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assisted Service VIP Ad Content */}
      {activeTab === "assisted" && (
        <div className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-[#1A1A1A] via-[#2A2426] to-[#1F191B] text-white">
          {/* Left Column: Assisted Service Perks */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{assistedPromo.badge || "Personalized VIP Service"}</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                {assistedPromo.title}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-300 mt-1">
                {assistedPromo.subtitle}
              </p>
            </div>

            {/* Perks List */}
            <div className="space-y-2 pt-1">
              {(assistedPromo.benefits || [
                "Dedicated Matchmaker handpicks curated profiles",
                "Facilitates family introductions & meetings",
                "100% Confidential and background-verified",
              ]).map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/subscription?plan=assisted"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-105 active:scale-[0.98] text-stone-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>{assistedPromo.ctaText || "Explore Assisted Service"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11.5px] text-stone-400">
                High-touch matchmaking for busy professionals & HNIs
              </span>
            </div>
          </div>

          {/* Right Column: Luxury Badge Box */}
          <div className="relative shrink-0 w-44 sm:w-52 h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-400/20 flex flex-col items-center justify-center p-4 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 mb-3 shadow-md">
              <Crown className="w-7 h-7" />
            </div>
            <div className="text-sm font-bold text-amber-300">3X Faster Matches</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Personal Matchmaker assigns handpicked Sindhi matches weekly
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const EditProfileAdsSection = memo(
  EditProfileAdsSectionComponent,
  (prev, next) => isDeepEqual(prev, next)
);
EditProfileAdsSection.displayName = "EditProfileAdsSection";
export default EditProfileAdsSection;
