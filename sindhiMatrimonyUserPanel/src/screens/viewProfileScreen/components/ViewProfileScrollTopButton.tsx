"use client";

import React, { memo } from "react";
import { ChevronUp } from "lucide-react";

export interface ViewProfileScrollTopButtonProps {
  isVisible: boolean;
  onScrollToTop: () => void;
  className?: string;
}

const ViewProfileScrollTopButtonComponent: React.FC<ViewProfileScrollTopButtonProps> = ({
  isVisible,
  onScrollToTop,
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onScrollToTop}
      className={`fixed bottom-22 right-6 z-40 w-11 h-11 rounded-full bg-white border border-stone-300 text-stone-700 hover:text-stone-900 shadow-md flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer animate-in fade-in-50 zoom-in-90 ${className}`}
      aria-label="Scroll to top of profile"
    >
      <ChevronUp className="w-4 h-4 -mb-1 stroke-2.5" />
      <span className="text-[10px] font-bold tracking-tight">Top</span>
    </button>
  );
};

export const ViewProfileScrollTopButton = memo(ViewProfileScrollTopButtonComponent);
ViewProfileScrollTopButton.displayName = "ViewProfileScrollTopButton";
