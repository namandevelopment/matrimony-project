"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrustBadges } from "./components/TrustBadges";
import { LoginModal } from "./components/LoginModal";
import { MatrimonyHeartLogo } from "./components/Icons";

export const LandingScreen: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#1A1A1A] selection:bg-red-100 selection:text-red-900">
      {/* 1. Header (Sticky & Responsive) */}
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />

      {/* 2. Main Content */}
      <main className="relative flex-1 w-full flex flex-col pt-16 sm:pt-18 bg-white">
        {/* Hero Section with Couples Collage & Registration Forms */}
        <HeroSection onLoginClick={() => setIsLoginModalOpen(true)} />

        {/* 3. Trust & Credibility Badges (5 Trust Highlights from Photo 2 & 4) */}
        <TrustBadges communityName="Sindhis" />

        {/* 4. SEO Descriptive Content Section (Crawlable Semantic Content) */}
        <section
          aria-label="About Sindhi Matrimony"
          className="w-full py-12 bg-stone-50 border-t border-[#E9E9E9] text-stone-600 text-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
                India&apos;s Most Trusted Sindhi Matrimonial Network
              </h2>
              <p className="leading-relaxed mb-4 text-[#444444]">
                SindhiMatrimony.com is the dedicated matchmaking portal from Matrimony.com Group, tailored exclusively for the global Sindhi community. Whether you belong to Bhaiband, Amil, Sahiti, Lohana, Larkana, or any other Sindhi sub-caste, our verified profiles, advanced horoscope matching, and strict privacy controls help you discover your compatible life partner with ease and dignity.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
                  Sindhi Brides &amp; Grooms
                </span>
                <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
                  100% Mobile &amp; ID Verified
                </span>
                <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
                  Kundali &amp; Horoscope Matching
                </span>
                <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
                  Global Sindhi NRI Network
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="w-full bg-stone-900 text-stone-400 py-8 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MatrimonyHeartLogo size={24} className="w-6 h-6" color="#FF4A57" />
            <p>© {new Date().getFullYear()} SindhiMatrimony.com. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-stone-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/safety-tips" className="hover:text-white transition-colors">
              Safety Tips
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Help &amp; Support
            </Link>
          </div>
        </div>
      </footer>

      {/* 6. Accessible Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
