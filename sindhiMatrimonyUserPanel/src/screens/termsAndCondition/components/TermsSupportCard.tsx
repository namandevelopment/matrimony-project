import React from "react";
import { HeartHandshake, Mail } from "lucide-react";

export const TermsSupportCard: React.FC = React.memo(() => {
  return (
    <div className="bg-gradient-to-br from-red-500 to-[#B71F2A] text-white p-5 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <HeartHandshake className="w-5 h-5 text-red-200" />
        <h4 className="font-heading font-bold text-sm">Have Questions?</h4>
      </div>
      <p className="text-xs text-red-100 leading-relaxed">
        Our dedicated member grievance and matrimonial support team is available to assist you with any policy or profile inquiries.
      </p>
      <div className="pt-1">
        <a
          href="mailto:support@sindhimatrimony.com"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-[#DB2F3C] hover:bg-red-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email Support
        </a>
      </div>
    </div>
  );
});

TermsSupportCard.displayName = "TermsSupportCard";
