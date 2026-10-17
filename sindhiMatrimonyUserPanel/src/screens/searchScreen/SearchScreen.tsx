"use client";

import React, { memo } from "react";
import { DashboardSearchView } from "@/screens/dashboardScreen/components/DashboardSearchView";
import { SearchScreenProps } from "./types";

const SearchScreenComponent: React.FC<SearchScreenProps> = ({
  onUpgradeClick,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-10rem)] py-6 px-4">
      <DashboardSearchView onUpgradeClick={onUpgradeClick} />
    </div>
  );
};

export const SearchScreen = memo(SearchScreenComponent);
SearchScreen.displayName = "SearchScreen";
export default SearchScreen;
