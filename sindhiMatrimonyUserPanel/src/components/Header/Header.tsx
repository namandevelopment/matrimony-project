"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Phone, ArrowLeft } from "lucide-react";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";
import { useHelpSupportQuery } from "@/tanstackQuery";
import { isDeepEqual } from "@/utils";

export interface HeaderProps {
  /** Callback when Log In button is clicked */
  onLoginClick?: () => void;
  /** Whether to show Log In button. Defaults to true if onLoginClick is provided, or when neither showHelpPhone nor rightContent is provided */
  showLogin?: boolean;
  /** Callback when Back button is clicked */
  onBackClick?: () => void;
  /** Whether to show a Back button before the logo */
  showBack?: boolean;
  /** Custom href for the back button when onBackClick is not provided */
  backHref?: string;
  /** Whether to show "Need help? Call <number>" on the right */
  showHelpPhone?: boolean;
  /** Phone number text to display (default: "8144-77-88-66") */
  helpPhoneNumber?: string;
  /** Help label text (default: "Need help? Call") */
  helpPhoneText?: string;
  /** Custom subtitle below the brand title (default: "Powered by NeelimaMarriage.com") */
  subtitle?: string;
  /** Custom right-side content slot */
  rightContent?: React.ReactNode;
  /** Layout positioning: "fixed" | "sticky" | "relative" (default: "fixed") */
  position?: "fixed" | "sticky" | "relative";
  /** Optional additional container className */
  className?: string;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  onLoginClick,
  showLogin,
  onBackClick,
  showBack,
  backHref = "/",
  showHelpPhone = false,
  helpPhoneNumber = "8144-77-88-66",
  helpPhoneText = "Need help? Call",
  subtitle = "Powered by NeelimaMarriage.com",
  rightContent,
  position = "fixed",
  className = "",
}) => {
  const { data: helpRes } = useHelpSupportQuery(showHelpPhone);
  const helpData = (helpRes as any)?.data || helpRes;
  const activeHelpPhone =
    helpData?.supportDesk?.enquiryNumber ||
    helpData?.supportDesk?.tollFreeHelpline ||
    helpData?.supportDesk?.whatsappDisplay ||
    helpPhoneNumber;

  // Determine position class
  const positionClass =
    position === "sticky"
      ? "sticky top-0"
      : position === "relative"
      ? "relative"
      : "fixed top-0 inset-x-0";

  // Determine whether to display Login CTA
  const shouldShowLogin =
    showLogin !== undefined
      ? showLogin
      : Boolean(onLoginClick) || (!showHelpPhone && !rightContent);

  const shouldShowBack = showBack || Boolean(onBackClick);

  return (
    <header
      className={`${positionClass} z-50 w-full bg-white border-b border-[#E9E9E9] shadow-xs ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Optional Back Button + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {shouldShowBack && (
            onBackClick ? (
              <button
                type="button"
                onClick={onBackClick}
                className="p-1.5 -ml-1 text-stone-500 hover:text-[#DB2F3C] rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={backHref}
                className="p-1.5 -ml-1 text-stone-500 hover:text-[#DB2F3C] rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )
          )}

          <Link
            href="/"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.location.pathname === "/") {
                e.preventDefault();
                if (window.location.hash || window.location.search) {
                  window.history.pushState(null, "", "/");
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DB2F3C] rounded-lg p-1 transition-opacity hover:opacity-95 cursor-pointer"
            aria-label="Sindhi Matrimony Home"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
              <MatrimonyHeartLogo size={42} className="w-10 h-10 sm:w-11 sm:h-11" color="#DB2F3C" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-[22px] font-bold tracking-tight text-[#1A1A1A] leading-tight font-heading">
                Sindhi<span className="text-[#DB2F3C]">marriage</span>.in
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#666666] font-normal tracking-wide truncate max-w-[160px] sm:max-w-none">
                {subtitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center">
          {rightContent ? (
            rightContent
          ) : showHelpPhone ? (
            /* Help / Helpline link: Need help? Call 8144-77-88-66 */
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#444444]">
              <span className="hidden sm:inline">{helpPhoneText}</span>
              <a
                href={`tel:${activeHelpPhone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1 font-semibold text-[#DB2F3C] hover:underline"
                aria-label={`${helpPhoneText} ${activeHelpPhone}`}
              >
                <Phone className="w-3.5 h-3.5 fill-[#DB2F3C] text-[#DB2F3C]" />
                <span className="tracking-wide">{activeHelpPhone}</span>
              </a>
            </div>
          ) : shouldShowLogin ? (
            /* Member Login CTA */
            <>
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
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export const Header = memo(
  HeaderComponent,
  (prev, next) => isDeepEqual(prev, next)
);
Header.displayName = "Header";
export default Header;
