import React from "react";
import { Header } from "@/components/Header";

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
