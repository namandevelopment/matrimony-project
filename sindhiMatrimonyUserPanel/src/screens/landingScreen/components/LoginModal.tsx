"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { MatrimonyHeartLogo } from "./Icons";
import { CustomTextInput, CustomButton } from "@/components";
import apiFetch, { apiPost, ApiURL, setToken, setRefreshToken, showToast } from "@/redux/apiService";
import { Storage } from "@/storage/Storage";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface LoginModalProps {
  isOpen: boolean;
  initialIdentifier?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormState {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

interface FormTouched {
  identifier?: boolean;
  password?: boolean;
}

// ----------------------------------------------------
// Validation Logic
// ----------------------------------------------------
const validateIdentifier = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter your Mobile Number";
  }

  // Case 1: Email Address (contains '@')
  if (trimmed.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    return undefined;
  }

  // Case 2: Phone number check
  // Matches pure digits or phone formats like +91 9876543210 / 98765-43210
  const digitsOnly = trimmed.replace(/\D/g, "");
  const hasOnlyDigitsOrPhoneSymbols = /^[\d\s+\-()]+$/.test(trimmed);

  if (hasOnlyDigitsOrPhoneSymbols && digitsOnly.length > 0) {
    // If user prefixed country code +91
    const cleanDigits =
      digitsOnly.startsWith("91") && digitsOnly.length === 12
        ? digitsOnly.slice(2)
        : digitsOnly;

    if (cleanDigits.length < 10) {
      return "Please enter a valid 10-digit mobile number";
    }
    if (cleanDigits.length === 10) {
      if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
        return "Mobile number must start with 6, 7, 8, or 9";
      }
      return undefined;
    }
    if (cleanDigits.length > 10) {
      return "Mobile number cannot exceed 10 digits";
    }
    return undefined;
  }

  // Case 3: Matrimony ID (e.g., SND4517087, BRH123456)
  if (trimmed.length < 4) {
    return "Matrimony ID must be at least 4 characters";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return "Matrimony ID can only contain letters, numbers, and dashes";
  }

  return undefined;
};

