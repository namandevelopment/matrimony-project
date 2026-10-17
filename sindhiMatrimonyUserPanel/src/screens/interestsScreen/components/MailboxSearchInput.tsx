"use client";

import React, { memo } from "react";
import { Search } from "lucide-react";

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
      className={`relative inline-flex items-center text-xs sm:text-[13px] text-stone-600 ${className}`}
    >
      <Search className="w-4 h-4 text-stone-400 absolute left-2.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-3 py-1.5 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#DB2F3C] focus:bg-white focus:outline-hidden transition-all rounded text-stone-800 placeholder-stone-500 w-44 sm:w-56"
      />
    </div>
  );
};

export const MailboxSearchInput = memo(MailboxSearchInputComponent);
MailboxSearchInput.displayName = "MailboxSearchInput";
export default MailboxSearchInput;
