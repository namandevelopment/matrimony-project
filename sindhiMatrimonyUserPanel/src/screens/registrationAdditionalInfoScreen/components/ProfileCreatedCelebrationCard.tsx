"use client";

import React, { memo, useEffect, useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { CustomButton } from "@/components";

export interface ProfileCreatedCelebrationCardProps {
  onContinue: () => void;
  autoAdvanceSeconds?: number;
}

export const ProfileCreatedCelebrationCard: React.FC<ProfileCreatedCelebrationCardProps> = memo(
  ({ onContinue, autoAdvanceSeconds = 2.5 }) => {
    const [secondsLeft, setSecondsLeft] = useState(autoAdvanceSeconds);

    useEffect(() => {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onContinue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [onContinue]);

    return (
      <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm px-6 sm:px-12 py-10 sm:py-16 text-center flex flex-col items-center">
          {/* Animated Celebration Icon with Sparkles (Matches Screenshot 2 & 3) */}
          <div className="relative mb-6">
            {/* Top-Right Sparkle */}
            <div className="absolute -top-1.5 -right-2 text-amber-400 animate-pulse">
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </div>

            {/* Top-Left Tiny Sparkle */}
            <div className="absolute top-1 -left-3 text-amber-400 animate-bounce">
              <Sparkles className="w-4 h-4 fill-amber-200" />
            </div>

            {/* Green Circle with White Checkmark */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#28A745] to-[#34D399] flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50">
              <Check className="w-10 h-10 sm:w-11 sm:h-11 text-white stroke-[3.5]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight max-w-md mx-auto">
            Congratulations! Your profile has been created!
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-600 font-normal mt-3 max-w-md mx-auto leading-relaxed">
            Just a few more details to complete! Add them to make your profile
            better and find your perfect match faster.
          </p>

          {/* Continue Action */}
          <div className="mt-8 w-full max-w-xs">
            <CustomButton
              type="button"
              onClick={onContinue}
              fullWidth
              size="lg"
              shape="rounded-2xl"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Step 4/4
            </CustomButton>
            <p className="text-xs text-stone-400 mt-2">
              Auto-advancing in {Math.ceil(secondsLeft)}s...
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ProfileCreatedCelebrationCard.displayName = "ProfileCreatedCelebrationCard";
