"use client";

import React, { useState, useCallback, memo } from "react";
import { Header } from "@/components/Header";
import { LoginModal } from "@/screens/landingScreen/components/LoginModal";

export const HelpHeader: React.FC = memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <>
      <Header
        showBack
        backHref="/"
        onLoginClick={handleOpenLogin}
        showLogin={true}
        showHelpPhone={false}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </>
  );
});

HelpHeader.displayName = "HelpHeader";
