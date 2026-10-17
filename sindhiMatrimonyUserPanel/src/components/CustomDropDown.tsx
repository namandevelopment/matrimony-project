"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  memo,
} from "react";
import { ChevronDown, ChevronUp, Search, AlertCircle, Check, X } from "lucide-react";
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
  /** For single-select: string | number. For multi-select: string[] | number[] | (string | number)[] */
  value?: string | number | (string | number)[];
  /** Callback fired when selection changes. Passes string in single-select, or string[] in multi-select */
  onChange?: (value: any) => void;
  /** Dedicated callback for multi-select returning array of selected values */
  onMultiChange?: (values: string[]) => void;
  options: (string | number | DropdownOption)[];
  /** Enable multi-select functionality */
  isMultiSelect?: boolean;
  /** Alias for isMultiSelect */
  multiple?: boolean;
  /** Maximum number of tags to display inside closed trigger before showing '+X more' (default: 3) */
  maxSelectedDisplay?: number;
  /** Whether to show a clear all button when items are selected (default: true for multi-select) */
  clearable?: boolean;
  /** Show "Select All" / "Clear All" bar in multi-select popover (default: true) */
  showSelectAll?: boolean;
  /** Enable search input inside dropdown */
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Active theme color: "brand" (red, default) | "green" (emerald) | "stone" (neutral) */
  activeColor?: "brand" | "green" | "stone";
  /** Highlight border green when open (backward compatibility, defaults to false) */
  activeGreenBorder?: boolean;
  containerClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: "sm" | "md" | "lg";
}

