"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import type { DashboardNavTab } from "../types";

export interface DashboardNavContextValue {
  activeTab: DashboardNavTab["id"];
  onTabChange: (tabId: DashboardNavTab["id"]) => void;
  notificationCount?: number;
  isInsideProvider?: boolean;
}

export const defaultNavContext: DashboardNavContextValue = {
  activeTab: "home",
  onTabChange: () => {},
  notificationCount: 0,
  isInsideProvider: false,
};

const DashboardNavContext = createContext<DashboardNavContextValue>(defaultNavContext);

export function useDashboardNav(): DashboardNavContextValue {
  return useContext(DashboardNavContext);
}

export interface DashboardNavProviderProps {
  activeTab: DashboardNavTab["id"];
  onTabChange: (tabId: DashboardNavTab["id"]) => void;
  notificationCount?: number;
  children: ReactNode;
}

export const DashboardNavProvider: React.FC<DashboardNavProviderProps> = ({
  activeTab,
  onTabChange,
  notificationCount = 0,
  children,
}) => {
  const value = useMemo(
    () => ({
      activeTab,
      onTabChange,
      notificationCount,
      isInsideProvider: true,
    }),
    [activeTab, onTabChange, notificationCount]
  );

  return (
    <DashboardNavContext.Provider value={value}>
      {children}
    </DashboardNavContext.Provider>
  );
};
