import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { LoaderOverlay } from './LoaderOverlay';
import { ConfirmModal, type ConfirmVariant } from './ConfirmModal';

import { UserProfileModal } from './UserProfileModal';
import { LogoutModal } from './LogoutModal';
import { getUnifiedUserProfile, type UnifiedUserProfile } from '../services/unifiedUserService';

interface GlobalModalContextType {
  showLoader: (message?: string, subMessage?: string) => void;
  hideLoader: () => void;
  confirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
  }) => Promise<boolean>;
  openUserProfile: (userOrId: string | any) => void;
  closeUserProfile: () => void;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loader state
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Loading...');
  const [loaderSubMessage, setLoaderSubMessage] = useState('Please wait...');

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOpts, setConfirmOpts] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
  }>({
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
  });
  const confirmResolver = useRef<((val: boolean) => void) | null>(null);

  const showLoader = useCallback((msg = 'Loading data...', subMsg = 'Please wait while we process your request') => {
    setLoaderMessage(msg);
    setLoaderSubMessage(subMsg);
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setLoading(false);
  }, []);

  const confirm = useCallback(
    (options: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      variant?: ConfirmVariant;
    }): Promise<boolean> => {
      setConfirmOpts(options);
      setConfirmOpen(true);
      return new Promise<boolean>((resolve) => {
        confirmResolver.current = resolve;
      });
    },
    []
  );

  const handleConfirmAction = useCallback(() => {
    setConfirmOpen(false);
    if (confirmResolver.current) {
      confirmResolver.current(true);
      confirmResolver.current = null;
    }
  }, []);

  const handleCancelAction = useCallback(() => {
    setConfirmOpen(false);
    if (confirmResolver.current) {
      confirmResolver.current(false);
      confirmResolver.current = null;
    }
  }, []);

  // User Profile Modal state
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UnifiedUserProfile | null>(null);

  const openUserProfile = useCallback((userOrId: string | any) => {
    if (!userOrId) return;
    if (typeof userOrId === 'string') {
      const profile = getUnifiedUserProfile(userOrId);
      setSelectedProfile(profile);
      setProfileOpen(true);
    } else if (typeof userOrId === 'object') {
      // If object passed directly, check if it's already unified or needs mapping
      if ('sourceType' in userOrId) {
        setSelectedProfile(userOrId);
      } else {
        const profile = getUnifiedUserProfile(userOrId.uniqueId || userOrId.id || userOrId.fullName || userOrId.name);
        setSelectedProfile(profile);
      }
      setProfileOpen(true);
    }
  }, []);

  const closeUserProfile = useCallback(() => {
    setProfileOpen(false);
  }, []);

  // Logout Modal state
  const [logoutOpen, setLogoutOpen] = useState(false);
  const openLogoutModal = useCallback(() => {
    setLogoutOpen(true);
  }, []);
  const closeLogoutModal = useCallback(() => {
    setLogoutOpen(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      showLoader,
      hideLoader,
      confirm,
      openUserProfile,
      closeUserProfile,
      openLogoutModal,
      closeLogoutModal,
    }),
    [showLoader, hideLoader, confirm, openUserProfile, closeUserProfile, openLogoutModal, closeLogoutModal]
  );

  return (
    <GlobalModalContext.Provider value={contextValue}>
      {children}

      {/* Global Loader Overlay */}
      <LoaderOverlay
        isLoading={loading}
        message={loaderMessage}
        subMessage={loaderSubMessage}
      />

      {/* Global Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmOpts.title}
        message={confirmOpts.message}
        confirmText={confirmOpts.confirmText}
        cancelText={confirmOpts.cancelText}
        variant={confirmOpts.variant || 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Universal User Profile Details Modal */}
      <UserProfileModal
        isOpen={profileOpen}
        user={selectedProfile}
        onClose={closeUserProfile}
      />

      {/* Universal Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={closeLogoutModal}
      />
    </GlobalModalContext.Provider>
  );
};

export const useGlobalModal = (): GlobalModalContextType => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};
