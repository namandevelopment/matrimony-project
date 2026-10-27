"use client";

import React, { useState, useCallback, memo, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Header, CustomTextInput, CustomButton } from "@/components";
import {
  DobSelectGroup,
  MotherTongueSelect,
  BasicDetailsHeader,
} from "./components";
import { BasicInfoFormData, FormErrors, MonthAbbr } from "./types";
import {
  getRegistrationDraft,
  saveRegistrationDraft,
  verifyRegistrationSessionWithBackend,
  getToken,
  setToken,
  setRefreshToken,
} from "@/storage";
import apiFetch, { ApiURL, showToast } from "@/redux/apiService";

const MONTHS: MonthAbbr[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RegistrationBasicInfoScreenComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters from previous step
  const mobile = searchParams.get("mobile") || "";
  const name = searchParams.get("name") || "";
  const profileFor = searchParams.get("for") || "Myself";
  const defaultGender =
    profileFor.toLowerCase() === "daughter" || profileFor.toLowerCase() === "sister"
      ? "Female"
      : "Male";

  // Form State
  const [formData, setFormData] = useState<BasicInfoFormData>({
    day: "",
    month: "",
    year: "",
    gender: defaultGender,
    motherTongue: "Sindhi", // Default pre-select community language
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery & draft restoration
  useEffect(() => {
    if (typeof window === "undefined") return;

    const draft = getRegistrationDraft();
    const targetMobile = mobile || draft?.phone || draft?.mobileNumber;
    const targetToken = searchParams.get("token") || draft?.token;

    if (!targetMobile) {
      router.replace("/");
      return;
    }

    verifyRegistrationSessionWithBackend(targetMobile, targetToken).then((res) => {
      if (res.isRegistered) {
        router.replace("/dashboard");
        return;
      }
      if (!res.isOtpVerified && (res.status === "OTP_PENDING" || res.status === "EXPIRED")) {
        showToast({
          type: "error",
          message: "Registration session has expired. Please verify your mobile number.",
        });
        router.replace(`/registration/otp?mobile=${targetMobile}`);
        return;
      }

      if (draft?.basicInfo) {
        setFormData((prev) => ({
          ...prev,
          day: draft.basicInfo?.day || prev.day,
          month: draft.basicInfo?.month || prev.month,
          year: draft.basicInfo?.year || prev.year,
          gender: draft.basicInfo?.gender || prev.gender,
          motherTongue: draft.basicInfo?.motherTongue || prev.motherTongue,
          email: draft.basicInfo?.email || prev.email,
        }));
      }
    });
  }, [mobile, router, searchParams]);

  // Field change handlers
  const handleGenderChange = useCallback((gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    setErrors((prev) => ({ ...prev, gender: undefined }));
  }, []);

  // Field change handlers
  const handleDobChange = useCallback((field: "day" | "month" | "year", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, dob: undefined }));
  }, []);

  const handleMotherTongueChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, motherTongue: value }));
    setErrors((prev) => ({ ...prev, motherTongue: undefined }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const { day, month, year } = formData;

  // Dynamic age calculation
  const calculatedAge = useMemo(() => {
    if (!day || !month || !year) return null;
    const monthIdx = MONTHS.indexOf(month as MonthAbbr);
    if (monthIdx === -1) return null;

    const birthDate = new Date(parseInt(year, 10), monthIdx, parseInt(day, 10));
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, [day, month, year]);

  // Form Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // 1. DOB Validation
    if (!formData.day || !formData.month || !formData.year) {
      newErrors.dob = "Please select complete date of birth (Day, Month, Year)";
    } else if (calculatedAge !== null && calculatedAge < 18) {
      newErrors.dob = "You must be at least 18 years old to register.";
    }

    // 2. Mother Tongue Validation
    if (!formData.motherTongue.trim()) {
      newErrors.motherTongue = "Please select your mother tongue";
    }

    // 3. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // 4. Password Validation
    if (!formData.password) {
      newErrors.password = "Please create a password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, calculatedAge]);

  // Handle Form Submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      const regSessionToken =
        searchParams.get("regSessionToken") ||
        (typeof window !== "undefined" ? sessionStorage.getItem("sindhi_reg_session_token") : null) ||
        getRegistrationDraft()?.token;

      // Persist step 3 to backend API & receive permanent Bearer auth token
      apiFetch<{ token?: string; refreshToken?: string; nextRoute?: string; [key: string]: any }>({
        url: ApiURL.registerStep,
        method: "POST",
        data: {
          phone: mobile,
          mobile,
          step: 3,
          regSessionToken: regSessionToken || undefined,
          gender: formData.gender,
          day: formData.day,
          month: formData.month,
          year: formData.year,
          dob: `${formData.year}-${formData.month}-${formData.day}`,
          motherTongue: formData.motherTongue,
          email: formData.email,
          password: formData.password,
          calculatedAge,
          name,
          profileFor,
        },
      })
        .then((res) => {
          setIsSubmitting(false);
          if (res.error) {
            const msg = res.message || "Failed to save basic details. Please check your input.";
            showToast({ type: "error", message: msg });
            return;
          }

          // ⭐ Bearer token is saved here upon password creation
          if (res.data?.token) {
            setToken(res.data.token);
            if (res.data?.refreshToken) {
              setRefreshToken(res.data.refreshToken);
            }
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("sindhi_reg_session_token");
            }
          }

          // Save draft state
          saveRegistrationDraft({
            currentStep: "personal-religious-info",
            token: res.data?.token,
            basicInfo: {
              gender: formData.gender,
              day: formData.day,
              month: formData.month,
              year: formData.year,
              calculatedAge,
              motherTongue: formData.motherTongue,
              email: formData.email,
            },
          });

          const nextRoute = res.data?.nextRoute || "/registration/personal-religious-info";
          const params = new URLSearchParams(window.location.search);
          params.delete("regSessionToken");
          if (formData.gender) {
            params.set("gender", formData.gender);
          }
          router.push(`${nextRoute}?${params.toString()}`);
        })
        .catch(() => {
          setIsSubmitting(false);
          showToast({
            type: "error",
            message: "Unable to save details. Please check your internet connection.",
          });
        });
    },
    [validateForm, formData, calculatedAge, mobile, name, profileFor, router, searchParams]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Main Registration Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        <div className="w-full max-w-xl mx-auto">
          {/* Sub-header navigation row: "<- Basic Details" + "Step 1/4" */}
          <BasicDetailsHeader onBackClick={handleBack} title="Basic Details" stepText="Step 1/4" />

          {/* Form Card */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Field: Gender Selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs sm:text-sm font-semibold text-stone-700">
                  Gender
                </label>
                <div className="flex items-center gap-3">
                  {["Male", "Female"].map((g) => {
                    const isSelected = (formData.gender || defaultGender) === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGenderChange(g)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#DB2F3C] text-white border-[#DB2F3C] shadow-sm"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 1: Date of birth */}
              <DobSelectGroup
                day={formData.day}
                month={formData.month}
                year={formData.year}
                onChange={handleDobChange}
                error={errors.dob}
              />

              {/* Field 2: Select your mother tongue */}
              <div>
                <MotherTongueSelect
                  value={formData.motherTongue}
                  onChange={handleMotherTongueChange}
                  error={errors.motherTongue}
                />
              </div>

              {/* Field 3: Email */}
              <CustomTextInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                label="Email"
                placeholder="Enter your email"
                autoComplete="email"
                variant="registration"
                inputSize="lg"
                error={errors.email}
              />

              {/* Field 4: Create password */}
              <CustomTextInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                label="Create Password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                variant="registration"
                inputSize="lg"
                showPasswordToggle
                error={errors.password}
              />

              {/* Submit Button: "Next" */}
              <div className="pt-2">
                <CustomButton
                  type="submit"
                  fullWidth
                  size="lg"
                  shape="rounded-2xl"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                >
                  Next
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
};

export const RegistrationBasicInfoScreen = memo(RegistrationBasicInfoScreenComponent);
RegistrationBasicInfoScreen.displayName = "RegistrationBasicInfoScreen";
export default RegistrationBasicInfoScreen;
