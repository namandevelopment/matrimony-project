import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { createMetadata } from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Sindhi Matrimony Registration",
  description: "Register and create your free profile on SindhiMatrimony.",
  noIndex: true,
});

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* Persistent Registration Header across all steps (Prevents re-mounting & blinking) */}
      <Header
        showHelpPhone
        helpPhoneText="Need help? Call"
        helpPhoneNumber="8144-77-88-66"
        subtitle="From Matrimony.com Group"
        position="sticky"
      />

      {/* Step Page Content */}
      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
