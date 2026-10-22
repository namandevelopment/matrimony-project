import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  AlertTriangle, 
  ShieldAlert, 
  HeartHandshake, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

interface QueueCardProps {
  title: string;
  count: number;
  badgeText: string;
  badgeColor: string;
  icon: React.ElementType;
  iconBg: string;
  description: string;
  items: string[];
  actionLabel: string;
  onAction: () => void;
  urgent?: boolean;
}

const QueueCard: React.FC<QueueCardProps> = ({
  title,
  count,
  badgeText,
  badgeColor,
  icon: Icon,
  iconBg,
  description,
  items,
  actionLabel,
  onAction,
  urgent,
}) => (
  <div className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
    urgent ? 'border-amber-300 ring-1 ring-amber-200/50' : 'border-slate-200'
  }`}>
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${badgeColor}`}>
              {badgeText}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-slate-900">{count}</span>
          <span className="text-xs text-slate-400 block">pending</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3">{description}</p>

      <div className="space-y-1.5 bg-slate-50 rounded-lg p-2.5 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center text-xs text-slate-600 gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={onAction}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-rose-900 text-white transition-colors group cursor-pointer"
    >
      <span>{actionLabel}</span>
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
);

export interface QueueItemData {
  id?: string;
  title?: string;
  count?: number;
  badgeText?: string;
  badgeColor?: string;
  iconBg?: string;
  description?: string;
  items?: string[];
  actionLabel?: string;
  route?: string;
  urgent?: boolean;
}

export interface AdminActionQueuesData {
  profileVerification?: QueueItemData;
  matchExceptions?: QueueItemData;
  abuseComplaints?: QueueItemData;
  marriageOffboarding?: QueueItemData;
}

export interface AdminActionQueuesProps {
  queues?: AdminActionQueuesData;
  onNavigate?: (route: string) => void;
}

export const AdminActionQueues: React.FC<AdminActionQueuesProps> = memoWithDeepEqual(({
  queues,
  onNavigate,
}) => {
  const navigate = useNavigate();

  const handleRoute = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(route);
    }
  };

  const pv = queues?.profileVerification;
  const me = queues?.matchExceptions;
  const ac = queues?.abuseComplaints;
  const mo = queues?.marriageOffboarding;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Admin Action Queues</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
              <Clock className="w-3 h-3" />
              Live SLA Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Exception-based operational review queues requiring supervisor or admin clearance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Rule: Auto-matches bypass queues; review only on exceptions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Profile Verification Queue */}
        <QueueCard
          title={pv?.title || "Profile Verification"}
          count={pv?.count ?? 38}
          badgeText={pv?.badgeText || "High SLA"}
          badgeColor={pv?.badgeColor || "bg-blue-100 text-blue-700"}
          icon={FileCheck2}
          iconBg={pv?.iconBg || "bg-blue-50 text-blue-600"}
          description={pv?.description || "Govt ID cards, salary slips & selfies awaiting visual authenticity audit"}
          items={pv?.items || [
            "18 Aadhaar Card OCR Mismatch",
            "12 High-Income Salary Slip (>30 LPA)",
            "8 Selfie Liveness Review"
          ]}
          actionLabel={pv?.actionLabel || "Open Verification Desk"}
          onAction={() => handleRoute(pv?.route || '/verifications')}
        />

        {/* 2. Match Policy Exceptions */}
        <QueueCard
          title={me?.title || "Match Exceptions"}
          count={me?.count ?? 7}
          badgeText={me?.badgeText || "Requires Admin Sign-off"}
          badgeColor={me?.badgeColor || "bg-amber-100 text-amber-700"}
          icon={AlertTriangle}
          iconBg={me?.iconBg || "bg-amber-50 text-amber-600"}
          description={me?.description || "Borderline horoscope gunas, age gap > 6 yrs, or inter-subcaste manual requests"}
          items={me?.items || [
            "3 Horoscope Guna < 18 (Client Requested)",
            "2 Age Gap Exception (+6 Years)",
            "2 Sagotra Distance Review"
          ]}
          actionLabel={me?.actionLabel || "Review Match Exceptions"}
          onAction={() => handleRoute(me?.route || '/matchmaking')}
          urgent={me?.urgent ?? true}
        />

        {/* 3. Abuse & Safety Complaints */}
        <QueueCard
          title={ac?.title || "Abuse Complaints"}
          count={ac?.count ?? 4}
          badgeText={ac?.badgeText || "Priority 1"}
          badgeColor={ac?.badgeColor || "bg-rose-100 text-rose-700"}
          icon={ShieldAlert}
          iconBg={ac?.iconBg || "bg-rose-50 text-rose-600"}
          description={ac?.description || "Grievances reported by members regarding harassment, fake profiles, or extortion"}
          items={ac?.items || [
            "2 Misbehavior on Phone Call",
            "1 Suspicious NRI Identity Claim",
            "1 Already Married / Impersonation"
          ]}
          actionLabel={ac?.actionLabel || "Open Priority Triage"}
          onAction={() => handleRoute(ac?.route || '/safety')}
          urgent={ac?.urgent ?? true}
        />

        {/* 4. Engagement & Marriage Reports */}
        <QueueCard
          title={mo?.title || "Engagement / Marriage"}
          count={mo?.count ?? 6}
          badgeText={mo?.badgeText || "Offboarding Ready"}
          badgeColor={mo?.badgeColor || "bg-emerald-100 text-emerald-700"}
          icon={HeartHandshake}
          iconBg={mo?.iconBg || "bg-emerald-50 text-emerald-600"}
          description={mo?.description || "Couples who reported wedding fix. Deactivate from matches and log success stories"}
          items={mo?.items || [
            "4 Vivah Confirmed (Archive Profile)",
            "2 Success Story Photos Submitted",
            "RM Attribution: Priya (2), Amit (2)"
          ]}
          actionLabel={mo?.actionLabel || "Review & Offboard"}
          onAction={() => handleRoute(mo?.route || '/success-stories')}
          urgent={mo?.urgent ?? false}
        />
      </div>
    </div>
  );
});

AdminActionQueues.displayName = 'AdminActionQueues';
