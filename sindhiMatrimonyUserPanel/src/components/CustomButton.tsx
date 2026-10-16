"use client";

import React, { memo, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type CustomButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type CustomButtonSize = "sm" | "md" | "lg" | "xl";
export type CustomButtonShape = "rounded-2xl" | "rounded-full" | "rounded-xl" | "rounded-lg" | "rounded-md";

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CustomButtonVariant;
  size?: CustomButtonSize;
  shape?: CustomButtonShape;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<CustomButtonVariant, string> = {
  // Signature linear gradient across all primary buttons
  primary:
    "text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.99] shadow-md shadow-red-700/20 hover:shadow-lg hover:shadow-red-600/30",
  secondary:
    "text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-[0.99]",
  outline:
    "text-[#DB2F3C] bg-white border border-[#DB2F3C] hover:bg-red-50/60 active:scale-[0.99]",
  ghost:
    "text-stone-700 hover:text-[#DB2F3C] hover:bg-stone-100 active:scale-[0.99]",
};

const sizeStyles: Record<CustomButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-semibold",
  md: "h-10 sm:h-11 px-5 text-sm font-semibold",
  lg: "h-11 sm:h-12 px-6 text-sm sm:text-base font-bold",
  xl: "h-12 sm:h-14 px-8 text-base sm:text-lg font-bold",
};

export const CustomButton = memo(
  forwardRef<HTMLButtonElement, CustomButtonProps>(
    (
      {
        variant = "primary",
        size = "lg",
        shape = "rounded-2xl",
        fullWidth = false,
        isLoading = false,
        loadingText,
        icon,
        iconPosition = "left",
        children,
        disabled,
        className = "",
        type = "button",
        ...props
      },
      ref
    ) => {
      const isDisabled = disabled || isLoading;

      return (
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={`
            inline-flex items-center justify-center gap-2 font-heading tracking-wide transition-all duration-200 cursor-pointer select-none
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${shape}
            ${fullWidth ? "w-full" : ""}
            ${isDisabled ? "opacity-75 cursor-not-allowed pointer-events-none" : ""}
            ${className}
          `}
          {...props}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{loadingText || children}</span>
            </>
          ) : (
            <>
              {icon && iconPosition === "left" && (
                <span className="shrink-0">{icon}</span>
              )}
              {children && <span>{children}</span>}
              {icon && iconPosition === "right" && (
                <span className="shrink-0">{icon}</span>
              )}
            </>
          )}
        </button>
      );
    }
  )
);

CustomButton.displayName = "CustomButton";
