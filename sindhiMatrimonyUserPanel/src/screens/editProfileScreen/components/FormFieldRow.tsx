"use client";

import React, { memo } from "react";

export interface FormFieldRowProps {
  label: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  alignTop?: boolean;
}

const FormFieldRowComponent: React.FC<FormFieldRowProps> = ({
  label,
  required = false,
  children,
  helperText,
  error,
  className = "",
  labelClassName = "",
  alignTop = false,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 py-2.5 sm:py-3 border-b border-stone-100 last:border-b-0 ${
        alignTop ? "items-start" : "items-center"
      } ${className}`}
    >
      {/* Left Column: Label */}
      <div className={`md:col-span-4 lg:col-span-3 ${labelClassName}`}>
        <label className="text-[13px] sm:text-[13.5px] font-medium text-stone-700 select-none flex items-center gap-1">
          <span>{label}</span>
          {required && (
            <span className="text-[#DB2F3C] font-bold text-sm" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {/* Right Column: Input / Controls */}
      <div className="md:col-span-8 lg:col-span-9">
        <div className="w-full max-w-xl">{children}</div>
        {helperText && !error && (
          <p className="mt-1 text-[11.5px] text-stone-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-[11.5px] text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export const FormFieldRow = memo(FormFieldRowComponent);
FormFieldRow.displayName = "FormFieldRow";
