"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { memoWithDeepEqual } from "@/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Heart,
  HelpCircle,
  Lock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { apiFetch, ApiURL, showToast } from "@/redux/apiService";
import { PlanCard } from "./components";
import { PlanItem, PlanTab, SubscriptionScreenProps } from "./types";

const FALLBACK_PLANS: PlanItem[] = [
  {
    id: "plan_silver",
    name: "Silver Tier",
    tagline: "Essential starter package for active discovery",
    tier: "SILVER",
    durationMonths: 3,
    durationDays: 90,
    priceINR: 2999,
    originalPriceINR: 4999,
    discountPercentage: 40,
    contactViewCredits: 25,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: null,
    features: [
      "Send unlimited Connect / Rishta interests",
      "Unlock 25 verified Phone & WhatsApp contacts",
      "Direct chat messaging with all candidates (Unlimited)",
      "Basic Kundli & 36 Guna Milan report",
      "Valid for 90 Days",
    ],
    isPopular: false,
  },
  {
    id: "plan_gold",
    name: "Gold Tier",
    tagline: "Most popular choice for serious candidates & families",
    tier: "GOLD",
    durationMonths: 6,
    durationDays: 180,
    priceINR: 5999,
    originalPriceINR: 9999,
    discountPercentage: 40,
    contactViewCredits: 60,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "MOST POPULAR",
    features: [
      "Everything in Silver Tier included",
      "Unlock 60 verified Phone & WhatsApp contacts",
      "Unlimited direct chat messaging for 6 full months",
      "View candidates who visited your profile",
      "Priority profile placement in daily recommendations",
      "Full Vedic Kundli matching breakdown",
      "Valid for 180 Days",
    ],
    isPopular: true,
  },
  {
    id: "plan_diamond",
    name: "Diamond Tier",
    tagline: "High-visibility package with premium matchmaking perks",
    tier: "DIAMOND",
    durationMonths: 12,
    durationDays: 365,
    priceINR: 9999,
    originalPriceINR: 17999,
    discountPercentage: 45,
    contactViewCredits: 150,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "BEST VALUE",
    features: [
      "Everything in Gold Tier included",
      "Unlock 150 verified Phone & WhatsApp contacts",
      "Unlimited direct chat messaging for 1 full year",
      "Featured Candidate badge on profile card",
      "Standout profile highlighting in search results",
      "Dedicated matrimonial advisor support",
      "Valid for 365 Days",
    ],
    isPopular: false,
  },
  {
    id: "plan_vip",
    name: "VIP Assisted Matchmaking",
    tagline: "White-glove matrimonial assistance by senior Sindhi matchmaker",
    tier: "VIP",
    durationMonths: 12,
    durationDays: 365,
    priceINR: 21000,
    originalPriceINR: 35000,
    discountPercentage: 40,
    contactViewCredits: 999,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "VIP ASSISTED",
    features: [
      "Dedicated Senior Relationship Manager assigned",
      "Handpicked matches sent directly on WhatsApp weekly",
      "RM coordinates & schedules conference calls / meetings",
      "Background and family verification support",
      "Unlock up to 999 verified Phone numbers",
      "Valid for 1 Full Year",
    ],
    isPopular: false,
  },
];

