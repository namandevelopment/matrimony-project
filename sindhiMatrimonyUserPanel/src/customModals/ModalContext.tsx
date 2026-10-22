'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { LogoutModal } from './LogoutModal';

export interface GlobalModalContextType {
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  isLogoutModalOpen: boolean;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const openLogoutModal = useCallback(() => {
    setLogoutOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setLogoutOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openLogoutModal,
      closeLogoutModal,
      isLogoutModalOpen: logoutOpen,
    }),
    [openLogoutModal, closeLogoutModal, logoutOpen]
  );

  return (
    <GlobalModalContext.Provider value={value}>
      {children}
      {/* Mount universal clean LogoutModal globally */}
      <LogoutModal isOpen={logoutOpen} onClose={closeLogoutModal} />
    </GlobalModalContext.Provider>
  );
};

export const useGlobalModal = (): GlobalModalContextType => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    // Graceful fallback if invoked outside provider so it never crashes
    return {
      openLogoutModal: () => {},
      closeLogoutModal: () => {},
      isLogoutModalOpen: false,
    };
  }
  return context;
};

export default ModalProvider;
