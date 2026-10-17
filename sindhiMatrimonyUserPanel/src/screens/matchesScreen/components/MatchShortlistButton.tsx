"use client";

import React, { memo } from "react";
import { Bookmark } from "lucide-react";

export interface MatchShortlistButtonProps {
  isShortlisted?: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

const MatchShortlistButtonComponent: React.FC<MatchShortlistButtonProps> = ({
  isShortlisted = false,
  onToggle,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xs transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
        isShortlisted
          ? "bg-[#111827]/85 text-[#FBBF24] border border-[#FBBF24]/50"
          : "bg-black/60 hover:bg-black/80 text-white border border-white/20"
      } ${className}`}
      aria-label={isShortlisted ? "Remove from shortlist" : "Shortlist this profile"}
    >
      <Bookmark
        className={`w-3.5 h-3.5 transition-colors ${
          isShortlisted ? "fill-[#FBBF24] text-[#FBBF24]" : "text-white"
        }`}
      />
      <span className="text-[11px] font-medium tracking-wide">
        {isShortlisted ? "Shortlisted" : "Shortlist"}
      </span>
    </button>
  );
};

export const MatchShortlistButton = memo(MatchShortlistButtonComponent);
MatchShortlistButton.displayName = "MatchShortlistButton";
export default MatchShortlistButton;
