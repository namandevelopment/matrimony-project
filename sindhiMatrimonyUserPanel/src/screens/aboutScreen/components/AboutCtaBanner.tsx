"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const AboutCtaBanner: React.FC = memo(() => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[#B31D28] via-[#DB2F3C] to-[#E54854] text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-rose-100 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Begin Your Auspicious Journey Today</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading">
          Find Your Perfect Sindhi Life Partner with Complete Dignity
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-rose-100/90 leading-relaxed">
          Join thousands of verified Sindhi singles and respected families. Free registration, confidential matchmaking, and 100% genuine rishtas.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/registration/basic-info"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#DB2F3C] font-bold text-sm shadow-lg hover:bg-rose-50 hover:shadow-xl transition-all duration-200"
          >
            <span>Register for FREE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 backdrop-blur-md transition-all duration-200"
          >
            <span>Browse Sindhi Matches</span>
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-rose-200/90">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            100% Privacy Control
          </span>
          <span>•</span>
          <span>No Obligation Free Sign-up</span>
          <span>•</span>
          <span>Verified Sindhi Rishtey</span>
        </div>
      </div>
    </section>
  );
});

AboutCtaBanner.displayName = "AboutCtaBanner";
