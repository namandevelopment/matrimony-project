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
  AlertTriangle,
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
    actionUrl: "/dashboard",
  },
  {
    id: "membership",
    label: "👑 Membership Plans",
    query: "What are the premium membership benefits?",
    response:
      "Our Premium Membership includes direct contact views, personalized matchmaker assistance, verified contact numbers, and priority profile placement.",
    actionLabel: "View Plans",
    actionUrl: "https://wa.me/918769530667?text=Hello%20Sindhi%20Matrimony%2C%20please%20share%20plans",
  },
  {
    id: "registration",
    label: "📝 Free Registration",
    query: "Registration kaise kare?",
    response:
      "Sindhi Matrimony par registration bilkul 100% free aur aasan hai. Kewal 4 steps me apni profile create karein!",
    actionLabel: "Start Free Registration",
    actionUrl: "/registration/basic-info",
  },
  {
    id: "gotra",
    label: "🕉️ Gotra & Sub-caste",
    query: "Gotra aur Sub-caste kaise search karein?",
    response:
      "Aap Bhaiband, Amil, Lohana, Sahiti aadi sub-castes aur apne Gotra (Nukh) ke anusaar compatible profiles filter kar sakte hain.",
    actionLabel: "Filter by Gotra",
    actionUrl: "/dashboard",
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
      suggestedQuestions: [
        "Free Registration Kaise Kare?",
        "Find Compatible Sindhi Matches",
        "Membership Plans & Fees",
        "Talk to Relationship Manager",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Clean up all pending timers on unmount to guarantee zero memory leaks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (botTimerRef.current) {
        clearTimeout(botTimerRef.current);
      }
    };
  }, []);

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

  // Pre-load the bot engine lazily in idle time or on user interaction
  const prefetchBotEngine = useCallback(() => {
    import("./chatBotEngine").catch(() => {});
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        prefetchBotEngine();
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
  }, [onOpen, onClose, prefetchBotEngine]);

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

      // Clear any pending reply timer before starting a new one
      if (botTimerRef.current) {
        clearTimeout(botTimerRef.current);
      }

      // Bot response based on intelligent knowledge base & moderation (Lazy Loaded)
      botTimerRef.current = setTimeout(async () => {
        try {
          const { getBotResponse } = await import("./chatBotEngine");
          if (!isMountedRef.current) return;
          const botResult = getBotResponse(query, { whatsappNumber });

          const botReply: ChatMessage = {
            id: `support-${Date.now()}`,
            sender: "support",
            text: botResult.text,
            timestamp: "Just now",
            actionType: botResult.actionType,
            actionUrl: botResult.actionUrl,
            actionLabel: botResult.actionLabel,
            suggestedQuestions: botResult.suggestedQuestions,
            isAbusiveWarning: botResult.isAbusiveWarning,
          };

          if (isMountedRef.current) {
            setMessages((prev) => [...prev, botReply]);
          }
        } catch {
          if (isMountedRef.current) {
            setMessages((prev) => [
              ...prev,
              {
                id: `support-${Date.now()}`,
                sender: "support",
                text: "Namaste! 🙏 Hamare Sindhi Relationship Manager se seedhe WhatsApp par baat karein:",
                timestamp: "Just now",
                actionType: "whatsapp",
                actionUrl: `https://wa.me/${whatsappNumber}?text=Namaste%2C%20I%20need%20assistance`,
                actionLabel: "Chat on WhatsApp",
              },
            ]);
          }
        } finally {
          if (isMountedRef.current) {
            setIsTyping(false);
          }
        }
      }, 650);
    },
    [inputText, whatsappNumber]
  );

  const handleQuickSuggestionClick = useCallback(
    (s: QuickSuggestion) => {
      handleSendMessage(s.query);
    },
    [handleSendMessage]
  );

  // IME-safe enter-to-submit handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // Block submission if IME composition is active (Chinese/Japanese/Hindi virtual typing)
        if (e.nativeEvent.isComposing || e.keyCode === 229) {
          return;
        }
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none transform-gpu will-change-transform"
    >
      {/* 1. CHAT WINDOW (Smooth Scale & Fade with GPU acceleration) */}
      <div
        className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right mb-3 ${isOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-4 pointer-events-none select-none hidden"
          }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] h-[550px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden">
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

          {/* Quick Contact Bar Banner */}
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
                    {msg.isAbusiveWarning ? (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Community Moderation
                      </span>
                    ) : (
                      "Sindhi Matrimony Team"
                    )}
                  </span>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm transition-all ${msg.sender === "user"
                    ? "bg-gradient-to-br from-[#DB2F3C] to-[#B71F2A] text-white rounded-br-xs font-normal"
                    : msg.isAbusiveWarning
                      ? "bg-amber-50/95 text-amber-950 border border-amber-300 rounded-bl-xs shadow-amber-900/5 font-medium"
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs"
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Optional Action Button inside bubble */}
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target={msg.actionUrl.startsWith("http") ? "_blank" : undefined}
                      rel={msg.actionUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-white font-medium text-xs rounded-lg transition-all shadow-sm active:scale-95 ${msg.actionType === "whatsapp" || msg.actionUrl.includes("wa.me")
                        ? "bg-[#25D366] hover:bg-[#20bd5a]"
                        : "bg-gradient-to-r from-[#DB2F3C] to-[#B71F2A] hover:brightness-105"
                        }`}
                    >
                      <span>{msg.actionLabel || "Proceed"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Follow-up Quick Suggestion Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={`${msg.id}-sq-${idx}`}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          className="text-left text-[11px] bg-red-50/90 hover:bg-red-100 text-[#B71F2A] hover:text-[#DB2F3C] border border-red-200/80 px-2.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
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

            {/* Initial Quick Suggestion Chips when conversation just started */}
            {messages.length <= 1 && !isTyping && (
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
                      className="text-left text-xs bg-white hover:bg-red-50 hover:text-[#DB2F3C] hover:border-red-200 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95 cursor-pointer"
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
                placeholder="Apna prashna type karein..."
                aria-label="Chat input"
                className="flex-1 text-xs sm:text-[13px] bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
              />

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleQuickLike}
                  title="Send thumbs up"
                  aria-label="Interested thumbs up"
                  className="p-1 text-gray-400 hover:text-amber-500 active:scale-90 transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${inputText.trim()
                    ? "bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 text-white active:scale-90 shadow-sm"
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
              <span>Sindhi Family Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FLOATING TRIGGER BUTTON & "WE ARE HERE! 👋" BADGE */}
      <div className="pointer-events-auto flex items-end justify-end space-x-2.5 relative">
        {/* Animated "We Are Here!" Tooltip Badge */}
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
            onMouseEnter={prefetchBotEngine}
            aria-label={isOpen ? "Close Support Chat" : "Open Support Chat"}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-emerald-500 shadow-xl shadow-red-950/15 flex items-center justify-center p-1.5 transition-transform duration-300 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200 cursor-pointer"
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
