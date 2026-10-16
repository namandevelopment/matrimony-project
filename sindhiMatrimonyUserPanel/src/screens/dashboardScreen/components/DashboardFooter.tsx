"use client";

import React, { memo } from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import { LimcaBookBadge } from "./DashboardIcons";

export interface DashboardFooterProps {
  className?: string;
}

const DashboardFooterComponent: React.FC<DashboardFooterProps> = ({
  className = "",
}) => {
  return (
    <footer
      aria-label="Sindhi Matrimony Dashboard Footer"
      className={`w-full bg-white border-t border-stone-200 mt-10 text-[#444444] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8">
          {/* Column 1: About Us (Takes 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <MatrimonyHeartLogo size={22} color="#DB2F3C" />
              <h4 className="text-sm font-bold text-[#1A1A1A] font-heading uppercase tracking-wide">
                About Us
              </h4>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed pr-2">
              SindhiMatrimony.com is part of CommunityMatrimony which has over 200+
              Indian community portals offering online matrimony services. Register
              with us for FREE to find a partner from your own community. Take
              advantage of our user friendly search features to find a bride or groom
              who matches your preferences. Join us and begin your happy journey
              today..{" "}
              <Link
                href="/about"
                className="text-[#DB2F3C] font-semibold hover:underline inline-block"
              >
                more &raquo;
              </Link>
            </p>
          </div>

          {/* Column 2: Our Other Services (Takes 2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-heading">
              Our Other Services
            </h4>
            <ul className="space-y-1.5 text-xs text-[#555555]">
              <li>
                <a
                  href="https://www.elitematrimony.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  EliteMatrimony.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.mandap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Mandap.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.weddingbazaar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  WeddingBazaar.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.luv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Luv.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.manyjobs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  ManyJobs.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Support (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-heading">
              Help & Support
            </h4>
            <ul className="space-y-1.5 text-xs text-[#555555]">
              <li>
                <Link href="/help" className="hover:text-[#DB2F3C] transition-colors">
                  24x7 Live help
                </Link>
              </li>
              <li>
                <Link
                  href="/help#contact"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/help#feedback"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/help#faq" className="hover:text-[#DB2F3C] transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links (Takes 2.5 cols on lg) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-heading">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-[#555555]">
              <li>
                <Link
                  href="/subscription"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Upgrade
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Success Story
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/horoscope"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Free Astrology Online
                </Link>
              </li>
              <li>
                <Link
                  href="/safety-tips"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Safe Matrimony
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  Popular Matrimony Searches
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer, Copyright, Limca Badge & Social Links */}
        <div className="pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
          {/* Left: Disclaimers & Copyright */}
          <div className="text-center md:text-left space-y-1">
            <p>
              This website is strictly for matrimonial purpose only and not a
              dating website.
            </p>
            <p>
              Copyright &copy; 2026 Matrimony.com, the most trusted matrimony brand.
            </p>
          </div>

          {/* Right: Limca Badge + Follow Us */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* Limca Badge */}
            <div className="flex items-center gap-2">
              <LimcaBookBadge className="w-20 h-10 border-stone-400" />
              <div className="text-[10px] text-stone-500 leading-tight">
                <div>The Limca Book of records</div>
                <div className="font-semibold text-stone-700">
                  Highest No of Marriages
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#1A1A1A]">
                FOLLOW US ON:
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-6 h-6 rounded bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-6 h-6 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity"
              >
                ig
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const DashboardFooter = memo(DashboardFooterComponent);
DashboardFooter.displayName = "DashboardFooter";
export default DashboardFooter;
