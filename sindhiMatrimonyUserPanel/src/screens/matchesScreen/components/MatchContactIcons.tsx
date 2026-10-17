"use client";

import React, { memo } from "react";
import { Phone } from "lucide-react";

export interface MatchContactIconsProps {
  onCallClick?: (e: React.MouseEvent) => void;
  onWhatsAppClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const MatchContactIconsComponent: React.FC<MatchContactIconsProps> = ({
  onCallClick,
  onWhatsAppClick,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Call Icon Button (Orange circular border) */}
      <button
        type="button"
        onClick={onCallClick}
        aria-label="Call member"
        className="w-8 h-8 rounded-full border border-[#EA580C] text-[#EA580C] bg-white hover:bg-[#FFF7ED] flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
        title="View phone number / Call"
      >
        <Phone className="w-4 h-4" />
      </button>

      {/* WhatsApp Icon Button (Green circular border with WhatsApp glyph) */}
      <button
        type="button"
        onClick={onWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="w-8 h-8 rounded-full border border-[#22C55E] text-[#22C55E] bg-white hover:bg-[#F0FDF4] flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
        title="Connect on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </div>
  );
};

export const MatchContactIcons = memo(MatchContactIconsComponent);
MatchContactIcons.displayName = "MatchContactIcons";
export default MatchContactIcons;
