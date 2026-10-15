"use client";

import React, { memo } from "react";
import { Check, ShieldCheck } from "lucide-react";

interface OtpStepTrackerProps {
  currentStep?: number;
}

const OtpStepTrackerComponent: React.FC<OtpStepTrackerProps> = ({ currentStep = 2 }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between relative">
        {/* Step Connecting Line Background */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-stone-200 z-0" />
        {/* Completed Progress Line */}
        <div className="absolute top-1/2 left-8 w-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-[#DB2F3C] z-0 transition-all duration-500" />

        {/* Step 1: Basic Profile */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-stone-700 mt-1.5 whitespace-nowrap">
            1. Registration
          </span>
        </div>

        {/* Step 2: OTP Verification (Current) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#FF4A57] to-[#DB2F3C] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg ring-4 ring-rose-100 animate-pulse">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#DB2F3C] mt-1.5 whitespace-nowrap">
            2. Verify OTP
          </span>
        </div>

        {/* Step 3: Matchmaking Preferences */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 border border-stone-300 text-stone-400 flex items-center justify-center font-semibold text-xs sm:text-sm ring-4 ring-white">
            3
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-stone-400 mt-1.5 whitespace-nowrap">
            3. Partner Match
          </span>
        </div>
      </div>
    </div>
  );
};

export const OtpStepTracker = memo(OtpStepTrackerComponent);
OtpStepTracker.displayName = "OtpStepTracker";
