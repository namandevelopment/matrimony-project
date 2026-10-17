"use client";

import React, { memo, useState } from "react";
import { Lightbulb, X } from "lucide-react";

export interface EditProfilePromoBannerProps {
  onAddPhotoClick: () => void;
  className?: string;
}

const EditProfilePromoBannerComponent: React.FC<EditProfilePromoBannerProps> = ({
  onAddPhotoClick,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={`w-full bg-[#FFF9E6] border-y border-[#FFE8A3] px-4 py-2 sm:py-2.5 transition-all ${className}`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-[13.5px]">
        <div className="flex items-center gap-2 text-stone-800 mx-auto sm:mx-0">
          <Lightbulb className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E08A00] shrink-0" />
          <span>
            Increase rate of profile responses by adding your Photo.{" "}
            <button
              type="button"
              onClick={onAddPhotoClick}
              className="font-bold text-[#1D68CD] hover:underline cursor-pointer inline-flex items-center gap-0.5"
            >
              Add Now &raquo;
            </button>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss banner"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const EditProfilePromoBanner = memo(EditProfilePromoBannerComponent);
EditProfilePromoBanner.displayName = "EditProfilePromoBanner";
