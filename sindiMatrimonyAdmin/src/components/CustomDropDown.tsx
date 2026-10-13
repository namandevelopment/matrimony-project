import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';

export type DropDownSize = 'sm' | 'md' | 'lg';
export type DropDownVariant = 'default' | 'filled' | 'outline';
export type DropDownPlacement = 'bottom' | 'top';

export interface CustomDropDownOption {
  /** Label displayed for the option */
  label: string;
  /** Value stored / emitted on select */
  value: string | number;
  /** Optional icon displayed next to the option */
  icon?: React.ReactNode;
  /** Optional subtitle or description below the label */
  description?: string;
  /** Disables selection for this option */
  disabled?: boolean;
  /** Optional badge tag (e.g. "Popular", "New", "Admin") */
  badge?: string;
}

export interface CustomDropDownProps {
  /** Label displayed above the dropdown */
  label?: React.ReactNode;
  /** Displays a red asterisk (*) next to label */
  required?: boolean;
  /** Optional badge next to label (e.g. "(Optional)") */
  optionalBadge?: React.ReactNode;
  /** List of options (can be strings or CustomDropDownOption objects) */
  options: Array<CustomDropDownOption | string>;
  /** Selected value */
  value?: string | number | null;
  /** Callback when an option is selected */
  onChange?: (value: string | number, option: CustomDropDownOption) => void;
  /** Placeholder when no option is selected */
  placeholder?: string;
  /** Leading icon inside the select trigger box on the left */
  icon?: React.ReactNode;
  /** Validation error message */
  error?: string;
  /** Informational helper text displayed below the box */
  helperText?: string;
  /** Disables the dropdown */
  disabled?: boolean;
  /** Enables a fast search bar inside the dropdown popup for large lists */
  searchable?: boolean;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Shows a clear button (X) when a value is selected */
  clearable?: boolean;
  /** Callback fired when the selection is cleared */
  onClear?: () => void;
  /** Size variant */
  size?: DropDownSize;
  /** Visual theme variant */
  variant?: DropDownVariant;
  /**
   * Placement of the dropdown menu:
   * 'bottom' (default): opens directly below the trigger box (never overlaps the trigger)
   * 'top': opens directly above the trigger box
   */
  placement?: DropDownPlacement;
  /** Max height class for the scrollable list (e.g. 'max-h-60') */
  maxHeight?: string;
  /** Custom empty state message when search yields no results */
  emptyMessage?: string;
  /** Custom className for the root container */
  containerClassName?: string;
  /** Custom className for the trigger button */
  triggerClassName?: string;
  /** Custom className for the dropdown menu popup */
  menuClassName?: string;
  /** Custom className for the label */
  labelClassName?: string;
  /** Custom className for the error message */
  errorClassName?: string;
  /** Custom className for the helper text */
  helperClassName?: string;
  /** Form input name for native form submission support */
  name?: string;
  /** ID for accessibility */
  id?: string;
}

