"use client";

import React, { memo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FemaleSilhouetteAvatar, MaleSilhouetteAvatar } from "@/screens/dashboardScreen/components/DashboardIcons";

export interface ViewProfilePhotoGalleryProps {
  photos: string[];
  name: string;
  gender: "female" | "male";
  onPhotoClick?: (index: number) => void;
  className?: string;
}

const ViewProfilePhotoGalleryComponent: React.FC<ViewProfilePhotoGalleryProps> = ({
  photos,
  name,
  gender,
  onPhotoClick,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPhotos = photos && photos.length > 0;
  const isMultiple = hasPhotos && photos.length > 1;

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    },
    [photos.length]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    },
    [photos.length]
  );

  return (
    <div
      onClick={() => onPhotoClick?.(currentIndex)}
      className={`relative w-full aspect-4/5 max-h-[360px] sm:max-h-[380px] bg-stone-900 rounded-2xl overflow-hidden cursor-pointer group shadow-inner ${className}`}
      aria-label={`Photo gallery of ${name}`}
    >
      {hasPhotos ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photos[currentIndex]}
          alt={`${name} photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="eager"
          decoding="async"
        />
      ) : gender === "female" ? (
        <FemaleSilhouetteAvatar className="w-full h-full" />
      ) : (
        <MaleSilhouetteAvatar className="w-full h-full" />
      )}

      {/* Subtle bottom shadow vignette */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Prev / Next arrows if multiple photos */}
      {isMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Counter Indicator Pill (Matching Screenshot: Dash indicator + 1/1) */}
      <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/55 backdrop-blur-xs px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide border border-white/10 shadow-xs">
          <span className="w-4 h-1 bg-white rounded-full inline-block" />
          <span>
            {hasPhotos ? `${currentIndex + 1}/${photos.length}` : "0/0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ViewProfilePhotoGallery = memo(ViewProfilePhotoGalleryComponent);
ViewProfilePhotoGallery.displayName = "ViewProfilePhotoGallery";
