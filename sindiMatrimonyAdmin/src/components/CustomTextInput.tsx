import React, { forwardRef, useState, useId } from 'react';
import { AlertCircle, Eye, EyeOff, X } from 'lucide-react';

export type TextInputSize = 'sm' | 'md' | 'lg';
export type TextInputVariant = 'default' | 'filled' | 'outline';

export interface CustomTextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label displayed above the input */
  label?: React.ReactNode;
  /** Marks the field with a red asterisk (*) */
  required?: boolean;
  /** Optional badge or text next to the label (e.g. "(Optional)") */
  optionalBadge?: React.ReactNode;
  /** Error message displayed below the input with an alert icon */
  error?: string;
  /** Informational helper text displayed below the input when there is no error */
  helperText?: string;
  /** Leading icon inside the input on the left */
  leftIcon?: React.ReactNode;
  /** Trailing icon inside the input on the right */
  rightIcon?: React.ReactNode;
  /** Addon element attached outside the input to the left (e.g. +91, https://) */
  leftAddon?: React.ReactNode;
  /** Addon element attached outside the input to the right (e.g. .com, kg) */
  rightAddon?: React.ReactNode;
  /** Size variant */
  size?: TextInputSize;
  /** Visual variant */
  variant?: TextInputVariant;
  /** Shows a clear (X) button when input has a value */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Automatically shows a toggle visibility button if type is 'password' (defaults to true) */
  showPasswordToggle?: boolean;
  /** Displays a live character count in the corner if maxLength is set */
  showCharCount?: boolean;
  /** Additional classes for the root container */
  containerClassName?: string;
  /** Additional classes for the input element */
  inputClassName?: string;
  /** Additional classes for the label */
  labelClassName?: string;
  /** Additional classes for the error message */
  errorClassName?: string;
  /** Additional classes for the helper text */
  helperClassName?: string;
}

