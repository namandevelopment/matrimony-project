import React from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { SafetySection } from "../types";

interface SafetySectionCardProps {
  section: SafetySection;
}

export const SafetySectionCard: React.FC<SafetySectionCardProps> = React.memo(({ section }) => {
  return (
    <section
      id={section.id}
      data-safety-clause-id={section.id}
      className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs scroll-mt-28 transition-all hover:border-stone-300 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-red-100/70 text-[#DB2F3C] font-bold text-sm flex items-center justify-center font-heading">
            {section.number}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-heading">
            {section.title}
          </h2>
        </div>
        {section.badge && (
          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-[11px] font-semibold uppercase tracking-wider border border-stone-200">
            {section.badge}
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-stone-600 leading-relaxed font-medium">
        {section.summary}
      </p>

      {/* Main Narrative / Regulatory Context */}
      <div>{section.content}</div>

      {/* Dos and Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Do's Column */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recommended Best Practices (DOs)
          </div>
          <ul className="space-y-2 text-xs text-stone-700">
            {section.dos.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts Column */}
        <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/80 space-y-3">
          <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-red-600" />
            Strict Safety Prohibitions (DON&apos;Ts)
          </div>
          <ul className="space-y-2 text-xs text-stone-700">
            {section.donts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Red Flags Alert Box (if present) */}
      {section.redFlags && section.redFlags.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-stone-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Critical Red Flags to Watch Out For:
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-stone-700 pt-1">
            {section.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold shrink-0">⚠</span>
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
});

SafetySectionCard.displayName = "SafetySectionCard";
