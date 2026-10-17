"use client";

import React, { memo, useState, useCallback } from "react";
import { ArrowLeftRight, ChevronRight, ChevronLeft } from "lucide-react";

export interface LanguagesDualListBoxProps {
  allLanguages: string[];
  selectedLanguages: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

const LanguagesDualListBoxComponent: React.FC<LanguagesDualListBoxProps> = ({
  allLanguages,
  selectedLanguages,
  onChange,
  className = "",
}) => {
  const [highlightedLeft, setHighlightedLeft] = useState<string | null>(null);
  const [highlightedRight, setHighlightedRight] = useState<string | null>(null);

  // Available languages: all languages minus already selected ones
  const availableLanguages = allLanguages.filter(
    (lang) => !selectedLanguages.includes(lang)
  );

  // Double click on left item to select
  const handleLeftDoubleClick = useCallback(
    (lang: string) => {
      if (!selectedLanguages.includes(lang)) {
        onChange([...selectedLanguages, lang]);
        setHighlightedLeft(null);
      }
    },
    [selectedLanguages, onChange]
  );

  // Double click on right item to deselect
  const handleRightDoubleClick = useCallback(
    (lang: string) => {
      onChange(selectedLanguages.filter((item) => item !== lang));
      setHighlightedRight(null);
    },
    [selectedLanguages, onChange]
  );

  // Single click select button (move left to right)
  const handleMoveRight = useCallback(() => {
    if (highlightedLeft && !selectedLanguages.includes(highlightedLeft)) {
      onChange([...selectedLanguages, highlightedLeft]);
      setHighlightedLeft(null);
    }
  }, [highlightedLeft, selectedLanguages, onChange]);

  // Single click deselect button (move right to left)
  const handleMoveLeft = useCallback(() => {
    if (highlightedRight) {
      onChange(selectedLanguages.filter((item) => item !== highlightedRight));
      setHighlightedRight(null);
    }
  }, [highlightedRight, selectedLanguages, onChange]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        {/* Left Box: Available Languages */}
        <div className="w-full sm:w-[200px] flex flex-col">
          <div className="h-36 sm:h-40 border border-stone-300 rounded-lg bg-white overflow-y-auto shadow-inner select-none focus:outline-hidden focus:ring-1 focus:ring-[#DB2F3C]">
            {availableLanguages.length === 0 ? (
              <div className="p-3 text-[11.5px] text-stone-400 italic text-center mt-8">
                All languages selected
              </div>
            ) : (
              availableLanguages.map((lang) => {
                const isSelected = highlightedLeft === lang;
                return (
                  <div
                    key={lang}
                    onClick={() => {
                      setHighlightedLeft(lang);
                      setHighlightedRight(null);
                    }}
                    onDoubleClick={() => handleLeftDoubleClick(lang)}
                    className={`px-3 py-1.5 text-xs sm:text-[13px] cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white font-medium"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {lang}
                  </div>
                );
              })
            )}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 leading-tight">
            Double click on the values to select.
          </span>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex sm:flex-col items-center justify-center gap-1.5 py-1">
          <button
            type="button"
            onClick={handleMoveRight}
            disabled={!highlightedLeft}
            className={`p-1.5 rounded-md border text-stone-600 transition-colors ${
              highlightedLeft
                ? "bg-stone-100 hover:bg-[#DB2F3C] hover:text-white border-stone-300 cursor-pointer"
                : "opacity-40 cursor-not-allowed border-stone-200"
            }`}
            title="Move to Selected"
            aria-label="Add language"
          >
            <ChevronRight className="w-4 h-4 hidden sm:block" />
            <ArrowLeftRight className="w-4 h-4 sm:hidden" />
          </button>

          <button
            type="button"
            onClick={handleMoveLeft}
            disabled={!highlightedRight}
            className={`p-1.5 rounded-md border text-stone-600 transition-colors ${
              highlightedRight
                ? "bg-stone-100 hover:bg-[#DB2F3C] hover:text-white border-stone-300 cursor-pointer"
                : "opacity-40 cursor-not-allowed border-stone-200"
            }`}
            title="Remove from Selected"
            aria-label="Remove language"
          >
            <ChevronLeft className="w-4 h-4 hidden sm:block" />
          </button>
        </div>

        {/* Right Box: Selected Languages */}
        <div className="w-full sm:w-[200px] flex flex-col">
          <div className="h-36 sm:h-40 border border-stone-300 rounded-lg bg-white overflow-y-auto shadow-inner select-none focus:outline-hidden focus:ring-1 focus:ring-[#DB2F3C]">
            {selectedLanguages.length === 0 ? (
              <div className="p-3 text-[11.5px] text-stone-400 italic text-center mt-8">
                No languages added yet
              </div>
            ) : (
              selectedLanguages.map((lang) => {
                const isSelected = highlightedRight === lang;
                return (
                  <div
                    key={lang}
                    onClick={() => {
                      setHighlightedRight(lang);
                      setHighlightedLeft(null);
                    }}
                    onDoubleClick={() => handleRightDoubleClick(lang)}
                    className={`px-3 py-1.5 text-xs sm:text-[13px] cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white font-medium"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {lang}
                  </div>
                );
              })
            )}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 leading-tight">
            Double click on the values to deselect.
          </span>
        </div>
      </div>
    </div>
  );
};

export const LanguagesDualListBox = memo(LanguagesDualListBoxComponent);
LanguagesDualListBox.displayName = "LanguagesDualListBox";
