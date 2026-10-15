"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { RotateCw } from "lucide-react";
import { ResendChannel } from "../types";

interface OtpTimerResendProps {
  initialSeconds?: number;
  onResend: (channel: ResendChannel) => Promise<void> | void;
  mobileNumber?: string;
  disabled?: boolean;
}

const OtpTimerResendComponent: React.FC<OtpTimerResendProps> = ({
  initialSeconds = 30,
  onResend,
  mobileNumber = "",
  disabled = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Auto-hide toast after 4s
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleTriggerResend = useCallback(
    async (channel: ResendChannel) => {
      if (disabled || isResending) return;
      setIsResending(true);
      try {
        await onResend(channel);
        setSecondsLeft(initialSeconds);
        const channelLabel = channel === "whatsapp" ? "WhatsApp" : "SMS";
        setToastMessage(`OTP sent via ${channelLabel}!`);
      } catch {
        setToastMessage("Failed to resend. Please try again.");
      } finally {
        setIsResending(false);
      }
    },
    [disabled, isResending, onResend, initialSeconds]
  );

  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      {/* Dynamic Toast feedback on resend */}
      {toastMessage && (
        <div className="mb-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Matching BrahminMatrimony Layout: Top label, Bottom actionable */}
      <span className="text-xs sm:text-sm text-[#777777]">
        Didn&apos;t receive the OTP?
      </span>

      {secondsLeft > 0 ? (
        <span className="text-xs sm:text-sm font-semibold text-[#EA5558] mt-0.5">
          Resend OTP {secondsLeft} sec
        </span>
      ) : (
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            disabled={disabled || isResending}
            onClick={() => handleTriggerResend("sms")}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#EA5558] hover:underline cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
            <span>Resend OTP</span>
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            disabled={disabled || isResending}
            onClick={() => handleTriggerResend("whatsapp")}
            className="text-xs sm:text-sm font-medium text-emerald-600 hover:underline cursor-pointer disabled:opacity-50"
          >
            via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export const OtpTimerResend = memo(OtpTimerResendComponent);
OtpTimerResend.displayName = "OtpTimerResend";
