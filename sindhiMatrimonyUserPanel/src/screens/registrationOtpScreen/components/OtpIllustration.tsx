"use client";

import React, { memo } from "react";

const OtpIllustrationComponent: React.FC = () => {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center mb-5 select-none">
      {/* SVG Phone & OTP Passcode Graphic matching BrahminMatrimony reference */}
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="phoneBody" x1="42" y1="20" x2="78" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="phoneScreen" x1="46" y1="26" x2="74" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EA5558" />
            <stop offset="100%" stopColor="#DB2F3C" />
          </linearGradient>

          <linearGradient id="bubbleGrad" x1="32" y1="42" x2="88" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFF1F2" />
          </linearGradient>

          <filter id="shadow" x="26" y="44" width="68" height="34" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Outer Circular Backdrop */}
        <circle cx="60" cy="60" r="56" fill="#FFF5F5" stroke="#FFE4E6" strokeWidth="1.5" />

        {/* Smartphone Body */}
        <rect
          x="42"
          y="24"
          width="36"
          height="72"
          rx="8"
          fill="url(#phoneBody)"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Phone Glass Screen */}
        <rect
          x="45"
          y="28"
          width="30"
          height="64"
          rx="5"
          fill="url(#phoneScreen)"
        />

        {/* Speaker Notch */}
        <rect x="54" y="26" width="12" height="1.8" rx="0.9" fill="#94A3B8" />

        {/* Mini App Header Icon */}
        <circle cx="60" cy="38" r="4.5" fill="#FEE2E2" />
        <path
          d="M58.5 38H61.5M60 36.5V39.5"
          stroke="#DB2F3C"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Floating OTP Bubble Badge with 4 Dots */}
        <g filter="url(#shadow)">
          <rect
            x="33"
            y="48"
            width="54"
            height="22"
            rx="11"
            fill="url(#bubbleGrad)"
            stroke="#FECDD3"
            strokeWidth="1"
          />

          {/* 4 Passcode Dots */}
          <circle cx="43" cy="59" r="2.8" fill="#DB2F3C" />
          <circle cx="51.5" cy="59" r="2.8" fill="#DB2F3C" />
          <circle cx="60" cy="59" r="2.8" fill="#DB2F3C" />
          <circle cx="68.5" cy="59" r="2.8" fill="#DB2F3C" />

          {/* Mini Arrow Icon */}
          <circle cx="77" cy="59" r="4" fill="url(#brandGrad)" />
          <path
            d="M75.5 59H78.5M77.2 57.7L78.5 59L77.2 60.3"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Phone Action Button Representation */}
        <rect x="47" y="75" width="26" height="7" rx="3.5" fill="url(#brandGrad)" />
        <path
          d="M57 78.5H63M61 76.5L63 78.5L61 80.5"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const OtpIllustration = memo(OtpIllustrationComponent);
OtpIllustration.displayName = "OtpIllustration";
