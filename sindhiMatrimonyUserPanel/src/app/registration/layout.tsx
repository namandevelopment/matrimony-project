import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { createMetadata } from "@/metadata";
import { RegistrationRouteGuard } from "./components/RegistrationRouteGuard";

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
        subtitle="Powered by NeelimaMarriage.com"
        position="sticky"
      />

      {/* Step Page Content guarded by authoritative server state */}
      <div className="flex-1 w-full flex flex-col">
        <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center p-8 text-stone-400">Loading...</div>}>
          <RegistrationRouteGuard>{children}</RegistrationRouteGuard>
        </Suspense>
      </div>
    </div>
  );
}
