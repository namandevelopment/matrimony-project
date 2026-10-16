"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { CustomDropDown, CustomButton } from "@/components";
import { TimeOfBirthModal } from "./TimeOfBirthModal";
import { HoroscopeFormData } from "../types";
import {
  COUNTRY_OPTIONS,
  INDIAN_STATES,
  CITIES_BY_STATE,
  DEFAULT_CITIES,
} from "@/screens/registrationLocationProfessionalScreen/data";

export interface HoroscopeDetailsStepProps {
  initialDob?: string;
  onSubmit: (data: HoroscopeFormData) => void;
  onSkip: () => void;
}

export const HoroscopeDetailsStep: React.FC<HoroscopeDetailsStepProps> = memo(
  ({ initialDob = "11-May-1999", onSubmit, onSkip }) => {
    const [formData, setFormData] = useState<HoroscopeFormData>({
      dateOfBirth: initialDob,
      timeOfBirth: "02:02 AM",
      birthCountry: "India",
      birthState: "",
      birthCity: "",
    });

    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isIndia = formData.birthCountry === "India";

    // Dynamic cities based on state
    const cityOptions = useMemo(() => {
      if (formData.birthState && CITIES_BY_STATE[formData.birthState]) {
        return CITIES_BY_STATE[formData.birthState];
      }
      return DEFAULT_CITIES;
    }, [formData.birthState]);

    const handleCountryChange = useCallback((value: string) => {
      setFormData((prev) => ({
        ...prev,
        birthCountry: value,
        birthState: value === "India" ? prev.birthState : "",
        birthCity: value === "India" ? prev.birthCity : "",
      }));
    }, []);

    const handleStateChange = useCallback((value: string) => {
      setFormData((prev) => ({
        ...prev,
        birthState: value,
        birthCity: "",
      }));
    }, []);

    const handleCityChange = useCallback((value: string) => {
      setFormData((prev) => ({
        ...prev,
        birthCity: value,
      }));
    }, []);

    const handleTimeSelect = useCallback((timeStr: string) => {
      setFormData((prev) => ({
        ...prev,
        timeOfBirth: timeStr,
      }));
    }, []);

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
        {/* Planet Icon Illustration (Matching Screenshot 2 & 4) */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-center p-3 shadow-2xs">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-[#DB2F3C]"
            >
              <circle
                cx="32"
                cy="32"
                r="16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="fill-rose-100/40"
              />
              <path
                d="M10 40C14 46 22 48 32 48C46 48 56 38 56 30C56 24 50 20 42 20C32 20 20 26 12 34"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="26" cy="22" r="1.5" fill="currentColor" />
              <circle cx="48" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Date of birth */}
          <div className="w-full text-left">
            <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
              Date of birth
            </label>
            <div className="w-full h-11 sm:h-12 px-4 rounded-xl border border-stone-300 bg-white flex items-center justify-between text-sm sm:text-base text-[#1A1A1A]">
              <span className="font-medium">{formData.dateOfBirth}</span>
              <ChevronDown className="w-4 h-4 text-stone-600" />
            </div>
          </div>

          {/* Field 2: Time of birth */}
          <div className="w-full text-left">
            <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
              Time of birth
            </label>
            <button
              type="button"
              onClick={() => setIsTimeModalOpen(true)}
              className="w-full h-11 sm:h-12 px-4 rounded-xl border border-stone-300 bg-white flex items-center justify-between text-sm sm:text-base text-left hover:border-stone-400 focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745] cursor-pointer transition-colors"
            >
              <span
                className={
                  formData.timeOfBirth
                    ? "font-medium text-[#1A1A1A]"
                    : "text-stone-500"
                }
              >
                {formData.timeOfBirth || "Select your time of birth"}
              </span>
              <div className="flex items-center gap-1.5 text-stone-500">
                <Clock className="w-4 h-4 text-stone-600" />
                <ChevronDown className="w-4 h-4 text-stone-600" />
              </div>
            </button>
          </div>

          {/* Field 3: Place of birth */}
          <div className="space-y-3 pt-1">
            <CustomDropDown
              label="Place of birth"
              placeholder="Select your country of birth"
              value={formData.birthCountry}
              onChange={handleCountryChange}
              options={COUNTRY_OPTIONS}
              searchable
              searchPlaceholder="Search country of birth"
            />

            {/* If India: State & City dropdowns (Matching Screenshot 4) */}
            {isIndia && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <CustomDropDown
                  placeholder="Select your state of birth"
                  value={formData.birthState}
                  onChange={handleStateChange}
                  options={INDIAN_STATES}
                  searchable
                  searchPlaceholder="Search state of birth"
                />

                <CustomDropDown
                  placeholder="Select your city of birth"
                  value={formData.birthCity}
                  onChange={handleCityChange}
                  options={cityOptions}
                  searchable
                  searchPlaceholder="Search city of birth"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <CustomButton
              type="submit"
              fullWidth
              size="lg"
              shape="rounded-2xl"
              isLoading={isSubmitting}
              loadingText="Saving horoscope..."
            >
              Submit
            </CustomButton>
          </div>
        </form>

        {/* Time of Birth Picker Modal */}
        <TimeOfBirthModal
          isOpen={isTimeModalOpen}
          initialTime={formData.timeOfBirth}
          onClose={() => setIsTimeModalOpen(false)}
          onSelect={handleTimeSelect}
        />
      </div>
    );
  }
);

HoroscopeDetailsStep.displayName = "HoroscopeDetailsStep";