export const CustomDropDown: React.FC<CustomDropDownProps> = ({
  label,
  required = false,
  optionalBadge,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  icon,
  error,
  helperText,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  clearable = false,
  onClear,
  size = 'md',
  variant = 'default',
  placement = 'bottom',
  maxHeight = 'max-h-64',
  emptyMessage = 'No options found',
  containerClassName = '',
  triggerClassName = '',
  menuClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  name,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const generatedId = useId();
  const dropdownId = id || generatedId;
  const hasError = Boolean(error);

  // Normalize options array: string items are converted to CustomDropDownOption
  const normalizedOptions: CustomDropDownOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return {
          label: String(opt),
          value: opt,
        };
      }
      return opt;
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    return normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [normalizedOptions, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query)) ||
        (opt.badge && opt.badge.toLowerCase().includes(query))
    );
  }, [normalizedOptions, searchQuery]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex];
          if (!selected.disabled) {
            handleSelectOption(selected);
          }
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelectOption = (option: CustomDropDownOption) => {
    if (option.disabled) return;
    if (onChange) {
      onChange(option.value, option);
    }
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('', { label: '', value: '' });
    }
  };

  // Size styling tokens with comfortable responsive side padding & gaps
  const sizeConfig: Record<
    DropDownSize,
    { trigger: string; icon: string; chevron: string; text: string; item: string }
  > = {
    sm: {
      trigger: 'py-1.5 px-3 text-xs rounded-lg gap-2',
      icon: 'w-3.5 h-3.5',
      chevron: 'w-3.5 h-3.5',
      text: 'text-xs',
      item: 'px-3 py-1.5 text-xs',
    },
    md: {
      trigger: 'py-2.5 px-3.5 sm:px-4 text-xs sm:text-sm rounded-xl gap-2.5',
      icon: 'w-4 h-4',
      chevron: 'w-4 h-4',
      text: 'text-xs sm:text-sm',
      item: 'px-3.5 py-2 text-xs sm:text-sm',
    },
    lg: {
      trigger: 'py-3 px-4 text-sm sm:text-base rounded-xl gap-3',
      icon: 'w-5 h-5',
      chevron: 'w-4 h-4',
      text: 'text-sm sm:text-base',
      item: 'px-4 py-2.5 text-sm',
    },
  };

  // Variant styling tokens
  const getTriggerVariantClasses = () => {
    if (hasError) {
      return 'bg-rose-50/50 border-2 border-red-500 text-slate-900 focus:border-red-600 focus:ring-2 focus:ring-red-100';
    }

    if (isOpen) {
      return 'bg-white border-[#C81E28] ring-2 ring-rose-500/15 text-slate-900 shadow-sm';
    }

    switch (variant) {
      case 'filled':
        return 'bg-slate-100/90 border border-transparent text-slate-800 hover:bg-slate-100 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30';
      case 'outline':
        return 'bg-white border border-slate-200 text-slate-800 hover:border-slate-300 focus:border-[#C81E28] focus:ring-2 focus:ring-rose-500/15';
      case 'default':
      default:
        return 'bg-slate-50 border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100/60 focus:bg-white focus:border-[#C81E28] focus:ring-2 focus:ring-rose-500/15';
    }
  };

  // Critical requirement: Ensure the dropdown popup does NOT jump over or cover the trigger box!
  // Placed right below trigger with mt-1.5 margin, or above with mb-1.5 margin.
  const menuPlacementClasses =
    placement === 'top'
      ? 'bottom-full mb-1.5 origin-bottom'
      : 'top-full mt-1.5 origin-top';

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col gap-1.5 select-none ${containerClassName}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for form data */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedOption ? String(selectedOption.value) : ''}
        />
      )}

      {/* Label Row */}
      {(label || optionalBadge) && (
        <div className="flex items-center justify-between gap-2 px-0.5">
          {label && (
            <label
              htmlFor={dropdownId}
              onClick={() => {
                if (!disabled) setIsOpen((prev) => !prev);
              }}
              className={`block font-bold text-slate-700 cursor-pointer text-xs ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
          )}

          {optionalBadge && (
            <span className="text-[11px] font-medium text-slate-400">
              {optionalBadge}
            </span>
          )}
        </div>
      )}

      {/* Trigger Box */}
      <div className="relative w-full">
        <button
          ref={triggerRef}
          id={dropdownId}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${dropdownId}-error`
              : helperText
                ? `${dropdownId}-helper`
                : undefined
          }
          className={`w-full flex items-center justify-between text-left transition-all duration-150 outline-none cursor-pointer ${
            sizeConfig[size].trigger
          } ${getTriggerVariantClasses()} ${
            disabled
              ? 'opacity-60 bg-slate-100 text-slate-500 cursor-not-allowed'
              : ''
          } ${triggerClassName}`}
        >
          {/* Left Section: Leading Icon & Selected Text / Placeholder */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            {/* Leading Icon (custom or option's icon) */}
            {selectedOption?.icon ? (
              <span className="shrink-0 text-slate-600 flex items-center">
                {selectedOption.icon}
              </span>
            ) : icon ? (
              <span
                className={`shrink-0 flex items-center transition-colors ${
                  hasError ? 'text-red-400' : 'text-slate-400'
                }`}
              >
                {icon}
              </span>
            ) : null}

            {/* Label or Placeholder with clean truncation */}
            <span
              className={`truncate font-normal ${
                selectedOption
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-400 font-normal'
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            {/* Selected Option Badge if present */}
            {selectedOption?.badge && (
              <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                {selectedOption.badge}
              </span>
            )}
          </div>

          {/* Right Section: Clear Button & Rotating Chevron */}
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            {/* Clear Button */}
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                title="Clear selection"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className={sizeConfig[size].icon} />
              </span>
            )}

            {/* Chevron Arrow (Smoothly flips when open) */}
            <ChevronDown
              className={`${sizeConfig[size].chevron} transition-transform duration-200 text-slate-400 ${
                isOpen ? 'rotate-180 text-[#C81E28]' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Popup - Strictly positioned below/above with clean spacing, never covering the box */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className={`absolute left-0 right-0 ${menuPlacementClasses} z-50 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          >
            {/* Optional Search Filter inside Dropdown */}
            {searchable && (
              <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(-1);
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#C81E28] focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              className={`p-1.5 overflow-y-auto space-y-0.5 overscroll-contain ${maxHeight}`}
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-400">{emptyMessage}</p>
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected =
                    selectedOption !== null &&
                    String(selectedOption.value) === String(option.value);
                  const isHighlighted = highlightedIndex === index;

                  return (
                    <div
                      key={String(option.value) + '-' + index}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => handleSelectOption(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex items-center justify-between rounded-xl transition-colors cursor-pointer select-none ${
                        sizeConfig[size].item
                      } ${
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-400'
                          : isSelected
                            ? 'bg-rose-50/80 text-[#C81E28] font-semibold'
                            : isHighlighted
                              ? 'bg-slate-100/80 text-slate-900'
                              : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {/* Left: Option Icon + Label + Description */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        {option.icon && (
                          <span
                            className={`shrink-0 flex items-center ${
                              isSelected ? 'text-[#C81E28]' : 'text-slate-400'
                            }`}
                          >
                            {option.icon}
                          </span>
                        )}

                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{option.label}</span>
                          {option.description && (
                            <span className="text-[11px] text-slate-400 font-normal truncate">
                              {option.description}
                            </span>
                          )}
                        </div>

                        {option.badge && (
                          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 ml-1.5">
                            {option.badge}
                          </span>
                        )}
                      </div>

                      {/* Right: Selected Checkmark */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#C81E28] shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p
          id={`${dropdownId}-error`}
          role="alert"
          className={`text-[11px] font-medium text-red-600 flex items-center gap-1.5 px-0.5 mt-0.5 animate-in fade-in duration-150 ${errorClassName}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </p>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <p
          id={`${dropdownId}-helper`}
          className={`text-[11px] text-slate-400 px-0.5 mt-0.5 ${helperClassName}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

CustomDropDown.displayName = 'CustomDropDown';

export default CustomDropDown;
