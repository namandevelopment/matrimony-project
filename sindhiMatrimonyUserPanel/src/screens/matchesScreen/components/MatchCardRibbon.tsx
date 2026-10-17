"use client";

import React, { memo } from "react";

export interface MatchCardRibbonProps {
  label?: string;
  className?: string;
}

const MatchCardRibbonComponent: React.FC<MatchCardRibbonProps> = ({
  label = "NEWLY JOINED",
  className = "",
}) => {
  return (
    <div
      className={`absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10 ${className}`}
      aria-label={label}
    >
      <div className="absolute transform -rotate-45 bg-[#E61853] text-white font-extrabold text-[9px] tracking-wider uppercase text-center py-1 -left-7 top-4 w-28 shadow-md">
        {label}
      </div>
    </div>
  );
};

export const MatchCardRibbon = memo(MatchCardRibbonComponent);
MatchCardRibbon.displayName = "MatchCardRibbon";
export default MatchCardRibbon;
