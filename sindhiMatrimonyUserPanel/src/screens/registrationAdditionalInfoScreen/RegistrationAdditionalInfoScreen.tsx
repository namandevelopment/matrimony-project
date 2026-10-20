"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Header, CustomButton } from "@/components";
import {
  AdditionalDetailsHeader,
  FamilyStatusSelect,
  AboutMyselfTextarea,
  ProfileCreatedCelebrationCard,
  RegistrationCompleteModal,
} from "./components";
import { AdditionalInfoFormData, FamilyStatus, FormErrors } from "./types";
import apiFetch, { ApiURL, setToken, setRefreshToken, showToast } from "@/redux/apiService";
import { Storage } from "@/storage/Storage";

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
      setErrors((prev) => ({ ...prev, general: undefined }));

      // Retrieve all drafted registration data across the wizard
      let draftQuick: any = {};
      let step1: any = {};
      let step2: any = {};
      let step3: any = {};
      let savedOtp = "1234";

      if (typeof window !== "undefined") {
        try {
          draftQuick = JSON.parse(sessionStorage.getItem("sindhi_reg_draft") || "{}");
          step1 = JSON.parse(sessionStorage.getItem("sindhi_reg_step1_draft") || "{}");
          step2 = JSON.parse(sessionStorage.getItem("sindhi_reg_step2_draft") || "{}");
          step3 = JSON.parse(sessionStorage.getItem("sindhi_reg_step3_draft") || "{}");
          savedOtp =
            sessionStorage.getItem("sindhi_reg_otp") ||
            searchParams.get("otp") ||
            draftQuick.otp ||
            "1234";
        } catch {
          // Fallback to empty objects
        }
      }

      const rawPhone =
        draftQuick.phone ||
        draftQuick.mobileNumber ||
        mobile ||
        searchParams.get("mobile") ||
        "9829012345";
      const cleanPhone = String(rawPhone).replace(/\D/g, "");

      const candidateName = (
        draftQuick.name ||
        name ||
        searchParams.get("name") ||
        "Sindhi Member"
      ).trim();
      const rawProfileFor = (
        draftQuick.profileFor ||
        profileFor ||
        searchParams.get("for") ||
        "MYSELF"
      )
        .trim()
        .toUpperCase();
      const validProfileFors = [
        "MYSELF",
        "SON",
        "DAUGHTER",
        "BROTHER",
        "SISTER",
        "FRIEND",
        "RELATIVE",
      ];
      const resolvedProfileFor = validProfileFors.includes(rawProfileFor)
        ? rawProfileFor
        : "MYSELF";

      // Gender resolution: Explicit selection in step1 > URL param > inferred from profileFor > default MALE
      const rawGender = (
        step1.gender ||
        searchParams.get("gender") ||
        (resolvedProfileFor === "DAUGHTER" || resolvedProfileFor === "SISTER"
          ? "FEMALE"
          : "MALE")
      )
        .trim()
        .toUpperCase();
      const resolvedGender = rawGender === "FEMALE" ? "FEMALE" : "MALE";

      // DOB resolution
      let formattedDob: string | undefined = undefined;
      if (step1.year && step1.month && step1.day) {
        const monthMap: Record<string, string> = {
          Jan: "01",
          Feb: "02",
          Mar: "03",
          Apr: "04",
          May: "05",
          Jun: "06",
          Jul: "07",
          Aug: "08",
          Sep: "09",
          Oct: "10",
          Nov: "11",
          Dec: "12",
        };
        const mm = monthMap[step1.month] || "01";
        const dd = String(step1.day).padStart(2, "0");
        formattedDob = `${step1.year}-${mm}-${dd}`;
      } else {
        formattedDob = "1997-06-15";
      }

      // Height resolution
      let heightNum = 170;
      if (step2.height) {
        const extracted = String(step2.height).match(/\d+/g);
        if (extracted && extracted.length > 0) {
          const lastNum = parseInt(extracted[extracted.length - 1], 10);
          if (lastNum > 100) heightNum = lastNum;
        }
      }

      // Marital status resolution
      const rawMarital = (step2.maritalStatus || "").toUpperCase();
      let mappedMaritalStatus = "NEVER_MARRIED";
      if (rawMarital.includes("DIVORCED")) mappedMaritalStatus = "DIVORCED";
      else if (rawMarital.includes("WIDOWED")) mappedMaritalStatus = "WIDOWED";
      else if (rawMarital.includes("AWAITING")) mappedMaritalStatus = "AWAITING_DIVORCE";

      // Income numeric resolution
      let annualIncomeNum = 1200000;
      if (step3.annualIncome) {
        const incomeMatch = String(step3.annualIncome).match(/\d+/);
        if (incomeMatch) {
          const lpa = parseInt(incomeMatch[0], 10);
          annualIncomeNum = lpa > 100 ? lpa : lpa * 100000;
        }
      }

      const registerPayload = {
        phone: cleanPhone,
        otp: savedOtp,
        password: step1.password || "Password123@",
        name: candidateName,
        profileFor: resolvedProfileFor,
        gender: resolvedGender,
        countryCode: draftQuick.countryCode || "+91",
        clientPlatform: "WEB",
        email: step1.email || undefined,
        subcaste: step2.subcaste || "Bhaiband",
        dob: formattedDob,
        maritalStatus: mappedMaritalStatus,
        height: heightNum,
        education: step3.education || education || "Graduate",
        profession: step3.occupation || occupation || "Professional",
        occupation: step3.occupation || occupation || "Professional",
        annualIncome: annualIncomeNum,
        city: step3.residingCity || city || "Jaipur",
        state: step3.residingState || "Rajasthan",
        nativePlace: step3.residingCity || city || "Jaipur",
        aboutMe: formData.aboutMyself.trim(),
        aboutMyself: formData.aboutMyself.trim(),
      };

      try {
        const response = await apiFetch<{
          token: string;
          refreshToken: string;
          user: any;
          profile: any;
        }>({
          url: ApiURL.register,
          method: "POST",
          data: registerPayload,
        });

        setIsSubmitting(false);

        if (response.error || !response.data) {
          const errMsg =
            response.message || "Registration failed. Please check your details.";
          setErrors((prev) => ({ ...prev, general: errMsg }));
          showToast({
            type: "error",
            message: errMsg,
          });
          return;
        }

        const { token, refreshToken, user } = response.data;

        if (token) setToken(token);
        if (refreshToken) setRefreshToken(refreshToken);
        if (user) {
          Storage.setItemSync("user", user);
        }

        if (typeof window !== "undefined") {
          try {
            const userProfile = {
              name: candidateName,
              phone: cleanPhone,
              gender: resolvedGender,
              profileFor: resolvedProfileFor,
              matrimonyId: user?.activeProfileId
                ? "SND" + user.activeProfileId.slice(-6).toUpperCase()
                : "SND108920",
              community: "Sindhimarriage.in",
              membershipStatus: "Free member",
              completenessScore: 85,
              isLoggedIn: true,
            };
            localStorage.setItem("sindhi_matrimony_user", JSON.stringify(userProfile));
            localStorage.setItem("sindhi_matrimony_is_authenticated", "true");

            // Clean up registration drafts
            sessionStorage.removeItem("sindhi_reg_draft");
            sessionStorage.removeItem("sindhi_reg_otp");
            sessionStorage.removeItem("sindhi_reg_step1_draft");
            sessionStorage.removeItem("sindhi_reg_step2_draft");
            sessionStorage.removeItem("sindhi_reg_step3_draft");
            sessionStorage.setItem("sindhi_reg_step4_completed", "true");
          } catch {
            // Ignore storage quota
          }
        }

        showToast({
          type: "success",
          message: "Registration successful! Welcome to Sindhimarriage.in",
        });

        setIsCompleteModalOpen(true);
      } catch (err) {
        setIsSubmitting(false);
        const networkError = "Network error. Please verify your connection and try again.";
        setErrors((prev) => ({ ...prev, general: networkError }));
        showToast({
          type: "error",
          message: networkError,
        });
      }
    },
    [
      validateForm,
      formData,
      mobile,
      name,
      profileFor,
      education,
      employment,
      occupation,
      city,
      searchParams,
    ]
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
                {/* Server Error Alert Banner */}
                {errors.general && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errors.general}</span>
                  </div>
                )}

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
          if (typeof window !== "undefined") {
            try {
              const userProfile = {
                name: name || "Member",
                matrimonyId: "SND" + Math.floor(100000 + Math.random() * 900000),
                community: "SindhiMatrimony",
                membershipStatus: "Free member",
                completenessScore: 80,
                isLoggedIn: true,
              };
              localStorage.setItem("sindhi_matrimony_user", JSON.stringify(userProfile));
              localStorage.setItem("sindhi_matrimony_is_authenticated", "true");
            } catch {
              // Ignore quota
            }
          }
          router.push("/matches");
        }}
        onGoHome={() => {
          setIsCompleteModalOpen(false);
          if (typeof window !== "undefined") {
            try {
              const userProfile = {
                name: name || "Member",
                matrimonyId: "SND" + Math.floor(100000 + Math.random() * 900000),
                community: "SindhiMatrimony",
                membershipStatus: "Free member",
                completenessScore: 80,
                isLoggedIn: true,
              };
              localStorage.setItem("sindhi_matrimony_user", JSON.stringify(userProfile));
              localStorage.setItem("sindhi_matrimony_is_authenticated", "true");
            } catch {
              // Ignore quota
            }
          }
          router.push("/dashboard");
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
