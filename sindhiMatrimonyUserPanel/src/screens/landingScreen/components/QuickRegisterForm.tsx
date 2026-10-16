"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { QuickRegisterFormData } from "../types";

interface QuickRegisterFormProps {
  variant: "desktop" | "mobile";
  onSuccess?: (data: QuickRegisterFormData) => void;
}

const PROFILE_FOR_OPTIONS = [
  { value: "Myself", label: "Myself" },
  { value: "Daughter", label: "Daughter" },
  { value: "Son", label: "Son" },
  { value: "Sister", label: "Sister" },
  { value: "Brother", label: "Brother" },
  { value: "Relative", label: "Relative" },
  { value: "Friend", label: "Friend" },
];

/**
 * Custom Animated Dropdown for "Matrimony Profile For"
 * Opens smoothly with transition, supports outside click, and renders options in 3 columns.
 */
interface ProfileForDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  variant: "desktop" | "mobile";
}

const ProfileForDropdown = memo<ProfileForDropdownProps>(({
  value,
  onChange,
  error,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (variant === "desktop") {
    return (
      <div
        ref={dropdownRef}
        className="relative flex-1 px-4 py-2.5 flex flex-col justify-center min-w-[220px] text-left rounded-l-lg cursor-pointer select-none transition-colors hover:bg-stone-50/70"
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-semibold text-[#666666] uppercase tracking-wider block">
          Matrimony Profile For
        </span>
        <div className="flex items-center justify-between mt-0.5 pr-1">
          <span
            className={`text-sm font-semibold truncate ${
              value ? "text-[#1A1A1A]" : "text-stone-500"
            }`}
          >
            {value || "Select Profile"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 transition-transform duration-300 ease-out shrink-0 ml-1.5 ${
              isOpen ? "rotate-180 text-[#DB2F3C]" : "rotate-0"
            }`}
          />
        </div>
        {error && (
          <span className="text-[10px] text-red-600 font-medium">{error}</span>
        )}

        {/* Smooth Animated Dropdown Menu (3-Column Layout) */}
        <div
          className={`absolute top-[calc(100%+6px)] left-0 w-[350px] sm:w-[370px] bg-white rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 transition-all duration-200 ease-out origin-top-left ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="listbox"
        >
          <div className="grid grid-cols-3 gap-x-2 gap-y-2.5">
            {PROFILE_FOR_OPTIONS.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`text-left px-2.5 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "text-[#DB2F3C] font-bold bg-rose-50"
                      : "text-[#1A1A1A] hover:text-[#DB2F3C] hover:bg-stone-100/80"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Mobile Dropdown
  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`relative border rounded-lg bg-stone-50/60 px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all select-none ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : isOpen
            ? "border-[#DB2F3C] ring-1 ring-[#DB2F3C]"
            : "border-stone-300 hover:border-stone-400"
        }`}
      >
        <span
          className={`text-sm font-semibold truncate ${
            value ? "text-[#1A1A1A]" : "text-stone-500"
          }`}
        >
          {value || "Select Profile"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-stone-500 transition-transform duration-300 ease-out shrink-0 ml-1.5 ${
            isOpen ? "rotate-180 text-[#DB2F3C]" : "rotate-0"
          }`}
        />
      </div>

      {/* Smooth Animated Dropdown Menu for Mobile */}
      <div
        className={`absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 transition-all duration-200 ease-out origin-top ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="listbox"
      >
        <div className="grid grid-cols-3 gap-x-2 gap-y-2.5">
          {PROFILE_FOR_OPTIONS.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`text-center sm:text-left px-2 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "text-[#DB2F3C] font-bold bg-rose-50"
                    : "text-[#1A1A1A] hover:text-[#DB2F3C] hover:bg-stone-100/80"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
ProfileForDropdown.displayName = "ProfileForDropdown";

const QuickRegisterFormComponent: React.FC<QuickRegisterFormProps> = ({
  variant,
  onSuccess,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<QuickRegisterFormData>({
    profileFor: "",
    name: "",
    countryCode: "+91",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState<{
    profileFor?: string;
    name?: string;
    mobile?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic helper text for name field
  const getNameHelperText = () => {
    switch (formData.profileFor) {
      case "Daughter":
      case "Sister":
        return "Enter the name of bride";
      case "Son":
      case "Brother":
        return "Enter the name of groom";
      default:
        return "Enter your full name";
    }
  };

  const validate = (): boolean => {
    const errs: { profileFor?: string; name?: string; mobile?: string } = {};

    if (!formData.profileFor || formData.profileFor === "Select Profile") {
      errs.profileFor = "Please select profile";
    }

    if (!formData.name.trim()) {
      errs.name = "Please enter name";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    const cleanNumber = formData.mobileNumber.replace(/\D/g, "");
    if (!cleanNumber) {
      errs.mobile = "Please enter mobile number";
    } else if (cleanNumber.length !== 10) {
      errs.mobile = "Please enter valid 10-digit number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const cleanNumber = formData.mobileNumber.replace(/\D/g, "");

    // Persist registration draft in sessionStorage for reliability
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("sindhi_reg_draft", JSON.stringify(formData));
      } catch {
        // Safe fallback
      }
    }

    if (onSuccess) onSuccess(formData);

    const params = new URLSearchParams({
      mobile: cleanNumber,
      code: formData.countryCode || "+91",
      name: formData.name.trim(),
      for: formData.profileFor || "Myself",
    });

    // Seamless navigation to registration OTP verification screen
    setTimeout(() => {
      router.push(`/registration/otp?${params.toString()}`);
    }, 350);
  };

  if (isSuccess) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-emerald-200 text-center animate-fade-in max-w-lg mx-auto">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1A1A]">Welcome, {formData.name}!</h3>
        <p className="text-sm text-[#666666] mt-1.5">
          Your profile for{" "}
          <strong className="text-stone-800">
            {formData.profileFor || "Myself"}
          </strong>{" "}
          has been registered with mobile{" "}
          <strong className="text-stone-800">
            {formData.countryCode} {formData.mobileNumber}
          </strong>
          .
        </p>
        <p className="text-xs text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg mt-3 font-medium">
          OTP sent! Redirecting to complete horoscope & community details...
        </p>
      </div>
    );
  }

  // DESKTOP HORIZONTAL FORM (Matching Photo 5)
  if (variant === "desktop") {
    return (
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-2xl flex flex-row items-stretch border border-stone-200 divide-x divide-stone-200 relative"
          noValidate
        >
          {/* 1. Matrimony Profile For (Custom Smooth Dropdown) */}
          <ProfileForDropdown
            variant="desktop"
            value={formData.profileFor}
            error={errors.profileFor}
            onChange={(val) => {
              setFormData({ ...formData, profileFor: val });
              if (errors.profileFor) {
                setErrors({ ...errors, profileFor: undefined });
              }
            }}
          />

          {/* 2. Name */}
          <div className="flex-1 px-4 py-2.5 flex flex-col justify-center min-w-[190px] text-left">
            <label
              htmlFor="desktop-name"
              className="text-[11px] font-semibold text-[#666666] uppercase tracking-wider"
            >
              Name
            </label>
            <input
              id="desktop-name"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className="w-full bg-transparent text-sm font-medium text-[#1A1A1A] placeholder:text-stone-400 py-1 focus:outline-hidden"
            />
            {errors.name && (
              <span className="text-[10px] text-red-600 font-medium">
                {errors.name}
              </span>
            )}
          </div>

          {/* 3. Mobile Number */}
          <div className="flex-[1.3] px-4 py-2.5 flex flex-col justify-center min-w-[240px] text-left">
            <label
              htmlFor="desktop-mobile"
              className="text-[11px] font-semibold text-[#666666] uppercase tracking-wider"
            >
              Mobile Number
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-1 text-sm font-semibold text-[#1A1A1A] shrink-0 pr-1">
                <span>+91</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <input
                id="desktop-mobile"
                type="tel"
                maxLength={10}
                placeholder="Enter Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, mobileNumber: val });
                  if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                }}
                className="w-full bg-transparent text-sm font-medium text-[#1A1A1A] placeholder:text-stone-400 py-1 focus:outline-hidden"
              />
            </div>
            {errors.mobile && (
              <span className="text-[10px] text-red-600 font-medium">
                {errors.mobile}
              </span>
            )}
          </div>

          {/* 4. Register Free Button */}
          <div className="flex items-stretch shrink-0">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg hover:shadow-red-600/30 min-w-[170px] rounded-r-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                "Register Free"
              )}
            </button>
          </div>
        </form>

        {/* Desktop T&C / Privacy Disclaimer */}
        <p className="mt-3 text-center text-xs text-stone-200/90 drop-shadow-xs">
          By clicking on Register Free, you agree to{" "}
          <Link
            href="/terms-and-conditions"
            className="text-white hover:underline underline-offset-2"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-white hover:underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    );
  }

  // MOBILE VERTICAL CARD FORM (Matching Photos 3 & 4)
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-stone-200/90 p-5 sm:p-6 text-left">
      <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight text-center mb-5">
        Register for free to find your perfect partner
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Field 1: Matrimony Profile For (Custom Smooth Dropdown) */}
        <div>
          <ProfileForDropdown
            variant="mobile"
            value={formData.profileFor}
            error={errors.profileFor}
            onChange={(val) => {
              setFormData({ ...formData, profileFor: val });
              if (errors.profileFor) {
                setErrors({ ...errors, profileFor: undefined });
              }
            }}
          />
          <p className="text-[11.5px] text-[#666666] mt-1 pl-1">
            Select whom are you creating this profile for
          </p>
          {errors.profileFor && (
            <p className="text-xs text-red-600 mt-1 pl-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.profileFor}</span>
            </p>
          )}
        </div>

        {/* Field 2: Name */}
        <div>
          <div
            className={`border rounded-lg bg-white transition-all ${
              errors.name
                ? "border-red-500 ring-1 ring-red-500"
                : "border-stone-300 focus-within:border-[#DB2F3C] focus-within:ring-1 focus-within:ring-[#DB2F3C]"
            }`}
          >
            <input
              id="mobile-name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className="w-full px-4 py-3.5 text-sm font-medium text-[#1A1A1A] placeholder:text-stone-400 focus:outline-hidden"
            />
          </div>
          <p className="text-[11.5px] text-[#666666] mt-1 pl-1">
            {getNameHelperText()}
          </p>
          {errors.name && (
            <p className="text-xs text-red-600 mt-1 pl-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Field 3: Mobile Number */}
        <div>
          <div
            className={`flex items-center border rounded-lg bg-white overflow-hidden transition-all ${
              errors.mobile
                ? "border-red-500 ring-1 ring-red-500"
                : "border-stone-300 focus-within:border-[#DB2F3C] focus-within:ring-1 focus-within:ring-[#DB2F3C]"
            }`}
          >
            <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-stone-50 border-r border-stone-200 text-sm font-semibold text-[#1A1A1A] shrink-0">
              <span>+91</span>
              <ChevronDown className="w-4 h-4 text-stone-500" />
            </div>
            <input
              id="mobile-number"
              type="tel"
              maxLength={10}
              placeholder="Enter Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, mobileNumber: val });
                if (errors.mobile) setErrors({ ...errors, mobile: undefined });
              }}
              className="w-full px-4 py-3.5 text-sm font-medium text-[#1A1A1A] placeholder:text-stone-400 focus:outline-hidden"
            />
          </div>
          <p className="text-[11.5px] text-[#666666] mt-1 pl-1">
            Interested matches will contact you in this number
          </p>
          {errors.mobile && (
            <p className="text-xs text-red-600 mt-1 pl-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.mobile}</span>
            </p>
          )}
        </div>

        {/* Mobile Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full font-bold text-white text-base bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] shadow-md shadow-red-700/25 hover:shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              "Register Free"
            )}
          </button>
        </div>

        {/* Mobile Disclaimer */}
        <p className="text-center text-[11px] sm:text-xs text-[#666666] leading-relaxed pt-1">
          By clicking on Register Free, you agree to{" "}
          <Link
            href="/terms-and-conditions"
            className="text-[#DB2F3C] hover:underline font-medium"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-[#DB2F3C] hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
};

export const QuickRegisterForm = memo(QuickRegisterFormComponent);
QuickRegisterForm.displayName = "QuickRegisterForm";
export default QuickRegisterForm;
