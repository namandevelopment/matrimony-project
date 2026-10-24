"use client";

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, ExternalLink } from "lucide-react";
import englishTalks from "@/components/FloatingChatWidget/data/englishTalks.json";
import { getBotResponse } from "@/components/FloatingChatWidget/chatBotEngine";

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

const FloatingChatWidgetComponent: React.FC<FloatingChatWidgetProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
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
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[420px] animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#DB2F3C] to-[#B71F2A] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-none">Matrimony Help Desk</h4>
                <p className="text-[10px] text-white/80 mt-1">{englishTalks.welcome.status}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8F9FA] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-2xs ${
                    m.sender === "user"
                      ? "bg-[#DB2F3C] text-white rounded-br-xs"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.actionUrl && m.actionLabel && (
                    <a
                      href={m.actionUrl}
                      target={m.actionUrl.startsWith("http") ? "_blank" : undefined}
                      rel={m.actionUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-[#DB2F3C] text-white text-[11px] font-semibold hover:bg-[#B71F2A] transition-colors"
                    >
                      <span>{m.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions from englishTalks.json */}
          {englishTalks.quickSuggestions?.length > 0 && (
            <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto">
              {englishTalks.quickSuggestions.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleQuickQuestion(s)}
                  className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] text-stone-700 font-medium hover:border-[#DB2F3C] hover:text-[#DB2F3C] shrink-0 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-full focus:outline-hidden focus:ring-1 focus:ring-[#DB2F3C]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#DB2F3C] text-white flex items-center justify-center hover:bg-[#B71F2A] transition-colors cursor-pointer shrink-0"
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
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#DB2F3C] to-[#FF4D5A] hover:from-[#B71F2A] hover:to-[#DB2F3C] text-white shadow-xl hover:shadow-red-500/30 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
        aria-label="Open 24x7 Help Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 fill-current" />
            {/* Subtle active pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
        )}
      </button>
    </aside>
  );
};

export const FloatingChatWidget = memo(FloatingChatWidgetComponent);
FloatingChatWidget.displayName = "FloatingChatWidget";
export default FloatingChatWidget;
