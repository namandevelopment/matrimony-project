import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useInputs } from '../customHooks/useInputs';

export interface ReasonFormValues {
  reason: string;
}

export interface ReasonModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  isDestructive?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm Action',
  isDestructive = false,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    values,
    setFieldValue,
    reset,
    errors,
    validateForm,
  } = useInputs<ReasonFormValues>(
    { reason: '' },
    {
      validate: (vals) => {
        const errs: Partial<Record<keyof ReasonFormValues, string>> = {};
        if (!vals.reason.trim() || vals.reason.trim().length < 8) {
          errs.reason = 'Please provide a meaningful reason (min 8 characters).';
        }
        return errs;
      },
    }
  );

  useEffect(() => {
    if (isOpen) {
      reset();
      setSubmitError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitError('');
    setLoading(true);
    try {
      await onConfirm(values.reason.trim());
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to execute action.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${isDestructive ? 'text-rose-600' : 'text-amber-500'}`} />
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-600">{description}</p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mandatory Justification / Audit Reason *
            </label>
            <textarea
              required
              rows={3}
              value={values.reason}
              onChange={(e) => setFieldValue('reason', e.target.value)}
              placeholder="Explain why this action is being taken (immutable log)..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {(errors.reason || submitError) && (
              <p className="text-xs text-rose-600 mt-1">{errors.reason || submitError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
