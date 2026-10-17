"use client";

import React, { memo } from "react";
import Image from "next/image";
import { X, CheckCircle2, MapPin, Briefcase, GraduationCap, Heart, Sparkles } from "lucide-react";
import { EditProfileState } from "../types";

export interface EditProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EditProfileState;
  className?: string;
}

const EditProfilePreviewModalComponent: React.FC<EditProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  className = "",
}) => {
  if (!isOpen) return null;

  const { basicInfo, educationOccupation, contactDetails, photos } = data;
  const primaryPhoto = photos.find((p) => p.isPrimary)?.url || photos[0]?.url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DB2F3C]" />
            <h3 className="text-sm font-bold text-stone-900 font-heading">
              Profile Preview (How others see you)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Banner */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Photo Avatar */}
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
              {primaryPhoto ? (
                <Image
                  src={primaryPhoto}
                  alt={basicInfo.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-400">
                  <svg
                    className="w-20 h-20 text-stone-400"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <path d="M50 48C58.2843 48 65 41.2843 65 33C65 24.7157 58.2843 18 50 18C41.7157 18 35 24.7157 35 33C35 41.2843 41.7157 48 50 48Z" />
                    <path d="M50 54C34.536 54 22 66.536 22 82H78C78 66.536 65.464 54 50 54Z" />
                  </svg>
                  <span className="text-[10px] text-stone-500 mt-1">Photo Not Added</span>
                </div>
              )}
            </div>

            {/* Basic Summary */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 capitalize font-heading">
                  {basicInfo.name || "Naman"}
                </h2>
                <span title="Verified Profile">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>

              <p className="text-xs text-stone-500 font-mono">
                ID: SM9842104 • Profile created by {basicInfo.profileCreatedBy}
              </p>

              <div className="space-y-1 text-xs text-stone-700">
                <p>
                  <span className="font-semibold">Age / Height:</span> 27 Yrs,{" "}
                  {basicInfo.height}
                </p>
                <p>
                  <span className="font-semibold">Community:</span>{" "}
                  {basicInfo.casteDivision} ({basicInfo.subcaste || "Sindhi"})
                </p>
                <p>
                  <span className="font-semibold">Mother Tongue:</span>{" "}
                  {basicInfo.motherTongue}
                </p>
                <p className="flex items-center gap-1 text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    {contactDetails.city}, {contactDetails.state},{" "}
                    {contactDetails.country}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#DB2F3C]" />
              About Me
            </h4>
            <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed italic">
              &ldquo;{basicInfo.aboutMe}&rdquo;
            </p>
          </div>

          {/* Education & Career */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                <GraduationCap className="w-4 h-4 text-[#DB2F3C]" />
                Education
              </div>
              <p className="text-stone-700">{educationOccupation.highestEducation}</p>
              <p className="text-stone-500 text-[11px]">{educationOccupation.collegeInstitute}</p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                <Briefcase className="w-4 h-4 text-[#DB2F3C]" />
                Profession &amp; Income
              </div>
              <p className="text-stone-700">{educationOccupation.occupation}</p>
              <p className="text-stone-500 text-[11px]">{educationOccupation.annualIncome}</p>
            </div>
          </div>

          {/* Horoscope & Lifestyle Badges */}
          <div className="flex flex-wrap gap-2 text-[11.5px]">
            <span className="px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
              Diet: <strong className="font-semibold">{basicInfo.eatingHabits}</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
              Gothra: <strong className="font-semibold">{basicInfo.gothra}</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
              Star: <strong className="font-semibold">{basicInfo.star}</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
              Raasi: <strong className="font-semibold">{basicInfo.raasi}</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
              Manglik: <strong className="font-semibold">{basicInfo.manglik}</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#DB2F3C] text-white text-xs font-bold hover:bg-[#C22430] transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditProfilePreviewModal = memo(EditProfilePreviewModalComponent);
EditProfilePreviewModal.displayName = "EditProfilePreviewModal";
