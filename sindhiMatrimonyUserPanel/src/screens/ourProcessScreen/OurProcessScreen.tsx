"use client";

import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import {
  UserPlus,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Users2,
  Lock,
  Headset,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import {
  DEFAULT_OUR_PROCESS_DATA,
  OurProcessContent,
  ProcessStep,
} from "./data/ourProcessData";
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";

const STEP_ICONS: Record<string, React.ElementType> = {
  UserPlus,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
};

export const OurProcessScreen: React.FC = memo(() => {
  const [data, setData] = useState<OurProcessContent>(DEFAULT_OUR_PROCESS_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;
    apiFetch.get<any>(ApiURL.ourProcess)
      .then((res) => {
        if (isMounted && res?.data && res.data.steps && res.data.steps.length > 0) {
          setData(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs h-16 sm:h-18 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="leading-tight">
              <span className="font-heading font-extrabold text-stone-900 text-lg sm:text-xl tracking-tight block">
                Sindhi<span className="text-red-600">Matrimony</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wide uppercase block -mt-0.5">
                Vivah &amp; Matchmaking Desk
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/#quick-register"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              Register Free
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 w-full pt-20 sm:pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold">Our Process</span>
          </nav>
        </div>

        {/* Hero Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center py-10 sm:py-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>{data.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-stone-900 tracking-tight leading-tight">
            {data.title}
          </h1>

          <p className="text-base sm:text-xl text-stone-600 max-w-3xl mx-auto font-normal">
            {data.subtitle}
          </p>
        </section>

        {/* 4 Detailed Step Cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {data.steps.map((step) => {
            const IconComp = STEP_ICONS[step.icon] || Sparkles;

            return (
              <div
                key={step.stepNumber}
                className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex sm:flex-col items-center gap-3 shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-red-500/20">
                      0{step.stepNumber}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md">
                        {step.badge}
                      </span>
                      <span className="text-xs text-stone-400">• Step {step.stepNumber}</span>
                    </div>

                    <h2 className="text-2xl font-heading font-bold text-stone-900">
                      {step.title}
                    </h2>

                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                      {step.detailedDescription || step.shortDescription}
                    </p>

                    {/* Highlights */}
                    {step.highlights && step.highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {step.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tips */}
                    {step.tips && step.tips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-900">
                        <span className="font-bold text-amber-800">💡 Advice: </span>
                        <span>{step.tips[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Process FAQs Section */}
        {data.faqs && data.faqs.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
                Frequently Asked Questions About Our Process
              </h3>
              <p className="text-stone-500 text-sm">
                Everything you need to know before embarking on your matrimonial search.
              </p>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-stone-800 hover:text-red-600 transition-colors"
                    >
                      <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-red-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h3 className="text-2xl sm:text-4xl font-heading font-black">
                {data.cta.title}
              </h3>
              <p className="text-stone-300 text-sm sm:text-base">
                {data.cta.subtitle}
              </p>
              <div className="pt-4">
                <Link
                  href="/#quick-register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <span>{data.cta.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-stone-900 text-stone-400 py-8 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Sindhimarriage.in. All rights reserved.</p>
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
    </div>
  );
});

OurProcessScreen.displayName = "OurProcessScreen";

export default OurProcessScreen;
