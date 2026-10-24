"use client";

import React, { useState, useCallback, memo } from "react";
import { Header } from "@/screens/landingScreen/components/Header";
import { LoginModal } from "@/screens/landingScreen/components/LoginModal";
import { DashboardFooter } from "@/screens/dashboardScreen/components/DashboardFooter";
import {
  AboutHero,
  AboutMissionVision,
  AboutPillars,
  AboutHeritage,
  AboutFaq,
  AboutCtaBanner,
} from "./components";
import { ABOUT_PAGE_DATA } from "./data/aboutData";

export const AboutScreen: React.FC = memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Top Navigation Bar */}
      <Header onLoginClick={handleOpenLogin} />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <AboutHero data={ABOUT_PAGE_DATA} />
        <AboutMissionVision data={ABOUT_PAGE_DATA} />
        <AboutPillars pillars={ABOUT_PAGE_DATA.pillars} />
        <AboutHeritage subcastes={ABOUT_PAGE_DATA.subcastes} />
        <AboutFaq faqs={ABOUT_PAGE_DATA.faqs} />
        <AboutCtaBanner />
      </main>

      {/* 3. Footer */}
      <DashboardFooter />

      {/* 4. Login Dialog */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
});

AboutScreen.displayName = "AboutScreen";
