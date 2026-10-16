"use client";

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ReligionSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RELIGIONS = [
  "Hindu",
  "Sikh",
  "Jain",
  "Parsi",
  "Buddhist",
  "Christian",
  "Jewish",
  "Spiritual - not religious",
  "Other",
];

export const ReligionSelect: React.FC<ReligionSelectProps> = memo(
  ({ value = "Hindu", onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSelect = useCallback(
      (rel: string) => {
        onChange(rel);
        setIsOpen(false);
      },
      [onChange]
    );

    return (
      <div ref={containerRef} className="w-full text-left relative">
        {/* Floating/Fieldset style box matching Screenshot 1 */}
        <div className="relative">
          <label className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-xs font-semibold text-stone-600 z-10">
            Religion
          </label>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className={`w-full h-11 sm:h-12 px-4 rounded-xl border text-sm sm:text-base font-medium flex items-center justify-between transition-colors cursor-pointer bg-white ${
              isOpen
                ? "border-[#28A745] ring-1 ring-[#28A745]"
                : "border-stone-300 text-[#1A1A1A] hover:border-stone-400"
            }`}
          >
            <span>{value || "Hindu"}</span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-700 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-700 shrink-0" />
            )}
          </button>
        </div>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-xl border border-stone-200 shadow-xl py-1 max-h-56 overflow-y-auto z-40">
            {RELIGIONS.map((rel) => {
              const isSelected = value === rel;
              return (
                <button
                  key={rel}
                  type="button"
                  onClick={() => handleSelect(rel)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-50 text-[#28A745] font-semibold"
                      : "text-stone-800 hover:bg-[#F3F4F6]"
                  }`}
                >
                  <span>{rel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

ReligionSelect.displayName = "ReligionSelect";
