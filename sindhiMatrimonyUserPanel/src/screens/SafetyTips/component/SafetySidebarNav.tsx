import React from "react";
import { Shield, ChevronRight } from "lucide-react";
import { SafetySection } from "../types";

interface SafetySidebarNavProps {
  sections: readonly SafetySection[];
}

export const SafetySidebarNav: React.FC<SafetySidebarNavProps> = React.memo(({ sections }) => {
  return (
    <nav
      aria-label="Safety Guidelines Table of Contents"
      className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-4 mb-3 border-b border-stone-100">
        <div className="p-1.5 bg-red-100/70 text-[#DB2F3C] rounded-lg">
          <Shield className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-stone-900 font-heading">
          Safety Topics Directory
        </h2>
      </div>

      <ul className="space-y-1 text-xs">
        {sections.map((sec) => (
          <li key={sec.id}>
            <a
              href={`#${sec.id}`}
              className="flex items-center justify-between p-2.5 rounded-xl text-stone-600 hover:text-[#DB2F3C] hover:bg-red-50/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-bold flex items-center justify-center shrink-0 group-hover:bg-[#DB2F3C] group-hover:text-white transition-colors">
                  {sec.number}
                </span>
                <span className="truncate font-medium">{sec.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#DB2F3C] shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});

SafetySidebarNav.displayName = "SafetySidebarNav";
