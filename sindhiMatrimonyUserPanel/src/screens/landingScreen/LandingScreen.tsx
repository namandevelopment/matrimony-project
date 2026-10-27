"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrustBadges } from "./components/TrustBadges";
import { OurProcessSection } from "./components/OurProcessSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { FloatingChatWidget } from "@/components";
import { Storage } from "@/storage";
import { LoginModal } from "./components/LoginModal";

function SearchParamsSync({ onOpenLogin }: { onOpenLogin: (mobile: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const shouldOpenLogin = searchParams.get("login") === "true";
    const mobileParam = searchParams.get("mobile");
    if (shouldOpenLogin) {
      onOpenLogin(mobileParam || "");
    }
  }, [searchParams, onOpenLogin]);
  return null;
}

const LandingScreenComponent: React.FC = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMobile, setLoginMobile] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = Storage.getItemSync<any>("user");
    if (user?.isOnboardingComplete) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleAutoOpenLogin = useCallback((mobile: string) => {
    if (mobile) setLoginMobile(mobile);
    setIsLoginModalOpen(true);
  }, []);

  const handleOpenLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
      <React.Suspense fallback={null}>
        <SearchParamsSync onOpenLogin={handleAutoOpenLogin} />
      </React.Suspense>
      {/* 1. Header (Sticky & Responsive) */}
      <Header onLoginClick={handleOpenLoginModal} />

      {/* 2. Main Content */}
      <main className="relative flex-1 w-full flex flex-col pt-16 sm:pt-18">
        {/* Hero Section with Couples Collage & Registration Forms */}
        <HeroSection onLoginClick={handleOpenLoginModal} />

        {/* 3. Trust & Credibility Badges (5 Trust Highlights) */}
        <TrustBadges communityName="Sindhis" />

        {/* 4. Our Process (4-Step Matrimonial Journey) */}
        <OurProcessSection />

        {/* 5. Real Member Reviews & Stories (Admin Moderated) */}
        <ReviewsSection />

        {/* 6. SEO Descriptive Content Section */}
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
