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
  ArrowRight,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  DEFAULT_OUR_PROCESS_DATA,
  OurProcessContent,
  ProcessStep,
} from "../../ourProcessScreen/data/ourProcessData";
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";

const STEP_ICONS: Record<string, React.ElementType> = {
  UserPlus,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
};

const PILLAR_ICONS: Record<string, React.ElementType> = {
  Users2,
  Lock,
  Headset,
  BadgeCheck,
};

export const OurProcessSection: React.FC = memo(() => {
  const [data, setData] = useState<OurProcessContent>(DEFAULT_OUR_PROCESS_DATA);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Fetch dynamic content from backend API with fallback
  useEffect(() => {
    let isMounted = true;
    apiFetch.get<any>(ApiURL.ourProcess)
      .then((res) => {
        if (isMounted && res?.data && res.data.steps && res.data.steps.length > 0) {
          setData(res.data);
        }
      })
      .catch(() => {
        // Fallback silently to pre-bundled DEFAULT_OUR_PROCESS_DATA
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentStep =
    data.steps.find((s) => s.stepNumber === activeStep) || data.steps[0];
  const StepIcon = currentStep ? STEP_ICONS[currentStep.icon] || Sparkles : Sparkles;

  return (
    <section
      id="our-process"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 text-[#1A1A1A] overflow-hidden"
    >
      {/* Decorative Background Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>{data.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-stone-900 tracking-tight leading-tight">
            {data.title}
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            {data.subtitle}
          </p>
        </div>

        {/* 4 Steps Interactive Tabs (Mobile + Desktop) */}
        <div className="mt-12 lg:mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-1.5 sm:p-2 bg-stone-100/80 rounded-2xl border border-stone-200/80 shadow-inner">
            {data.steps.map((step) => {
              const IconComp = STEP_ICONS[step.icon] || Sparkles;
              const isSelected = activeStep === step.stepNumber;

              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStep(step.stepNumber)}
                  className={`relative flex items-center gap-3 p-3 sm:p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-white text-stone-900 shadow-md ring-1 ring-red-500/20 scale-[1.01]"
                      : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm sm:text-base transition-colors ${
                      isSelected
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-stone-200/70 text-stone-700"
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-red-600 truncate">
                      {step.badge || `Step 0${step.stepNumber}`}
                    </span>
                    <span className="block text-xs sm:text-sm font-semibold truncate text-stone-800">
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Feature Display Card */}
          {currentStep && (
            <div className="mt-8 bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
                {/* Left Column: Details & Highlights */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs uppercase tracking-wider">
                      Step {currentStep.stepNumber} of 4
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium text-xs">
                      {currentStep.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900">
                    {currentStep.title}
                  </h3>

                  <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                    {currentStep.detailedDescription || currentStep.shortDescription}
                  </p>

                  {/* Highlights Bullet List */}
                  {currentStep.highlights && currentStep.highlights.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Key Features &amp; Guarantees:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentStep.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro Tip Box */}
                  {currentStep.tips && currentStep.tips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-900 space-y-1">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block">
                        💡 Pro Tip for Sindhi Families:
                      </span>
                      <p className="leading-relaxed">{currentStep.tips[0]}</p>
                    </div>
                  )}

                  {/* Step Action CTA */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <a
                      href="#quick-register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Start This Step Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <Link
                      href="/our-process"
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-stone-700 hover:text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors"
                    >
                      <span>Read Full Guide</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Visual Journey Illustration & Icon Island */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-tr from-red-500/10 via-amber-500/10 to-stone-100 border border-stone-200 p-8 flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-24 h-24 rounded-3xl bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/20 mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
                      <StepIcon className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                        {currentStep.stepKey}
                      </span>
                      <h4 className="text-xl font-heading font-bold text-stone-900">
                        {currentStep.title}
                      </h4>
                      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                        {currentStep.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      {[1, 2, 3, 4].map((stepNum) => (
                        <button
                          key={stepNum}
                          onClick={() => setActiveStep(stepNum)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeStep === stepNum
                              ? "w-8 bg-red-600"
                              : "w-2 bg-stone-300 hover:bg-stone-400"
                          }`}
                          aria-label={`Jump to Step ${stepNum}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-heading font-bold text-stone-900">
              Why 10,000+ Sindhi Families Trust Our Process
            </h3>
            <p className="text-sm text-stone-500 mt-2">
              Combining ancient Sindhi traditions with modern privacy and security safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.featurePillars.map((pillar, i) => {
              const PillarIcon = PILLAR_ICONS[pillar.icon] || BadgeCheck;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-red-200 hover:shadow-lg transition-all duration-300 space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <PillarIcon className="w-6 h-6" />
                  </div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50/60 px-2.5 py-0.5 rounded-md">
                    {pillar.badge}
                  </span>
                  <h4 className="font-heading font-bold text-stone-900 text-base">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Counter Strip */}
        {data.stats && data.stats.length > 0 && (
          <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-stone-900 text-white shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
              {data.stats.map((st, idx) => (
                <div key={idx} className="pt-4 lg:pt-0 px-2 space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    <span>{st.value}</span>
                    <span className="text-red-500">{st.suffix}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-300">
                    {st.label}
                  </p>
                  <p className="text-[11px] text-stone-400 font-light">
                    {st.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

OurProcessSection.displayName = "OurProcessSection";
