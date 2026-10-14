"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  ThumbsUp,
  Smile,
  Paperclip,
} from "lucide-react";
import type { ChatMessage, QuickSuggestion, FloatingChatWidgetProps } from "./types";

const DEFAULT_SUGGESTIONS: QuickSuggestion[] = [
  {
    id: "search",
    label: "💍 Find Matches",
    query: "How can I find compatible Sindhi matches?",
    response:
      "You can browse thousands of verified profiles by Sub-caste (Bhaiband, Amil, Lohana, Sahiti, etc.), City, Education, and Horoscope. Register for free to start viewing matches!",
    actionLabel: "Browse Matches",
    actionUrl: "#browse-matches",
  },
  {
    id: "membership",
    label: "👑 Membership Plans",
    query: "What are the premium membership benefits?",
    response:
      "Our Premium Membership includes direct contact views, personalized matchmaker assistance, verified contact numbers, and priority profile placement.",
    actionLabel: "View Plans",
    actionUrl: "#plans",
  },
  {
    id: "verify",
    label: "🛡️ Profile Verification",
    query: "How is profile verification done?",
    response:
      "All profiles undergo a strict 2-step verification process including Government ID check and phone number verification to ensure 100% genuine Sindhi matches.",
  },
  {
    id: "whatsapp",
    label: "💬 Talk on WhatsApp",
    query: "I would like to speak directly with a relationship manager.",
    response:
      "Our dedicated relationship managers are available on WhatsApp to assist you immediately. Click below to chat now!",
    actionLabel: "Chat on WhatsApp",
    actionUrl: "https://wa.me/918769530667?text=Hello%20Sindhi%20Matrimony%2C%20I%20need%20help%20with%20finding%20matches",
  },
];

