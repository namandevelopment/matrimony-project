"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { X, Phone, Check, AlertCircle } from "lucide-react";

interface OtpEditPhoneModalProps {
  isOpen: boolean;
  currentMobile: string;
  countryCode: string;
  onClose: () => void;
  onSave: (newMobile: string, newCode: string) => void;
}

interface InnerEditFormProps {
  initialMobile: string;
  initialCode: string;
  onClose: () => void;
  onSave: (newMobile: string, newCode: string) => void;
}

const InnerEditForm: React.FC<InnerEditFormProps> = ({
  initialMobile,
  initialCode,
  onClose,
  onSave,
}) => {
  const [mobile, setMobile] = useState(initialMobile);
  const [code, setCode] = useState(initialCode || "+91");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobile.replace(/\D/g, "");
    if (!cleanNumber) {
      setError("Please enter a valid mobile number");
      return;
    }
    if (cleanNumber.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }
    setError(null);
    onSave(cleanNumber, code);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-phone-title"
      className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-7 z-10 animate-scale-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-[#DB2F3C] flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h2 id="edit-phone-title" className="text-base sm:text-lg font-bold text-[#1A1A1A]">
              Change Mobile Number
            </h2>
            <p className="text-xs text-stone-500">
              We will resend the 4-digit OTP to this new number
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="edit-mobile-input" className="block text-xs font-bold text-stone-700 mb-1.5">
            Mobile Number
          </label>
          <div className="flex rounded-xl border border-stone-300 focus-within:border-[#DB2F3C] focus-within:ring-2 focus-within:ring-red-100 transition-all overflow-hidden bg-white shadow-2xs">
            {/* Country Code Select */}
            <select
              aria-label="Country Dial Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm font-semibold bg-stone-50 text-stone-800 border-r border-stone-200 outline-none cursor-pointer"
            >
              <option value="+91">+91 (IN)</option>
              <option value="+1">+1 (US/CA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+971">+971 (UAE)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+65">+65 (SG)</option>
            </select>

            {/* Mobile Input */}
            <input
              ref={inputRef}
              id="edit-mobile-input"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                if (error) setError(null);
              }}
              placeholder="Enter 10-digit mobile"
              className="flex-1 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-[#1A1A1A] outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Update & Resend OTP</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const OtpEditPhoneModalComponent: React.FC<OtpEditPhoneModalProps> = ({
  isOpen,
  currentMobile,
  countryCode,
  onClose,
  onSave,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <InnerEditForm
        key={`${isOpen}-${currentMobile}-${countryCode}`}
        initialMobile={currentMobile}
        initialCode={countryCode}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};

export const OtpEditPhoneModal = memo(OtpEditPhoneModalComponent);
OtpEditPhoneModal.displayName = "OtpEditPhoneModal";
