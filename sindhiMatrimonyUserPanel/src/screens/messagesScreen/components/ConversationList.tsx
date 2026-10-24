"use client";

import React from "react";
import { SlidersHorizontal, ChevronRight, Heart } from "lucide-react";
import { memoWithDeepEqual } from "@/utils";
import { MessageTab, ConversationItem } from "../types";

export interface ConversationListProps {
  currentTab: MessageTab;
  onTabChange: (tab: MessageTab) => void;
  conversations: ConversationItem[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

const ConversationListComponent: React.FC<ConversationListProps> = ({
  currentTab,
  onTabChange,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onFilterClick,
  className = "",
}) => {
  return (
    <div
      className={`w-full lg:w-80 xl:w-96 shrink-0 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col ${className}`}
    >
      {/* 1. Top Tabs: Received | Awaiting Response | Calls */}
      <div className="flex items-center border-b border-stone-200 px-3 pt-2 text-xs sm:text-[13px] font-semibold text-stone-600">
        <button
          type="button"
          onClick={() => onTabChange("received")}
          className={`px-3 py-2.5 relative transition-colors cursor-pointer ${currentTab === "received" ? "text-stone-900 font-bold" : "hover:text-stone-900"
            }`}
        >
          <span>Received</span>
          {currentTab === "received" && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("awaiting")}
          className={`px-3 py-2.5 relative transition-colors cursor-pointer ${currentTab === "awaiting" ? "text-stone-900 font-bold" : "hover:text-stone-900"
            }`}
        >
          <span>Awaiting Response</span>
          {currentTab === "awaiting" && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("calls")}
          className={`px-3 py-2.5 relative transition-colors cursor-pointer ${currentTab === "calls" ? "text-stone-900 font-bold" : "hover:text-stone-900"
            }`}
        >
          <span>Calls</span>
          {currentTab === "calls" && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#DB2F3C] rounded-full" />
          )}
        </button>
      </div>

      {/* 2. Subheader: Incoming conversations from matches + Filter button */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-[#FAFAFA]">
        <span className="text-xs font-bold text-stone-800">
          Incoming conversations from matches
        </span>
        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-semibold text-stone-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3 text-stone-500" />
          <span>Filter</span>
        </button>
      </div>

      {/* 3. Conversation List Items */}
      <div className="divide-y divide-stone-100 overflow-y-auto max-h-[540px]">
        {conversations.map((item) => {
          const isSelected = item.id === selectedConversationId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectConversation(item.id)}
              className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${isSelected
                  ? "bg-[#F3F4F6]"
                  : "bg-white hover:bg-stone-50"
                }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Red Circular Logo with Online Green Dot */}
                <div className="relative shrink-0 w-10 h-10 rounded-full bg-[#DB2F3C] text-white flex items-center justify-center shadow-xs">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {item.name ? item.name.charAt(0).toUpperCase() : <Heart className="w-5 h-5 fill-current" />}
                    </span>
                  )}
                  {item.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ConversationList = memoWithDeepEqual(
  ConversationListComponent,
  "ConversationList"
);
export default ConversationList;
