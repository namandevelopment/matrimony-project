"use client";

import React, { useState, useCallback, memo, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { Header, CustomDropDown, CustomButton } from "@/components";
import { selectMasterDropdowns } from "@/redux/useSelector";
import {
  getRegistrationDraft,
  saveRegistrationDraft,
  verifyRegistrationSessionWithBackend,
  getToken,
} from "@/storage";
import apiFetch, { ApiURL, showToast } from "@/redux/apiService";
import {
  PersonalReligiousHeader,
  PhysicalStatusSelect,
  MaritalStatusSelect,
} from "./components";
import {
  PersonalReligiousFormData,
  PhysicalStatus,
  MaritalStatus,
  DoshStatus,
  FormErrors,
} from "./types";

const RegistrationPersonalReligiousScreenComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const masterDropdowns = useSelector(selectMasterDropdowns);
  const activeHeights = useMemo(() => masterDropdowns?.heights || [], [masterDropdowns]);
  const activeCastes = useMemo(() => {
    if (masterDropdowns?.castes?.length) {
      return masterDropdowns.castes.map((c: any) => (typeof c === "string" ? c : (c.label || c.name || c.id)));
    }
    return [];
  }, [masterDropdowns]);
  const activeDefaultSubcastes = useMemo(() => masterDropdowns?.defaultSubcastes || [], [masterDropdowns]);
  const activeGothras = useMemo(() => masterDropdowns?.gothras || [], [masterDropdowns]);

  // Search parameters from previous steps
  const mobile = searchParams.get("mobile") || "";
  const name = searchParams.get("name") || "";
  const profileFor = searchParams.get("for") || "Myself";

  // Form State - Religion is ALWAYS "Hindu" by default
  const [formData, setFormData] = useState<PersonalReligiousFormData>({
    height: "",
    physicalStatus: "Normal",
    maritalStatus: "Never married",
    religion: "Hindu",
    caste: "",
    subcaste: "",
    willingToMarryAnyCaste: false,
    gothra: "Don't wish to specify",
    dosh: undefined,
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

      if (draft?.personalReligious) {
        setFormData((prev) => ({
          ...prev,
          height: draft.personalReligious?.height || prev.height,
          maritalStatus: (draft.personalReligious?.maritalStatus as MaritalStatus) || prev.maritalStatus,
          caste: draft.personalReligious?.caste || prev.caste,
          subcaste: draft.personalReligious?.subcaste || prev.subcaste,
        }));
      }
    });
  }, [mobile, router, searchParams]);

  // Field change handlers
  const handleHeightChange = useCallback((height: string) => {
    setFormData((prev) => ({ ...prev, height }));
    setErrors((prev) => ({ ...prev, height: undefined }));
  }, []);

  const handlePhysicalStatusChange = useCallback((physicalStatus: PhysicalStatus) => {
    setFormData((prev) => ({ ...prev, physicalStatus }));
    setErrors((prev) => ({ ...prev, physicalStatus: undefined }));
  }, []);

  const handleMaritalStatusChange = useCallback((maritalStatus: MaritalStatus) => {
    setFormData((prev) => ({ ...prev, maritalStatus }));
    setErrors((prev) => ({ ...prev, maritalStatus: undefined }));
  }, []);

  const handleCasteChange = useCallback((caste: string) => {
    setFormData((prev) => ({
      ...prev,
      caste,
      // Reset subcaste on caste change
      subcaste: "",
    }));
    setErrors((prev) => ({ ...prev, caste: undefined }));
  }, []);

  const handleSubcasteChange = useCallback((subcaste: string) => {
    setFormData((prev) => ({ ...prev, subcaste }));
    setErrors((prev) => ({ ...prev, subcaste: undefined }));
  }, []);

  const handleGothraChange = useCallback((gothra: string) => {
    setFormData((prev) => ({ ...prev, gothra }));
  }, []);

  // Dynamic Subcaste list based on selected caste from backend Redux store
  const subcasteOptions = useMemo(() => {
    if (!formData.caste) return activeDefaultSubcastes;
    const map = masterDropdowns?.subcasteMap || {};
    return map[formData.caste] || activeDefaultSubcastes;
  }, [formData.caste, masterDropdowns, activeDefaultSubcastes]);

  // Form Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.height) {
      newErrors.height = "Please select your height";
    }

    if (!formData.caste) {
      newErrors.caste = "Please select your caste";
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

      const heightMatch = formData.height?.match(/\((\d+)\s*cm\)/);
      const heightInCm = heightMatch ? parseInt(heightMatch[1], 10) : parseInt(formData.height, 10) || 165;

      try {
        const res = await apiFetch({
          url: ApiURL.registerStep,
          method: "POST",
          data: {
            step: 4,
            height: heightInCm,
            maritalStatus: formData.maritalStatus,
            caste: formData.caste,
            subcaste: formData.subcaste,
            gotra: formData.gothra,
            manglik: formData.dosh === "Yes" ? "MANGLIK" : formData.dosh === "No" ? "NON_MANGLIK" : "DONT_KNOW",
          },
        });

        setIsSubmitting(false);

        if (res.error) {
          showToast({ type: "error", message: res.message || "Failed to save personal details." });
          return;
        }

        saveRegistrationDraft({
          currentStep: "location-professional-info",
          personalReligious: {
            height: formData.height,
            maritalStatus: formData.maritalStatus,
            caste: formData.caste,
            subcaste: formData.subcaste,
          },
        });

        const nextRoute = res.data?.nextRoute || "/registration/location-professional-info";
        const params = new URLSearchParams(window.location.search);
        router.push(`${nextRoute}?${params.toString()}`);
      } catch (err: any) {
        setIsSubmitting(false);
        showToast({ type: "error", message: err?.message || "Network error. Please try again." });
      }
    },
    [validateForm, formData, router]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Main Registration Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        <div className="w-full max-w-xl mx-auto">
          {/* Sub-header navigation row: "<- Personal and Religious Details" + "Step 2/4" */}
          <PersonalReligiousHeader
            onBackClick={handleBack}
            title="Personal and Religious Details"
            stepText="Step 2/4"
          />

          {/* Form Card (Matches Reference Screenshots) */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs px-6 sm:px-10 py-7 sm:py-9">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Personal Details */}
              <div className="space-y-5">
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight text-left">
                  Personal Details
                </h2>

                {/* Field 1: Height via CustomDropDown */}
                <CustomDropDown
                  label="Height"
                  placeholder="Select your height"
                  value={formData.height}
                  onChange={handleHeightChange}
                  options={activeHeights}
                  error={errors.height}
                />

                {/* Field 2: Your physical status */}
                <PhysicalStatusSelect
                  value={formData.physicalStatus}
                  onChange={handlePhysicalStatusChange}
                  error={errors.physicalStatus}
                />

                {/* Field 3: Your marital status */}
                <MaritalStatusSelect
                  value={formData.maritalStatus}
                  onChange={handleMaritalStatusChange}
                  error={errors.maritalStatus}
                />
              </div>

              {/* Section 2: Religion */}
              <div className="space-y-4 pt-1">
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight text-left">
                  Religion
                </h2>

                {/* Field 4: Religion (Always Hindu by default) */}
                <CustomDropDown
                  label="Religion"
                  value="Hindu"
                  readOnly
                  options={["Hindu"]}
                  triggerClassName="bg-stone-50/70 cursor-default"
                />

                {/* Field 5: Select caste via CustomDropDown */}
                <CustomDropDown
                  label="Caste"
                  placeholder="Select your caste"
                  value={formData.caste}
                  onChange={handleCasteChange}
                  options={activeCastes}
                  searchable
                  searchPlaceholder="Search caste"
                  error={errors.caste}
                />

                {/* Additional fields that appear when caste is selected */}
                {Boolean(formData.caste) && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    {/* Field 6: Select subcaste */}
                    <CustomDropDown
                      label="Subcaste"
                      placeholder="Select your subcaste"
                      value={formData.subcaste}
                      onChange={handleSubcasteChange}
                      options={subcasteOptions}
                      searchable
                      searchPlaceholder="Search subcaste"
                      error={errors.subcaste}
                    />

                    {/* Field 7: Willing to marry from any caste checkbox */}
                    <div className="flex items-center gap-2.5 pt-0.5 text-left">
                      <input
                        type="checkbox"
                        id="willingToMarryAnyCaste"
                        checked={formData.willingToMarryAnyCaste || false}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            willingToMarryAnyCaste: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-stone-300 text-[#DB2F3C] focus:ring-[#DB2F3C] cursor-pointer"
                      />
                      <label
                        htmlFor="willingToMarryAnyCaste"
                        className="text-xs sm:text-sm text-stone-800 font-normal cursor-pointer select-none"
                      >
                        Willing to marry from any caste
                      </label>
                    </div>

                    {/* Field 8: Select gothra(m) */}
                    <CustomDropDown
                      label="Gothra(m)"
                      placeholder="Select your gothra(m)"
                      value={formData.gothra}
                      onChange={handleGothraChange}
                      options={activeGothras}
                      searchable
                      searchPlaceholder="Search gothra"
                    />

                    {/* Field 9: Do you have any dosh? (Optional) */}
                    <div className="text-left pt-1">
                      <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
                        Do you have any dosh?{" "}
                        <span className="text-xs text-stone-500 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {(["No", "Yes", "Don't know"] as DoshStatus[]).map((doshOption) => {
                          const isSelected = formData.dosh === doshOption;
                          return (
                            <button
                              key={doshOption}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, dosh: doshOption }))
                              }
                              className={`py-2 px-6 rounded-full text-sm sm:text-base transition-all cursor-pointer font-medium ${
                                isSelected
                                  ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] shadow-xs"
                                  : "bg-white border border-stone-400 text-stone-800 hover:border-stone-600 hover:bg-stone-50"
                              }`}
                            >
                              {doshOption}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button: "Next" */}
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

export const RegistrationPersonalReligiousScreen = memo(
  RegistrationPersonalReligiousScreenComponent
);
RegistrationPersonalReligiousScreen.displayName =
  "RegistrationPersonalReligiousScreen";
export default RegistrationPersonalReligiousScreen;
