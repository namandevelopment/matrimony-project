import React from "react";
import { ShieldCheck, Clock, Lock } from "lucide-react";
import { PolicyMetaInfo } from "../types";
import { PrivacySearchAndPrint } from "./PrivacySearchAndPrint";

interface PrivacyHeroHeaderProps {
  meta: PolicyMetaInfo;
}

export const PrivacyHeroHeader: React.FC<PrivacyHeroHeaderProps> = ({ meta }) => {
  return (
    <header className="relative w-full bg-gradient-to-b from-white via-red-50/30 to-stone-50 border-b border-stone-200/80 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100/70 border border-red-200 rounded-full text-xs font-semibold text-[#DB2F3C] mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Data Protection &amp; Confidentiality Charter
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-heading leading-tight">
              Privacy Policy &amp; Personal Data Protection
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              Your trust is sacred. Discover how SindhiMatrimony.com safeguards your profile, horoscope data, photos, and personal contact details with bank-grade encryption and granular privacy controls.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                Last Updated: <strong className="text-stone-700">{meta.lastUpdatedDate}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Compliance: <strong className="text-stone-700">{meta.complianceStandard}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#DB2F3C]" />
                Security: <strong className="text-stone-700">{meta.securityStandard}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Search & Print Widget (Client Island) */}
          <PrivacySearchAndPrint />
        </div>
      </div>
    </header>
  );
};
