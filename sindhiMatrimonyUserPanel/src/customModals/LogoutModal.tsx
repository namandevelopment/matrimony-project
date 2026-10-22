'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, X, ShieldAlert, Loader2, User } from 'lucide-react';
import { getStoredUser, clearAllUserStorage } from '../storage';
import { toast } from '../toastMessage/toast';
import { apiFetch, ApiURL } from '../redux/apiService';
import { store } from '../redux/Store/store';
import { resetEntireStore } from '../redux/slices/dataSlice';
import { queryClient } from '../tanstackQuery/client';

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  userName?: string;
  userMatrimonyId?: string;
  userAvatar?: string;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

const LogoutModalComponent: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userMatrimonyId,
  userAvatar,
  title = 'Sign Out of Sindhi Matrimony?',
  message = 'Are you sure you want to end your active session? Any unsaved profile edits or draft responses will be discarded.',
  isLoading: externalLoading = false,
}) => {
  const router = useRouter();
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  // Retrieve current authenticated user profile
  const storedUser = getStoredUser();
  const displayName =
    userName ||
    storedUser?.fullName ||
    storedUser?.name ||
    'Sindhi Matrimony Member';
  const displayId =
    userMatrimonyId ||
    storedUser?.matrimonyId ||
    storedUser?.memberId ||
    storedUser?.mobile ||
    'Verified Member';
  const avatarSrc = userAvatar || storedUser?.avatarUrl || storedUser?.photoUrl || '';

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Comprehensive clean logout execution
  const handleConfirmLogout = useCallback(async () => {
    setInternalLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        // 1. Notify Backend API (gracefully fail-safe)
        try {
          await apiFetch({
            url: ApiURL.logout,
            method: 'POST',
            showErrorToast: false,
          });
        } catch (_) {}

        // 2. Thoroughly purge all LocalStorage, SessionStorage, Tokens and Cookies
        clearAllUserStorage();

        // 3. Clear TanStack Query Cache completely
        try {
          queryClient.clear();
        } catch (_) {}

        // 4. Reset Redux Store state completely
        try {
          store.dispatch(resetEntireStore());
        } catch (_) {}

        // 5. Toast Feedback
        toast.info('You have been logged out securely.');

        // 6. Navigate to Home/Login
        try {
          router.replace('/?login=true');
        } catch (_) {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Logout encountered an issue. Please try again.');
    } finally {
      setInternalLoading(false);
    }
  }, [onConfirm, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-logout-modal-title"
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Ruby Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#88131B] via-[#DB2F3C] to-rose-500" />

        <div className="p-6 sm:p-7">
          {/* Header Row: Icon, Title & Close Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-center justify-center text-[#DB2F3C] shadow-xs">
                  <LogOut className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DB2F3C]" />
                </span>
              </div>

              <div>
                <h3
                  id="user-logout-modal-title"
                  className="text-lg font-extrabold text-stone-900 tracking-tight"
                >
                  {title}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Confirm your action below
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              title="Close modal"
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition disabled:opacity-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description Text */}
          <div className="mt-4">
            <p className="text-xs leading-relaxed text-stone-600 font-normal">
              {message}
            </p>
          </div>

          {/* Active User Card Preview */}
          <div className="mt-4 bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-2xs shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-100/70 border border-rose-200 text-[#DB2F3C] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-stone-500 font-mono font-medium truncate">
                  {displayId}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Session
            </div>
          </div>

          {/* Security Notice Box */}
          <div className="mt-3.5 bg-rose-50/70 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug">
              Session tokens, authentication credentials, and local cached data will be securely and cleanly purged on this device.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#88131B] via-[#AB1E28] to-[#DB2F3C] hover:opacity-95 shadow-md shadow-rose-900/20 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-white" />
                  <span>Yes, Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LogoutModal = memo(LogoutModalComponent);
LogoutModal.displayName = 'LogoutModal';

/**
 * Convenience hook to manage LogoutModal visibility and state
 */
export function useLogoutModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openLogout = useCallback(() => setIsOpen(true), []);
  const closeLogout = useCallback(() => setIsOpen(false), []);
  const toggleLogout = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openLogout,
    closeLogout,
    toggleLogout,
    LogoutModalComponent: (props: Partial<LogoutModalProps> = {}) => (
      <LogoutModal
        isOpen={isOpen}
        onClose={closeLogout}
        {...props}
      />
    ),
  };
}

export default LogoutModal;
