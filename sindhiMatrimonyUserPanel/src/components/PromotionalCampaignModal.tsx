"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Sparkles, Tag, ArrowRight } from "lucide-react";
import { ApiURL } from "@/redux/apiService/endpoint";

export interface PromotionalPopupData {
  id: string;
  popupId?: string;
  title: string;
  subtitle?: string;
  message: string;
  bannerUrl?: string;
  bannerImageUrl?: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountLabel?: string;
  couponCode?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaType?: string;
  placement?: string;
  priority?: number;
}

interface PromotionalCampaignModalProps {
  userId?: string;
  onNavigate?: (route: string) => void;
}

export const PromotionalCampaignModal: React.FC<PromotionalCampaignModalProps> = ({
  userId = "guest_user",
  onNavigate,
}) => {
  const [popup, setPopup] = useState<PromotionalPopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const today = new Date().toISOString().split("T")[0];

    const fetchEligiblePopup = async () => {
      try {
        const queryParams = new URLSearchParams({
          placement: "DASHBOARD",
          platform: "WEB",
          userId: String(userId),
          clientDate: today,
        }).toString();

        const res = await fetch(ApiURL.activePopups(queryParams), {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": String(userId),
          },
        });
        const json = await res.json();
        const popups: PromotionalPopupData[] = json?.data?.popups || [];

        if (isMounted && popups.length > 0) {
          const topPopup = popups[0];
          // Check local client guard for today as fallback
          const localKey = `popup_dismissed_${topPopup.id || topPopup.popupId}_${today}`;
          if (localStorage.getItem(localKey) !== "true") {
            setPopup(topPopup);
            setIsOpen(true);

            // Track impression
            fetch(ApiURL.popupInteraction(topPopup.id || topPopup.popupId || ""), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "IMPRESSION" }),
            }).catch(() => {});
          }
        }
      } catch {}
    };

    fetchEligiblePopup();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleDismiss = useCallback(() => {
    if (!popup) return;
    const targetId = popup.id || popup.popupId || "";
    const today = new Date().toISOString().split("T")[0];

    // 1. Immediately close modal on UI
    setIsOpen(false);

    // 2. Client guard fallback
    try {
      localStorage.setItem(`popup_dismissed_${targetId}_${today}`, "true");
    } catch {}

    // 3. Call backend Ludo King Day-Cap dismiss API
    fetch(ApiURL.dismissPopup(targetId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: String(userId),
        clientDate: today,
        reason: "USER_CLICKED_CROSS_CLOSE",
      }),
    }).catch(() => {});
  }, [popup, userId]);

  const handleCtaClick = useCallback(() => {
    if (!popup) return;
    const targetId = popup.id || popup.popupId || "";

    // Track click
    fetch(ApiURL.popupInteraction(targetId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "CLICK" }),
    }).catch(() => {});

    setIsOpen(false);

    if (popup.ctaLink) {
      if (onNavigate) {
        onNavigate(popup.ctaLink);
      } else if (typeof window !== "undefined") {
        window.location.href = popup.ctaLink;
      }
    }
  }, [popup, onNavigate]);

  if (!isOpen || !popup) return null;

  const banner = popup.bannerImageUrl || popup.bannerUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden text-center relative animate-scale-up">
        {/* [X] Close Button (Triggers 1-Day Dismissal) */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md"
          title="Close (Will not appear again today)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner Creative */}
        {banner && (
          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
            <img
              src={banner}
              alt={popup.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {popup.discountLabel && (
              <div className="absolute top-3 left-3 bg-[#C81E28] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {popup.discountLabel}
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-3">
          {popup.subtitle && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
              {popup.subtitle}
            </span>
          )}

          <h3 className="text-base font-black text-slate-900 leading-snug">
            {popup.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {popup.message}
          </p>

          {/* Pricing Comparison */}
          {popup.discountedPrice && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl py-2 px-3 flex items-center justify-center gap-3">
              {popup.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ₹{Number(popup.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-lg font-black text-emerald-600">
                ₹{Number(popup.discountedPrice).toLocaleString("en-IN")}
              </span>
              {popup.couponCode && (
                <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-md font-mono font-bold">
                  {popup.couponCode}
                </span>
              )}
            </div>
          )}

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] shadow-md shadow-rose-900/20 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{popup.ctaText || "Claim Offer"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

