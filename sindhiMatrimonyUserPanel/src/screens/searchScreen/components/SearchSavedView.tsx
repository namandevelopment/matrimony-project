"use client";

import React, { memo } from "react";
import { BookmarkCheck } from "lucide-react";

export interface SearchSavedViewProps {
  className?: string;
}

const SearchSavedViewComponent: React.FC<SearchSavedViewProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`p-10 sm:p-14 text-center max-w-md mx-auto space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
        <BookmarkCheck className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-stone-900">
        No Saved Searches Yet
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed">
        Save frequent partner search criteria here to find newly registered profiles with a single click.
      </p>
    </div>
  );
};

export const SearchSavedView = memo(SearchSavedViewComponent);
SearchSavedView.displayName = "SearchSavedView";
export default SearchSavedView;
