"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, forwardRef } from "react";
import { ChevronDown, ChevronUp, Search, AlertCircle, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DropdownOption {
  label: string;
  value: string;
  badge?: string;
}

export interface CustomDropDownProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: (string | DropdownOption)[];
  /** Enable search input inside dropdown */
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Highlight border green when open */
  activeGreenBorder?: boolean;
  containerClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: "sm" | "md" | "lg";
}

export const CustomDropDown = forwardRef<HTMLDivElement, CustomDropDownProps>(
  (
    {
      id,
      label,
      placeholder = "Select an option",
      value,
      onChange,
      options,
      searchable = false,
      searchPlaceholder = "Search...",
      error,
      helperText,
      disabled = false,
      readOnly = false,
      required = false,
      activeGreenBorder = true,
      containerClassName,
      triggerClassName,
      menuClassName,
      size = "lg",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Normalize options to DropdownOption format
    const normalizedOptions: DropdownOption[] = useMemo(() => {
      return options.map((opt) => {
        if (typeof opt === "string") {
          return { label: opt, value: opt };
        }
        return opt;
      });
    }, [options]);

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
    }, [containerRef]);

    // Close on Escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else if (!isOpen) {
        setSearchQuery("");
      }
    }, [isOpen, searchable]);

    // Scroll to selected item when opened
    useEffect(() => {
      if (isOpen && listRef.current && value) {
        const selectedIndex = normalizedOptions.findIndex((o) => o.value === value);
        if (selectedIndex !== -1) {
          const itemHeight = 38;
          listRef.current.scrollTop = Math.max(0, selectedIndex * itemHeight - 70);
        }
      }
    }, [isOpen, value, normalizedOptions]);

    // Filter options by search query
    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return normalizedOptions;
      const q = searchQuery.toLowerCase().trim();
      return normalizedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(q) ||
          opt.value.toLowerCase().includes(q)
      );
    }, [normalizedOptions, searchQuery]);

    const handleSelect = useCallback(
      (val: string) => {
        if (disabled || readOnly) return;
        onChange?.(val);
        setIsOpen(false);
      },
      [disabled, readOnly, onChange]
    );

    const toggleOpen = useCallback(() => {
      if (disabled || readOnly) return;
      setIsOpen((prev) => !prev);
    }, [disabled, readOnly]);

    // Selected option label
    const selectedOption = normalizedOptions.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : value;

    // Size height matching CustomTextInput exactly
    const sizeClasses = {
      sm: "h-9 text-xs px-3",
      md: "h-11 sm:h-12 text-sm sm:text-base px-4",
      lg: "h-11 sm:h-12 text-sm sm:text-base px-4",
    };

    return (
      <div
        ref={containerRef}
        id={id}
        className={cn("w-full text-left relative flex flex-col gap-1", containerClassName)}
      >
        {/* Simple Standard Label above Dropdown */}
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1 select-none">
            {label}
            {required && (
              <span className="text-[#DB2F3C] ml-1 font-bold" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Dropdown Container */}
        <div className="relative w-full">
          {/* Trigger Button */}
          <button
            type="button"
            onClick={toggleOpen}
            disabled={disabled}
            aria-expanded={isOpen}
            className={cn(
              "w-full rounded-xl border text-left font-normal flex items-center justify-between transition-colors bg-white",
              sizeClasses[size],
              disabled && "opacity-60 cursor-not-allowed bg-stone-50",
              readOnly && "cursor-default bg-stone-50/50",
              !disabled && !readOnly && "cursor-pointer",
              error
                ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                : isOpen
                ? activeGreenBorder
                  ? "border-[#28A745] ring-1 ring-[#28A745]"
                  : "border-stone-800"
                : value
                ? "border-stone-400 hover:border-stone-600 text-[#1A1A1A]"
                : "border-stone-300 text-stone-500 hover:border-stone-400",
              triggerClassName
            )}
          >
            <span
              className={cn(
                "truncate",
                value ? "text-[#1A1A1A] font-medium" : "text-stone-500"
              )}
            >
              {displayLabel || placeholder}
            </span>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {readOnly ? (
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  Default
                </span>
              ) : isOpen ? (
                <ChevronUp className="w-4 h-4 text-stone-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-700" />
              )}
            </div>
          </button>

          {/* Unified Dropdown Menu Popover */}
          {isOpen && !readOnly && !disabled && (
            <div
              className={cn(
                "absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100",
                menuClassName
              )}
            >
              {/* Search Box if Searchable */}
              {searchable && (
                <div className="p-2.5 bg-white border-b border-stone-100">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-stone-200 text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div ref={listRef} className="max-h-56 overflow-y-auto py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-stone-500 text-center">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between",
                          isSelected
                            ? "bg-emerald-50 text-[#28A745] font-semibold"
                            : "text-stone-800 hover:bg-[#F3F4F6]"
                        )}
                      >
                        <span>{opt.label}</span>
                        <div className="flex items-center gap-1.5">
                          {opt.badge && (
                            <span className="text-[11px] font-bold text-[#DB2F3C] bg-red-50 px-2 py-0.5 rounded-full">
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#28A745] shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error or Helper Text */}
        {error ? (
          <p className="flex items-center gap-1 text-xs text-red-600 font-medium animate-fade-in mt-0.5 pl-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-stone-500 font-normal mt-0.5 pl-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

CustomDropDown.displayName = "CustomDropDown";
