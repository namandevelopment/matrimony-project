"use client";

import React, { memo } from "react";
import { Camera, X, CheckCircle } from "lucide-react";
import { MatchDetailProfile } from "../types";

export interface RequestPhotoModalProps {
  isOpen: boolean;
  profile: MatchDetailProfile | null;
  onClose: () => void;
  onConfirmRequest: (id: string) => void;
}

const RequestPhotoModalComponent: React.FC<RequestPhotoModalProps> = ({
  isOpen,
  profile,
  onClose,
  onConfirmRequest,
}) => {
  if (!isOpen || !profile) return null;

  const isFemale = profile.gender !== "male";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-center p-6 space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-[#DB2F3C] flex items-center justify-center">
          <Camera className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 font-heading">
            Request Photo from {profile.name}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We will notify {profile.name} ({profile.matrimonyId}) to upload a photo to {isFemale ? "her" : "his"} profile.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmRequest(profile.id);
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Send Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const RequestPhotoModal = memo(RequestPhotoModalComponent);
RequestPhotoModal.displayName = "RequestPhotoModal";
export default RequestPhotoModal;
