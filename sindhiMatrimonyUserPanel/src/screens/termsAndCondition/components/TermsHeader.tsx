"use client";

import React, { useState } from "react";
import { Header } from "@/screens/landingScreen/components/Header";
import { LoginModal } from "@/screens/landingScreen/components/LoginModal";

export const TermsHeader: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
