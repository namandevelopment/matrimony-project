import React from "react";
import { FileText, Clock, Shield, UserCheck } from "lucide-react";
import { TermsMetaInfo } from "../types";
import { TermsSearchAndPrint } from "./TermsSearchAndPrint";

interface TermsHeroHeaderProps {
  meta: TermsMetaInfo;
}

export const TermsHeroHeader: React.FC<TermsHeroHeaderProps> = ({ meta }) => {
  return (
    <header className="relative w-full bg-gradient-to-b from-white via-red-50/30 to-stone-50 border-b border-stone-200/80 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100/70 border border-red-200 rounded-full text-xs font-semibold text-[#DB2F3C] mb-4">
              <FileText className="w-3.5 h-3.5" />
              Official User Agreement
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-heading leading-tight">
              Terms and Conditions &amp; Service Agreement
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              Please read this User Agreement carefully before registering on Sindhimarriage.in. These terms govern your membership, code of conduct, privacy safeguards, and use of our matrimonial matchmaking platform.
            </p>

            {/* Meta details & Trust factors */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                Last Updated: <strong className="text-stone-700">{meta.lastUpdatedDate}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                Effective Date: <strong className="text-stone-700">{meta.effectiveDate}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#DB2F3C]" />
                Applicable to: <strong className="text-stone-700">{meta.targetAudience}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Search & Print Widget (Client Island) */}
          <TermsSearchAndPrint />
        </div>
      </div>
    </header>
  );
};
