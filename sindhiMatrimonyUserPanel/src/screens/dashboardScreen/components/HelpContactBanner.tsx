"use client";

import React, { memo } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { useHelpSupportQuery } from "@/tanstackQuery";
import { isDeepEqual } from "@/utils";

export interface HelpContactBannerProps {
  onCallClick?: () => void;
  onChatClick?: () => void;
  className?: string;
}

const HelpContactBannerComponent: React.FC<HelpContactBannerProps> = ({
  onCallClick,
  onChatClick,
  className = "",
}) => {
  const { data: helpRes } = useHelpSupportQuery();
  const helpData = (helpRes as any)?.data || helpRes;
  const tollFreeRaw = helpData?.supportDesk?.tollFreeRaw || helpData?.supportDesk?.enquiryNumber || "+918144778866";
  const whatsappNumber = helpData?.supportDesk?.whatsappNumber || "918144778866";
  const displayPhone = helpData?.supportDesk?.enquiryNumber || helpData?.supportDesk?.tollFreeHelpline || "8144-77-88-66";

  const handleCall = () => {
    if (onCallClick) {
      onCallClick();
    } else {
      window.location.href = `tel:${tollFreeRaw}`;
    }
  };

  const handleChat = () => {
    if (onChatClick) {
      onChatClick();
    } else {
      window.open(
        `https://wa.me/${whatsappNumber}?text=Hello%20Sindhi%20Matrimony%2C%20I%20need%20help%20with%20my%20account`,
        "_blank"
      );
    }
  };

  return (
    <div
      aria-label="Need Help Contact Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
    >
      {/* Left Text */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-heading">
          Need help in using SindhiMatrimony?
        </h3>
        <p className="text-xs sm:text-[13px] text-[#666666] mt-0.5">
          Reach out to us on this number or chat with us
        </p>
      </div>

      {/* Right Action Buttons with Linear Gradient & Modern Styling */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
        {/* Call Now Button */}
        <button
          type="button"
          onClick={handleCall}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-gradient-to-r hover:from-[#FF525F] hover:via-[#DB2F3C] hover:to-[#B71F2A] hover:text-white hover:border-transparent active:scale-[0.98] shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>Call now</span>
        </button>

        {/* Chat With Us Button */}
        <button
          type="button"
          onClick={handleChat}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-gradient-to-r hover:from-[#FF525F] hover:via-[#DB2F3C] hover:to-[#B71F2A] hover:text-white hover:border-transparent active:scale-[0.98] shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat with us</span>
        </button>
      </div>
    </div>
  );
};

export const HelpContactBanner = memo(
  HelpContactBannerComponent,
  (prev, next) => isDeepEqual(prev, next)
);
HelpContactBanner.displayName = "HelpContactBanner";
export default HelpContactBanner;
