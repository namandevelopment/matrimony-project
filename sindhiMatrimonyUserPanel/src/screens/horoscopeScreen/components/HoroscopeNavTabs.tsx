"use client";

import React, { memo, useCallback } from "react";
import { Printer } from "lucide-react";

export interface HoroscopeNavTabsProps {
  activeTab?: "personal" | "partner";
  onTabChange?: (tab: "personal" | "partner") => void;
  className?: string;
}

const HoroscopeNavTabsComponent: React.FC<HoroscopeNavTabsProps> = ({
  activeTab = "personal",
  onTabChange,
  className = "",
}) => {
  const handleScrollToPartner = useCallback(() => {
    if (onTabChange) {
      onTabChange("partner");
    }
    const elem = document.getElementById("partner-preference-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [onTabChange]);

  const handleScrollToPersonal = useCallback(() => {
    if (onTabChange) {
      onTabChange("personal");
    }
    const elem = document.getElementById("personal-information-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [onTabChange]);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  return (
    <div
      className={`w-full bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between rounded-t-xl ${className}`}
    >
      {/* Navigation tabs */}
      <div className="flex items-center gap-6 sm:gap-8">
        <button
          type="button"
          onClick={handleScrollToPersonal}
          className={`text-[15px] sm:text-[15.5px] pb-1.5 cursor-pointer transition-colors relative ${
            activeTab === "personal"
              ? "font-bold text-[#DB2F3C] border-b-2 border-[#DB2F3C]"
              : "text-stone-500 hover:text-[#DB2F3C] font-medium"
          }`}
        >
          Personal Information
        </button>

        <button
          type="button"
          onClick={handleScrollToPartner}
          className={`text-[15px] sm:text-[15.5px] pb-1.5 cursor-pointer transition-colors flex items-center gap-1 ${
            activeTab === "partner"
              ? "font-bold text-[#DB2F3C] border-b-2 border-[#DB2F3C]"
              : "text-stone-500 hover:text-[#DB2F3C] font-medium"
          }`}
        >
          <span>Partner Preference</span>
          <span className="text-sm">↓</span>
        </button>
      </div>

      {/* Right side: Print icon */}
      <button
        type="button"
        onClick={handlePrint}
        className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md hover:bg-stone-100 transition-colors"
        aria-label="Print Profile"
      >
        <span title="Print Profile">
          <Printer className="w-5 h-5" />
        </span>
      </button>
    </div>
  );
};

export const HoroscopeNavTabs = memo(HoroscopeNavTabsComponent);
HoroscopeNavTabs.displayName = "HoroscopeNavTabs";
