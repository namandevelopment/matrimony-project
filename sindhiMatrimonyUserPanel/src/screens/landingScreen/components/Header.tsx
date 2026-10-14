"use client";

import React, { memo } from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "./Icons";

interface HeaderProps {
  onLoginClick?: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full bg-white border-b border-[#E9E9E9] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DB2F3C] rounded-lg p-1 transition-opacity hover:opacity-95"
          aria-label="Sindhi Matrimony Home"
        >
          <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
            <MatrimonyHeartLogo size={42} className="w-10 h-10 sm:w-11 sm:h-11" color="#DB2F3C" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-[22px] font-bold tracking-tight text-[#1A1A1A] leading-tight font-heading">
              Sindhi<span className="text-[#DB2F3C]">Matrimony</span>.com
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#666666] font-normal tracking-wide">
              Powered by NeelimaMarriage.com
            </span>
          </div>
        </Link>

        {/* Desktop Member Login CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[13px] sm:text-sm text-[#444444]">
            Already a member?
          </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] rounded-full shadow-xs hover:shadow-md hover:shadow-red-500/20 transition-all duration-200 cursor-pointer"
          >
            Log In
          </button>
        </div>

        {/* Mobile Member Login Link */}
        <div className="sm:hidden flex items-center">
          <button
            type="button"
            onClick={onLoginClick}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] rounded-full shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
Header.displayName = "Header";
