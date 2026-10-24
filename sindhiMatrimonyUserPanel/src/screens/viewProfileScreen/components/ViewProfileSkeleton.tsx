"use client";

import React, { memo } from "react";

const ViewProfileSkeletonComponent: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`space-y-6 animate-in fade-in-50 duration-200 ${className}`} aria-label="Loading profile details">
      {/* 1. Hero Card Shimmer */}
      <div className="w-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-8">
          {/* Photo gallery placeholder */}
          <div className="w-full md:w-72 lg:w-80 h-[330px] sm:h-[360px] rounded-2xl shimmer-box shrink-0" />

          {/* Profile details placeholder */}
          <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-8 w-48 sm:w-60 rounded-xl shimmer-box" />
                  <div className="h-4 w-36 rounded-md shimmer-box" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-8 w-22 rounded-full shimmer-box" />
                  <div className="w-8 h-8 rounded-full shimmer-box" />
                  <div className="w-8 h-8 rounded-full shimmer-box" />
                </div>
              </div>

              {/* Bio & Details lines */}
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-md shimmer-box" />
                <div className="h-4 w-11/12 rounded-md shimmer-box" />
                <div className="h-4 w-4/5 rounded-md shimmer-box" />
                <div className="h-4 w-2/3 rounded-md shimmer-box" />
              </div>
            </div>

            {/* Bottom action buttons */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <div className="h-10 w-28 rounded-full shimmer-box" />
              <div className="h-10 w-36 rounded-full shimmer-box" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Section Shimmer */}
      <div className="w-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6">
        <div className="flex items-center gap-3 pb-5 border-b border-stone-100">
          <div className="w-8 h-8 rounded-full shimmer-box shrink-0" />
          <div className="h-6 w-44 rounded-lg shimmer-box" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="h-3 w-20 rounded shimmer-box" />
              <div className="h-4.5 w-36 rounded-md shimmer-box" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Contact Information Section Shimmer */}
      <div className="w-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-full shimmer-box shrink-0" />
          <div className="h-6 w-40 rounded-lg shimmer-box" />
        </div>
        <div className="pt-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded shimmer-box" />
            <div className="h-3 w-48 rounded shimmer-box" />
          </div>
          <div className="h-9 w-28 rounded-full shimmer-box" />
        </div>
      </div>
    </div>
  );
};

export const ViewProfileSkeleton = memo(ViewProfileSkeletonComponent);
ViewProfileSkeleton.displayName = "ViewProfileSkeleton";
