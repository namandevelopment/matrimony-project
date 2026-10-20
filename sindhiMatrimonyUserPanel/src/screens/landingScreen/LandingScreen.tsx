"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrustBadges } from "./components/TrustBadges";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { FloatingChatWidget } from "@/components";

// Dynamically import LoginModal to reduce critical initial bundle size
const LoginModal = dynamic(
  () => import("./components/LoginModal").then((mod) => mod.LoginModal),
  { ssr: false }
);

const LandingScreenComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMobile, setLoginMobile] = useState("");

  useEffect(() => {
    const shouldOpenLogin = searchParams.get("login") === "true";
    const mobileParam = searchParams.get("mobile");
    if (shouldOpenLogin) {
      if (mobileParam) setLoginMobile(mobileParam);
      setIsLoginModalOpen(true);
    }
  }, [searchParams]);

  const handleOpenLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
      {/* 1. Header (Sticky & Responsive) */}
      <Header onLoginClick={handleOpenLoginModal} />

      {/* 2. Main Content */}
      <main className="relative flex-1 w-full flex flex-col pt-16 sm:pt-18">
        {/* Hero Section with Couples Collage & Registration Forms */}
        <HeroSection onLoginClick={handleOpenLoginModal} />

        {/* 3. Trust & Credibility Badges (5 Trust Highlights) */}
        <TrustBadges communityName="Sindhis" />

        {/* 4. SEO Descriptive Content Section */}
        <AboutSection />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Accessible Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        initialIdentifier={loginMobile}
        onClose={handleCloseLoginModal}
      />

      {/* 7. Floating Customer Support Chat Widget (Smooth & Isolated State) */}
      <FloatingChatWidget />
    </div>
  );
};

export const LandingScreen = memo(LandingScreenComponent);
LandingScreen.displayName = "LandingScreen";
