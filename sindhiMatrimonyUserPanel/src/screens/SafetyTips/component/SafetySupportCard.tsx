import React from "react";
import { Mail, Phone, ShieldAlert } from "lucide-react";
import { SAFETY_META } from "../data/safetyData";

export const SafetySupportCard: React.FC = React.memo(() => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <div className="p-1.5 bg-red-100/70 text-[#DB2F3C] rounded-lg">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-stone-900 font-heading">
          Trust &amp; Safety Desk
        </h3>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Encountered a suspicious profile or financial request? Report directly to our senior safety officers.
      </p>

      <div className="space-y-2 pt-1 text-xs">
        <a
          href={`mailto:${SAFETY_META.trustEmail}`}
          className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 hover:bg-red-50 text-stone-700 hover:text-[#DB2F3C] border border-stone-200 transition-colors"
        >
          <Mail className="w-4 h-4 text-[#DB2F3C] shrink-0" />
          <span className="truncate font-medium">{SAFETY_META.trustEmail}</span>
        </a>
        <a
          href="tel:1930"
          className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 transition-colors"
        >
          <Phone className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-bold">National Cyber Crime: 1930</span>
        </a>
      </div>
    </div>
  );
});

SafetySupportCard.displayName = "SafetySupportCard";
