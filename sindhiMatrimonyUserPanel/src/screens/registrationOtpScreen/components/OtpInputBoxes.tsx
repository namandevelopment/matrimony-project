"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  memo,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
} from "react";
import { AlertCircle } from "lucide-react";

interface OtpInputBoxesProps {
  value: string[];
  onChange: (digits: string[]) => void;
  onSubmit?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const OtpInputBoxesComponent: React.FC<OtpInputBoxesProps> = ({
  value,
  onChange,
  onSubmit,
  hasError = false,
  errorMessage,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first slot on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otpLength = value.length || 4;

  // WebOTP API Integration (Standard Web Browser Feature)
  useEffect(() => {
    if (typeof window === "undefined" || !("OTPCredential" in window)) {
      return;
    }

    const abortController = new AbortController();

    async function listenForSmsOtp() {
      try {
        const content = await (navigator.credentials as unknown as { get: (options: unknown) => Promise<{ code?: string }> }).get({
          otp: { transport: ["sms"] },
          signal: abortController.signal,
        });

        if (content && content.code) {
          const rawDigits = content.code.replace(/\D/g, "").slice(0, otpLength).split("");
          if (rawDigits.length === otpLength) {
            onChange(rawDigits);
            if (onSubmit) {
              setTimeout(onSubmit, 150);
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    listenForSmsOtp();

    return () => {
      abortController.abort();
    };
  }, [onChange, onSubmit, otpLength]);

  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "");
      if (!val) {
        const next = [...value];
        next[index] = "";
        onChange(next);
        return;
      }

      // If user typed/pasted a single digit
      const char = val.slice(-1);
      const next = [...value];
      next[index] = char;
      onChange(next);

      // Auto-advance to next input
      if (index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        if (next.every((d) => d.length === 1)) {
          inputRefs.current[index]?.blur();
        }
      }
    },
    [value, onChange, otpLength]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!value[index] && index > 0) {
          const next = [...value];
          next[index - 1] = "";
          onChange(next);
          inputRefs.current[index - 1]?.focus();
          e.preventDefault();
        } else {
          const next = [...value];
          next[index] = "";
          onChange(next);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      } else if (e.key === "ArrowRight" && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (value.every((d) => d.trim().length === 1)) {
          e.preventDefault();
          onSubmit?.();
        }
      }
    },
    [value, onChange, onSubmit, otpLength]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "");
      if (!pasted) return;

      const digits = pasted.slice(0, otpLength).split("");
      const next = new Array(otpLength).fill("");
      for (let i = 0; i < digits.length; i++) {
        next[i] = digits[i];
      }
      onChange(next);

      const nextFocus = Math.min(digits.length, otpLength - 1);
      inputRefs.current[nextFocus]?.focus();

      if (digits.length === otpLength && onSubmit) {
        setTimeout(onSubmit, 200);
      }
    },
    [onChange, onSubmit, otpLength]
  );

  return (
    <div className="w-full flex flex-col items-center">
      <fieldset className="border-0 p-0 m-0">
        <legend className="sr-only">Enter {otpLength}-digit verification code</legend>
        <div
          className={`flex items-center justify-center gap-3 sm:gap-5 my-2 ${
            hasError ? "animate-[shake_0.4s_ease-in-out]" : ""
          }`}
        >
          {value.map((digit, idx) => {
            const isFilled = digit.length > 0;

            return (
              <div key={idx} className="relative">
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${idx + 1} of ${otpLength}`}
                  value={digit}
                  disabled={disabled}
                  onChange={(e) => handleChange(idx, e)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold tracking-wider font-sans bg-transparent border-b-2 transition-all duration-200 outline-none select-none ${
                    hasError
                      ? "border-red-500 text-red-600"
                      : isFilled
                      ? "border-[#DB2F3C] text-[#1A1A1A]"
                      : "border-stone-300 text-[#1A1A1A] hover:border-stone-400"
                  } focus:border-[#00A86B] focus:text-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            );
          })}
        </div>
      </fieldset>

      {/* Error Message with Icon */}
      {hasError && errorMessage && (
        <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 py-1.5 px-3 rounded-lg border border-red-200/80 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export const OtpInputBoxes = memo(OtpInputBoxesComponent);
OtpInputBoxes.displayName = "OtpInputBoxes";
