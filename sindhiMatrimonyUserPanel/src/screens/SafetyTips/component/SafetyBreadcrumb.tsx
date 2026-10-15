import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export const SafetyBreadcrumb: React.FC = React.memo(() => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full bg-white border-b border-stone-200/80 text-xs py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-stone-500">
        <Link
          href="/"
          className="hover:text-[#DB2F3C] transition-colors flex items-center gap-1 font-medium"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-600 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Trust &amp; Safety
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-[#DB2F3C] font-semibold" aria-current="page">
          Safety Tips &amp; Fraud Prevention
        </span>
      </div>
    </nav>
  );
});

SafetyBreadcrumb.displayName = "SafetyBreadcrumb";
