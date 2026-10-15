"use client";

import React, { useState, useCallback } from "react";
import { Header } from "@/screens/landingScreen/components/Header";
import { LoginModal } from "@/screens/landingScreen/components/LoginModal";

export const SafetyHeader: React.FC = React.memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <>
      <Header onLoginClick={handleOpenLogin} />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </>
  );
});

SafetyHeader.displayName = "SafetyHeader";
