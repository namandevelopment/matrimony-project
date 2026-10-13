import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { memoWithDeepEqual } from '../utils/memoUtils';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  { icon: React.FC<{ className?: string }>; bg: string; text: string; btn: string }
> = {
  danger: {
    icon: AlertTriangle,
    bg: 'bg-rose-100 text-rose-600',
    text: 'text-rose-900',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-100 text-amber-600',
    text: 'text-amber-900',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-100 text-blue-600',
    text: 'text-blue-900',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-900',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = memoWithDeepEqual(({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-y-0 right-0 left-0 md:left-[var(--admin-sidebar-width,16rem)] z-40 flex items-center justify-center bg-slate-950/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col space-y-4">
        {/* Header with Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{message}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${style.btn}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';
export default ConfirmModal;
