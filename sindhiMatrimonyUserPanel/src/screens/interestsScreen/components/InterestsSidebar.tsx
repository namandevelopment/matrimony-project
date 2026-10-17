"use client";

import React, { memo } from "react";
import { InterestSection, InterestStatus } from "../types";

export interface InterestsSidebarProps {
  currentSection: InterestSection;
  currentStatus: InterestStatus;
  onSelect: (section: InterestSection, status: InterestStatus) => void;
  counts?: Partial<Record<string, number>>;
  className?: string;
}

interface NavItemConfig {
  status: InterestStatus;
  label: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { status: "all", label: "All" },
  { status: "pending", label: "Pending" },
  { status: "accepted", label: "Accepted / replied" },
  { status: "declined", label: "Declined" },
];

const InterestsSidebarComponent: React.FC<InterestsSidebarProps> = ({
  currentSection,
  currentStatus,
  onSelect,
  counts,
  className = "",
}) => {
  return (
    <aside
      aria-label="Interests Categories Sidebar"
      className={`w-full lg:w-64 xl:w-72 shrink-0 bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-6 ${className}`}
    >
      {/* 1. Interests Received Group */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Interests Received
        </h3>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentSection === "received" && currentStatus === item.status;
            const countKey = `received_${item.status}`;
            const count = counts?.[countKey];

            return (
              <li key={`received-${item.status}`}>
                <button
                  type="button"
                  onClick={() => onSelect("received", item.status)}
                  className={`w-full text-left py-1 px-1.5 text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "text-[#DB2F3C] font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span>{item.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="text-[11px] text-stone-400">({count})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <hr className="border-stone-200" />

      {/* 2. Interests Sent Group */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 tracking-tight">
          Interests Sent
        </h3>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentSection === "sent" && currentStatus === item.status;
            const countKey = `sent_${item.status}`;
            const count = counts?.[countKey];

            return (
              <li key={`sent-${item.status}`}>
                <button
                  type="button"
                  onClick={() => onSelect("sent", item.status)}
                  className={`w-full text-left py-1 px-1.5 text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "text-[#DB2F3C] font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span>{item.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="text-[11px] text-stone-400">({count})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export const InterestsSidebar = memo(InterestsSidebarComponent);
InterestsSidebar.displayName = "InterestsSidebar";
export default InterestsSidebar;
