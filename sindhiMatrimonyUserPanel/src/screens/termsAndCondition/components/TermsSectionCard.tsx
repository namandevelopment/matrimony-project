import React from "react";
import { TermsSection } from "../types";

interface TermsSectionCardProps {
  section: TermsSection;
}

export const TermsSectionCard: React.FC<TermsSectionCardProps> = ({ section }) => {
  return (
    <section
      id={section.id}
      data-clause-id={section.id}
      className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs scroll-mt-28 transition-all hover:border-stone-300"
    >
      {/* Clause Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-stone-100">
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

      {/* Clause Body */}
      <div className="text-sm leading-relaxed text-stone-700">
        {section.content}
      </div>
    </section>
  );
};
