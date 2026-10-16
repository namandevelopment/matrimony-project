"use client";

import React, { memo } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { BasicInfoFormData } from "../types";

export interface StepSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BasicInfoFormData;
  calculatedAge: number | null;
  onProceedToNextStep: () => void;
}

export const StepSuccessModal: React.FC<StepSuccessModalProps> = memo(
  ({ isOpen, onClose, data, calculatedAge, onProceedToNextStep }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Basic Details Saved!
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
            Step 1 of 4 completed successfully.
          </p>

          {/* Summary Box */}
          <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs sm:text-sm space-y-2">
            <div className="flex justify-between items-center text-stone-600">
              <span>Date of Birth:</span>
              <strong className="text-stone-900 font-semibold">
                {data.day} {data.month} {data.year} ({calculatedAge} yrs)
              </strong>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Mother Tongue:</span>
              <strong className="text-stone-900 font-semibold">{data.motherTongue}</strong>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Email:</span>
              <strong className="text-stone-900 font-semibold truncate max-w-[180px]">
                {data.email}
              </strong>
            </div>
          </div>

          {/* Next Step Teaser */}
          <div className="mt-4 p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center gap-2.5 text-left">
            <Heart className="w-5 h-5 text-[#DB2F3C] shrink-0" />
            <p className="text-[12px] text-stone-700 leading-tight">
              <strong>Step 2/4 Next:</strong> Add your Sindhi sub-caste (Bhaiband, Amil, Sahiti, etc.) and native city to discover top matches.
            </p>
          </div>

          {/* Proceed CTA */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onProceedToNextStep}
              className="w-full py-3 px-6 rounded-full font-bold text-white text-sm bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-98 transition-all shadow-md shadow-red-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 2/4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Edit details
            </button>
          </div>
        </div>
      </div>
    );
  }
);

StepSuccessModal.displayName = "StepSuccessModal";
