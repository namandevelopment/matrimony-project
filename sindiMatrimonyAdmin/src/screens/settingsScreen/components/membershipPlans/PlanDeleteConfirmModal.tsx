import React, { memo } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { MembershipPlan } from './types';

interface PlanDeleteConfirmModalProps {
  isOpen: boolean;
  plan: MembershipPlan | null;
  onClose: () => void;
  onConfirm: (planId: string) => void;
}

export const PlanDeleteConfirmModal: React.FC<PlanDeleteConfirmModalProps> = memo(({
  isOpen,
  plan,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">
            Delete Membership Plan
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Are you sure you want to remove the <strong className="text-slate-800">&quot;{plan.title}&quot;</strong> tier?
            Existing active members on this tier will keep their current entitlements until expiry.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6 flex justify-between items-center">
            <span className="font-semibold">{plan.title} ({plan.category === 'SELF_SERVICE' ? 'Self Service' : 'Assist Plan'})</span>
            <span className="font-bold text-slate-900">₹{plan.offerPrice.toLocaleString('en-IN')} /{plan.duration}</span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(plan.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PlanDeleteConfirmModal.displayName = 'PlanDeleteConfirmModal';
