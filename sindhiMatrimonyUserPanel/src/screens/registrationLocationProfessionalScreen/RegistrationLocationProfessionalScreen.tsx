"use client";

import React, { useState, useCallback, memo, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, CustomDropDown, CustomButton } from "@/components";
import {
  getRegistrationDraft,
  saveRegistrationDraft,
  verifyRegistrationSessionWithBackend,
  getToken,
} from "@/storage";
import apiFetch, { ApiURL, showToast } from "@/redux/apiService";
import { LocationProfessionalHeader } from "./components";
import {
  COUNTRY_OPTIONS,
  INDIAN_STATES,
  CITIES_BY_STATE,
  DEFAULT_CITIES,
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  OCCUPATIONS_NOT_WORKING,
  OCCUPATIONS_BUSINESS,
  OCCUPATIONS_GOVERNMENT,
  OCCUPATIONS_PRIVATE,
  CURRENCY_OPTIONS,
  ANNUAL_INCOME_INR,
  ANNUAL_INCOME_FOREIGN,
} from "./data";
import {
  LocationProfessionalFormData,
  FormErrors,
  EmploymentType,
} from "./types";

const INITIAL_FORM_DATA: LocationProfessionalFormData = {
  residentCountry: "India",
  residingState: "",
  residingCity: "",
  citizenship: "India",
  education: "",
  employmentType: "",
  occupation: "",
  currency: "INR - India",
  annualIncome: "",
};

const RegistrationLocationProfessionalScreenComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<LocationProfessionalFormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sindhi_matrimony_reg_step3");
      if (saved) {
        try {
          return { ...INITIAL_FORM_DATA, ...JSON.parse(saved) };
        } catch {
          // Ignore parse errors
        }
      }
    }
    return INITIAL_FORM_DATA;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to safe centralized registration draft
  useEffect(() => {
    if (typeof window !== "undefined") {
      saveRegistrationDraft({ locationProfessional: formData });
    }
  }, [formData]);

  // Recovery & draft restoration
  useEffect(() => {
    if (typeof window === "undefined") return;

    const draft = getRegistrationDraft();
    const targetMobile = searchParams.get("mobile") || draft?.phone || draft?.mobileNumber;
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

      if (draft?.locationProfessional) {
        setFormData((prev) => ({
          ...prev,
          residentCountry: draft.locationProfessional?.residentCountry || prev.residentCountry,
          residingState: draft.locationProfessional?.residingState || prev.residingState,
          residingCity: draft.locationProfessional?.residingCity || prev.residingCity,
          citizenship: draft.locationProfessional?.citizenship || prev.citizenship,
          education: draft.locationProfessional?.education || prev.education,
          employmentType: (draft.locationProfessional?.employmentType as EmploymentType) || prev.employmentType,
          occupation: draft.locationProfessional?.occupation || prev.occupation,
          annualIncome: draft.locationProfessional?.annualIncome || prev.annualIncome,
        }));
      }
    });
  }, [router, searchParams]);

  // Dynamic Cities based on selected State
  const cityOptions = useMemo(() => {
    if (formData.residingState && CITIES_BY_STATE[formData.residingState]) {
      return CITIES_BY_STATE[formData.residingState];
    }
    return DEFAULT_CITIES;
  }, [formData.residingState]);

  // Dynamic Occupations based on Employment Type
  const occupationOptions = useMemo(() => {
    if (formData.employmentType === "Not working") {
      return OCCUPATIONS_NOT_WORKING;
    }
    if (
      formData.employmentType === "Business" ||
      formData.employmentType === "Self employed"
    ) {
      return OCCUPATIONS_BUSINESS;
    }
    if (
      formData.employmentType === "Government / PSU" ||
      formData.employmentType === "Defence"
    ) {
      return OCCUPATIONS_GOVERNMENT;
    }
    return OCCUPATIONS_PRIVATE;
  }, [formData.employmentType]);

  // Dynamic Income Options based on Currency
  const incomeOptions = useMemo(() => {
    if (formData.currency.startsWith("INR")) {
      return ANNUAL_INCOME_INR;
    }
    return ANNUAL_INCOME_FOREIGN;
  }, [formData.currency]);

  // Handlers
  const handleCountryChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      residentCountry: value,
      residingState: value === "India" ? prev.residingState : "",
      residingCity: value === "India" ? prev.residingCity : "",
    }));
    setErrors((prev) => ({ ...prev, residentCountry: undefined }));
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      residingState: value,
      residingCity: "", // Reset city on state change
    }));
    setErrors((prev) => ({ ...prev, residingState: undefined }));
  }, []);

  const handleCityChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, residingCity: value }));
    setErrors((prev) => ({ ...prev, residingCity: undefined }));
  }, []);

  const handleCitizenshipChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, citizenship: value }));
  }, []);

  const handleEducationChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, education: value }));
    setErrors((prev) => ({ ...prev, education: undefined }));
  }, []);

  const handleEmploymentTypeChange = useCallback((value: string) => {
    setFormData((prev) => {
      const isNotWorking = value === "Not working";
      let updatedOccupation = prev.occupation;
      // If switching to Not working and occupation is not in not working list, reset occupation
      if (isNotWorking && !OCCUPATIONS_NOT_WORKING.includes(updatedOccupation)) {
        updatedOccupation = "";
      }
      return {
        ...prev,
        employmentType: value as EmploymentType,
        occupation: updatedOccupation,
        annualIncome: isNotWorking ? "" : prev.annualIncome,
      };
    });
    setErrors((prev) => ({ ...prev, employmentType: undefined }));
  }, []);

  const handleOccupationChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, occupation: value }));
    setErrors((prev) => ({ ...prev, occupation: undefined }));
  }, []);

  const handleCurrencyChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      currency: value,
      annualIncome: "",
    }));
  }, []);

  const handleIncomeChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, annualIncome: value }));
    setErrors((prev) => ({ ...prev, annualIncome: undefined }));
  }, []);

  // Back button handler
  const handleBack = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/registration/personal-religious-info?${params.toString()}`);
  }, [router, searchParams]);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: FormErrors = {};

      if (!formData.residentCountry.trim()) {
        newErrors.residentCountry = "Please select your resident country";
      }
      if (!formData.education.trim()) {
        newErrors.education = "Please select your education details";
      }
      if (!formData.employmentType.trim()) {
        newErrors.employmentType = "Please select your employment type";
      }
      if (!formData.occupation.trim()) {
        newErrors.occupation = "Please select your occupation";
      }
      if (formData.employmentType !== "Not working" && !formData.annualIncome.trim()) {
        newErrors.annualIncome = "Please select your annual income";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await apiFetch({
          url: ApiURL.registerStep,
          method: "POST",
          data: {
            step: 5,
            country: formData.residentCountry,
            state: formData.residingState,
            city: formData.residingCity || formData.residingState,
            highestEducation: formData.education,
            occupation: formData.occupation,
            profession: formData.occupation,
            annualIncome: formData.annualIncome ? parseInt(formData.annualIncome.replace(/[^\d]/g, ""), 10) || 0 : 0,
            companyName: "",
          },
        });

        setIsSubmitting(false);

        if (res.error) {
          showToast({ type: "error", message: res.message || "Failed to save location details." });
          return;
        }

        saveRegistrationDraft({
          currentStep: "additional-info",
          locationProfessional: { ...formData },
        });

        const nextRoute = res.data?.nextRoute || "/registration/additional-info";
        const params = new URLSearchParams(searchParams.toString());
        params.set("celebrate", "true");
        router.push(`${nextRoute}?${params.toString()}`);
      } catch (err: any) {
        setIsSubmitting(false);
        showToast({ type: "error", message: err?.message || "Network error. Please try again." });
      }
    },
    [formData, router, searchParams]
  );

  const isNotWorking = formData.employmentType === "Not working";
  const isIndia = formData.residentCountry === "India";

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Main Step 3/4 Card Container */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        <div className="w-full max-w-xl mx-auto">
          {/* Section Header: Back button + Title ("Location and Professional Details") + "Step 3/4" */}
          <LocationProfessionalHeader
            onBackClick={handleBack}
            title="Location and Professional Details"
            stepText="Step 3/4"
          />

          {/* Form Card Container */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ================= SECTION 1: Location Details ================= */}
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-3">
                  Location Details
                </h2>

                <div className="space-y-4">
                  {/* Field 1: Select your resident country */}
                  <CustomDropDown
                    label="Resident Country"
                    placeholder="Select your resident country"
                    value={formData.residentCountry}
                    onChange={handleCountryChange}
                    options={COUNTRY_OPTIONS}
                    searchable
                    searchPlaceholder="Search country"
                    error={errors.residentCountry}
                  />

                  {/* Dependent location fields for India */}
                  {isIndia && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Residing State */}
                        <CustomDropDown
                          label="Residing State"
                          placeholder="Select residing state"
                          value={formData.residingState}
                          onChange={handleStateChange}
                          options={INDIAN_STATES}
                          searchable
                          searchPlaceholder="Search state"
                          error={errors.residingState}
                        />

                        {/* Residing City */}
                        <CustomDropDown
                          label="Residing City"
                          placeholder="Select residing city"
                          value={formData.residingCity}
                          onChange={handleCityChange}
                          options={cityOptions}
                          searchable
                          searchPlaceholder="Search city"
                          error={errors.residingCity}
                        />
                      </div>

                      {/* Citizenship */}
                      <CustomDropDown
                        label="Citizenship"
                        placeholder="Select citizenship"
                        value={formData.citizenship}
                        onChange={handleCitizenshipChange}
                        options={COUNTRY_OPTIONS}
                        searchable
                        searchPlaceholder="Search citizenship"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* ================= SECTION 2: Professional Details ================= */}
              <div className="pt-2">
                <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-3">
                  Professional Details
                </h2>

                <div className="space-y-4">
                  {/* Field 2: Select your education details */}
                  <CustomDropDown
                    label="Educational Details"
                    placeholder="Select your education details"
                    value={formData.education}
                    onChange={handleEducationChange}
                    options={EDUCATION_OPTIONS}
                    searchable
                    searchPlaceholder="Search education details"
                    error={errors.education}
                  />

                  {/* Field 3: Select your employment type */}
                  <CustomDropDown
                    label="Employment Type"
                    placeholder="Select your employment type"
                    value={formData.employmentType}
                    onChange={handleEmploymentTypeChange}
                    options={EMPLOYMENT_TYPE_OPTIONS}
                    error={errors.employmentType}
                  />

                  {/* Field 4: Select your occupation */}
                  <CustomDropDown
                    label="Occupation"
                    placeholder="Select your occupation"
                    value={formData.occupation}
                    onChange={handleOccupationChange}
                    options={occupationOptions}
                    searchable={!isNotWorking}
                    searchPlaceholder="Search occupation"
                    error={errors.occupation}
                  />
                </div>
              </div>

              {/* ================= SECTION 3: Annual Income ================= */}
              {/* Only visible when Employment Type is NOT "Not working" */}
              {!isNotWorking && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-3">
                    Annual Income
                  </h2>

                  <div className="space-y-4">
                    {/* Field 5: Annual Income Currency */}
                    <CustomDropDown
                      label="Annual Income Currency"
                      placeholder="Select currency"
                      value={formData.currency}
                      onChange={handleCurrencyChange}
                      options={CURRENCY_OPTIONS}
                      searchable
                      searchPlaceholder="Search currency"
                    />

                    {/* Field 6: Select your annual income */}
                    <CustomDropDown
                      label="Annual Income"
                      placeholder="Select your annual income"
                      value={formData.annualIncome}
                      onChange={handleIncomeChange}
                      options={incomeOptions}
                      error={errors.annualIncome}
                    />
                  </div>
                </div>
              )}

              {/* ================= SECTION 4: Submit Button (Next) ================= */}
              <div className="pt-3">
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

export const RegistrationLocationProfessionalScreen = memo(
  RegistrationLocationProfessionalScreenComponent
);
RegistrationLocationProfessionalScreen.displayName =
  "RegistrationLocationProfessionalScreen";