const validatePassword = (value: string): string | undefined => {
  if (!value) {
    return "Please enter your password";
  }
  if (value.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (value.length > 50) {
    return "Password cannot exceed 50 characters";
  }
  return undefined;
};

const LoginModalComponent: React.FC<LoginModalProps> = ({
  isOpen,
  initialIdentifier = "",
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const identifierInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    identifier: initialIdentifier,
    password: "",
    rememberMe: true,
  });

  useEffect(() => {
    if (isOpen && initialIdentifier) {
      setForm((prev) => ({ ...prev, identifier: initialIdentifier }));
    }
  }, [isOpen, initialIdentifier]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setForm({ identifier: "", password: "", rememberMe: true });
    setErrors({});
    setTouched({});
    setGeneralError(null);
    setIsForgotPasswordOpen(false);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  // Auto focus identifier on modal open
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      identifierInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

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

  // Real-time Field Change Handler
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, identifier: value }));
    setGeneralError(null);

    // Revalidate if field has already been touched or had an error
    if (touched.identifier || errors.identifier) {
      const errorMsg = validateIdentifier(value);
      setErrors((prev) => ({ ...prev, identifier: errorMsg }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, password: value }));
    setGeneralError(null);

    if (touched.password || errors.password) {
      const errorMsg = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: errorMsg }));
    }
  };

  // Blur Handlers (validate on field exit)
  const handleIdentifierBlur = () => {
    setTouched((prev) => ({ ...prev, identifier: true }));
    const errorMsg = validateIdentifier(form.identifier);
    setErrors((prev) => ({ ...prev, identifier: errorMsg }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    const errorMsg = validatePassword(form.password);
    setErrors((prev) => ({ ...prev, password: errorMsg }));
  };

  // Forgot password handler
  const handleForgotPassword = useCallback(() => {
    setIsForgotPasswordOpen(true);
  }, []);

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions / rapid clicking jitter
    if (isLoading) return;

    // Mark all as touched
    setTouched({ identifier: true, password: true });

    const identifierError = validateIdentifier(form.identifier);
    const passwordError = validatePassword(form.password);

    if (identifierError || passwordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError,
      });

      // Focus first error field
      if (identifierError) {
        identifierInputRef.current?.focus();
      }
      return;
    }

    // Clear any field errors but preserve generalError while request is in flight
    // so modal height does not collapse and expand repeatedly (causing vertical jerk)
    setErrors({});
    setIsLoading(true);
    apiFetch<{
      token: string;
      refreshToken: string;
      user: any;
    }>({
      url: ApiURL.login,
      method: "POST",
      data: {
        phone: form.identifier.trim(),
        password: form.password,
        clientPlatform: "WEB",
      },
    })
      .then((response) => {
        setIsLoading(false);

        if (response.error || !response.data) {
          const errMsg = response.message || "Invalid mobile number or password.";
          setGeneralError(errMsg);
          showToast({
            type: "error",
            message: errMsg,
          });
          return;
        }

        const { token, refreshToken, user } = response.data;

        if (token) setToken(token);
        if (refreshToken) setRefreshToken(refreshToken);
        if (user) Storage.setItemSync("user", user);

        showToast({
          type: "success",
          message: response.message || "Logged in successfully!",
        });

        handleClose();

        const nextRoute = (response.data as any)?.nextRoute;
        const isOnboardingComplete = (response.data as any)?.isOnboardingComplete ?? (response.data as any)?.user?.isOnboardingComplete;

        if (isOnboardingComplete === false && nextRoute && nextRoute !== "/dashboard") {
          router.push(nextRoute);
        } else if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const errMsg = err?.message || "Failed to connect to authentication server. Please try again.";
        setGeneralError(errMsg);
        showToast({
          type: "error",
          message: errMsg,
        });
      });
  };

  if (!isOpen) return null;

  if (isForgotPasswordOpen) {
    return (
      <ForgotPasswordModal
        isOpen={isOpen}
        initialIdentifier={form.identifier}
        onClose={handleClose}
        onBackToLogin={() => setIsForgotPasswordOpen(false)}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <MatrimonyHeartLogo size={32} className="w-8 h-8" color="#DB2F3C" />
            <h3 id="login-title" className="text-lg font-bold text-[#1A1A1A] font-heading">
              Member Login
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* General Alert Banner */}
          {generalError && (
            <div
              role="alert"
              className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Identifier Field (Mobile Number / Matrimony ID / Email) */}
          <CustomTextInput
            ref={identifierInputRef}
            id="login-identifier"
            name="identifier"
            type="text"
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            value={form.identifier}
            onChange={handleIdentifierChange}
            onBlur={handleIdentifierBlur}
            error={touched.identifier ? errors.identifier : undefined}
            rightIcon={<Phone className="w-4 h-4 text-stone-400" />}
            variant="registration"
            inputSize="md"
            autoComplete="username"
            required
          />

          {/* Password Field */}
          <CustomTextInput
            id="login-password"
            name="password"
            type="password"
            label="Password"
            labelRight={
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#DB2F3C] hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            }
            placeholder="Enter your password"
            value={form.password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={touched.password ? errors.password : undefined}
            variant="registration"
            inputSize="md"
            autoComplete="current-password"
            showPasswordToggle
            required
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))
                }
                className="w-4 h-4 text-[#DB2F3C] border-stone-300 rounded focus:ring-[#DB2F3C] accent-[#DB2F3C] cursor-pointer"
              />
              <span>Keep me logged in</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <CustomButton
              type="submit"
              fullWidth
              size="md"
              shape="rounded-xl"
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Log In
            </CustomButton>
          </div>

          {/* Register Free Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#666666]">
              Not a member yet?{" "}
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push("/#quick-register");
                }}
                className="font-bold text-[#DB2F3C] hover:underline cursor-pointer"
              >
                Register Free
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LoginModal = memo(LoginModalComponent);
LoginModal.displayName = "LoginModal";
export { ForgotPasswordModal } from "./ForgotPasswordModal";
export default LoginModal;

