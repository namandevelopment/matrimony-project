import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Bell, User } from "lucide-react";
import { createMetadata } from "@/metadata";
import { DashboardHeader } from "@/screens/dashboardScreen/components/DashboardHeader";
import { DashboardFooter } from "@/screens/dashboardScreen/components/DashboardFooter";
import type { UserProfile } from "@/screens/dashboardScreen/types";

interface Props {
  params: Promise<{ tab: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab } = await params;
  const title =
    tab === "account"
      ? "Account Settings"
      : tab === "communication"
      ? "Communication Settings"
      : "Privacy Settings";

  return createMetadata({
    title: `${title} | Sindhimarriage.in`,
    description: `Manage your ${title.toLowerCase()} and profile preferences on Sindhimarriage.in.`,
    canonicalPath: `/settings/${tab}`,
  });
}

export default async function SettingsPage({ params }: Props) {
  const { tab } = await params;
  const activeTab = tab || "account";

  const user: UserProfile = {
    name: "Naman",
    matrimonyId: "SM4517087",
    community: "Sindhi",
    membershipStatus: "Free member",
    completenessScore: 85,
    avatarUrl: undefined,
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#1A1A1A] flex flex-col justify-between">
      {/* 1. Global Platform Dashboard Header */}
      <DashboardHeader user={user} />

      {/* 2. Main Settings Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        {/* Breadcrumb / Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13.5px] text-stone-500">
            <Link href="/dashboard" className="hover:text-[#DB2F3C] transition-colors">
              Dashboard
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-stone-800">Settings</span>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          {/* Settings Tabs */}
          <div className="flex border-b border-stone-200 overflow-x-auto bg-white">
            <Link
              href="/settings/account"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "account"
                  ? "border-[#DB2F3C] text-[#DB2F3C] font-bold"
                  : "border-transparent text-stone-600 hover:text-stone-900"
              }`}
            >
              <User className="w-4 h-4" />
              Account Settings
            </Link>
            <Link
              href="/settings/communication"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "communication"
                  ? "border-[#DB2F3C] text-[#DB2F3C] font-bold"
                  : "border-transparent text-stone-600 hover:text-stone-900"
              }`}
            >
              <Bell className="w-4 h-4" />
              Communication Settings
            </Link>
            <Link
              href="/settings/privacy"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "privacy"
                  ? "border-[#DB2F3C] text-[#DB2F3C] font-bold"
                  : "border-transparent text-stone-600 hover:text-stone-900"
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacy Settings
            </Link>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-heading">Account Credentials</h2>
                  <p className="text-sm text-stone-500 mt-1">Manage your registered phone number, email, and password.</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-xs text-stone-500 font-medium uppercase">Registered Mobile</p>
                      <p className="text-sm font-semibold text-stone-900 mt-0.5">+91 95095 31768</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-xs text-stone-500 font-medium uppercase">Profile Status</p>
                      <p className="text-sm font-semibold text-stone-900 mt-0.5">Active & Visible to Matches</p>
                    </div>
                    <span className="text-xs text-stone-600 font-semibold bg-stone-200 px-2.5 py-1 rounded-full">
                      Free Member
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "communication" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-heading">Communication Preferences</h2>
                  <p className="text-sm text-stone-500 mt-1">Choose how and when you want to receive notifications and match alerts.</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">WhatsApp Match Alerts</p>
                      <p className="text-xs text-stone-500 mt-0.5">Receive curated Sindhi match recommendations on WhatsApp</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Email Daily Digest</p>
                      <p className="text-xs text-stone-500 mt-0.5">Summary of new profiles matching your partner preferences</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Enabled</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-heading">Privacy & Photo Shield</h2>
                  <p className="text-sm text-stone-500 mt-1">Control who can view your contact details, photos, and horoscope.</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Photo Visibility</p>
                      <p className="text-xs text-stone-500 mt-0.5">Visible only to verified members who match your criteria</p>
                    </div>
                    <span className="text-xs text-stone-700 font-semibold bg-stone-200 px-2 py-0.5 rounded">Protected</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Phone Number Privacy</p>
                      <p className="text-xs text-stone-500 mt-0.5">Share phone number only after you accept their interest</p>
                    </div>
                    <span className="text-xs text-stone-700 font-semibold bg-stone-200 px-2 py-0.5 rounded">Restricted</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Global Dashboard Footer */}
      <DashboardFooter />
    </div>
  );
}
