import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const TermsBreadcrumb: React.FC = React.memo(() => {
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
        <span className="text-stone-600">Legal &amp; Policy</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-[#DB2F3C] font-semibold" aria-current="page">
          Terms &amp; Conditions
        </span>
      </div>
    </nav>
  );
});

TermsBreadcrumb.displayName = "TermsBreadcrumb";
