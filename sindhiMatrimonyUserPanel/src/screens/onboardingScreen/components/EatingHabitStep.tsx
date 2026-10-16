"use client";

import React, { memo, useState } from "react";
import { CustomButton } from "@/components";
import { EatingHabit } from "../types";

export interface EatingHabitStepProps {
  initialHabit?: EatingHabit;
  onSubmit: (habit: EatingHabit) => void;
  onSkip: () => void;
}

const EATING_HABITS: EatingHabit[] = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
];

export const EatingHabitStep: React.FC<EatingHabitStepProps> = memo(
  ({ initialHabit, onSubmit, onSkip }) => {
    const [selectedHabit, setSelectedHabit] = useState<EatingHabit | undefined>(
      initialHabit
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedHabit) return;

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmit(selectedHabit);
      }, 350);
    };

    return (
      <div className="w-full text-left">
        {/* Utensils Icon Illustration (Matching Screenshot) */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-rose-50/60 border-2 border-[#DB2F3C]/50 flex items-center justify-center p-4 shadow-2xs">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-[#DB2F3C]"
            >
              {/* Fork */}
              <path
                d="M18 14V26C18 28.5 20 30.5 22.5 30.5V50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27 14V26C27 28.5 25 30.5 22.5 30.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.5 14V26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Knife */}
              <path
                d="M36 14C36 14 41 18 41 28V50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Spoon */}
              <ellipse
                cx="48"
                cy="21"
                rx="5"
                ry="7"
                stroke="currentColor"
                strokeWidth="2.5"
                className="fill-rose-100/50"
              />
              <path
                d="M48 28V50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title inside card */}
          <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
            Select eating habit
          </h2>

          {/* Pill options matching reference screenshot */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {EATING_HABITS.map((habit) => {
              const isSelected = selectedHabit === habit;
              return (
                <button
                  key={habit}
                  type="button"
                  onClick={() => setSelectedHabit(habit)}
                  className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                      : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {habit}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <CustomButton
              type="submit"
              disabled={!selectedHabit}
              fullWidth
              size="lg"
              shape="rounded-2xl"
              isLoading={isSubmitting}
              loadingText="Saving..."
              className={!selectedHabit ? "opacity-50 cursor-not-allowed bg-stone-300" : ""}
            >
              Submit
            </CustomButton>
          </div>
        </form>
      </div>
    );
  }
);

EatingHabitStep.displayName = "EatingHabitStep";
