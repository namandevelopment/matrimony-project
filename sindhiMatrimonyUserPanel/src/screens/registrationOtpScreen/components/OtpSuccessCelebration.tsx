"use client";

import React, { memo } from "react";
import Link from "next/link";
import { CheckCircle2, HeartHandshake, ArrowRight, Sparkles } from "lucide-react";

interface OtpSuccessCelebrationProps {
  name?: string;
  profileFor?: string;
  mobile?: string;
}

const OtpSuccessCelebrationComponent: React.FC<OtpSuccessCelebrationProps> = ({
  name = "Member",
  profileFor = "Myself",
  mobile = "",
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-100 text-center animate-fade-in max-w-lg mx-auto">
      {/* Animated Success Badge */}
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Mobile Verified Successfully</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] font-heading tracking-tight">
        Welcome to SindhiMatrimony!
      </h2>

      <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
        Hello <strong className="text-stone-900">{name}</strong>, your matrimonial profile for{" "}
        <strong className="text-[#DB2F3C]">{profileFor}</strong> with mobile{" "}
        <strong className="text-stone-900">+91 {mobile}</strong> is successfully verified.
      </p>

      {/* Trust Highlight Box */}
      <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
          <HeartHandshake className="w-4 h-4 text-[#DB2F3C]" />
          <span>Next Step: Complete Partner Preferences</span>
        </div>
        <p className="text-[12px] text-stone-500 leading-normal">
          Set up your preferred sub-caste (Bhaiband, Amil, Lohana, Sahiti, etc.), age range, education, and city to unlock 100% matched profiles.
        </p>
      </div>

      {/* Continue CTA */}
      <div className="mt-6">
        <Link
          href={`/registration/basic-info?mobile=${encodeURIComponent(mobile)}&name=${encodeURIComponent(name)}&for=${encodeURIComponent(profileFor)}`}
          className="w-full py-3.5 px-6 rounded-full font-bold text-white text-sm sm:text-base bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-98 transition-all shadow-md shadow-red-700/20 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Basic Details (Step 1/4)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export const OtpSuccessCelebration = memo(OtpSuccessCelebrationComponent);
OtpSuccessCelebration.displayName = "OtpSuccessCelebration";
