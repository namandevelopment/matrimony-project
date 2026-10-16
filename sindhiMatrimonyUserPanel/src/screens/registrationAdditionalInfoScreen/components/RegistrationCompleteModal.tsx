"use client";

import React, { memo } from "react";
import { CheckCircle2, Heart, Sparkles, Home } from "lucide-react";
import { CustomButton } from "@/components";

export interface RegistrationCompleteModalProps {
  isOpen: boolean;
  onExploreMatches: () => void;
  onGoHome: () => void;
  userName?: string;
}

export const RegistrationCompleteModal: React.FC<RegistrationCompleteModalProps> = memo(
  ({ isOpen, onExploreMatches, onGoHome, userName }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200" />

        {/* Modal Content */}
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-7 sm:p-9 z-10 text-center animate-in zoom-in-95 duration-200">
          {/* Badge & Icon */}
          <div className="relative inline-flex mb-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#28A745] to-[#34D399] flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 text-amber-400">
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Registration Complete! 🎉
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-normal mt-3 leading-relaxed">
            {userName ? `Welcome, ${userName}! ` : "Welcome! "}
            Your Sindhi Matrimony profile has been successfully registered. You are now ready to connect with verified Sindhi brides & grooms.
          </p>

          {/* Features Highlights */}
          <div className="mt-6 bg-[#FFF6F0] border border-[#FED7AA] rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1A1A1A] font-medium">
              <Heart className="w-4 h-4 text-[#DB2F3C] shrink-0 fill-[#DB2F3C]" />
              <span>100% Verified Sindhi Community Profiles</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1A1A1A] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0" />
              <span>Direct Phone & WhatsApp Contact Options</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <CustomButton
              type="button"
              onClick={onExploreMatches}
              fullWidth
              size="lg"
              shape="rounded-2xl"
              className="flex-1"
            >
              Explore Matches
            </CustomButton>

            <button
              type="button"
              onClick={onGoHome}
              className="px-5 py-3 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

RegistrationCompleteModal.displayName = "RegistrationCompleteModal";
