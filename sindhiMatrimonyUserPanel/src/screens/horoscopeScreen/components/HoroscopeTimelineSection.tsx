"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

export interface HoroscopeTimelineSectionProps {
  id?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  editSectionKey?: string;
  onEdit?: () => void;
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

const HoroscopeTimelineSectionComponent: React.FC<HoroscopeTimelineSectionProps> = ({
  id,
  icon,
  iconBgColor = "bg-sky-500",
  title,
  editSectionKey,
  onEdit,
  children,
  isLast = false,
  className = "",
}) => {
  return (
    <div id={id} className={`relative flex items-start gap-4 sm:gap-6 ${className}`}>
      {/* Left Timeline Column: Icon Badge + Vertical Line */}
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${iconBgColor} text-white flex items-center justify-center shadow-xs z-10 shrink-0 select-none`}
        >
          {icon}
        </div>

        {/* Vertical line connecting to next item */}
        {!isLast && (
          <div className="w-[2px] bg-stone-200 flex-1 my-1 self-center" />
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 pb-9 sm:pb-11 min-w-0">
        {/* Section Header: Title & Edit Button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-stone-800 tracking-tight">
            {title}
          </h2>

          {editSectionKey ? (
            <Link
              href={`/profile/edit?section=${editSectionKey}`}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#DB2F3C] hover:text-[#B71F2A] transition-colors py-0.5 px-2 rounded-md hover:bg-red-50"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          ) : onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#DB2F3C] hover:text-[#B71F2A] transition-colors py-0.5 px-2 rounded-md hover:bg-red-50"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : null}
        </div>

        {/* Section Body */}
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
};

export const HoroscopeTimelineSection = memo(HoroscopeTimelineSectionComponent);
HoroscopeTimelineSection.displayName = "HoroscopeTimelineSection";
