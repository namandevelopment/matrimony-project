"use client";

import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp, Search, AlertCircle } from "lucide-react";

export interface CasteSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const SINDHI_CASTES = [
  "Sindhi - Bhaiband",
  "Sindhi - Amil",
  "Sindhi - Lohana",
  "Sindhi - Sahiti",
  "Sindhi - Larkana",
  "Sindhi - Sakhar",
  "Sindhi - Dadu",
  "Sindhi - Shikarpuri",
  "Sindhi - Thari",
  "Sindhi - Sehwani",
  "Sindhi - Hyderabadi",
  "Sindhi - Bhatia",
  "Sindhi - Brahmins (Pokharna, Saraswat)",
  "Sindhi - Chhapru",
  "Sindhi - Others",
  "Caste No Bar",
];

export const CasteSelect: React.FC<CasteSelectProps> = memo(
  ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto focus search input when opened
    useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else {
        setSearchQuery("");
      }
    }, [isOpen]);

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

    // Filter castes based on search query
    const filteredCastes = useMemo(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return SINDHI_CASTES;
      return SINDHI_CASTES.filter((caste) =>
        caste.toLowerCase().includes(q)
      );
    }, [searchQuery]);

    const handleSelect = useCallback(
      (caste: string) => {
        onChange(caste);
        setIsOpen(false);
      },
      [onChange]
    );

    return (
      <div ref={containerRef} className="w-full text-left relative">
        {/* Closed state: standard input button */}
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            className={`w-full h-11 sm:h-12 px-4 rounded-xl border text-sm sm:text-base font-normal flex items-center justify-between transition-colors cursor-pointer bg-white ${
              value
                ? "border-stone-800 text-[#1A1A1A]"
                : "border-stone-300 text-stone-500 hover:border-stone-400"
            }`}
          >
            <span className={value ? "text-[#1A1A1A] font-medium" : "text-stone-500"}>
              {value || "Select caste"}
            </span>
            <ChevronDown className="w-4 h-4 text-stone-700 shrink-0" />
          </button>
        ) : (
          /* Open state (Matches Screenshot 3 exactly with green border wrapper) */
          <div className="w-full rounded-xl border border-[#28A745] bg-white shadow-lg overflow-hidden transition-all">
            {/* Header / Active Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full h-11 sm:h-12 px-4 flex items-center justify-between text-sm sm:text-base text-stone-700 font-normal cursor-pointer bg-white"
            >
              <span>{value || "Select caste"}</span>
              <ChevronUp className="w-4 h-4 text-stone-700 shrink-0" />
            </button>

            {/* Divider */}
            <div className="border-t border-[#28A745]/30" />

            {/* Search Input Box */}
            <div className="p-3 bg-white">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search caste"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-stone-200 text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#28A745] bg-white"
                />
              </div>
            </div>

            {/* Caste Options List */}
            <div className="border-t border-stone-100 max-h-56 overflow-y-auto py-1">
              {filteredCastes.length === 0 ? (
                <div className="px-4 py-3 text-xs text-stone-500 text-center">
                  No caste found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredCastes.map((caste) => {
                  const isSelected = value === caste;
                  return (
                    <button
                      key={caste}
                      type="button"
                      onClick={() => handleSelect(caste)}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 text-[#28A745] font-semibold"
                          : "text-stone-800 hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <span>{caste}</span>
                    </button>
                  );
                })
              )}
            </div>
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

CasteSelect.displayName = "CasteSelect";
