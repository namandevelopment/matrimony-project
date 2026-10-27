"use client";

import React, { memo } from "react";
import { Phone, MessageSquare, Mail, ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { SUPPORT_CHANNELS } from "../data/helpData";
import { SupportChannel } from "../types";
interface HelpContactChannelsProps {
  channels?: SupportChannel[];
}

export const HelpContactChannels: React.FC<HelpContactChannelsProps> = memo(({ channels = SUPPORT_CHANNELS }) => {
  const getIcon = (type: SupportChannel["iconType"]) => {
    switch (type) {
      case "phone":
        return <Phone className="w-5 h-5 text-[#DB2F3C]" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case "mail":
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
    }
  };

  const getCardTheme = (type: SupportChannel["iconType"], isPrimary?: boolean) => {
    if (isPrimary) {
      return "border-red-200 bg-gradient-to-br from-red-50/60 via-white to-white shadow-md shadow-red-500/5 ring-1 ring-red-100";
    }
    return "border-stone-200 bg-white hover:border-stone-300 shadow-xs hover:shadow-md";
  };

  const getButtonTheme = (type: SupportChannel["iconType"], isPrimary?: boolean) => {
    if (isPrimary) {
      return "bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] text-white hover:brightness-105 shadow-xs shadow-red-500/20";
    }
    switch (type) {
      case "message":
        return "bg-emerald-600 hover:bg-emerald-700 text-white";
      case "mail":
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "shield":
        return "bg-stone-800 hover:bg-stone-900 text-white";
      default:
        return "bg-[#DB2F3C] hover:bg-[#B71F2A] text-white";
    }
  };

  return (
    <section
      aria-label="Contact and Support Channels"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${getCardTheme(
              channel.iconType,
              channel.isPrimary
            )}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200/80 flex items-center justify-center">
                  {getIcon(channel.iconType)}
                </div>
                {channel.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      channel.isPrimary
                        ? "bg-red-100 text-[#DB2F3C] border border-red-200"
                        : channel.iconType === "message"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}
                  >
                    {channel.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-heading font-bold text-stone-900 text-base">
                  {channel.title}
                </h3>
                <p className="text-xs text-stone-500 leading-snug mt-1 line-clamp-2">
                  {channel.subtitle}
                </p>
              </div>

              <div className="pt-1">
                <p className="text-sm font-bold text-stone-800 tracking-tight select-all font-mono">
                  {channel.displayValue}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                  <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{channel.timing}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-100">
              <a
                href={channel.actionHref}
                target={channel.actionHref.startsWith("http") ? "_blank" : undefined}
                rel={channel.actionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${getButtonTheme(
                  channel.iconType,
                  channel.isPrimary
                )}`}
              >
                <span>{channel.actionLabel}</span>
                {channel.actionHref.startsWith("http") ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <span aria-hidden="true">→</span>
                )}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

HelpContactChannels.displayName = "HelpContactChannels";
