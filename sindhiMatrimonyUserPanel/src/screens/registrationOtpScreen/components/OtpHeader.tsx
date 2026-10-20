"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Phone, ArrowLeft, Headphones } from "lucide-react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";

interface OtpHeaderProps {
  onBackClick?: () => void;
}

const OtpHeaderComponent: React.FC<OtpHeaderProps> = ({ onBackClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & Back Option */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onBackClick ? (
            <button
              type="button"
              onClick={onBackClick}
              className="p-1.5 -ml-1 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Back to Registration Form"
              title="Back to Registration Form"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/"
              className="p-1.5 -ml-1 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-hidden rounded-lg p-0.5"
            aria-label="Sindhi Matrimony Home"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
              <MatrimonyHeartLogo size={38} className="w-9 h-9 sm:w-10 sm:h-10" color="#DB2F3C" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-[21px] font-bold tracking-tight text-[#1A1A1A] leading-tight font-heading">
                Sindhi<span className="text-[#DB2F3C]">marriage</span>.in
              </span>
              <span className="text-[9.5px] sm:text-[10.5px] text-[#666666] font-normal tracking-wide">
                From Sindhimarriage.in • Powered by NeelimaMarriage.com
              </span>
            </div>
          </Link>
        </div>

        {/* Customer Care / Help Desk Link (Matching screenshot: "Need help? Call 8144-77-88-66") */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 border-r border-stone-200 pr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Support Online (9 AM - 8 PM)</span>
          </div>

          <a
            href="tel:+918144778866"
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-red-200 transition-all text-[#1A1A1A] hover:text-[#DB2F3C] shadow-2xs"
            aria-label="Call Customer Support at 8144-77-88-66"
          >
            <div className="w-7 h-7 rounded-full bg-red-100 group-hover:bg-[#DB2F3C] text-[#DB2F3C] group-hover:text-white flex items-center justify-center transition-colors">
              <Phone className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] text-stone-500 group-hover:text-red-700 font-medium leading-none">
                Need help? Call
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#DB2F3C] tracking-wide mt-0.5 leading-none">
                8144-77-88-66
              </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};

export const OtpHeader = memo(OtpHeaderComponent);
OtpHeader.displayName = "OtpHeader";
