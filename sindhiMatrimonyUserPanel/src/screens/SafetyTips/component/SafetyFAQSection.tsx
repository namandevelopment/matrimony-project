"use client";

import React, { useState, useCallback } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { SAFETY_FAQS } from "../data/safetyData";

export const SafetyFAQSection: React.FC = React.memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="safety-faqs"
      aria-label="Frequently Asked Questions on Matrimonial Safety"
      className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="p-2 bg-red-100/70 text-[#DB2F3C] rounded-xl">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-heading">
            Frequently Asked Questions (Safety FAQs)
          </h2>
          <p className="text-xs text-stone-500">
            Clear answers to common matrimonial safety and profile security questions
          </p>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {SAFETY_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left font-heading font-bold text-sm sm:text-base text-stone-800 hover:text-[#DB2F3C] transition-colors cursor-pointer group"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 group-hover:text-[#DB2F3C] transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-[#DB2F3C]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

SafetyFAQSection.displayName = "SafetyFAQSection";
