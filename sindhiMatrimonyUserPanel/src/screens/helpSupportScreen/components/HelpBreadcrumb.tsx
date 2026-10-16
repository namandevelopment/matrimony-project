import React, { memo } from "react";
import Link from "next/link";
import { ChevronRight, Home, HelpCircle } from "lucide-react";

export const HelpBreadcrumb: React.FC = memo(() => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full bg-white border-b border-stone-200 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-medium text-stone-500"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-[#DB2F3C] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#DB2F3C]" />
          <span>Help &amp; Support</span>
        </span>
      </div>
    </nav>
  );
});

HelpBreadcrumb.displayName = "HelpBreadcrumb";
