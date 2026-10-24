"use client";

import React, { memo, useMemo } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { MatchDetailProfile } from "../types";
import { UpgradeModal } from "@/screens/viewProfileScreen/components/ViewProfileModals";

export const formatMaskedPhone = (phone?: string) => {
  if (!phone) return "+91 98XXXXXX";
  const trimmed = phone.trim();
  const match = trimmed.match(/^(\+?\d{1,3}[\s-]?)?(\d{2})(\d*)$/);
  if (match) {
    return `${match[1] || ""}${match[2]}XXXXXX`;
  }
  return "+91 98XXXXXX";
};

export interface ContactDetailsModalProps {
  isOpen: boolean;
  type: "call" | "whatsapp" | null;
  profile: MatchDetailProfile | null;
  isSubscribed?: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

const ContactDetailsModalComponent: React.FC<ContactDetailsModalProps> = ({
  isOpen,
  type,
  profile,
  isSubscribed,
  onClose,
  onUpgradeClick,
}) => {
  const isSubscribedUser = useMemo(() => {
    if (typeof isSubscribed === "boolean") return isSubscribed;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return Boolean(parsed.isSubscribed || parsed.membershipStatus === "Paid member" || parsed.plan);
        }
      } catch {}
    }
    return false;
  }, [isSubscribed]);

  const userPhotoUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.avatar || parsed.avatarUrl || parsed.photoUrl || "";
        }
      } catch {}
    }
    return "";
  }, []);

  if (!isOpen || !profile) return null;

  const isCall = type === "call";

  if (!isSubscribedUser) {
    return (
      <UpgradeModal
        isOpen={isOpen}
        onClose={onClose}
        targetField={isCall ? "Phone Number" : "WhatsApp Number"}
        prospectName={profile.name}
        prospectPhotoUrl={profile.photoUrl}
        userPhotoUrl={userPhotoUrl}
        maskedPhone={formatMaskedPhone(profile.phoneNumber || profile.whatsappNumber)}
        onUpgradeNow={onUpgradeClick}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-center p-6 space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${
            isCall ? "bg-orange-50 text-[#EA580C]" : "bg-emerald-50 text-[#22C55E]"
          }`}
        >
          {isCall ? (
            <Phone className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 font-heading">
            {isCall ? "Call" : "WhatsApp"} {profile.name}
          </h3>
          <p className="text-xs text-stone-500">
            {profile.matrimonyId} &bull; {profile.city}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <p className="text-xs text-stone-600">Verified Contact Number:</p>
          <p className="text-base font-bold text-stone-900 tracking-wider">
            {profile.phoneNumber || "+91 98XXX XXXXX"}
          </p>
          <p className="text-[11px] text-stone-500">
            Member is online or active recently.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {isCall ? (
            <a
              href={`tel:${profile.phoneNumber || "+919876543210"}`}
              className="w-full py-2.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold shadow-xs active:scale-98 transition-all inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          ) : (
            <a
              href={`https://wa.me/${(profile.whatsappNumber || "919876543210").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold shadow-xs active:scale-98 transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </a>
          )}

          {onUpgradeClick && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="text-[11px] font-semibold text-[#DB2F3C] hover:underline pt-1 cursor-pointer"
            >
              Want direct contact to all matches? Upgrade now &raquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContactDetailsModal = memo(ContactDetailsModalComponent);
ContactDetailsModal.displayName = "ContactDetailsModal";
export default ContactDetailsModal;
