"use client";

import React, { memo } from "react";

export interface InterestsEmptyStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const InterestsEmptyStateComponent: React.FC<InterestsEmptyStateProps> = ({
  title = "You have no pending interests.",
  subtitle = "No pending conversations till now",
  className = "",
}) => {
  return (
    <div
      className={`w-full py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      {/* Stylized SVG couple with phone matching Screenshot 1 */}
      <div className="w-52 h-44 sm:w-64 sm:h-52 relative mb-6">
        <svg
          viewBox="0 0 240 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Central Smartphone */}
          <rect
            x="85"
            y="25"
            width="70"
            height="140"
            rx="12"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="3.5"
          />
          {/* Phone Screen Speaker & Button */}
          <rect x="108" y="32" width="24" height="3" rx="1.5" fill="#94A3B8" />
          <circle cx="120" cy="155" r="4" fill="#CBD5E1" />

          {/* Chat bubbles on phone screen */}
          <rect x="94" y="44" width="40" height="7" rx="3.5" fill="#E2E8F0" />
          <rect x="104" y="58" width="42" height="7" rx="3.5" fill="#FEE2E2" />
          <rect x="94" y="72" width="36" height="7" rx="3.5" fill="#E2E8F0" />
          <rect x="100" y="86" width="46" height="7" rx="3.5" fill="#FEE2E2" />

          {/* Ground shadow */}
          <ellipse cx="120" cy="180" rx="90" ry="6" fill="#F1F5F9" />

          {/* Left Figure: Standing Young Man in Red Shirt */}
          {/* Head & Hair */}
          <circle cx="68" cy="72" r="9" fill="#FBCFE8" />
          <path
            d="M60 70 C60 62, 76 60, 76 70 C76 64, 70 62, 60 70 Z"
            fill="#1E293B"
          />
          {/* Red Torso */}
          <path
            d="M60 84 L65 116 L74 116 L78 84 Z"
            fill="#EF4444"
          />
          {/* Arms holding phone */}
          <path
            d="M60 85 L78 95 L88 92"
            stroke="#FBCFE8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Dark Pants */}
          <path
            d="M64 116 L61 168 L69 168 L71 130 L74 168 L81 168 L77 116 Z"
            fill="#1E293B"
          />

          {/* Right Figure: Sitting Young Woman in Coral Dress */}
          {/* Head & Dark Bun Hair */}
          <circle cx="168" cy="100" r="9" fill="#FDE68A" />
          <circle cx="173" cy="94" r="5" fill="#1E293B" />
          <path
            d="M160 100 C160 92, 175 90, 175 100 Z"
            fill="#1E293B"
          />
          {/* Pink/Coral Blouse & Legs Sitting */}
          <path
            d="M160 112 L163 138 L175 138 L176 112 Z"
            fill="#F43F5E"
          />
          {/* Sitting Legs in Dark Jeans */}
          <path
            d="M163 138 C163 155, 175 168, 195 168 L198 162 C182 162, 175 150, 175 138 Z"
            fill="#334155"
          />
          {/* Arm resting */}
          <path
            d="M164 115 L174 135"
            stroke="#FDE68A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text Info */}
      <div className="space-y-1">
        <p className="text-xs sm:text-[13px] text-stone-500 font-normal">
          {subtitle}
        </p>
        <h4 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
          {title}
        </h4>
      </div>
    </div>
  );
};

export const InterestsEmptyState = memo(InterestsEmptyStateComponent);
InterestsEmptyState.displayName = "InterestsEmptyState";
export default InterestsEmptyState;
