import React from "react";
import { ShieldCheck, Clock, LifeBuoy, Users } from "lucide-react";
import { SafetyMetaInfo } from "../types";
import { SafetySearchAndPrint } from "./SafetySearchAndPrint";

interface SafetyHeroHeaderProps {
  meta: SafetyMetaInfo;
}

export const SafetyHeroHeader: React.FC<SafetyHeroHeaderProps> = React.memo(({ meta }) => {
  return (
    <header className="relative w-full bg-gradient-to-b from-white via-red-50/25 to-stone-50 border-b border-stone-200/80 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100/70 border border-red-200 rounded-full text-xs font-semibold text-[#DB2F3C] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DB2F3C]" />
              Official Matrimonial Safety Advisory
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-heading leading-tight">
              Matrimonial Safety Tips &amp; Fraud Prevention
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              Your security and peace of mind are our utmost priority. Follow these comprehensive guidelines to protect yourself and your family against financial fraud, fake profiles, and digital deception while searching for your Sindhi life partner.
            </p>

            {/* Meta details & Trust factors */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                Updated: <strong className="text-stone-700">{meta.lastUpdatedDate}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-emerald-600" />
                Cyber Helpline: <strong className="text-stone-700">1930 (Toll-Free)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#DB2F3C]" />
                Audience: <strong className="text-stone-700">{meta.targetAudience}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Search & Print Widget */}
          <SafetySearchAndPrint />
        </div>
      </div>
    </header>
  );
});

SafetyHeroHeader.displayName = "SafetyHeroHeader";
