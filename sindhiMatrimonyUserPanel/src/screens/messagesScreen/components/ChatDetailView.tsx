"use client";

import React, { memo } from "react";
import {
  Heart,
  FileCheck,
  FileText,
  MessageSquare,
  Zap,
  Crown,
} from "lucide-react";
import { ConversationItem } from "../types";

export interface ChatDetailViewProps {
  conversation: ConversationItem;
  onPayNowClick?: () => void;
  onKnowMoreClick?: () => void;
  className?: string;
}

const ChatDetailViewComponent: React.FC<ChatDetailViewProps> = ({
  conversation,
  onPayNowClick,
  onKnowMoreClick,
  className = "",
}) => {
  return (
    <div
      className={`flex-1 w-full min-w-0 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col min-h-[580px] ${className}`}
    >
      {/* 1. Header Bar */}
      <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-white">
        <div className="w-10 h-10 rounded-full bg-[#DB2F3C] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 leading-tight">
            {conversation.name}
          </h3>
          <p className="text-xs text-stone-500">
            Guaranteed weekly matches
          </p>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div className="flex-1 p-5 sm:p-6 bg-[#F8F9FA] overflow-y-auto space-y-4">
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-[11px] font-medium text-stone-400 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
            16 Oct 2026
          </span>
        </div>

        {/* Assisted Service Promotional / Onboarding Card */}
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-5 sm:p-6 shadow-xs max-w-2xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DB2F3C] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                Find your match 3x faster! With Assisted Service:
              </h4>
            </div>
          </div>

          {/* 4 Feature Points with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700 pl-1 sm:pl-12">
            {/* Point 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <p className="leading-snug">
                <strong className="text-stone-900">Get guaranteed</strong> relevant matches on weekly basis
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="leading-snug">
                  <strong className="text-stone-900">Get faster responses</strong> - Relationship Manager reaches out to prospects via Call/Message/ Whatsapp to get faster response.
                </p>
                <button
                  type="button"
                  onClick={onKnowMoreClick}
                  className="text-[#DB2F3C] font-semibold text-[11px] hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Know more &gt;
                </button>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <p className="leading-snug">
                <strong className="text-stone-900">Save time & effort</strong> - Relationship Manager will search, shortlist and share matches with you and arrange meetings.
              </p>
            </div>

            {/* Point 4 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <p className="leading-snug">
                <strong className="text-stone-900">Get more responses</strong> - Your profile will be made available in Matrimony.com group of sites and even free members can message you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Sticky Subscription Banner matching Screenshot 2 */}
      <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#F0FDF4] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 leading-tight">
              Subscribe to Assisted Gold - 3 months!
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm sm:text-base font-extrabold text-stone-900">
            Rs.24900
          </span>
          <button
            type="button"
            onClick={onPayNowClick}
            className="px-8 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs sm:text-[13px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const ChatDetailView = memo(ChatDetailViewComponent);
ChatDetailView.displayName = "ChatDetailView";
export default ChatDetailView;
