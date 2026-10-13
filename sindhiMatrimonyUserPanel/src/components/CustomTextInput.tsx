"use client";

import React, { forwardRef, useId, useState } from "react";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CustomTextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label text or custom React node displayed above input */
  label?: React.ReactNode;
  /** Right-aligned node in label row (e.g., 'Forgot Password?' link or counter) */
  labelRight?: React.ReactNode;
  /** Error message to display below input with red styling */
  error?: string;
  /** Helper/hint text displayed below input when there is no error */
  helperText?: string;
  /** Icon element rendered on the left inside the input */
  leftIcon?: React.ReactNode;
  /** Icon element rendered on the right inside the input */
  rightIcon?: React.ReactNode;
  /** Prefix/Adornment rendered inside or alongside input (e.g. '+91' or country flag) */
  leftAdornment?: React.ReactNode;
  /** Suffix/Adornment rendered on the right */
  rightAdornment?: React.ReactNode;
  /** Input size variation: sm (36px), md (44px), lg (48px) */
  inputSize?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "outlined" | "filled" | "flush";
  /** Automatically show eye/eye-off toggle button when type="password" (default: true) */
  showPasswordToggle?: boolean;
  /** Show clear button when value is present */
  clearable?: boolean;
  /** Callback fired when clear button is clicked */
  onClear?: () => void;
  /** Custom class for the outermost container */
  containerClassName?: string;
  /** Custom class for the label element */
  labelClassName?: string;
  /** Custom class for the input's relative wrapper */
  wrapperClassName?: string;
  /** Custom class for the `<input>` element itself */
  inputClassName?: string;
  /** Custom class for the error message */
  errorClassName?: string;
  /** Custom class for the helper text */
  helperClassName?: string;
}

export const CustomTextInput = forwardRef<HTMLInputElement, CustomTextInputProps>(
  (
    {
      id,
      name,
      type = "text",
      label,
      labelRight,
      placeholder,
      value,
      defaultValue,
      disabled = false,
      required = false,
      readOnly = false,
      error,
      helperText,
      leftIcon,
      rightIcon,
      leftAdornment,
      rightAdornment,
      inputSize = "md",
      variant = "outlined",
      showPasswordToggle = true,
      clearable = false,
      onClear,
      className,
      containerClassName,
      labelClassName,
      wrapperClassName,
      inputClassName,
      errorClassName,
      helperClassName,
      onChange,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // State for toggling password visibility
    const isPasswordField = type === "password";
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Compute effective input type
    const effectiveType = isPasswordField
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    // Check if input has value (for clear button)
    const hasValue = Boolean(value !== undefined ? value : defaultValue);

    // Size mappings
    const sizeStyles = {
      sm: "h-9 text-xs px-3",
      md: "h-11 text-sm px-4",
      lg: "h-12 text-base px-4",
    };

    // Variant base styles
    const variantStyles = {
      outlined: cn(
        "bg-white border rounded-lg transition-all duration-150",
        error
          ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          : "border-stone-300 text-[#1A1A1A] hover:border-stone-400 focus:border-[#DB2F3C] focus:ring-2 focus:ring-[#DB2F3C]/15"
      ),
      filled: cn(
        "bg-stone-100 border border-transparent rounded-lg transition-all duration-150",
        error
          ? "bg-red-50/60 border-red-500 text-red-900 focus:bg-white focus:ring-2 focus:ring-red-500/20"
          : "text-[#1A1A1A] hover:bg-stone-200/60 focus:bg-white focus:border-[#DB2F3C] focus:ring-2 focus:ring-[#DB2F3C]/15"
      ),
      flush: cn(
        "bg-transparent border-b rounded-none px-0 transition-all duration-150",
        error
          ? "border-red-500 text-red-900 focus:border-red-600"
          : "border-stone-300 text-[#1A1A1A] hover:border-stone-400 focus:border-[#DB2F3C]"
      ),
    };

    // Left and Right spacing adjustments
    const hasLeftElement = Boolean(leftIcon || leftAdornment);
    const hasRightToggle = isPasswordField && showPasswordToggle;
    const hasRightClear = clearable && hasValue && !disabled && !readOnly;
    const hasRightElement = Boolean(
      rightIcon || rightAdornment || hasRightToggle || hasRightClear
    );

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {/* Label Row */}
        {(label || labelRight) && (
          <div className="flex items-center justify-between text-xs">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "font-semibold text-[#444444] uppercase tracking-wider select-none",
                  disabled && "opacity-60 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
                {required && (
                  <span className="text-[#DB2F3C] ml-1 font-bold" aria-hidden="true">
                    *
                  </span>
                )}
              </label>
            )}
            {labelRight && (
              <div className="text-xs text-[#666666]">{labelRight}</div>
            )}
          </div>
        )}

        {/* Input Wrapper */}
        <div className={cn("relative flex items-center w-full", wrapperClassName)}>
          {/* Left Icon / Adornment */}
          {hasLeftElement && (
            <div className="absolute left-3.5 z-10 flex items-center justify-center text-stone-400 pointer-events-none">
              {leftIcon}
              {leftAdornment}
            </div>
          )}

          {/* Actual Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={effectiveType}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full outline-none font-normal placeholder:text-stone-400 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed disabled:border-stone-200 read-only:bg-stone-50/60",
              sizeStyles[inputSize],
              variantStyles[variant],
              hasLeftElement && (inputSize === "sm" ? "pl-9" : "pl-11"),
              hasRightElement && (inputSize === "sm" ? "pr-9" : "pr-11"),
              inputClassName,
              className
            )}
            {...restProps}
          />

          {/* Right Icons / Actions */}
          {hasRightElement && (
            <div className="absolute right-3 z-10 flex items-center gap-1.5 text-stone-400">
              {/* Clear button */}
              {hasRightClear && (
                <button
                  type="button"
                  onClick={onClear}
                  tabIndex={-1}
                  aria-label="Clear input"
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Password visibility toggle */}
              {hasRightToggle && (
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Right Adornment / Custom Icon */}
              {rightIcon}
              {rightAdornment}
            </div>
          )}
        </div>

        {/* Error or Helper Text */}
        {error ? (
          <p
            id={errorId}
            role="alert"
            className={cn(
              "flex items-center gap-1 text-xs text-red-600 font-medium animate-fade-in mt-0.5",
              errorClassName
            )}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className={cn(
              "text-xs text-stone-500 font-normal mt-0.5",
              helperClassName
            )}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

CustomTextInput.displayName = "CustomTextInput";

export default CustomTextInput;
