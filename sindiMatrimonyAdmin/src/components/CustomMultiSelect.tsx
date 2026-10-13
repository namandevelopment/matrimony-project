import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';

export type MultiSelectSize = 'sm' | 'md' | 'lg';
export type MultiSelectVariant = 'default' | 'filled' | 'outline';
export type MultiSelectPlacement = 'bottom' | 'top';

export interface MultiSelectOption {
  /** Label displayed for the option */
  label: string;
  /** Value stored / emitted on select */
  value: string;
  /** Optional icon displayed next to the option */
  icon?: React.ReactNode;
  /** Optional subtitle or description below the label */
  description?: string;
  /** Disables selection for this option */
  disabled?: boolean;
  /** Optional badge tag */
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
}

export interface CustomMultiSelectProps {
  /** Label displayed above the select */
  label?: React.ReactNode;
  /** Displays a red asterisk (*) next to label */
  required?: boolean;
  /** Optional badge next to label (e.g. "(Multi-select)") */
  optionalBadge?: React.ReactNode;
  /** List of options */
  options: Array<MultiSelectOption | string>;
  /** Selected values array */
  value: string[];
  /** Callback when selection changes */
  onChange: (selectedValues: string[]) => void;
  /** Placeholder when no option is selected */
  placeholder?: string;
  /** Leading icon inside the select trigger box */
  icon?: React.ReactNode;
  /** Validation error message */
  error?: string;
  /** Informational helper text */
  helperText?: string;
  /** Disables the multi-select */
  disabled?: boolean;
  /** Enables search filter inside the popup */
  searchable?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Shows a clear button (X) when items are selected */
  clearable?: boolean;
  /** Enables Select All / Deselect All buttons */
  showSelectAll?: boolean;
  /** Maximum number of tag pills to render before summarizing */
  maxTagCount?: number;
  /** Size variant */
  size?: MultiSelectSize;
  /** Visual theme variant */
  variant?: MultiSelectVariant;
  /** Placement of menu */
  placement?: MultiSelectPlacement;
  /** Max height for list */
  maxHeight?: string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom classNames */
  containerClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  label,
  required = false,
  optionalBadge,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  icon,
  error,
  helperText,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Search options...',
  clearable = true,
  showSelectAll = true,
  maxTagCount = 3,
  size = 'md',
  variant = 'default',
  placement = 'bottom',
  maxHeight = 'max-h-64',
  emptyMessage = 'No options found',
  containerClassName = '',
  triggerClassName = '',
  menuClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const generatedId = useId();
  const selectId = generatedId;
  const hasError = Boolean(error);

