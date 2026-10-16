"use client";

import React, { useState, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components";
import {
  OnboardingSubHeader,
  HoroscopeDetailsStep,
  StarDetailsStep,
  EatingHabitStep,
  HobbiesLifestyleStep,
} from "./components";
import { RegistrationCompleteModal } from "@/screens/registrationAdditionalInfoScreen/components/RegistrationCompleteModal";
import {
  OnboardingStep,
  HoroscopeFormData,
  StarFormData,
  EatingHabit,
  LifestyleFormData,
} from "./types";

const OnboardingScreenComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters
  const name = searchParams.get("name") || "";
  const initialDob = searchParams.get("dob") || "11-May-1999";
  const stepParam = (searchParams.get("step") as OnboardingStep) || "horoscope";

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(stepParam);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);

  // Stored state
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeFormData | null>(
    null
  );
  const [starData, setStarData] = useState<StarFormData | null>(null);
  const [lifestyleData, setLifestyleData] = useState<LifestyleFormData | null>(
    null
  );

  const goToStep = useCallback(
    (step: OnboardingStep) => {
      setCurrentStep(step);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step);
      router.replace(`/onboarding?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Horoscope Step Handlers
  const handleHoroscopeSubmit = useCallback(
    (data: HoroscopeFormData) => {
      setHoroscopeData(data);
      goToStep("star");
    },
    [goToStep]
  );

  const handleHoroscopeSkip = useCallback(() => {
    goToStep("star");
  }, [goToStep]);

  // Star Step Handlers
  const handleStarSubmit = useCallback(
    (data: StarFormData) => {
      setStarData(data);
      goToStep("eating-habit");
    },
    [goToStep]
  );

  const handleStarSkip = useCallback(() => {
    goToStep("eating-habit");
  }, [goToStep]);

  // Eating Habit Step Handlers
  const [eatingHabit, setEatingHabit] = useState<EatingHabit | null>(null);

  const handleEatingHabitSubmit = useCallback(
    (habit: EatingHabit) => {
      setEatingHabit(habit);
      goToStep("lifestyle");
    },
    [goToStep]
  );

  const handleEatingHabitSkip = useCallback(() => {
    goToStep("lifestyle");
  }, [goToStep]);

  // Lifestyle Step Handlers
  const handleLifestyleSubmit = useCallback(
    (data: LifestyleFormData) => {
      setLifestyleData(data);
      // Save all completed onboarding data to storage
      if (typeof window !== "undefined") {
        try {
          const onboardingProfile = {
            horoscope: horoscopeData,
            star: starData,
            eatingHabit,
            lifestyle: data,
            completedAt: new Date().toISOString(),
          };
          localStorage.setItem(
            "sindhi_matrimony_onboarding_profile",
            JSON.stringify(onboardingProfile)
          );
        } catch {
          // Ignore storage quota
        }
      }
      setIsFinalModalOpen(true);
    },
    [horoscopeData, starData, eatingHabit]
  );

  const handleLifestyleSkip = useCallback(() => {
    setIsFinalModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Header with Helpline */}
      <Header
        showHelpPhone
        helpPhoneText="Need help? Call"
        helpPhoneNumber="8144-77-88-66"
        subtitle="From Matrimony.com Group"
        position="sticky"
      />

      {/* 2. Main Onboarding Form Container */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        <div className="w-full max-w-xl mx-auto">
          {/* STEP 1: Add Horoscope Details (Screenshots 2 & 4) */}
          {currentStep === "horoscope" && (
            <div className="w-full animate-in fade-in duration-200">
              <OnboardingSubHeader
                title="Add horoscope details"
                onSkip={handleHoroscopeSkip}
                showSkip
              />
              <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
                <HoroscopeDetailsStep
                  initialDob={initialDob}
                  onSubmit={handleHoroscopeSubmit}
                  onSkip={handleHoroscopeSkip}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Add Star Details (Screenshot 5) */}
          {currentStep === "star" && (
            <div className="w-full animate-in fade-in duration-200">
              <OnboardingSubHeader
                title="Add star details"
                onSkip={handleStarSkip}
                showSkip
              />
              <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
                <StarDetailsStep
                  onSubmit={handleStarSubmit}
                  onSkip={handleStarSkip}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Select Eating Habit (Latest Screenshot) */}
          {currentStep === "eating-habit" && (
            <div className="w-full animate-in fade-in duration-200">
              <OnboardingSubHeader
                title="Select eating habit"
                onSkip={handleEatingHabitSkip}
                showSkip
              />
              <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
                <EatingHabitStep
                  initialHabit={eatingHabit || undefined}
                  onSubmit={handleEatingHabitSubmit}
                  onSkip={handleEatingHabitSkip}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Hobbies, Interests, Sports & Food (Screenshot 1) */}
          {currentStep === "lifestyle" && (
            <div className="w-full animate-in fade-in duration-200">
              <OnboardingSubHeader
                title="Hobbies & Lifestyle"
                onSkip={handleLifestyleSkip}
                showSkip
              />
              <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
                <HobbiesLifestyleStep
                  onSubmit={handleLifestyleSubmit}
                  onSkip={handleLifestyleSkip}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Final 100% Complete Success Modal */}
      <RegistrationCompleteModal
        isOpen={isFinalModalOpen}
        userName={name}
        onExploreMatches={() => {
          setIsFinalModalOpen(false);
          router.push("/");
        }}
        onGoHome={() => {
          setIsFinalModalOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
};

export const OnboardingScreen = memo(OnboardingScreenComponent);
OnboardingScreen.displayName = "OnboardingScreen";
export default OnboardingScreen;
