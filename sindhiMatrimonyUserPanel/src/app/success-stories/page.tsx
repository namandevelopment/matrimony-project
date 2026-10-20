import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { HappyMarriagesSection } from "@/screens/dashboardScreen/components/HappyMarriagesSection";
import { createMetadata } from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Success Stories | Sindhimarriage.in",
  description:
    "Real marriage stories and testimonials from couples who found their soulmate through Sindhimarriage.in.",
  canonicalPath: "/success-stories",
});

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 -ml-1 text-stone-500 hover:text-[#DB2F3C] rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-lg font-bold text-stone-900 font-heading">
              Success Stories
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#DB2F3C] hover:underline"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-[#DB2F3C] mb-3">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Sindhi Matrimony Success Stories
          </h1>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Read inspiring true love stories of couples who began their forever journey right here on Sindhimarriage.in.
          </p>
        </div>

        <HappyMarriagesSection defaultExpanded={true} />
      </main>
    </div>
  );
}
