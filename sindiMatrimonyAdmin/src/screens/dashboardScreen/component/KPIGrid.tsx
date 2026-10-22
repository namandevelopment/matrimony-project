import React, { useCallback } from 'react';
import { 
  Users, 
  UserCheck, 
  Heart, 
  UserX, 
  IndianRupee, 
  CreditCard, 
  BookOpen, 
  FileSpreadsheet,
  type LucideIcon
} from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface KPICardData {
  id: string;
  value: string | number;
  label: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeTextColor: string;
  isAction?: boolean;
  onClick?: () => void;
}

export interface KPIGridProps {
  cards?: KPICardData[];
  onCardClick?: (id: string) => void;
}

export const defaultKpiCards: KPICardData[] = [
  {
    id: 'total_members',
    value: '39,434',
    label: 'Total Members',
    icon: Users,
    badgeBg: 'bg-rose-600',
    badgeTextColor: 'text-white',
  },
  {
    id: 'male_profiles',
    value: '24,895',
    label: 'Male Profiles',
    icon: UserCheck,
    badgeBg: 'bg-blue-600',
    badgeTextColor: 'text-white',
  },
  {
    id: 'female_profiles',
    value: '14,508',
    label: 'Female Profiles',
    icon: Heart,
    badgeBg: 'bg-pink-600',
    badgeTextColor: 'text-white',
  },
  {
    id: 'inactive_members',
    value: '3',
    label: 'Inactive Members',
    icon: UserX,
    badgeBg: 'bg-rose-900',
    badgeTextColor: 'text-white',
  },
  {
    id: 'total_revenue',
    value: '₹32,400.00',
    label: 'Total Revenue',
    icon: IndianRupee,
    badgeBg: 'bg-amber-600',
    badgeTextColor: 'text-white',
  },
  {
    id: 'membership_plans',
    value: '6',
    label: 'Membership Plans',
    icon: CreditCard,
    badgeBg: 'bg-amber-500',
    badgeTextColor: 'text-white',
  },
  {
    id: 'total_blogs',
    value: '1',
    label: 'Total Blogs',
    icon: BookOpen,
    badgeBg: 'bg-emerald-600',
    badgeTextColor: 'text-white',
  },
  {
    id: 'export_backup',
    value: 'Export',
    label: 'Backup Members (CSV)',
    icon: FileSpreadsheet,
    badgeBg: 'bg-teal-600',
    badgeTextColor: 'text-white',
    isAction: true,
  },
];

// Fallback dummy cards preserved per project requirement
// export const DUMMY_FALLBACK_KPI_CARDS = defaultKpiCards;

export function createKpiCardsFromStats(stats: any): KPICardData[] {
  if (!stats) return defaultKpiCards;

  const total = stats.totalMembers ?? stats.totalRegistrations?.value ?? 150;
  const male = stats.maleProfiles ?? Math.round(total * 0.62);
  const female = stats.femaleProfiles ?? Math.max(0, total - male);
  const inactive = stats.inactiveMembers ?? 4;
  const rawRev = stats.totalRevenueNumeric ?? stats.totalRevenue?.value ?? stats.totalRevenue ?? 385000;
  const revenue = typeof rawRev === 'number'
    ? `₹${Number(rawRev).toLocaleString('en-IN')}`
    : String(rawRev);
  const plans = stats.membershipPlans != null ? String(stats.membershipPlans) : '6';
  const blogs = stats.totalBlogs != null ? String(stats.totalBlogs) : '1';

  return [
    {
      id: 'total_members',
      value: Number(total).toLocaleString('en-IN'),
      label: 'Total Members',
      icon: Users,
      badgeBg: 'bg-rose-600',
      badgeTextColor: 'text-white',
    },
    {
      id: 'male_profiles',
      value: Number(male).toLocaleString('en-IN'),
      label: 'Male Profiles',
      icon: UserCheck,
      badgeBg: 'bg-blue-600',
      badgeTextColor: 'text-white',
    },
    {
      id: 'female_profiles',
      value: Number(female).toLocaleString('en-IN'),
      label: 'Female Profiles',
      icon: Heart,
      badgeBg: 'bg-pink-600',
      badgeTextColor: 'text-white',
    },
    {
      id: 'inactive_members',
      value: String(inactive),
      label: 'Inactive Members',
      icon: UserX,
      badgeBg: 'bg-rose-900',
      badgeTextColor: 'text-white',
    },
    {
      id: 'total_revenue',
      value: revenue,
      label: 'Total Revenue',
      icon: IndianRupee,
      badgeBg: 'bg-amber-600',
      badgeTextColor: 'text-white',
    },
    {
      id: 'membership_plans',
      value: plans,
      label: 'Membership Plans',
      icon: CreditCard,
      badgeBg: 'bg-amber-500',
      badgeTextColor: 'text-white',
    },
    {
      id: 'total_blogs',
      value: blogs,
      label: 'Total Blogs',
      icon: BookOpen,
      badgeBg: 'bg-emerald-600',
      badgeTextColor: 'text-white',
    },
    {
      id: 'export_backup',
      value: 'Export',
      label: 'Backup Members (CSV)',
      icon: FileSpreadsheet,
      badgeBg: 'bg-teal-600',
      badgeTextColor: 'text-white',
      isAction: true,
    },
  ];
}

interface KPICardItemProps {
  card: KPICardData;
  onCardClick?: (id: string) => void;
}

export const KPICardItem: React.FC<KPICardItemProps> = memoWithDeepEqual(({ card, onCardClick }) => {
  const Icon = card.icon;

  const handleClick = useCallback(() => {
    if (card.onClick) {
      card.onClick();
    } else if (onCardClick) {
      onCardClick(card.id);
    }
  }, [card, onCardClick]);

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-4 ${
        card.isAction ? 'cursor-pointer hover:border-teal-400 group' : ''
      }`}
    >
      {/* Left Icon Badge with solid brand background */}
      <div
        className={`w-12 h-12 rounded-2xl ${card.badgeBg} ${card.badgeTextColor} flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Right Value & Label */}
      <div className="min-w-0 flex-1">
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight truncate">
          {card.value}
        </div>
        <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">
          {card.label}
        </div>
      </div>
    </div>
  );
});

KPICardItem.displayName = 'KPICardItem';

export const KPIGrid: React.FC<KPIGridProps> = memoWithDeepEqual(({
  cards = defaultKpiCards,
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <KPICardItem key={card.id} card={card} onCardClick={onCardClick} />
      ))}
    </div>
  );
});

KPIGrid.displayName = 'KPIGrid';
