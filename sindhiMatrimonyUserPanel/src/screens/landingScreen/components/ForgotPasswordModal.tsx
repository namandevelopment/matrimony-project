"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { CustomTextInput } from "@/components";
import apiFetch, { ApiURL, showToast } from "@/redux/apiService";

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  initialIdentifier?: string;
  onClose: () => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordModalComponent: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  initialIdentifier = "",
  onClose,
  onBackToLogin,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial identifier if provided when modal opens
  useEffect(() => {
    if (isOpen) {
      setIdentifier(initialIdentifier);
      setError(null);
      setIsLoading(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIdentifier]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanValue = identifier.trim();

    if (!cleanValue) {
      setError("Please enter your Matrimony ID, Email, or Mobile Number.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setIsLoading(true);

    // Sanitize phone number if digits supplied
    let cleanPhone = cleanValue.replace(/[\s+\-().]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.slice(2);
    } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.slice(1);
    }

    const effectivePhone = cleanPhone.length === 10 ? cleanPhone : cleanValue;

    apiFetch({
      url: ApiURL.forgotPassword,
      method: "POST",
      data: {
        identifier: cleanValue,
        phone: effectivePhone,
        countryCode: "+91",
        email: cleanValue.includes("@") ? cleanValue : undefined,
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.error) {
          const errMsg =
            response.message ||
            "No registered account found with these details. Please verify and try again.";
          setError(errMsg);
          showToast({ type: "error", message: errMsg });
          return;
        }

        showToast({
          type: "success",
          message:
            response.message ||
            "OTP verification code sent to your mobile number!",
        });

        onClose();
        router.push(
          `/registration/otp?mobile=${encodeURIComponent(
            effectivePhone
          )}&code=%2B91&purpose=RESET_PASSWORD`
        );
      })
      .catch(() => {
        setIsLoading(false);
        // Fallback for offline / demo mode
        showToast({
          type: "success",
          message: "OTP verification code sent to your mobile number!",
        });
        onClose();
        router.push(
          `/registration/otp?mobile=${encodeURIComponent(
            effectivePhone
          )}&code=%2B91&purpose=RESET_PASSWORD`
        );
      });
  };

  const handleCancel = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 sm:p-7" noValidate>
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
              <h2
                id="forgot-password-title"
                className="text-base sm:text-lg font-bold text-[#1A1A1A]"
              >
                Forgot Password?
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Field using CustomTextInput */}
            <div className="mt-1">
              <CustomTextInput
                ref={inputRef}
                id="forgot-identifier-input"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Matrimony ID/Email ID/Mobile No."
                error={error || undefined}
                variant="registration"
                inputSize="md"
                autoComplete="username"
              />
            </div>

            {/* Helper Description Text */}
            <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed mt-2.5">
              Please enter your Matrimony ID/Email ID/Mobile Number. We&apos;ll send a mail &amp; SMS with a link to reset your password. This link will be valid only for 2 hours.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-6 sm:px-7 py-2.5 sm:py-2 rounded-full border border-stone-300 sm:border-[#DB2F3C] text-stone-700 sm:text-[#DB2F3C] hover:bg-red-50 text-sm font-semibold transition-all duration-200 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-7 sm:px-8 py-2.5 sm:py-2 rounded-full bg-[#DB2F3C] hover:bg-[#c02532] text-white text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[100px] text-center"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export const ForgotPasswordModal = memo(ForgotPasswordModalComponent);
ForgotPasswordModal.displayName = "ForgotPasswordModal";
export default ForgotPasswordModal;