export const CustomTextInput = forwardRef<HTMLInputElement, CustomTextInputProps>(
  (
    {
      label,
      required = false,
      optionalBadge,
      error,
      helperText,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      size = 'md',
      variant = 'default',
      clearable = false,
      onClear,
      showPasswordToggle = true,
      showCharCount = false,
      containerClassName = '',
      inputClassName = '',
      labelClassName = '',
      errorClassName = '',
      helperClassName = '',
      type = 'text',
      value,
      defaultValue,
      onChange,
      disabled = false,
      readOnly = false,
      id,
      maxLength,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    // Track internal value length for character count if not controlled
    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0;

    const hasValue = Boolean(
      (value !== undefined && value !== null && value !== '') ||
      (defaultValue !== undefined && defaultValue !== null && defaultValue !== '')
    );

    const hasError = Boolean(error);

    // Size-specific dimensions and paddings
    const sizeConfig: Record<
      TextInputSize,
      { input: string; icon: string; addon: string; text: string }
    > = {
      sm: {
        input: 'py-1.5 px-3 text-xs rounded-lg',
        icon: 'w-3.5 h-3.5',
        addon: 'px-2.5 text-xs',
        text: 'text-xs',
      },
      md: {
        input: 'py-2.5 px-3.5 text-xs sm:text-sm rounded-xl',
        icon: 'w-4 h-4',
        addon: 'px-3 text-xs sm:text-sm',
        text: 'text-xs sm:text-sm',
      },
      lg: {
        input: 'py-3 px-4 text-sm sm:text-base rounded-xl',
        icon: 'w-5 h-5',
        addon: 'px-3.5 text-sm',
        text: 'text-sm',
      },
    };

    // Calculate left & right padding to accommodate icons nicely without overlapping text
    const getPaddingClasses = () => {
      let pl = '';
      let pr = '';

      if (leftIcon) {
        pl = size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-11' : 'pl-10';
      }

      // Check if there are elements on the right (rightIcon, clearable, or password toggle)
      const hasRightElements =
        Boolean(rightIcon) ||
        (clearable && hasValue && !disabled && !readOnly) ||
        (isPassword && showPasswordToggle);

      if (hasRightElements) {
        // If multiple elements can be present on the right
        const rightElementCount =
          (Boolean(rightIcon) ? 1 : 0) +
          (clearable && hasValue ? 1 : 0) +
          (isPassword && showPasswordToggle ? 1 : 0);

        if (rightElementCount >= 2) {
          pr = size === 'sm' ? 'pr-14' : size === 'lg' ? 'pr-18' : 'pr-16';
        } else {
          pr = size === 'sm' ? 'pr-8' : size === 'lg' ? 'pr-11' : 'pr-10';
        }
      }

      return `${pl} ${pr}`;
    };

    // Variant-specific background and border styling
    const getVariantClasses = () => {
      if (hasError) {
        return 'bg-rose-50/50 border-2 border-red-500 text-slate-900 placeholder:text-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-100';
      }

      switch (variant) {
        case 'filled':
          return 'bg-slate-100/90 border border-transparent text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30';
        case 'outline':
          return 'bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#C81E28] focus:ring-2 focus:ring-rose-500/15';
        case 'default':
        default:
          return 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-[#C81E28] focus:ring-2 focus:ring-rose-500/15';
      }
    };

    const actualInputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {/* Label Row */}
        {(label || optionalBadge || (showCharCount && maxLength)) && (
          <div className="flex items-center justify-between gap-2 px-0.5">
            {label ? (
              <label
                htmlFor={inputId}
                className={`block font-bold text-slate-700 select-none cursor-pointer text-xs ${labelClassName}`}
              >
                {label}
                {required && <span className="text-red-500 ml-1 font-bold">*</span>}
              </label>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              {optionalBadge && (
                <span className="text-[11px] font-medium text-slate-400">
                  {optionalBadge}
                </span>
              )}
              {showCharCount && maxLength && (
                <span
                  className={`text-[11px] font-mono ${
                    currentLength >= maxLength ? 'text-red-500 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {currentLength}/{maxLength}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Input Wrapper with optional Addons */}
        <div className="relative flex items-stretch w-full">
          {/* Left Addon */}
          {leftAddon && (
            <span
              className={`inline-flex items-center bg-slate-100 border border-r-0 border-slate-200 text-slate-600 font-medium rounded-l-xl select-none shrink-0 ${sizeConfig[size].addon}`}
            >
              {leftAddon}
            </span>
          )}

          {/* Main Input Container */}
          <div className="relative flex-1">
            {/* Left Icon */}
            {leftIcon && (
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none transition-colors ${
                  hasError ? 'text-red-400' : ''
                }`}
              >
                <span className="shrink-0">{leftIcon}</span>
              </div>
            )}

            {/* Input Element */}
            <input
              ref={ref}
              id={inputId}
              type={actualInputType}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              aria-invalid={hasError}
              aria-describedby={
                hasError
                  ? `${inputId}-error`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
              }
              className={`w-full transition-all duration-150 outline-none font-normal ${
                sizeConfig[size].input
              } ${getVariantClasses()} ${getPaddingClasses()} ${
                leftAddon ? 'rounded-l-none' : ''
              } ${rightAddon ? 'rounded-r-none' : ''} ${
                disabled
                  ? 'opacity-60 bg-slate-100 text-slate-500 cursor-not-allowed select-none'
                  : ''
              } ${readOnly ? 'bg-slate-50/80 cursor-default' : ''} ${className} ${inputClassName}`}
              {...props}
            />

            {/* Right Action Icons (Clear button, Password toggle, Custom rightIcon) */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
              {/* Clear button */}
              {clearable && hasValue && !disabled && !readOnly && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onClear) onClear();
                  }}
                  title="Clear input"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
                >
                  <X className={sizeConfig[size].icon} />
                </button>
              )}

              {/* Password visibility toggle */}
              {isPassword && showPasswordToggle && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className={sizeConfig[size].icon} />
                  ) : (
                    <Eye className={sizeConfig[size].icon} />
                  )}
                </button>
              )}

              {/* Custom Right Icon */}
              {rightIcon && (
                <span className="shrink-0 flex items-center justify-center text-slate-400">
                  {rightIcon}
                </span>
              )}
            </div>
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <span
              className={`inline-flex items-center bg-slate-100 border border-l-0 border-slate-200 text-slate-600 font-medium rounded-r-xl select-none shrink-0 ${sizeConfig[size].addon}`}
            >
              {rightAddon}
            </span>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className={`text-[11px] font-medium text-red-600 flex items-center gap-1.5 px-0.5 mt-0.5 animate-in fade-in duration-150 ${errorClassName}`}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span>{error}</span>
          </p>
        )}

        {/* Helper Text (only shown when there is no error) */}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className={`text-[11px] text-slate-400 px-0.5 mt-0.5 ${helperClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
