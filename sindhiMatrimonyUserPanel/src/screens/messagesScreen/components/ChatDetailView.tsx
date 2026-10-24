"use client";

import React, { useState, useRef, useEffect } from "react";
import { memoWithDeepEqual } from "@/utils";
import {
  Heart,
  FileCheck,
  FileText,
  MessageSquare,
  Zap,
  Crown,
  Send,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import { ConversationItem, ChatMessage } from "../types";

export interface ChatDetailViewProps {
  conversation: ConversationItem;
  messages?: ChatMessage[];
  isLoadingMessages?: boolean;
  onSendMessage?: (text: string) => Promise<void> | void;
  isSending?: boolean;
  onPayNowClick?: () => void;
  onKnowMoreClick?: () => void;
  className?: string;
}

const ChatDetailViewComponent: React.FC<ChatDetailViewProps> = ({
  conversation,
  messages = [],
  isLoadingMessages = false,
  onSendMessage,
  isSending = false,
  onPayNowClick,
  onKnowMoreClick,
  className = "",
}) => {
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending || !onSendMessage) return;
    setInputText("");
    await onSendMessage(trimmed);
  };

  const isAssisted = Boolean(conversation.isAssisted || conversation.id === "conv-assisted");

  return (
    <div
      className={`flex-1 w-full min-w-0 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col min-h-[580px] ${className}`}
    >
      {/* 1. Header Bar */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#DB2F3C] text-white flex items-center justify-center shrink-0 shadow-xs">
            {conversation.avatarUrl ? (
              <img
                src={conversation.avatarUrl}
                alt={conversation.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Heart className="w-5 h-5 fill-current" />
            )}
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 leading-tight">
              {conversation.name}
            </h3>
            <p className="text-xs text-stone-500">
              {isAssisted ? "Guaranteed weekly matches" : conversation.subtitle || (conversation.isOnline ? "Active now" : "Offline")}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div ref={messagesContainerRef} className="flex-1 p-5 sm:p-6 bg-[#F8F9FA] overflow-y-auto space-y-4">
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-[11px] font-medium text-stone-400 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        {isAssisted ? (
          /* Assisted Service Promotional Card */
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700 pl-1 sm:pl-12">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <p className="leading-snug">
                  <strong className="text-stone-900">Get guaranteed</strong> relevant matches on weekly basis
                </p>
              </div>

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

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <p className="leading-snug">
                  <strong className="text-stone-900">Save time & effort</strong> - Relationship Manager will search, shortlist and share matches with you and arrange meetings.
                </p>
              </div>

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
        ) : (
          /* Dynamic Chat Messages Area */
          <div className="space-y-3">
            {isLoadingMessages && messages.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#DB2F3C]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No messages yet. Send a message to break the ice!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      msg.isMe
                        ? "bg-[#DB2F3C] text-white rounded-br-xs"
                        : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        msg.isMe ? "text-red-100" : "text-stone-400"
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.isMe && (
                        <span>
                          {msg.status === "sending" ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : msg.status === "read" ? (
                            <CheckCheck className="w-3 h-3 text-white" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Bottom Bar: Subscription Banner for Assisted OR Input Form for Chat */}
      {isAssisted ? (
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
      ) : (
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 border-t border-stone-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-[#DB2F3C] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] disabled:opacity-50 text-white shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export const ChatDetailView = memoWithDeepEqual(
  ChatDetailViewComponent,
  "ChatDetailView"
);
export default ChatDetailView;
