import React from 'react';
import { Check } from 'lucide-react';

export interface CaptchaBoxProps {
  isVerified: boolean;
  isLoading: boolean;
  onVerify: () => void;
  errorMessage?: string;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({
  isVerified,
  isLoading,
  onVerify,
  errorMessage,
}) => {
  return (
    <div className="pt-1">
      <div className="border border-slate-300 rounded-xl bg-slate-50/80 p-3 flex items-center justify-between w-full sm:w-72 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerified || isLoading}
            className={`w-6 h-6 rounded border flex items-center justify-center transition-all cursor-pointer ${
              isVerified
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-white border-slate-400 hover:border-slate-500'
            }`}
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : isVerified ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : null}
          </button>
          <span className="text-xs font-medium text-slate-800 select-none">
            I'm not a robot
          </span>
        </div>

        <div className="flex flex-col items-center">
          <svg className="w-6 h-6 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18h-2v-1.07A6 6 0 0 1 6.07 12H5v-2h1.07A6 6 0 0 1 11 4.07V3h2v1.07A6 6 0 0 1 17.93 10H19v2h-1.07A6 6 0 0 1 13 16.93zM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5z" />
          </svg>
          <span className="text-[8px] font-semibold text-slate-400 tracking-tighter uppercase">
            reCAPTCHA
          </span>
        </div>
      </div>
      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CaptchaBox;