  // Normalize options array
  const normalizedOptions: MultiSelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  // Map of selected items
  const selectedSet = useMemo(() => new Set(value), [value]);

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
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Toggle single option
  const handleToggleOption = (optionValue: string) => {
    if (disabled) return;
    const next = new Set(value);
    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }
    onChange(Array.from(next));
  };

  // Remove tag chip
  const handleRemoveTag = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    if (disabled) return;
    const next = value.filter((v) => v !== optionValue);
    onChange(next);
  };

  // Clear all
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange([]);
  };

  // Select all filtered
  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const available = normalizedOptions.filter((o) => !o.disabled).map((o) => o.value);
    onChange(Array.from(new Set([...value, ...available])));
  };

  // Deselect all
  const handleDeselectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange([]);
  };

  // Size styling tokens
  const sizeConfig: Record<
    MultiSelectSize,
    { trigger: string; icon: string; chevron: string; text: string; tag: string; item: string }
  > = {
    sm: {
      trigger: 'py-1 px-2.5 text-xs rounded-lg min-h-[34px] gap-1.5',
      icon: 'w-3.5 h-3.5',
      chevron: 'w-3.5 h-3.5',
      text: 'text-xs',
      tag: 'text-[10px] py-0.5 px-1.5 rounded-md gap-1',
      item: 'px-3 py-1.5 text-xs',
    },
    md: {
      trigger: 'py-1.5 px-3 sm:px-3.5 text-xs sm:text-sm rounded-xl min-h-[42px] gap-2',
      icon: 'w-4 h-4',
      chevron: 'w-4 h-4',
      text: 'text-xs sm:text-sm',
      tag: 'text-[11px] py-0.5 px-2 rounded-lg gap-1.5',
      item: 'px-3.5 py-2 text-xs sm:text-sm',
    },
    lg: {
      trigger: 'py-2 px-4 text-sm sm:text-base rounded-xl min-h-[48px] gap-2.5',
      icon: 'w-5 h-5',
      chevron: 'w-4 h-4',
      text: 'text-sm sm:text-base',
      tag: 'text-xs py-1 px-2.5 rounded-lg gap-2',
      item: 'px-4 py-2.5 text-sm',
    },
  };

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

  const menuPlacementClasses =
    placement === 'top'
      ? 'bottom-full mb-1.5 origin-bottom'
      : 'top-full mt-1.5 origin-top';

  const selectedOptionsList = useMemo(() => {
    return value
      .map((val) => normalizedOptions.find((o) => o.value === val))
      .filter((o): o is MultiSelectOption => o !== undefined);
  }, [value, normalizedOptions]);

  const visibleTags = selectedOptionsList.slice(0, maxTagCount);
  const remainingCount = selectedOptionsList.length - maxTagCount;

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col gap-1.5 select-none ${containerClassName}`}
    >
      {/* Label Row */}
      {(label || optionalBadge) && (
        <div className="flex items-center justify-between gap-2 px-0.5">
          {label && (
            <label
              htmlFor={selectId}
              onClick={() => {
                if (!disabled) setIsOpen((prev) => !prev);
              }}
              className="block font-bold text-slate-700 cursor-pointer text-xs"
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
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          className={`w-full flex items-center justify-between text-left transition-all duration-150 outline-none cursor-pointer ${
            sizeConfig[size].trigger
          } ${getTriggerVariantClasses()} ${
            disabled ? 'opacity-60 bg-slate-100 text-slate-500 cursor-not-allowed' : ''
          } ${triggerClassName}`}
        >
          {/* Left: Icon & Selected Tags / Placeholder */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1 mr-2 py-0.5">
            {icon && (
              <span
                className={`shrink-0 flex items-center transition-colors ${
                  hasError ? 'text-red-400' : 'text-slate-400'
                }`}
              >
                {icon}
              </span>
            )}

            {selectedOptionsList.length === 0 ? (
              <span className="truncate text-slate-400 font-normal">
                {placeholder}
              </span>
            ) : (
              <>
                {visibleTags.map((opt) => (
                  <span
                    key={opt.value}
                    className={`inline-flex items-center font-bold bg-white border border-rose-200 text-[#DB2F3C] shadow-2xs ${sizeConfig[size].tag}`}
                  >
                    <span className="truncate max-w-[130px]">{opt.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => handleRemoveTag(e, opt.value)}
                      title={`Remove ${opt.label}`}
                      className="p-0.5 rounded hover:bg-rose-100 text-[#DB2F3C] transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </span>
                ))}

                {remainingCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-200/80 text-slate-700">
                    +{remainingCount} more
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right: Clear All & Chevron */}
          <div className="flex items-center gap-1 shrink-0 text-slate-400 ml-1">
            {clearable && selectedOptionsList.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClearAll}
                title="Clear all selected"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className={sizeConfig[size].icon} />
              </span>
            )}

            <ChevronDown
              className={`${sizeConfig[size].chevron} transition-transform duration-200 text-slate-400 ${
                isOpen ? 'rotate-180 text-[#C81E28]' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Popup */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className={`absolute left-0 right-0 ${menuPlacementClasses} z-50 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          >
            {/* Search Bar + Select All Header */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/70 space-y-2">
              {searchable && (
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              )}

              {showSelectAll && (
                <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-500">
                  <span>
                    Selected: <strong className="text-slate-900">{value.length}</strong> of {normalizedOptions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[#DB2F3C] hover:underline font-bold cursor-pointer"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Options Checkbox List */}
            <div
              className={`p-1.5 overflow-y-auto space-y-1 overscroll-contain ${maxHeight}`}
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-400">{emptyMessage}</p>
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isChecked = selectedSet.has(option.value);

                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isChecked}
                      aria-disabled={option.disabled}
                      onClick={() => !option.disabled && handleToggleOption(option.value)}
                      className={`flex items-start gap-2.5 rounded-xl p-2 transition-colors cursor-pointer select-none ${
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-400'
                          : isChecked
                            ? 'bg-rose-50/80 text-slate-900'
                            : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {/* Checkbox input */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={option.disabled}
                        onChange={() => {}} // handled by parent div
                        className="mt-0.5 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] cursor-pointer"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs truncate ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                            {option.label}
                          </span>
                          {option.badge && (
                            <span
                              className={`shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                option.badgeBg || 'bg-amber-100'
                              } ${option.badgeText || 'text-amber-800'}`}
                            >
                              {option.badge}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {option.description}
                          </p>
                        )}
                      </div>

                      {/* Selected check indicator */}
                      {isChecked && (
                        <Check className="w-4 h-4 text-[#DB2F3C] shrink-0 mt-0.5" />
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
          role="alert"
          className="text-[11px] font-medium text-red-600 flex items-center gap-1.5 px-0.5 mt-0.5"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </p>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <p className="text-[11px] text-slate-400 px-0.5 mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
};

CustomMultiSelect.displayName = 'CustomMultiSelect';
export default CustomMultiSelect;
