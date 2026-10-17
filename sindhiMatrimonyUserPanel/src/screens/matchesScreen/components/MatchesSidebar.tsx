"use client";

import React, { memo } from "react";
import {
  Users,
  Star,
  Eye,
  UserCheck,
  UserCheck2,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { MatchCategoryType } from "../types";

export interface MatchesSidebarProps {
  activeCategory: MatchCategoryType;
  onSelectCategory: (category: MatchCategoryType) => void;
  counts?: Partial<Record<MatchCategoryType, number>>;
  className?: string;
}

interface SidebarItemConfig {
  id: MatchCategoryType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface SidebarGroupConfig {
  groupTitle: string;
  items: SidebarItemConfig[];
}

const SIDEBAR_GROUPS: SidebarGroupConfig[] = [
  {
    groupTitle: "All Matches",
    items: [
      {
        id: "your_matches",
        title: "Your Matches",
        subtitle: "View all the profiles that match your preferences",
        icon: <Users className="w-4 h-4 text-[#0D9488]" />,
      },
    ],
  },
  {
    groupTitle: "Based on activity",
    items: [
      {
        id: "shortlisted_by_you",
        title: "Shortlisted By You",
        subtitle: "Matches you have shortlisted",
        icon: <Star className="w-4 h-4 text-[#4B5563]" />,
      },
      {
        id: "viewed_you",
        title: "Viewed You",
        subtitle: "Matches who have viewed your profile",
        icon: <Eye className="w-4 h-4 text-[#4B5563]" />,
      },
      {
        id: "shortlisted_you",
        title: "Shortlisted You",
        subtitle: "Matches who have shortlisted your profile",
        icon: <UserCheck className="w-4 h-4 text-[#4B5563]" />,
      },
      {
        id: "viewed_by_you",
        title: "Viewed By You",
        subtitle: "Matches you have viewed",
        icon: <UserCheck2 className="w-4 h-4 text-[#4B5563]" />,
      },
    ],
  },
  {
    groupTitle: "Recently joined & nearby matches",
    items: [
      {
        id: "newly_joined",
        title: "Newly Joined",
        subtitle: "Matches who joined within the last 30 days",
        icon: <Clock className="w-4 h-4 text-[#4B5563]" />,
      },
      {
        id: "nearby_matches",
        title: "Nearby Matches",
        subtitle: "Matches near your location",
        icon: <MapPin className="w-4 h-4 text-[#4B5563]" />,
      },
    ],
  },
];

interface SidebarItemProps {
  item: SidebarItemConfig;
  isActive: boolean;
  count?: number;
  onSelect: (id: MatchCategoryType) => void;
}

const MatchesSidebarItem = memo<SidebarItemProps>(
  ({ item, isActive, count, onSelect }) => {
    return (
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer ${
          isActive
            ? "bg-[#E8F8F5] text-[#0F172A]"
            : "bg-white hover:bg-[#F9FAFB] text-[#1F2937]"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${
              isActive ? "bg-[#CCFBF1] text-[#0D9488]" : "bg-stone-100 text-[#4B5563]"
            }`}
          >
            {item.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[13px] leading-tight truncate ${
                  isActive ? "font-bold text-[#0F172A]" : "font-semibold text-[#1F2937]"
                }`}
              >
                {item.title}
              </span>
              {count !== undefined && count > 0 && (
                <span className="text-[11px] font-bold text-[#0D9488]">
                  ({count})
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280] leading-snug mt-0.5 line-clamp-2">
              {item.subtitle}
            </p>
          </div>
        </div>

        <ChevronRight
          className={`w-4 h-4 shrink-0 transition-transform ${
            isActive ? "text-[#0D9488] translate-x-0.5" : "text-[#9CA3AF]"
          }`}
        />
      </button>
    );
  }
);
MatchesSidebarItem.displayName = "MatchesSidebarItem";

const MatchesSidebarComponent: React.FC<MatchesSidebarProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
  className = "",
}) => {
  return (
    <aside
      aria-label="Matches Categories Sidebar"
      className={`w-full lg:w-72 xl:w-80 shrink-0 bg-white rounded-xl border border-stone-200 shadow-2xs divide-y divide-stone-100 overflow-hidden ${className}`}
    >
      {SIDEBAR_GROUPS.map((group, groupIndex) => (
        <div key={group.groupTitle} className={groupIndex > 0 ? "pt-2" : ""}>
          <h3 className="px-4 pt-3 pb-1.5 text-xs sm:text-[13px] font-bold text-[#111827] tracking-tight">
            {group.groupTitle}
          </h3>
          <div className="divide-y divide-stone-50">
            {group.items.map((item) => (
              <MatchesSidebarItem
                key={item.id}
                item={item}
                isActive={activeCategory === item.id}
                count={counts?.[item.id]}
                onSelect={onSelectCategory}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export const MatchesSidebar = memo(MatchesSidebarComponent);
MatchesSidebar.displayName = "MatchesSidebar";
export default MatchesSidebar;
