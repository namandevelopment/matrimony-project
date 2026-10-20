"use client";

import React, { memo } from "react";
import { Search, X } from "lucide-react";

export interface MailboxSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const MailboxSearchInputComponent: React.FC<MailboxSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search in Mailbox",
  className = "",
}) => {
  return (
    <div
      className={`relative inline-flex items-center bg-white border border-stone-200 shadow-2xs hover:border-stone-300 focus-within:border-[#DB2F3C] focus-within:ring-2 focus-within:ring-red-100/60 rounded-full px-3 py-1.5 transition-all text-xs sm:text-[13px] z-20 ${className}`}
    >
      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 shrink-0 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-2 pr-1 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 w-36 sm:w-48 text-xs sm:text-[13px]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export const MailboxSearchInput = memo(MailboxSearchInputComponent);
MailboxSearchInput.displayName = "MailboxSearchInput";
export default MailboxSearchInput;
