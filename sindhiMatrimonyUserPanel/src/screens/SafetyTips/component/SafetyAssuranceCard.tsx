import React from "react";
import { ShieldCheck, UserCheck, Lock, BellRing } from "lucide-react";

export const SafetyAssuranceCard: React.FC = React.memo(() => {
  return (
    <div className="bg-gradient-to-br from-red-50/80 via-white to-stone-50 rounded-2xl border border-red-200/80 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-100 text-[#DB2F3C] rounded-xl shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
            Our Security Commitments to Sindhi Families
          </h2>
          <p className="text-xs text-stone-500">
            Enterprise-grade safety features operating behind every profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            100% OTP Verification
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Every registered Indian and International mobile number is authenticated via real-time SMS OTP before account activation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
            <Lock className="w-4 h-4 text-amber-600" />
            Photo Privacy Controls
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Full control to blur photos or make them visible exclusively to shortlisted and accepted matrimonial matches.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
            <BellRing className="w-4 h-4 text-[#DB2F3C]" />
            24/7 Red Flag Scanning
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Automated machine learning models instantly intercept suspicious chat patterns, money requests, and duplicate accounts.
          </p>
        </div>
      </div>
    </div>
  );
});

SafetyAssuranceCard.displayName = "SafetyAssuranceCard";
