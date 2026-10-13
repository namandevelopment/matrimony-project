import React from 'react';
import { useLocation } from 'react-router-dom';
import { memoWithDeepEqual } from '../utils/memoUtils';

export interface LoaderOverlayProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  scope?: 'content' | 'fullscreen';
}

export const LoaderOverlay: React.FC<LoaderOverlayProps> = memoWithDeepEqual(({
  isLoading,
  message = 'Loading data...',
  subMessage = 'Please wait while we process your request',
  scope,
}) => {
  const location = useLocation();

  if (!isLoading) return null;

  // If on login screen, use fullscreen. On admin dashboard and CRM, exclude sidebar completely!
  const isLoginPage = location?.pathname === '/login';
  const effectiveScope = scope || (isLoginPage ? 'fullscreen' : 'content');

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-y-0 right-0 z-30 flex items-center justify-center transition-all duration-300 animate-in fade-in duration-150 pointer-events-auto ${
        effectiveScope === 'content'
          ? 'left-0 md:left-[var(--admin-sidebar-width,16rem)] bg-slate-900/20 backdrop-blur-[2px]'
          : 'left-0 bg-slate-900/35 backdrop-blur-[3px]'
      }`}
    >
      {/* Centered Branded Floating Card (Underlying screen remains 100% visible behind the translucent overlay) */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-7 max-w-sm w-[85%] shadow-2xl border border-white/60 backdrop-blur-md flex flex-col items-center text-center space-y-3.5 animate-in zoom-in-95 duration-200">
        {/* Animated Double Ring Spinner */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Outer Ring (Ruby Red) */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-rose-100 border-t-[#DB2F3C] animate-spin" />
          {/* Inner Ring (Gold Accent) */}
          <div className="absolute inset-1.5 rounded-full border-[2.5px] border-amber-100 border-b-amber-500 animate-spin animate-reverse" />
          {/* Center Brand Icon */}
          <span className="text-lg select-none">🕉️</span>
        </div>

        {/* Text */}
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            {message}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            {subMessage}
          </p>
        </div>
      </div>
    </div>
  );
});

LoaderOverlay.displayName = 'LoaderOverlay';
export default LoaderOverlay;
