"use client";

import React, { useState, useEffect } from "react";
import { Scale } from "lucide-react";
import { TermsSection } from "../types";

interface TermsSidebarNavProps {
  sections: readonly TermsSection[];
}

export const TermsSidebarNav: React.FC<TermsSidebarNavProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "acceptance");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
        <h3 className="font-heading font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#DB2F3C]" />
          Table of Contents
        </h3>
        <span className="text-[11px] font-semibold text-stone-400">
          {sections.length} Clauses
        </span>
      </div>
      <nav aria-label="Table of contents" className="space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 text-xs">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                isActive
                  ? "bg-red-50 text-[#DB2F3C] font-semibold"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <span className="truncate">
                {sec.number}. {sec.title}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#DB2F3C] shrink-0 ml-2" />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