const CustomDropDownComponent = forwardRef<HTMLDivElement, CustomDropDownProps>(
  (
    {
      id,
      label,
      placeholder = "Select an option",
      value,
      onChange,
      onMultiChange,
      options,
      isMultiSelect = false,
      multiple = false,
      maxSelectedDisplay = 3,
      clearable,
      showSelectAll = true,
      searchable = false,
      searchPlaceholder = "Search...",
      error,
      helperText,
      disabled = false,
      readOnly = false,
      required = false,
      activeColor = "brand",
      activeGreenBorder = false,
      containerClassName,
      triggerClassName,
      menuClassName,
      size = "lg",
    },
    ref
  ) => {
    const isMulti = Boolean(isMultiSelect || multiple);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Resolve color theme: defaults to signature brand red (#DB2F3C)
    const resolvedColor: "brand" | "green" | "stone" =
      activeColor || (activeGreenBorder ? "green" : "brand");

    // Normalize options to DropdownOption format (handles strings, numbers, or objects)
    const normalizedOptions: DropdownOption[] = useMemo(() => {
      return options.map((opt) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return { label: String(opt), value: String(opt) };
        }
        return opt;
      });
    }, [options]);

    // Parse multi-select values
    const multiValues: string[] = useMemo(() => {
      if (!isMulti) return [];
      if (Array.isArray(value)) {
        return value.map(String);
      }
      if (value !== undefined && value !== null && value !== "") {
        return [String(value)];
      }
      return [];
    }, [isMulti, value]);

    // Single-select string value
    const stringVal = !isMulti && value !== undefined && value !== null ? String(value) : "";

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

    // Scroll to first selected item when opened
    useEffect(() => {
      if (isOpen && listRef.current) {
        const targetValue = isMulti ? multiValues[0] : stringVal;
        if (targetValue) {
          const selectedIndex = normalizedOptions.findIndex((o) => o.value === targetValue);
          if (selectedIndex !== -1) {
            const itemHeight = size === "sm" ? 34 : 38;
            listRef.current.scrollTop = Math.max(0, selectedIndex * itemHeight - 70);
          }
        }
      }
    }, [isOpen, isMulti, multiValues, stringVal, normalizedOptions, size]);

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

    // Single-select action
    const handleSingleSelect = useCallback(
      (val: string) => {
        if (disabled || readOnly) return;
        (onChange as ((val: string) => void) | undefined)?.(val);
        setIsOpen(false);
      },
      [disabled, readOnly, onChange]
    );

    // Multi-select toggle action
    const handleToggleMulti = useCallback(
      (optValue: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled || readOnly) return;
        const alreadySelected = multiValues.includes(optValue);
        const nextValues = alreadySelected
          ? multiValues.filter((v) => v !== optValue)
          : [...multiValues, optValue];

        onMultiChange?.(nextValues);
        (onChange as ((vals: string[]) => void) | undefined)?.(nextValues);
      },
      [disabled, readOnly, multiValues, onMultiChange, onChange]
    );

    // Remove single chip in multi-select trigger
    const handleRemoveChip = useCallback(
      (optValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled || readOnly) return;
        const nextValues = multiValues.filter((v) => v !== optValue);
        onMultiChange?.(nextValues);
        (onChange as ((vals: string[]) => void) | undefined)?.(nextValues);
      },
      [disabled, readOnly, multiValues, onMultiChange, onChange]
    );

    // Clear all selected items
    const handleClearAll = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled || readOnly) return;
        if (isMulti) {
          onMultiChange?.([]);
          (onChange as ((vals: string[]) => void) | undefined)?.([]);
        } else {
          (onChange as ((val: string) => void) | undefined)?.("");
        }
      },
      [disabled, readOnly, isMulti, onMultiChange, onChange]
    );

    // Select all options in multi-select mode
    const handleSelectAll = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled || readOnly) return;
        const allVals = normalizedOptions.map((o) => o.value);
        onMultiChange?.(allVals);
        (onChange as ((vals: string[]) => void) | undefined)?.(allVals);
      },
      [disabled, readOnly, normalizedOptions, onMultiChange, onChange]
    );

    const toggleOpen = useCallback(() => {
      if (disabled || readOnly) return;
      setIsOpen((prev) => !prev);
    }, [disabled, readOnly]);

    // Selected option label for single select
    const selectedOption = normalizedOptions.find((opt) => opt.value === stringVal);
    const displayLabel = selectedOption ? selectedOption.label : stringVal;

    // Selected options list for multi select
    const selectedOptionsList = useMemo(() => {
      if (!isMulti) return [];
      return multiValues
        .map((val) => normalizedOptions.find((o) => o.value === val) || { label: val, value: val })
        .filter(Boolean);
    }, [isMulti, multiValues, normalizedOptions]);

    const displayedChips = selectedOptionsList.slice(0, maxSelectedDisplay);
    const remainingCount = Math.max(0, selectedOptionsList.length - maxSelectedDisplay);

    const hasSelection = isMulti ? multiValues.length > 0 : Boolean(stringVal);
    const shouldShowClear = Boolean(clearable ?? (isMulti && hasSelection));

    // Size height classes
    const sizeClasses = {
      sm: isMulti && hasSelection ? "min-h-9 py-1 text-xs px-2.5" : "h-9 text-xs px-3",
      md: isMulti && hasSelection ? "min-h-10 py-1.5 text-xs sm:text-sm px-3" : "h-10 sm:h-10.5 text-xs sm:text-sm px-3.5",
      lg: isMulti && hasSelection ? "min-h-11 py-1.5 text-sm sm:text-base px-3.5" : "h-11 sm:h-12 text-sm sm:text-base px-4",
    };

    return (
      <div
        ref={containerRef}
        id={id}
        className={cn(
          "w-full text-left relative flex flex-col gap-1",
          isOpen && "z-30",
          containerClassName
        )}
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
                ? resolvedColor === "brand"
                  ? "border-[#DB2F3C] ring-1 ring-[#DB2F3C]"
                  : resolvedColor === "green"
                  ? "border-[#28A745] ring-1 ring-[#28A745]"
                  : "border-stone-800 ring-1 ring-stone-800/20"
                : hasSelection
                ? "border-stone-300 hover:border-stone-400 text-[#1A1A1A]"
                : "border-stone-300 text-stone-500 hover:border-stone-400",
              triggerClassName
            )}
          >
            {/* Display Area */}
            <div className="flex-1 min-w-0 pr-2">
              {isMulti ? (
                multiValues.length === 0 ? (
                  <span className="text-stone-500 truncate block">
                    {placeholder}
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {displayedChips.map((opt) => (
                      <span
                        key={opt.value}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors border",
                          size === "sm" ? "text-[11px]" : "text-xs",
                          resolvedColor === "brand"
                            ? "bg-red-50 text-[#DB2F3C] border-red-200/80"
                            : resolvedColor === "green"
                            ? "bg-emerald-50 text-[#28A745] border-emerald-200/80"
                            : "bg-stone-100 text-stone-800 border-stone-200"
                        )}
                      >
                        <span className="truncate max-w-[120px]">{opt.label}</span>
                        {!disabled && !readOnly && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleRemoveChip(opt.value, e)}
                            className="p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                            title={`Remove ${opt.label}`}
                          >
                            <X className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </span>
                    ))}
                    {remainingCount > 0 && (
                      <span
                        className={cn(
                          "rounded-md font-bold px-1.5 py-0.5 bg-stone-100 text-stone-700",
                          size === "sm" ? "text-[10px]" : "text-xs"
                        )}
                      >
                        +{remainingCount} more
                      </span>
                    )}
                  </div>
                )
              ) : (
                <span
                  className={cn(
                    "truncate block",
                    stringVal ? "text-[#1A1A1A] font-medium" : "text-stone-500"
                  )}
                >
                  {displayLabel || placeholder}
                </span>
              )}
            </div>

            {/* Right Icons: Clear + Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              {shouldShowClear && !disabled && !readOnly && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClearAll}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Clear selection"
                >
                  <X className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
                </span>
              )}

              {readOnly ? (
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  Default
                </span>
              ) : isOpen ? (
                <ChevronUp className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", "text-stone-700")} />
              ) : (
                <ChevronDown className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", "text-stone-700")} />
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
                <div className={cn("bg-white border-b border-stone-100", size === "sm" ? "p-2" : "p-2.5")}>
                  <div className="relative flex items-center">
                    <Search
                      className={cn(
                        "text-stone-400 absolute pointer-events-none",
                        size === "sm" ? "w-3.5 h-3.5 left-2.5" : "w-4 h-4 left-3"
                      )}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className={cn(
                        "w-full rounded-lg border border-stone-200 text-[#1A1A1A] placeholder-stone-400 focus:outline-none bg-white",
                        size === "sm" ? "h-8 text-xs pl-8 pr-2.5" : "h-10 text-sm pl-9 pr-3",
                        resolvedColor === "brand"
                          ? "focus:border-[#DB2F3C] focus:ring-1 focus:ring-[#DB2F3C]"
                          : resolvedColor === "green"
                          ? "focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745]"
                          : "focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Multi-Select Action Bar (Select All / Clear All) */}
              {isMulti && showSelectAll && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-stone-50 border-b border-stone-100 text-[11.5px]">
                  <span className="text-stone-600 font-medium">
                    {multiValues.length} of {normalizedOptions.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[#DB2F3C] font-semibold hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-stone-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-stone-500 hover:text-stone-800 font-semibold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
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
                    const isSelected = isMulti
                      ? multiValues.includes(opt.value)
                      : opt.value === stringVal;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={
                          isMulti
                            ? (e) => handleToggleMulti(opt.value, e)
                            : () => handleSingleSelect(opt.value)
                        }
                        className={cn(
                          "w-full text-left font-medium transition-colors cursor-pointer flex items-center justify-between",
                          size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
                          isSelected
                            ? resolvedColor === "brand"
                              ? "bg-red-50 text-[#DB2F3C] font-semibold"
                              : resolvedColor === "green"
                              ? "bg-emerald-50 text-[#28A745] font-semibold"
                              : "bg-stone-100 text-stone-900 font-semibold"
                            : "text-stone-800 hover:bg-[#F3F4F6]"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          {/* Multi-Select Checkbox Box */}
                          {isMulti && (
                            <div
                              className={cn(
                                "w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors border",
                                isSelected
                                  ? resolvedColor === "brand"
                                    ? "bg-[#DB2F3C] border-[#DB2F3C] text-white"
                                    : resolvedColor === "green"
                                    ? "bg-[#28A745] border-[#28A745] text-white"
                                    : "bg-stone-800 border-stone-800 text-white"
                                  : "border-stone-300 bg-white"
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          )}

                          <span className="truncate">{opt.label}</span>
                        </div>

                        {/* Optional badge or single-select check */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {opt.badge && (
                            <span className="text-[11px] font-bold text-[#DB2F3C] bg-red-50 px-2 py-0.5 rounded-full">
                              {opt.badge}
                            </span>
                          )}
                          {!isMulti && isSelected && (
                            <Check
                              className={cn(
                                size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
                                resolvedColor === "brand"
                                  ? "text-[#DB2F3C]"
                                  : resolvedColor === "green"
                                  ? "text-[#28A745]"
                                  : "text-stone-900",
                                "shrink-0"
                              )}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Multi-Select Bottom 'Done' Button */}
              {isMulti && (
                <div className="p-2 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
                  <span className="text-[11.5px] text-stone-600 font-medium pl-1">
                    {multiValues.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-1 rounded-lg bg-[#DB2F3C] hover:bg-[#C22430] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
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
CustomDropDownComponent.displayName = "CustomDropDownComponent";

export const CustomDropDown = memo(CustomDropDownComponent);
CustomDropDown.displayName = "CustomDropDown";
export default CustomDropDown;
