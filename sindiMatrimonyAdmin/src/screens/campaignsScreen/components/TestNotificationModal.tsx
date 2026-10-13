import React, { useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useInputs } from '../../../customHooks/useInputs';

interface TestNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTest: (recipient: string) => void;
  campaignTitle: string;
}

export const TestNotificationModal: React.FC<TestNotificationModalProps> = ({
  isOpen,
  onClose,
  onSendTest,
  campaignTitle,
}) => {
  const { values, bind, errors, touched, validateForm, reset } = useInputs(
    { recipient: '+91 98200 44551' },
    {
      validate: (vals) => {
        if (!vals.recipient.trim()) {
          return { recipient: 'Recipient phone number or email is required' };
        }
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  useEffect(() => {
    if (isOpen) {
      reset({ recipient: '+91 98200 44551' });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSendTest(values.recipient.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Send Test Preview</h3>
              <p className="text-[11px] text-slate-400">Dispatch to internal test device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Campaign Payload
            </span>
            <div className="font-bold text-slate-900 line-clamp-1">{campaignTitle}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Phone Number / Admin Email *
            </label>
            <input
              type="text"
              {...bind('recipient')}
              placeholder="e.g. +91 98200 44551 or admin@sindhimatrimony.com"
              className={`w-full px-3.5 py-2 text-xs rounded-xl border font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                touched.recipient && errors.recipient ? 'border-red-500' : 'border-slate-200'
              }`}
              required
            />
            {touched.recipient && errors.recipient && (
              <p className="text-[11px] text-red-600 mt-1">{errors.recipient}</p>
            )}
            <p className="text-[10px] text-slate-500 mt-1">
              Dispatches an isolated sandbox notification without touching real users or incrementing analytics.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
