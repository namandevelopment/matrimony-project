import React from "react";
import { PhoneCall, Mail, ExternalLink, ShieldAlert } from "lucide-react";
import { EMERGENCY_CONTACTS } from "../data/safetyData";

export const SafetyEmergencyCard: React.FC = React.memo(() => {
  return (
    <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm border border-stone-800 space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-stone-800">
        <div className="p-2 bg-red-600/30 text-[#FF4A57] rounded-xl border border-red-500/30">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-heading text-white">
            Emergency &amp; Cyber Helplines
          </h3>
          <p className="text-[11px] text-stone-400">
            Immediate 24x7 reporting escalation channels
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {EMERGENCY_CONTACTS.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between gap-3 text-xs"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-200 truncate">
                  {item.title}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-red-950 text-red-300 border border-red-800">
                  {item.badge}
                </span>
              </div>
              <div className="font-mono font-bold text-white text-sm mt-0.5">
                {item.numberOrEmail}
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-tight line-clamp-1">
                {item.description}
              </p>
            </div>

            <a
              href={item.actionUrl}
              target={item.actionUrl.startsWith("http") ? "_blank" : undefined}
              rel={item.actionUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-3 py-1.5 rounded-lg bg-[#DB2F3C] hover:bg-red-700 text-white font-semibold text-[11px] shrink-0 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              {item.actionUrl.startsWith("tel:") ? (
                <PhoneCall className="w-3 h-3" />
              ) : item.actionUrl.startsWith("mailto:") ? (
                <Mail className="w-3 h-3" />
              ) : (
                <ExternalLink className="w-3 h-3" />
              )}
              {item.actionLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
});

SafetyEmergencyCard.displayName = "SafetyEmergencyCard";