const SubscriptionScreenComponent: React.FC<SubscriptionScreenProps> = ({
  initialPlanType,
  className = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPlan = searchParams?.get("plan");
  const defaultTab: PlanTab =
    initialPlanType || (queryPlan === "assisted" ? "assisted" : "regular");

  const [activeTab, setActiveTab] = useState<PlanTab>(defaultTab);
  const [plans, setPlans] = useState<PlanItem[]>(FALLBACK_PLANS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("PLAN_GOLD_3_MONTHS");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 1. Fetch real plans from backend
  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.getPlans,
          method: "GET",
        });

        if (isMounted && res.data && Array.isArray(res.data.plans)) {
          setPlans(res.data.plans);
        }
      } catch {
        // Fallback already preset
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter plans based on active tab
  const regularPlans = useMemo(
    () =>
      plans.filter(
        (p) =>
          !p.id?.toUpperCase().includes("ASSIST") &&
          !p.tier?.toUpperCase().includes("ASSIST") &&
          p.tier !== "VIP" &&
          !p.name?.toUpperCase().includes("ASSIST")
      ),
    [plans]
  );
  const assistedPlans = useMemo(
    () =>
      plans.filter(
        (p) =>
          p.id?.toUpperCase().includes("ASSIST") ||
          p.tier?.toUpperCase().includes("ASSIST") ||
          p.tier === "VIP" ||
          p.name?.toUpperCase().includes("ASSIST")
      ),
    [plans]
  );

  // Handle plan purchase / upgrade
  const handleSelectPlan = useCallback(
    async (plan: PlanItem) => {
      setSelectedPlanId(plan.id);
      setIsProcessing(true);

      try {
        // 1. Initiate order with backend
        const orderRes = await apiFetch<any>({
          url: ApiURL.createPaymentOrder,
          method: "POST",
          data: {
            planId: plan.id,
            currency: "INR",
          },
        });

        const orderData = orderRes.data || {};

        // 2. Complete/Verify membership activation
        const verifyRes = await apiFetch<any>({
          url: ApiURL.verifyPaymentSignature,
          method: "POST",
          data: {
            planId: plan.id,
            paymentOrderId: orderData.orderId || `order_${Date.now()}`,
            paymentId: `pay_${Date.now()}`,
          },
        });

        if (verifyRes.error) {
          showToast({
            type: "error",
            message: verifyRes.message || "Payment initiation failed. Please try again.",
          });
        } else {
          showToast({
            type: "success",
            message: `Congratulations! Your ${plan.name} has been activated!`,
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
        }
      } catch (err: any) {
        showToast({
          type: "error",
          message: err?.message || "Failed to process payment. Please retry.",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [router]
  );

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pb-16 ${className}`}>
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-700">
              Special Festive Offer • Flat up to 58% Off
            </span>
          </div> */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DB2F3C] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membership Plans</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Find Your Sindhi Life Partner Faster
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
            Upgrade your membership to view verified phone numbers, start unlimited direct chats, and unlock horoscope matching.
          </p>

          {/* Tab Selector */}
          <div className="mt-6 inline-flex p-1 rounded-full bg-stone-200/80 border border-stone-300">
            <button
              type="button"
              onClick={() => setActiveTab("regular")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "regular"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Standard Membership
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("assisted")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "assisted"
                ? "bg-[#DB2F3C] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
                }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Assisted Service</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        {activeTab === "regular" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
            {regularPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={plan.id === selectedPlanId}
                onSelect={handleSelectPlan}
                isProcessing={isProcessing && selectedPlanId === plan.id}
              />
            ))}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${assistedPlans.length === 1
              ? "max-w-md"
              : assistedPlans.length === 2
                ? "md:grid-cols-2 max-w-3xl"
                : "md:grid-cols-3"
              } gap-6 sm:gap-8 items-stretch justify-center mx-auto mb-12`}
          >
            {assistedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={plan.id === selectedPlanId}
                onSelect={handleSelectPlan}
                isProcessing={isProcessing && selectedPlanId === plan.id}
              />
            ))}
          </div>
        )}

        {/* Trust & Guarantee Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs mb-12 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB2F3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">100% Verified Profiles</h4>
              <p className="text-[11px] text-stone-500">Government ID & mobile verified candidates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Secure Payments</h4>
              <p className="text-[11px] text-stone-500">256-bit encrypted bank grade checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Dedicated Support</h4>
              <p className="text-[11px] text-stone-500">Call / WhatsApp assistance anytime</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Highlights */}
        <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-4 text-center">
            Why Upgrade to Paid Membership?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Unlock Verified Contacts:</strong> Get direct mobile & WhatsApp numbers to speak with candidates and families directly.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Unlimited Chat & Messaging:</strong> Initiate conversations with prospects without waiting for reciprocal interest.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Vedic Kundli Compatibility:</strong> View complete Ashta Koota 36 Guna Milan breakdown and Manglik dosha checks.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Priority Profile Boost:</strong> Be seen by up to 5x more prospects with top listing in daily recommendations.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubscriptionScreen = memoWithDeepEqual(
  SubscriptionScreenComponent,
  "SubscriptionScreen"
);
export default SubscriptionScreen;
