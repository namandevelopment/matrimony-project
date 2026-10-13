import React from 'react';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { Employee } from '../../../types/employee.types';
import { CustomDropDown, type CustomDropDownOption } from '../../../components/CustomDropDown';

interface SessionPersonaBannerProps {
  effectiveUser: { fullName?: string; id?: string; role?: string };
  effectiveRole: string;
  simulatedUser: Employee | null;
  activeTab: string;
  myBucketCount: number;
  onSwitchSimulatedEmployee: (empId: string) => void;
}

const PERSONA_OPTIONS: CustomDropDownOption[] = [
  {
    label: '👑 Super Admin (Full Assignment Control)',
    value: 'SUPER_ADMIN',
    badge: 'Admin',
  },
  {
    label: '👩‍💼 Priya Sharma (CRM Manager - 42 leads)',
    value: 'emp_003',
  },
  {
    label: '👨‍💼 Amit Bajaj (CRM Agent - 28 leads)',
    value: 'emp_004',
  },
  {
    label: '👩‍💼 Neha Lulla (CRM Agent - 22 leads)',
    value: 'emp_005',
  },
];

export const SessionPersonaBanner: React.FC<SessionPersonaBannerProps> = React.memo(
  ({
    effectiveUser,
    effectiveRole,
    simulatedUser,
    activeTab,
    myBucketCount,
    onSwitchSimulatedEmployee,
  }) => {
    return (
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DB2F3C] to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Active CRM Session: {effectiveUser.fullName || 'User'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                {effectiveRole}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {activeTab === 'MY_BUCKET'
                ? `Viewing personal exclusive bucket: ${myBucketCount} assigned leads.`
                : 'Manager / Super Admin View: Full control to assign or reassign leads with audit tracking.'}
            </div>
          </div>
        </div>

        {/* Quick Persona Switcher for easy testing */}
        <div className="flex items-center gap-2.5 w-full md:w-auto self-end md:self-auto">
          <span className="text-[11px] font-semibold text-slate-600 shrink-0 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" /> Test Login As:
          </span>
          <div className="w-full sm:w-80">
            <CustomDropDown
              size="sm"
              variant="outline"
              options={PERSONA_OPTIONS}
              value={simulatedUser ? simulatedUser.id : 'SUPER_ADMIN'}
              onChange={(val) => onSwitchSimulatedEmployee(String(val))}
              triggerClassName="bg-white border-amber-300 hover:border-amber-400 font-medium shadow-2xs text-xs"
              containerClassName="w-full sm:w-80"
            />
          </div>
        </div>
      </div>
    );
  }
);

SessionPersonaBanner.displayName = 'SessionPersonaBanner';
