"use client";

import React, { memo } from "react";
import Link from "next/link";
import { User, GraduationCap, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { HoroscopeProfileData } from "../types";

export interface HoroscopeHeroCardProps {
  data: HoroscopeProfileData;
  onViewHoroscope: () => void;
  onAddPhoto?: () => void;
  className?: string;
}

const HoroscopeHeroCardComponent: React.FC<HoroscopeHeroCardProps> = ({
  data,
  onViewHoroscope,
  onAddPhoto,
  className = "",
}) => {
  return (
    <div
      className={`w-full bg-white rounded-xl border border-stone-200/90 shadow-xs p-4 sm:p-6 transition-all ${className}`}
    >
      {/* Top Header Line: Profile ID & Created For */}
      <div className="flex items-center justify-between text-[13px] text-stone-500 font-medium pb-4 border-b border-stone-100">
        <div>
          <span className="font-semibold text-stone-700">{data.matrimonyId}</span>
          <span className="mx-2 text-stone-300">|</span>
          <span>Profile Created for {data.profileCreatedFor}</span>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="pt-4 flex flex-col md:flex-row gap-5 lg:gap-7 items-start">
        {/* Left: Silhouette Avatar & Add Photo Button */}
        <div className="w-full sm:w-auto flex flex-col items-center shrink-0">
          <div className="w-36 h-40 sm:w-40 sm:h-44 bg-gradient-to-b from-stone-100 to-stone-200 rounded-t-lg border border-stone-300/80 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                viewBox="0 0 100 110"
                className="w-28 h-32 text-stone-400 fill-current opacity-70 translate-y-2"
                aria-hidden="true"
              >
                <circle cx="50" cy="38" r="22" />
                <path d="M12 105 C 12 70, 88 70, 88 105 Z" />
              </svg>
            )}
          </div>

          {/* Add Photo Button Under Avatar */}
          <button
            type="button"
            onClick={onAddPhoto}
            className="w-36 sm:w-40 bg-gradient-to-r from-[#FF4A57] to-[#DB2F3C] hover:brightness-105 active:scale-95 text-white text-[13.5px] font-semibold py-2 px-3 rounded-b-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Add Photo</span>
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-[26px] font-bold text-stone-800 tracking-tight">
              {data.name}
            </h1>

            <div className="space-y-1.5 pt-1 text-[14.5px] text-stone-600">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{data.basicDetails.age}, {data.height}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{data.education}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{data.location}</span>
              </div>
            </div>
          </div>

          {/* Action Box: Mobile Number, View Horoscope, Edit My Profile */}
          <div className="mt-5 bg-stone-50 border border-stone-200/90 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
            <div className="space-y-1.5">
              {/* Mobile row */}
              <div className="flex items-center gap-2 text-[14px] text-stone-800 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>
                  Mobile Number : <strong className="text-stone-900 font-semibold">{data.mobileNumber}</strong>
                </span>
              </div>

              {/* View Horoscope Link */}
              <div className="flex items-center gap-2 text-[14px]">
                <Sparkles className="w-4 h-4 text-[#DB2F3C] shrink-0" />
                <button
                  type="button"
                  onClick={onViewHoroscope}
                  className="text-[#DB2F3C] hover:text-[#B71F2A] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View Horoscope
                </button>
              </div>
            </div>

            {/* Red Action Button: Edit My Profile */}
            <Link
              href="/profile/edit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-[#DB2F3C] hover:bg-[#B71F2A] active:scale-[0.98] text-white text-[14px] sm:text-[14.5px] font-bold rounded-md shadow-xs hover:shadow-md transition-all shrink-0 text-center"
            >
              Edit My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HoroscopeHeroCard = memo(HoroscopeHeroCardComponent);
HoroscopeHeroCard.displayName = "HoroscopeHeroCard";
