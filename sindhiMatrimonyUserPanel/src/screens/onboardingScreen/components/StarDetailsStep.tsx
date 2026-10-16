"use client";

import React, { memo, useState } from "react";
import { CustomDropDown, CustomButton } from "@/components";
import { StarFormData } from "../types";
import { NAKSHATRA_OPTIONS, RAASI_OPTIONS } from "../data";

export interface StarDetailsStepProps {
  onSubmit: (data: StarFormData) => void;
  onSkip: () => void;
}

export const StarDetailsStep: React.FC<StarDetailsStepProps> = memo(
  ({ onSubmit, onSkip }) => {
    const [formData, setFormData] = useState<StarFormData>({
      nakshatra: "",
      raasi: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmit(formData);
      }, 350);
    };

    return (
      <div className="w-full">
        {/* Star / Mandala Icon Illustration (Matching Screenshot 5) */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-center p-3 shadow-2xs">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-[#DB2F3C]"
            >
              {/* Outer decorative petal ring */}
              <circle
                cx="32"
                cy="32"
                r="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="fill-rose-100/50"
              />
              <path
                d="M32 10V18M32 46V54M10 32H18M46 32H54M16.5 16.5L22 22M42 42L47.5 47.5M16.5 47.5L22 42M42 22L47.5 16.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="6" fill="currentColor" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Star / Nakshatra(m) */}
          <CustomDropDown
            label="Star / Nakshatra(m)"
            placeholder="Select your Star / Nakshatra(m)"
            value={formData.nakshatra}
            onChange={(val) => setFormData((prev) => ({ ...prev, nakshatra: val }))}
            options={NAKSHATRA_OPTIONS}
            searchable
            searchPlaceholder="Search Star / Nakshatra"
          />

          {/* Field 2: Raasi */}
          <CustomDropDown
            label="Raasi"
            placeholder="Select your Raasi"
            value={formData.raasi}
            onChange={(val) => setFormData((prev) => ({ ...prev, raasi: val }))}
            options={RAASI_OPTIONS}
            searchable
            searchPlaceholder="Search Raasi"
          />

          {/* Submit Button */}
          <div className="pt-4">
            <CustomButton
              type="submit"
              fullWidth
              size="lg"
              shape="rounded-2xl"
              isLoading={isSubmitting}
              loadingText="Saving star details..."
            >
              Submit
            </CustomButton>
          </div>
        </form>
      </div>
    );
  }
);

StarDetailsStep.displayName = "StarDetailsStep";
