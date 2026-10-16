"use client";

import React, { memo } from "react";
import { HelpFAQ } from "../types";
import { ChevronDown, HelpCircle } from "lucide-react";

interface HelpFAQSectionProps {
  faqs: HelpFAQ[];
}

export const HelpFAQSection: React.FC<HelpFAQSectionProps> = memo(({ faqs }) => {
  return (
    <section
      id="faq-section"
      aria-label="Frequently Asked Questions"
      className="w-full bg-stone-50 border-y border-stone-200 py-14 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DB2F3C] text-xs font-semibold border border-red-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            Quick answers to the most common queries regarding accounts, privacy, verification, and matchmaking policies.
          </p>
        </div>

        {/* Native Mutually Exclusive Accessible Details Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.id}
              name="help-faq-accordion"
              open={index === 0}
              className="group bg-white rounded-2xl border border-stone-200 shadow-2xs open:border-[#DB2F3C]/40 open:ring-1 open:ring-[#DB2F3C]/10 transition-all duration-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 sm:p-6 text-sm sm:text-base font-bold text-stone-800 cursor-pointer list-none select-none hover:text-[#DB2F3C] transition-colors gap-4">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-100 group-open:bg-red-50 text-stone-500 group-open:text-[#DB2F3C] text-xs flex items-center justify-center shrink-0 font-mono transition-colors">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 group-open:text-[#DB2F3C] transition-transform duration-200 shrink-0" />
              </summary>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 group-open:bg-stone-50/50">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});

HelpFAQSection.displayName = "HelpFAQSection";
