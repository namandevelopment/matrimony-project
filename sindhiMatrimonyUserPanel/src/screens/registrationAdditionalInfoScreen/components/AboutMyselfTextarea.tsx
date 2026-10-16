"use client";

import React, { memo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface AboutMyselfTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  minCharacters?: number;
}

export const AboutMyselfTextarea: React.FC<AboutMyselfTextareaProps> = memo(
  ({
    value,
    onChange,
    error,
    placeholder = "Write a few words about your personality, background, education, and what you are looking for in a life partner...",
    minCharacters = 50,
  }) => {
    const charCount = value.trim().length;
    const isValidLength = charCount >= minCharacters;

    const appendSnippet = (text: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        onChange(text);
      } else {
        onChange(`${trimmed} ${text}`);
      }
    };

    return (
      <div className="w-full text-left">
        {/* Simple Label on top */}
        <div className="flex items-center justify-between mb-2 select-none">
          <label
            htmlFor="about-myself-textarea"
            className="block text-xs sm:text-sm font-semibold text-stone-700"
          >
            A few words about myself
          </label>
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              isValidLength ? "text-[#28A745]" : "text-stone-500"
            }`}
          >
            {isValidLength && <CheckCircle2 className="w-3.5 h-3.5" />}
            {charCount} / {minCharacters} min
          </span>
        </div>

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            id="about-myself-textarea"
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white p-3.5 sm:p-4 text-sm sm:text-base text-[#1A1A1A] placeholder:text-stone-400 outline-none transition-all resize-y ${
              error
                ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                : "border-stone-300 focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745]"
            }`}
          />
        </div>

        {/* Helper row: Minimum 50 characters */}
        <div className="flex items-center justify-between mt-1.5 px-0.5">
          <p className="text-xs text-stone-500 font-normal">
            Minimum {minCharacters} characters
          </p>

          {/* Quick suggestions to help user write 50+ chars easily */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                appendSnippet(
                  "I value family traditions, enjoy traveling, and look for an understanding partner."
                )
              }
              className="text-stone-500 hover:text-[#DB2F3C] cursor-pointer hover:underline text-[11px]"
            >
              + Add interests
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() =>
                appendSnippet(
                  "Looking for a supportive companion from a cultured Sindhi family."
                )
              }
              className="text-stone-500 hover:text-[#DB2F3C] cursor-pointer hover:underline text-[11px]"
            >
              + Add partner preference
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1.5 pl-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

AboutMyselfTextarea.displayName = "AboutMyselfTextarea";
