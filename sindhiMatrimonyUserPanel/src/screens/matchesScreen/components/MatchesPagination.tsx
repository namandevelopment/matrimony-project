"use client";

import React, { memo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MatchesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const MatchesPaginationComponent: React.FC<MatchesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const [jumpPageInput, setJumpPageInput] = useState("");

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleJumpSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = parseInt(jumpPageInput.trim(), 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
        setJumpPageInput("");
      }
    },
    [jumpPageInput, totalPages, onPageChange]
  );

  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-stone-200 text-xs sm:text-[13px] ${className}`}
      aria-label="Matches Pagination"
    >
      {/* Left: Previous, Page Numbers, Next */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentPage <= 1
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-600 hover:text-stone-900 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          {pagesArray.map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center font-semibold text-xs sm:text-[13px] transition-all cursor-pointer ${
                  isActive
                    ? "border border-stone-800 text-stone-900 bg-white shadow-2xs font-bold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            currentPage >= totalPages
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-600 hover:text-stone-900 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Go to page [input] [GO] */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <label htmlFor="jump-page-input" className="text-stone-600 font-medium">
          Go to page
        </label>
        <input
          id="jump-page-input"
          type="number"
          min={1}
          max={totalPages}
          value={jumpPageInput}
          onChange={(e) => setJumpPageInput(e.target.value)}
          placeholder=""
          className="w-12 px-2 py-1 text-center bg-white border border-stone-300 rounded text-stone-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#DB2F3C] focus:border-[#DB2F3C]"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded text-xs font-bold text-stone-700 hover:text-stone-900 transition-colors uppercase cursor-pointer"
        >
          GO
        </button>
      </form>
    </div>
  );
};

export const MatchesPagination = memo(MatchesPaginationComponent);
MatchesPagination.displayName = "MatchesPagination";
export default MatchesPagination;
