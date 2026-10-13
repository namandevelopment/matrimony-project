import React from 'react';

export type BadgeVariant =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'INTERESTED'
  | 'CONVERTED'
  | 'LOST'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUCCESS'
  | 'REFUNDED'
  | 'FAILED'
  | 'HIGH'
  | 'URGENT'
  | 'MEDIUM'
  | 'LOW'
  | string;

interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  // Leads & Process
  NEW: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  ASSIGNED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  CONTACTED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  QUALIFIED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  INTERESTED: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  CONVERTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  LOST: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },

  // Profiles & Accounts
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  SUSPENDED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  VERIFIED: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },

  // Finance & Transactions
  SUCCESS: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  REFUNDED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  FAILED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },

  // Priority
  URGENT: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  HIGH: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  MEDIUM: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  LOW: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

import { memoWithDeepEqual } from '../utils/memoUtils';

export const StatusBadge: React.FC<StatusBadgeProps> = memoWithDeepEqual(({ status, label, className = '' }) => {
  const normalized = (status || '').toUpperCase();
  const config = statusConfig[normalized] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {label || status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
