"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowLeft, Star, HeartHandshake, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ReviewsSection } from "@/screens/landingScreen/components/ReviewsSection";
import { Footer } from "@/screens/landingScreen/components/Footer";

export const ReviewsScreen: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 -ml-1 text-stone-500 hover:text-[#DB2F3C] rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-lg font-bold text-stone-900 font-heading">
              Member Reviews &amp; Ratings
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/success-stories"
              className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#DB2F3C] transition-colors"
            >
              Success Stories
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs font-bold transition-all shadow-xs"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Reviews Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#DB2F3C] text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-[#DB2F3C]" />
            <span>4.9 / 5 Rating from Sindhi Families</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Trusted by Over 1,200+ Sindhi Families Worldwide
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            Read verified experiences and ratings from brides, grooms, and parents who found their ideal matrimonial matches on Sindhimarriage.in.
          </p>
        </div>

        {/* 3 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB2F3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">100% ID Verified</p>
              <p className="text-[11px] text-stone-500">Government ID &amp; Gotra checks</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Authentic Feedback</p>
              <p className="text-[11px] text-stone-500">Only verified member reviews</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Admin Moderation</p>
              <p className="text-[11px] text-stone-500">Family-safe content guaranteed</p>
            </div>
          </div>
        </div>

        {/* Live Dynamic Reviews Section */}
        <ReviewsSection />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
});

ReviewsScreen.displayName = "ReviewsScreen";