const FloatingChatWidgetComponent: React.FC<FloatingChatWidgetProps> = ({
  title = "Sindhi Matrimony Support",
  subtitle = "Typically replies in 1 minute • Online",
  whatsappNumber = "918769530667",
  supportEmail = "support@sindhimatrimony.com",
  initialGreeting = "Namaste! 🙏 Welcome to Sindhi Matrimony. Looking for your perfect life partner or need help setting up your profile?",
  onOpen,
  onClose,
}) => {
  // Completely isolated local state - ensures 0 re-renders on the parent page
  const [isOpen, setIsOpen] = useState(false);
  const [isTeaserDismissed, setIsTeaserDismissed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "initial-msg-1",
      sender: "support",
      text: initialGreeting,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll inside chat box only (never affects page window scroll)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);


  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Subtle delayed focus for good UX without stealing mobile focus abruptly
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setHasUnread(false);
        setIsTeaserDismissed(true);
        try {
          sessionStorage.setItem("chat_teaser_dismissed", "true");
        } catch {
          // ignore
        }
        onOpen?.();
      } else {
        onClose?.();
      }
      return nextState;
    });
  }, [onOpen, onClose]);

  const handleDismissTeaser = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTeaserDismissed(true);
    try {
      sessionStorage.setItem("chat_teaser_dismissed", "true");
    } catch {
      // ignore
    }
  }, []);

  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const query = (textToSend || inputText).trim();
      if (!query) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInputText("");
      setIsTyping(true);

      // Subtle bot reply after 700ms simulation
      setTimeout(() => {
        setIsTyping(false);
        const lower = query.toLowerCase();

        let replyText =
          "Thank you for reaching out! Our Sindhi relationship manager is reviewing your query. You can also connect with us directly on WhatsApp for immediate assistance.";
        let actionLabel = "Chat on WhatsApp";
        let actionUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `Hi Sindhi Matrimony, I asked: ${query}`
        )}`;

        if (lower.includes("price") || lower.includes("cost") || lower.includes("plan") || lower.includes("membership")) {
          replyText =
            "We have flexible Premium Plans offering direct contact numbers, horoscope matching, and personal relationship managers. Click below to view plan details or chat with our team.";
          actionLabel = "View Plans on WhatsApp";
        } else if (lower.includes("match") || lower.includes("profile") || lower.includes("register")) {
          replyText =
            "Registration is completely free! You can search profiles by gotra, education, city, and sub-caste with 100% privacy control.";
          actionLabel = "Register / Connect Now";
        }

        const botReply: ChatMessage = {
          id: `support-${Date.now()}`,
          sender: "support",
          text: replyText,
          timestamp: "Just now",
          actionType: "whatsapp",
          actionUrl,
          actionLabel,
        };

        setMessages((prev) => [...prev, botReply]);
      }, 750);
    },
    [inputText, whatsappNumber]
  );

  const handleQuickSuggestionClick = useCallback(
    (s: QuickSuggestion) => {
      handleSendMessage(s.query);
    },
    [handleSendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleQuickLike = useCallback(() => {
    handleSendMessage("👍 Interested!");
  }, [handleSendMessage]);

  const whatsappDirectUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Sindhi%20Matrimony%2C%20I%20need%20assistance`;

  return (
    <aside
      aria-label="Customer Support Chat"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none"
    >
      {/* 1. CHAT WINDOW (Smooth Scale & Fade with GPU acceleration) */}
      <div
        className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right mb-3 ${isOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-4 pointer-events-none select-none hidden"
          }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#DB2F3C] via-[#FF4A57] to-[#B71F2A] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 backdrop-blur-sm border border-white/40 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.webp"
                    alt="Sindhi Matrimony"
                    width={36}
                    height={36}
                    className="object-contain rounded-full"
                    priority
                  />
                </div>
                {/* Active Indicator */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm"
                  title="Online"
                />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  {title}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h3>
                <p className="text-[11px] text-white/90 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block" />
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* WhatsApp direct call button */}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white"
              >
                <PhoneCall className="w-4 h-4" />
              </a>

              {/* Minimize / Close Button */}
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Close Chat"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Contact Bar Banner (matching screenshot 2 style) */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50/50 border-b border-red-100 px-3.5 py-2 text-[11px] text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[#B71F2A] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DB2F3C]" />
              Official Helpdesk
            </span>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DB2F3C] hover:text-[#B71F2A] font-bold inline-flex items-center gap-0.5 hover:underline"
            >
              WhatsApp Support
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-[#FBFBFC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`animate-chat-bubble flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                  }`}
              >
                {msg.sender === "support" && (
                  <span className="text-[10px] font-semibold text-gray-500 mb-1 ml-1 flex items-center gap-1">
                    Sindhi Matrimony Team
                  </span>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${msg.sender === "user"
                    ? "bg-gradient-to-br from-[#DB2F3C] to-[#B71F2A] text-white rounded-br-xs font-normal"
                    : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs"
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Optional Action Button inside bubble */}
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs rounded-lg transition-all shadow-sm"
                    >
                      <span>{msg.actionLabel || "Proceed"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-1.5 bg-white border border-gray-200 px-3 py-2 rounded-2xl w-fit shadow-xs">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-typing-1" />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-typing-2" />
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-typing-3" />
                <span className="text-[10px] text-gray-400 ml-1">Typing...</span>
              </div>
            )}

            {/* Quick Suggestion Chips */}
            {messages.length <= 3 && !isTyping && (
              <div className="pt-2">
                <p className="text-[11px] font-medium text-gray-400 mb-2">
                  Frequently asked questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_SUGGESTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleQuickSuggestionClick(s)}
                      className="text-left text-xs bg-white hover:bg-red-50 hover:text-[#DB2F3C] hover:border-red-200 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-gray-200/90 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 rounded-full px-3 py-1.5 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="flex-1 text-xs sm:text-[13px] bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
              />

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleQuickLike}
                  title="Send thumbs up"
                  className="p-1 text-gray-400 hover:text-amber-500 active:scale-90 transition-all"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${inputText.trim()
                    ? "bg-[#DB2F3C] text-white hover:bg-[#B71F2A] active:scale-90 shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                🔒 100% Confidential
              </span>
              <span>Direct Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FLOATING TRIGGER BUTTON & "WE ARE HERE! 👋" BADGE */}
      <div className="pointer-events-auto flex items-end justify-end space-x-2.5 relative">
        {/* Animated "We Are Here!" Tooltip Badge (matching screenshot 1) */}
        {!isOpen && !isTeaserDismissed && (
          <div className="animate-chat-float relative flex items-center mb-1 select-none">
            <div
              onClick={handleToggle}
              className="group cursor-pointer bg-white text-gray-800 border-2 border-emerald-500/80 rounded-2xl py-1.5 pl-3 pr-2.5 shadow-lg shadow-emerald-900/10 flex items-center gap-1.5 hover:border-emerald-600 transition-all hover:scale-102"
            >
              <span className="animate-chat-wave text-base inline-block">
                👋
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 tracking-tight leading-tight flex items-center gap-1">
                  We Are Here!
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold leading-tight">
                  Online • Need help?
                </span>
              </div>

              {/* Dismiss X button */}
              <button
                type="button"
                onClick={handleDismissTeaser}
                aria-label="Dismiss greeting"
                className="ml-1 p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speech bubble pointer triangle */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t-2 border-r-2 border-emerald-500/80 transform rotate-45" />
          </div>
        )}

        {/* Floating Circular Toggle Button */}
        <div className="relative group">
          {/* Subtle pulsating outer ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 to-emerald-500 opacity-30 animate-chat-ring -z-10" />

          <button
            type="button"
            onClick={handleToggle}
            aria-label={isOpen ? "Close Support Chat" : "Open Support Chat"}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-emerald-500 shadow-xl shadow-red-950/15 flex items-center justify-center p-1.5 transition-transform duration-300 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#DB2F3C] transition-transform duration-200 rotate-0 hover:rotate-90" />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/images/logo.webp"
                  alt="Sindhi Matrimony Support"
                  width={46}
                  height={46}
                  className="object-contain rounded-full"
                  priority
                />

                {/* Unread dot / Active status */}
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                )}
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export const FloatingChatWidget = memo(FloatingChatWidgetComponent);
FloatingChatWidget.displayName = "FloatingChatWidget";
