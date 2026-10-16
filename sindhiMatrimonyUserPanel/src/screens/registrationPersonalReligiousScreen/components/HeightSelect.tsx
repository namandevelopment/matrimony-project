"use client";

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export interface HeightSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Heights list matching matrimony standard formats: e.g. "5 ft 10 in (177 cm)"
const HEIGHT_OPTIONS: string[] = [
  "4 ft 6 in (137 cm)",
  "4 ft 7 in (140 cm)",
  "4 ft 8 in (142 cm)",
  "4 ft 9 in (145 cm)",
  "4 ft 10 in (147 cm)",
  "4 ft 11 in (150 cm)",
  "5 ft (152 cm)",
  "5 ft 1 in (155 cm)",
  "5 ft 2 in (157 cm)",
  "5 ft 3 in (160 cm)",
  "5 ft 4 in (162 cm)",
  "5 ft 5 in (165 cm)",
  "5 ft 6 in (167 cm)",
  "5 ft 7 in (170 cm)",
  "5 ft 8 in (172 cm)",
  "5 ft 9 in (175 cm)",
  "5 ft 10 in (177 cm)",
  "5 ft 11 in (180 cm)",
  "6 ft (182 cm)",
  "6 ft 1 in (185 cm)",
  "6 ft 2 in (187 cm)",
  "6 ft 3 in (190 cm)",
  "6 ft 4 in (193 cm)",
  "6 ft 5 in (195 cm)",
  "6 ft 6 in (198 cm)",
  "6 ft 7 in (200 cm)",
  "6 ft 8 in (203 cm)",
  "6 ft 9 in (205 cm)",
  "6 ft 10 in (208 cm)",
  "6 ft 11 in (210 cm)",
  "7 ft (213 cm)",
];

export const HeightSelect: React.FC<HeightSelectProps> = memo(
  ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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

    // Scroll to selected height when opened
    useEffect(() => {
      if (isOpen && listRef.current && value) {
        const selectedIndex = HEIGHT_OPTIONS.indexOf(value);
        if (selectedIndex !== -1) {
          const itemHeight = 40;
          listRef.current.scrollTop = Math.max(0, selectedIndex * itemHeight - 80);
        }
      }
    }, [isOpen, value]);

    const handleSelect = useCallback(
      (height: string) => {
        onChange(height);
        setIsOpen(false);
      },
      [onChange]
    );

    return (
      <div ref={containerRef} className="w-full text-left relative">
        <label className="block text-sm sm:text-base font-bold text-[#1A1A1A] mb-1.5">
          Height
        </label>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={`w-full h-11 sm:h-12 px-4 rounded-xl border text-sm sm:text-base font-normal flex items-center justify-between transition-colors cursor-pointer bg-white ${
            isOpen
              ? "border-[#28A745] ring-1 ring-[#28A745]"
              : value
              ? "border-stone-800 text-[#1A1A1A]"
              : "border-stone-300 text-stone-500 hover:border-stone-400"
          }`}
        >
          <span className={value ? "text-[#1A1A1A] font-medium" : "text-stone-500"}>
            {value || "Select your height"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-700 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-700 shrink-0" />
          )}
        </button>

        {/* Dropdown Menu (Matches Screenshot 2) */}
        {isOpen && (
          <div
            ref={listRef}
            className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-xl border border-[#28A745]/60 shadow-xl py-1 max-h-56 overflow-y-auto z-40"
          >
            {HEIGHT_OPTIONS.map((height) => {
              const isSelected = value === height;
              return (
                <button
                  key={height}
                  type="button"
                  onClick={() => handleSelect(height)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-stone-100 font-bold text-[#28A745]"
                      : "text-stone-800 hover:bg-[#F3F4F6]"
                  }`}
                >
                  <span>{height}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

HeightSelect.displayName = "HeightSelect";
