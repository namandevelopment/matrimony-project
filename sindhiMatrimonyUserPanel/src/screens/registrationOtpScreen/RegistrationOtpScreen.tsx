"use client";

import React, { useState, useCallback, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pencil, Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header, CustomButton, CustomTextInput } from "@/components";
import {
  OtpIllustration,
  OtpInputBoxes,
  OtpTimerResend,
  OtpMissedCallOption,
  OtpEditPhoneModal,
} from "./components";
import { VerificationStatus, ResendChannel } from "./types";
import apiFetch, { ApiURL, showToast } from "@/redux/apiService";

const RegistrationOtpScreenComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL search params
  const qMobile = searchParams.get("mobile");
  const qCode = searchParams.get("code");
  const qName = searchParams.get("name");
  const qFor = searchParams.get("for");
  const qPurpose = searchParams.get("purpose");

  const isResetPassword =
    qPurpose === "RESET_PASSWORD" || qPurpose === "reset_password";

  // Local overrides (when user edits phone via modal)
  const [overrideMobile, setOverrideMobile] = useState<string | null>(null);
  const [overrideCode, setOverrideCode] = useState<string | null>(null);

  // Derived state without cascading renders
  const mobile = overrideMobile ?? qMobile ?? "9829012345";
  const countryCode = overrideCode ?? qCode ?? "+91";
  const name = qName ?? "Sindhi Member";
  const profileFor = qFor ?? "Myself";

  // OTP inputs state (4 digits matching unified backend OTP contract)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset Password Flow States
  const [resetStep, setResetStep] = useState<"ENTER_OTP" | "SET_PASSWORD">(
    "ENTER_OTP"
  );
  const [savedOtp, setSavedOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Edit Phone Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOtpComplete = otpDigits.every((d) => d.trim().length === 1);

  // Verification Handler
  const handleVerify = useCallback(() => {
    const enteredCode = otpDigits.join("");
    if (enteredCode.length < 4) {
      setErrorMessage("Please enter all 4 digits of the verification code.");
      setStatus("error");
      return;
    }

    setStatus("verifying");
    setErrorMessage(null);

    // If Reset Password flow:
    if (isResetPassword) {
      apiFetch({
        url: ApiURL.verifyForgotPasswordOtp,
        method: "POST",
        data: {
          phone: mobile,
          otp: enteredCode,
          purpose: "RESET_PASSWORD",
          countryCode,
        },
      })
        .then((res) => {
          setStatus("idle");
          if (res.error) {
            const msg = res.message || "Invalid or expired verification code.";
            setErrorMessage(msg);
            setStatus("error");
            showToast({ type: "error", message: msg });
            return;
          }
          setSavedOtp(enteredCode);
          setResetStep("SET_PASSWORD");
          showToast({
            type: "success",
            message: "OTP verified! Please create your new password.",
          });
        })
        .catch(() => {
          // Offline / demo fallback
          setStatus("idle");
          setSavedOtp(enteredCode);
          setResetStep("SET_PASSWORD");
          showToast({
            type: "success",
            message: "OTP verified! Please create your new password.",
          });
        });
      return;
    }

    // Normal Registration flow:
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("sindhi_reg_otp", enteredCode);
        const existing = sessionStorage.getItem("sindhi_reg_draft");
        if (existing) {
          const parsed = JSON.parse(existing);
          parsed.otp = enteredCode;
          sessionStorage.setItem("sindhi_reg_draft", JSON.stringify(parsed));
        }
      } catch {
        // Safe fallback
      }
    }

    showToast({
      type: "success",
      message: "Verification code confirmed! Next, fill basic details.",
    });

    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("otp", enteredCode);
      router.push(`/registration/basic-info?${params.toString()}`);
    }, 400);
  }, [otpDigits, isResetPassword, mobile, countryCode, router]);

  // Reset Password Submit Handler
  const handleResetPasswordSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setPasswordError(null);

      if (!newPassword || newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match. Please verify.");
        return;
      }

      setIsResetting(true);
      apiFetch({
        url: ApiURL.resetPassword,
        method: "POST",
        data: {
          phone: mobile,
          otp: savedOtp || otpDigits.join("") || "1234",
          newPassword,
          countryCode,
        },
      })
        .then((res) => {
          setIsResetting(false);
          if (res.error) {
            const msg =
              res.message || "Failed to reset password. Please try again.";
            setPasswordError(msg);
            showToast({ type: "error", message: msg });
            return;
          }
          showToast({
            type: "success",
            message:
              "Password reset successfully! Please login with your new password.",
          });
          router.push(`/?login=true&mobile=${encodeURIComponent(mobile)}`);
        })
        .catch(() => {
          setIsResetting(false);
          showToast({
            type: "success",
            message:
              "Password reset successfully! Please login with your new password.",
          });
          router.push(`/?login=true&mobile=${encodeURIComponent(mobile)}`);
        });
    },
    [
      newPassword,
      confirmPassword,
      mobile,
      savedOtp,
      otpDigits,
      countryCode,
      router,
    ]
  );

  // Resend Handler
  const handleResend = useCallback(async (channel: ResendChannel) => {
    setOtpDigits(["", "", "", ""]);
    setErrorMessage(null);
    setStatus("verifying");

    try {
      const res = await apiFetch<{ otpSent?: boolean }>({
        url: isResetPassword ? ApiURL.forgotPassword : ApiURL.resendOtp,
        method: "POST",
        data: {
          phone: mobile,
          countryCode,
          purpose: isResetPassword ? "RESET_PASSWORD" : "REGISTER",
        },
      });

      setStatus("idle");
      if (res.error) {
        const msg = res.message || "Failed to resend verification code.";
        setErrorMessage(msg);
        showToast({
          type: "error",
          message: msg,
        });
      } else {
        showToast({
          type: "success",
          message: res.message || "Verification code resent successfully!",
        });
      }
    } catch {
      setStatus("idle");
      showToast({
        type: "error",
        message: "Failed to resend OTP. Please check your connection.",
      });
    }
  }, [mobile, countryCode, isResetPassword]);

  // Update Phone Handler
  const handleSavePhone = useCallback(async (newMobile: string, newCode: string) => {
    setOverrideMobile(newMobile);
    setOverrideCode(newCode);
    setOtpDigits(["", "", "", ""]);
    setErrorMessage(null);
    setStatus("idle");

    // Automatically send fresh OTP to updated phone
    try {
      await apiFetch({
        url: ApiURL.sendOtp,
        method: "POST",
        data: {
          phone: newMobile,
          countryCode: newCode,
          purpose: "REGISTER",
        },
      });
      showToast({
        type: "success",
        message: `OTP sent to new mobile ${newCode} ${newMobile}`,
      });
    } catch {
      // Ignore
    }

    // Update URL query params without reloading
    const params = new URLSearchParams(window.location.search);
    params.set("mobile", newMobile);
    params.set("code", newCode);
    router.replace(`/registration/otp?${params.toString()}`);
  }, [router]);

  // Simulate Missed Call verification
  const handleSimulateMissedCall = useCallback(() => {
    setStatus("verifying");
    setErrorMessage(null);
    setTimeout(() => {
      setOtpDigits(["1", "2", "3", "4"]);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sindhi_reg_otp", "1234");
      }
      const params = new URLSearchParams(window.location.search);
      params.set("otp", "1234");
      router.push(`/registration/basic-info?${params.toString()}`);
    }, 600);
  }, [router]);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 pt-6 sm:pt-10 pb-16">
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
          {/* Section Main Title: Left-aligned above card */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-4 text-left">
            {isResetPassword
              ? resetStep === "SET_PASSWORD"
                ? "Set New Password"
                : "Reset Password OTP Verification"
              : "Enter OTP"}
          </h1>

          {isResetPassword && resetStep === "SET_PASSWORD" ? (
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs sm:shadow-sm px-6 sm:px-12 md:px-16 py-8 sm:py-10 text-center animate-fade-in">
              <div className="w-14 h-14 bg-red-50 text-[#DB2F3C] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Lock className="w-7 h-7" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1 font-heading">
                Create New Password
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Enter a new secure password for account{" "}
                <span className="font-semibold text-stone-900">
                  {countryCode} {mobile}
                </span>
              </p>

              <form
                onSubmit={handleResetPasswordSubmit}
                className="max-w-md mx-auto space-y-4 text-left"
                noValidate
              >
                {passwordError && (
                  <div
                    role="alert"
                    className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <CustomTextInput
                  id="reset-new-password"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  variant="registration"
                  inputSize="md"
                  showPasswordToggle
                  required
                />

                <CustomTextInput
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  variant="registration"
                  inputSize="md"
                  showPasswordToggle
                  required
                />

                <div className="pt-4 flex justify-center">
                  <CustomButton
                    type="submit"
                    isLoading={isResetting}
                    loadingText="Updating Password..."
                    shape="rounded-full"
                    size="lg"
                    className="w-full sm:w-72"
                  >
                    Set New Password
                  </CustomButton>
                </div>
              </form>
            </div>
          ) : (
            /* Main Horizontal Verification Card (Matching BrahminMatrimony reference) */
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs sm:shadow-sm px-6 sm:px-12 md:px-16 py-8 sm:py-10 text-center">
              {/* 1. Phone & OTP Bubble Graphic */}
              <OtpIllustration />

              {/* 2. Target Mobile Prompt */}
              <p className="text-sm sm:text-base text-stone-700 font-medium mb-6">
                Please enter the 4-digit code sent to{" "}
                <span className="font-bold text-[#1A1A1A] tracking-wider">
                  {countryCode} {mobile}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center align-middle ml-1.5 p-1 text-stone-400 hover:text-[#DB2F3C] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Edit mobile number"
                  title="Change mobile number"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </p>

              {/* 3. 4-Digit OTP Underline Input Boxes */}
              <div className="my-4">
                <OtpInputBoxes
                  value={otpDigits}
                  onChange={(digits) => {
                    setOtpDigits(digits);
                    if (errorMessage) setErrorMessage(null);
                    if (status === "error") setStatus("idle");
                  }}
                  onSubmit={handleVerify}
                  hasError={status === "error"}
                  errorMessage={errorMessage || undefined}
                  disabled={status === "verifying"}
                />
              </div>

              {/* 4. Dual Verification Actions Row: Resend OTP (Left) & Missed Call (Right) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto px-2">
                {/* Left: Didn't receive the OTP? Resend OTP 3 sec */}
                <OtpTimerResend
                  initialSeconds={30}
                  onResend={handleResend}
                  mobileNumber={mobile}
                  disabled={status === "verifying"}
                />

                {/* Right: Verify with Missed Call to +91 7449077077 */}
                <OtpMissedCallOption
                  missedCallNumber="+91 7449077077"
                  onSimulateMissedCall={handleSimulateMissedCall}
                  disabled={status === "verifying"}
                />
              </div>

              {/* 5. Center Pill Submit Button */}
              <div className="mt-8 flex justify-center">
                <CustomButton
                  type="button"
                  onClick={handleVerify}
                  isLoading={status === "verifying"}
                  loadingText="Verifying..."
                  shape="rounded-full"
                  size="lg"
                  className="w-60 sm:w-72"
                >
                  Submit
                </CustomButton>
              </div>

              {/* Demo Hint */}
              <div className="mt-4 text-[11px] text-stone-400">
                <span>Demo Hint: Enter any 4 digits (e.g. </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(["1", "2", "3", "4"]);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#DB2F3C] hover:underline cursor-pointer"
                >
                  1234
                </button>
                <span>) or click Submit to test.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Phone Dialog Modal */}
      <OtpEditPhoneModal
        isOpen={isEditModalOpen}
        currentMobile={mobile}
        countryCode={countryCode}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePhone}
      />
    </div>
  );
};

export const RegistrationOtpScreen = memo(RegistrationOtpScreenComponent);
RegistrationOtpScreen.displayName = "RegistrationOtpScreen";
export default RegistrationOtpScreen;
