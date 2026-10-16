"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Header, CustomTextInput, CustomButton } from "@/components";
import {
  DobSelectGroup,
  MotherTongueSelect,
  BasicDetailsHeader,
} from "./components";
import { BasicInfoFormData, FormErrors, MonthAbbr } from "./types";

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

  // Form State
  const [formData, setFormData] = useState<BasicInfoFormData>({
    day: "",
    month: "",
    year: "",
    motherTongue: "Sindhi", // Default pre-select community language
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Save draft state
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "sindhi_reg_step1_draft",
            JSON.stringify({ ...formData, calculatedAge, mobile, name, profileFor })
          );
        } catch {
          // Ignore storage issues
        }
      }

      // Save and navigate directly to Step 2/4 without modal
      setTimeout(() => {
        setIsSubmitting(false);
        const params = new URLSearchParams(window.location.search);
        router.push(`/registration/personal-religious-info?${params.toString()}`);
      }, 400);
    },
    [validateForm, formData, calculatedAge, mobile, name, profileFor, router]
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
