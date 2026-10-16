"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, CustomButton } from "@/components";
import {
  AdditionalDetailsHeader,
  FamilyStatusSelect,
  AboutMyselfTextarea,
  ProfileCreatedCelebrationCard,
  RegistrationCompleteModal,
} from "./components";
import { AdditionalInfoFormData, FamilyStatus, FormErrors } from "./types";

const INITIAL_FORM_DATA: AdditionalInfoFormData = {
  familyStatus: "Upper middle class",
  aboutMyself: "",
};

const RegistrationAdditionalInfoScreenComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters from previous steps
  const mobile = searchParams.get("mobile") || "";
  const name = searchParams.get("name") || "";
  const profileFor = searchParams.get("for") || "Myself";
  const education = searchParams.get("education") || "";
  const employment = searchParams.get("employment") || "";
  const occupation = searchParams.get("occupation") || "";
  const city = searchParams.get("city") || "";

  // Check if we should show the transitional "Congratulations! Your profile has been created!" card first
  const [showCelebration, setShowCelebration] = useState(() => {
    return searchParams.get("celebrate") === "true";
  });

  // Form State
  const [formData, setFormData] = useState<AdditionalInfoFormData>(() => {
    // Generate intelligent default bio based on previous registration selections
    let defaultBio = "";
    if (education || occupation || city) {
      const eduPart = education ? `completed my ${education}` : "completed my higher education";
      const workPart = employment === "Not working"
        ? "currently not working"
        : occupation
        ? `working as ${occupation}`
        : "currently working";
      const locPart = city ? `live in ${city}` : "live with my family";

      defaultBio = `I have ${eduPart}. I am ${workPart} and I ${locPart}. Looking for an understanding and cultured life partner from the Sindhi community.`;
    } else {
      defaultBio = "I have completed my Bachelor's degree. I am currently working and I live with my family. Looking for a compatible and cultured partner from the Sindhi community.";
    }

    return {
      familyStatus: "Upper middle class",
      aboutMyself: defaultBio,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Field change handlers
  const handleFamilyStatusChange = useCallback((familyStatus: FamilyStatus) => {
    setFormData((prev) => ({ ...prev, familyStatus }));
    setErrors((prev) => ({ ...prev, familyStatus: undefined }));
  }, []);

  const handleAboutMyselfChange = useCallback((aboutMyself: string) => {
    setFormData((prev) => ({ ...prev, aboutMyself }));
    if (aboutMyself.trim().length >= 50) {
      setErrors((prev) => ({ ...prev, aboutMyself: undefined }));
    }
  }, []);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.familyStatus) {
      newErrors.familyStatus = "Please select your family status";
    }

    const trimmedBio = formData.aboutMyself.trim();
    if (!trimmedBio) {
      newErrors.aboutMyself = "Please write a few words about yourself";
    } else if (trimmedBio.length < 50) {
      newErrors.aboutMyself = `Please write at least 50 characters (currently ${trimmedBio.length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle Form Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      // Save complete registration state to storage
      if (typeof window !== "undefined") {
        try {
          const finalProfile = {
            ...formData,
            mobile,
            name,
            profileFor,
            education,
            employment,
            occupation,
            city,
            registeredAt: new Date().toISOString(),
          };
          localStorage.setItem("sindhi_matrimony_user_profile", JSON.stringify(finalProfile));
          sessionStorage.setItem("sindhi_reg_step4_completed", "true");
        } catch {
          // Ignore storage quota
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsSubmitting(false);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("celebrate");
      router.push(`/onboarding?${params.toString()}`);
    },
    [validateForm, formData, mobile, name, profileFor, education, employment, occupation, city, router, searchParams]
  );

  const handleBack = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("celebrate");
    router.push(`/registration/location-professional-info?${params.toString()}`);
  }, [router, searchParams]);

  const handleDismissCelebration = useCallback(() => {
    setShowCelebration(false);
    // Remove celebrate flag from URL without reloading
    const params = new URLSearchParams(searchParams.toString());
    params.delete("celebrate");
    router.replace(`/registration/additional-info?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        {showCelebration ? (
          /* ================= Transitional Celebration View (Images 2 & 3) ================= */
          <ProfileCreatedCelebrationCard onContinue={handleDismissCelebration} />
        ) : (
          /* ================= Step 4/4 Form View (Image 4) ================= */
          <div className="w-full max-w-xl mx-auto animate-in fade-in duration-200">
            {/* Sub-header navigation row: "<- Additional Details" + "Step 4/4" */}
            <AdditionalDetailsHeader
              onBackClick={handleBack}
              title="Additional Details"
              stepText="Step 4/4"
            />

            {/* Form Card Container */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field 1: Select family status (Pill buttons matching Image 4) */}
                <FamilyStatusSelect
                  value={formData.familyStatus}
                  onChange={handleFamilyStatusChange}
                  error={errors.familyStatus}
                />

                {/* Field 2: A few words about myself (Textarea with 50 min chars) */}
                <AboutMyselfTextarea
                  value={formData.aboutMyself}
                  onChange={handleAboutMyselfChange}
                  error={errors.aboutMyself}
                  minCharacters={50}
                />

                {/* Submit Button: "Submit" */}
                <div className="pt-2">
                  <CustomButton
                    type="submit"
                    fullWidth
                    size="lg"
                    shape="rounded-2xl"
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                  >
                    Submit
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Registration 100% Complete Success Modal */}
      <RegistrationCompleteModal
        isOpen={isCompleteModalOpen}
        userName={name}
        onExploreMatches={() => {
          setIsCompleteModalOpen(false);
          router.push("/");
        }}
        onGoHome={() => {
          setIsCompleteModalOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
};

export const RegistrationAdditionalInfoScreen = memo(
  RegistrationAdditionalInfoScreenComponent
);
RegistrationAdditionalInfoScreen.displayName =
  "RegistrationAdditionalInfoScreen";
export default RegistrationAdditionalInfoScreen;
