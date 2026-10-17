"use client";

import React, { memo, useState, useCallback } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";

export interface FloatingChatWidgetProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
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
      text: "Namaste! Welcome to Matrimony Support. How can I help you find your dream partner today?",
      time: "Just now",
    },
  ]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: inputText.trim(),
        time: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");

      // Simulated auto-reply
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Thank you for reaching out! Our matchmaking counselor will assist you shortly, or you can check our Assisted Service plan for 3X faster matches.",
          time: "Just now",
        };
        setMessages((prev) => [...prev, botReply]);
      }, 700);
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
                <p className="text-[10px] text-white/80 mt-1">24x7 Relationship Support</p>
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
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

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
