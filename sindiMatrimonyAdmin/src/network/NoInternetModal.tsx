import React, { useSyncExternalStore, useState } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { networkService } from './networkService';

export interface NoInternetModalProps {
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
}

/**
 * Isolated NoInternetModal component.
 * Uses React 19's useSyncExternalStore to subscribe directly to the networkService singleton.
 *
 * CRITICAL PERFORMANCE GUARANTEE:
 * When network status flips (offline ↔ online), ONLY this modal renders.
 * 0% of other screens, tables, charts, or routers in the app re-render!
 */
export const NoInternetModal: React.FC<NoInternetModalProps> = ({
  title = 'No Internet Connection',
  description = 'You are currently offline. Please check your network connection to continue managing matrimony profiles and staff tasks.',
}) => {
  const isOnline = useSyncExternalStore(
    networkService.subscribe,
    () => networkService.getSnapshot().isOnline,
    () => true
  );

  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await networkService.checkConnectivity();
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  };

  if (isOnline) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="no-internet-title"
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Animated Badge & Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shadow-rose-500/10 shadow-lg relative">
          <WifiOff className="w-8 h-8 animate-pulse text-rose-600" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Connection Interrupted</span>
          </div>
          <h2 id="no-internet-title" className="text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Reconnect Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full py-3 px-5 rounded-2xl font-bold text-sm text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isRetrying
                ? 'bg-rose-400 cursor-not-allowed'
                : 'bg-[#88131B] hover:bg-[#6e0f16] active:scale-[0.98]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Checking Connection...' : 'Retry Connection'}</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Auto-reconnecting when internet is restored...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoInternetModal;
