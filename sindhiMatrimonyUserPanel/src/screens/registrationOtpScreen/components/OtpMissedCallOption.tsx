"use client";

import React, { memo } from "react";
import { PhoneCall } from "lucide-react";

interface OtpMissedCallOptionProps {
  missedCallNumber?: string;
  onSimulateMissedCall?: () => void;
  disabled?: boolean;
}

const OtpMissedCallOptionComponent: React.FC<OtpMissedCallOptionProps> = ({
  missedCallNumber = "+91 7449077077",
  onSimulateMissedCall,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
      {/* Top Label */}
      <span className="text-xs sm:text-sm text-[#777777]">
        Verify with Missed
      </span>

      {/* Bottom Actionable Link */}
      <div className="flex items-center gap-1.5 mt-0.5">
        <a
          href={`tel:${missedCallNumber.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#EA5558] hover:underline"
          title="Give a missed call to verify instantly"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#EA5558]" />
          <span>Call to {missedCallNumber}</span>
        </a>

        {/* Demo trigger helper */}
        {onSimulateMissedCall && (
          <button
            type="button"
            disabled={disabled}
            onClick={onSimulateMissedCall}
            className="text-[10px] text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
            title="Simulate missed call verification for demo"
          >
            Test
          </button>
        )}
      </div>
    </div>
  );
};

export const OtpMissedCallOption = memo(OtpMissedCallOptionComponent);
OtpMissedCallOption.displayName = "OtpMissedCallOption";
