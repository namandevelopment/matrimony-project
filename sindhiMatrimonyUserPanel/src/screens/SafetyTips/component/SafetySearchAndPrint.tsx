"use client";

import React, { useState, useId, useCallback, useEffect } from "react";
import { Printer, Search, X } from "lucide-react";

export const SafetySearchAndPrint: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputId = useId();

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const term = query.trim().toLowerCase();
    const articles = document.querySelectorAll<HTMLElement>("section[data-safety-clause-id]");
    const emptyNotice = document.getElementById("safety-empty-search-notice");

    let matchCount = 0;
    articles.forEach((el) => {
      const text = el.innerText.toLowerCase();
      const id = (el.getAttribute("data-safety-clause-id") || "").toLowerCase();
      if (!term || text.includes(term) || id.includes(term)) {
        el.style.display = "";
        matchCount++;
      } else {
        el.style.display = "none";
      }
    });

    if (emptyNotice) {
      emptyNotice.style.display = matchCount === 0 && term ? "block" : "none";
    }
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    const articles = document.querySelectorAll<HTMLElement>("section[data-safety-clause-id]");
    const emptyNotice = document.getElementById("safety-empty-search-notice");
    articles.forEach((el) => {
      el.style.display = "";
    });
    if (emptyNotice) {
      emptyNotice.style.display = "none";
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const articles = document.querySelectorAll<HTMLElement>("section[data-safety-clause-id]");
      articles.forEach((el) => {
        el.style.display = "";
      });
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
      {/* Search Input Bar */}
      <div className="relative flex-1 sm:w-80">
        <label htmlFor={searchInputId} className="sr-only">
          Search Safety Tips
        </label>
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          id={searchInputId}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Filter tips (money, meeting, cyber, police)..."
          className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C] focus:border-[#DB2F3C] text-stone-800 placeholder-stone-400 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 rounded-full cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Print Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs sm:text-sm font-medium rounded-xl shadow-xs hover:bg-stone-50 transition-all cursor-pointer shrink-0"
        title="Print or Save Safety Guidelines as PDF"
      >
        <Printer className="w-4 h-4 text-stone-600" />
        <span>Print Guidelines</span>
      </button>
    </div>
  );
});

SafetySearchAndPrint.displayName = "SafetySearchAndPrint";
