"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { MessageSquare, X, Send, User, ExternalLink } from "lucide-react";
import englishTalks from "@/components/FloatingChatWidget/data/englishTalks.json";
import { getBotResponse } from "@/components/FloatingChatWidget/chatBotEngine";
import { memoWithDeepEqual } from "@/utils/isDeepEqual";

export interface FloatingChatWidgetProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  actionLabel?: string;
  actionUrl?: string;
}

const ChatMessageItem = memoWithDeepEqual<{ message: ChatMessage }>(
  ({ message }) => {
    const isUser = message.sender === "user";
    return (
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in-50 duration-150`}
      >
        <div
          className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${isUser
              ? "bg-gradient-to-r from-[#DB2F3C] to-[#C92532] text-white rounded-tr-xs"
              : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs"
            }`}
        >
          <p className="text-xs">{message.text}</p>
          {message.actionUrl && message.actionLabel && (
            <a
              href={message.actionUrl}
              target={message.actionUrl.startsWith("http") ? "_blank" : undefined}
              rel={message.actionUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-[#DB2F3C] text-white text-[11px] font-semibold hover:bg-[#B71F2A] transition-colors"
            >
              <span>{message.actionLabel}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <span className="text-[10px] text-stone-400 mt-1 px-1 font-medium">
          {message.time}
        </span>
      </div>
    );
  },
  "ChatMessageItem"
);

const FloatingChatWidgetComponent: React.FC<FloatingChatWidgetProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const quickSuggestions = useMemo(
    () => englishTalks.quickSuggestions?.slice(0, 4) || [],
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-1",
      sender: "bot",
      text: englishTalks.welcome.greeting,
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleQuickQuestion = useCallback(
    (q: (typeof englishTalks.quickSuggestions)[0]) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: q.query,
        time: "Just now",
      };
      const botReply: ChatMessage = {
        id: `bot-${Date.now() + 1}`,
        sender: "bot",
        text: q.response,
        time: "Just now",
        actionLabel: q.actionLabel,
        actionUrl: q.actionUrl,
      };
      setMessages((prev) => [...prev, userMsg, botReply]);
    },
    []
  );

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = inputText.trim();
      if (!query) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        time: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");

      const botResult = getBotResponse(query);

      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResult.text,
          time: "Just now",
          actionLabel: botResult.actionLabel,
          actionUrl: botResult.actionUrl,
        };
        setMessages((prev) => [...prev, botReply]);
      }, 400);
    },
    [inputText]
  );

  return (
    <aside
      aria-label="Live Help and Support Chat"
      className={`fixed bottom-6 right-6 z-40 ${className}`}
    >
      {/* Expanded Chat Box with sleek opening animation & glassmorphism */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[330px] sm:w-[390px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-stone-200/90 overflow-hidden flex flex-col h-[460px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-250 ease-out origin-bottom-right z-50">
          {/* Header */}
          <div className="px-4.5 py-3.5 bg-gradient-to-r from-[#DB2F3C] via-[#E23B48] to-[#B71F2A] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs ring-2 ring-white/30 flex items-center justify-center text-white shadow-2xs">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white leading-none tracking-tight truncate">
                    Matrimony Help Desk
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/20 text-white shrink-0">
                    24x7
                  </span>
                </div>
                <p className="text-[11px] text-white/90 font-medium mt-1 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block shrink-0" />
                  <span>{englishTalks.welcome.status}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Close chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8F9FA] text-xs">
            {messages.map((m) => (
              <ChatMessageItem key={m.id} message={m} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions from englishTalks.json */}
          {quickSuggestions.length > 0 && (
            <div className="px-3.5 py-2.5 bg-stone-50/90 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto">
              {quickSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleQuickQuestion(s)}
                  className="px-3 py-1.5 rounded-full bg-white border border-stone-200/90 text-[11px] text-stone-700 font-medium hover:border-[#DB2F3C] hover:text-[#DB2F3C] hover:bg-rose-50/40 active:scale-95 shrink-0 transition-all cursor-pointer shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-stone-200/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 text-xs bg-stone-50/80 border border-stone-200 rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C]/20 focus:border-[#DB2F3C] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#DB2F3C] to-[#FF4D5A] disabled:opacity-40 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Red Trigger Button */}
      <button
        type="button"
        onClick={toggleChat}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#DB2F3C] to-[#FF4D5A] hover:from-[#B71F2A] hover:to-[#DB2F3C] text-white shadow-[0_8px_25px_-4px_rgba(219,47,60,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(219,47,60,0.65)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer"
        aria-label="Open 24x7 Help Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 fill-current" />
            {/* Subtle active pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
        )}
      </button>
    </aside>
  );
};

export const FloatingChatWidget = memoWithDeepEqual(
  FloatingChatWidgetComponent,
  "FloatingChatWidget"
);
export default FloatingChatWidget;
