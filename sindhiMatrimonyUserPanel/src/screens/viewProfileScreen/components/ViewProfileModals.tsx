"use client";

import React, { memo } from "react";
import { X, UserRound, MessageSquare, Sparkles, MapPin } from "lucide-react";
import { MaleSilhouetteAvatar, FemaleSilhouetteAvatar } from "@/screens/dashboardScreen/components/DashboardIcons";
import { ViewUserProfile } from "../types";

// 1. Upgrade to Paid Membership Modal (Exact replica of BrahminMatrimony Screenshot 2)
export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetField?: string;
  prospectName?: string;
  prospectPhotoUrl?: string;
  userPhotoUrl?: string;
  maskedPhone?: string;
  onUpgradeNow?: () => void;
}

export const UpgradeModal = memo<UpgradeModalProps>(
  ({
    isOpen,
    onClose,
    targetField = "contact details",
    prospectName = "Riya Dubey",
    prospectPhotoUrl,
    userPhotoUrl,
    maskedPhone = "+91 77XXXXXXXX",
    onUpgradeNow,
  }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
      >
        <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
          {/* Close button at top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs z-20"
            aria-label="Close dialog"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          {/* Top Sunburst Radiant Glow Header Section */}
          <div className="relative pt-8 pb-5 px-6 sm:px-8 text-center bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-white overflow-hidden">
            {/* Sunburst radial beams SVG */}
            <div className="absolute inset-0 pointer-events-none opacity-40 select-none flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 400 400"
                className="w-[180%] h-[180%] -top-1/3 animate-spin-very-slow text-amber-200/70"
                fill="currentColor"
              >
                {Array.from({ length: 18 }).map((_, i) => (
                  <polygon
                    key={i}
                    points="200,200 184,0 216,0"
                    transform={`rotate(${i * 20} 200 200)`}
                  />
                ))}
              </svg>
            </div>

            {/* Overlapping Avatars (User + Prospect) */}
            <div className="relative z-10 flex items-center justify-center -space-x-3 sm:-space-x-4 mb-3.5">
              {/* Left: User Avatar (Blue shirt male silhouette) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#EBF3FB] border-3 border-white shadow-md flex items-center justify-center z-10">
                {userPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userPhotoUrl}
                    alt="My Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-2 flex items-center justify-center">
                    <MaleSilhouetteAvatar className="w-full h-full text-stone-500" />
                  </div>
                )}
              </div>

              {/* Right: Prospect Avatar (Riya Dubey) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-stone-200 border-3 border-white shadow-md z-20">
                {prospectPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={prospectPhotoUrl}
                    alt={prospectName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-2 flex items-center justify-center">
                    <FemaleSilhouetteAvatar className="w-full h-full text-stone-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Heading */}
            <h3
              id="upgrade-modal-title"
              className="relative z-10 text-xl sm:text-[22px] font-bold text-stone-900 tracking-tight font-heading leading-tight"
            >
              Upgrade to Paid Membership
            </h3>

            {/* Subheading */}
            <p className="relative z-10 text-xs sm:text-[13.5px] text-stone-600 font-normal mt-1.5 leading-relaxed">
              Chat / Call {maskedPhone || "+91 77XXXXXXXX"} to connect with {prospectName}
            </p>
          </div>

          {/* Benefits Box Section */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 space-y-5">
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 mb-2.5 text-center sm:text-left">
                Paid membership lets you
              </h4>

              <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 space-y-3.5 shadow-2xs">
                {/* Benefit 1: View contact numbers */}
                <div className="flex items-center gap-3.5 text-xs sm:text-[13px] text-stone-700">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                    <UserRound className="w-4 h-4" />
                  </div>
                  <span>View contact numbers and call / WhatsApp matches</span>
                </div>

                {/* Benefit 2: Send personalised messages */}
                <div className="flex items-center gap-3.5 text-xs sm:text-[13px] text-stone-700">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Send personalised messages</span>
                </div>

                {/* Benefit 3: View and match horoscopes */}
                <div className="flex items-center gap-3.5 text-xs sm:text-[13px] text-stone-700">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>View and match horoscopes</span>
                </div>
              </div>
            </div>

            {/* Continue Button (Solid Coral Red full-width button) */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgradeNow?.();
              }}
              className="w-full py-3 rounded-xl sm:rounded-2xl bg-[#E54848] hover:bg-[#D93838] active:scale-[0.99] text-white text-sm sm:text-base font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer tracking-wide"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
);
UpgradeModal.displayName = "UpgradeModal";

// 2. Horoscope Request Modal
export interface HoroscopeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospectName: string;
  onConfirmSend: () => void;
  isSent?: boolean;
}

export const HoroscopeRequestModal = memo<HoroscopeRequestModalProps>(
  ({ isOpen, onClose, prospectName, onConfirmSend, isSent = false }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="horoscope-modal-title"
      >
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 space-y-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-7 h-7 stroke-2" />
          </div>

          <div>
            <h3 id="horoscope-modal-title" className="text-xl font-bold text-stone-900">
              {isSent ? "Horoscope Request Sent!" : "Request Horoscope Details"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {isSent
                ? `We have notified ${prospectName} about your horoscope request. You will receive an instant notification once accepted.`
                : `Would you like to send a formal request to ${prospectName} to view full horoscope and astrological charts?`}
            </p>
          </div>

          <div className="pt-2">
            {isSent ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                Done
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirmSend}
                  className="flex-1 py-2.5 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
HoroscopeRequestModal.displayName = "HoroscopeRequestModal";

// 3. Contact Details / Call & WhatsApp Modal (Renders exact Upgrade to Paid Membership design from Screenshot 2)
export interface ContactDetailsModalProps {
  isOpen: boolean;
  type: "call" | "whatsapp" | null;
  profile: ViewUserProfile | null;
  userPhotoUrl?: string;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

export const ProfileContactModal = memo<ContactDetailsModalProps>(
  ({ isOpen, type, profile, userPhotoUrl, onClose, onUpgradeClick }) => {
    if (!isOpen || !profile || !type) return null;

    return (
      <UpgradeModal
        isOpen={isOpen}
        onClose={onClose}
        targetField={type === "call" ? "Phone Number" : "WhatsApp Number"}
        prospectName={profile.name}
        prospectPhotoUrl={profile.photoUrls?.[0]}
        userPhotoUrl={userPhotoUrl}
        maskedPhone={profile.contactInfo?.phoneMasked || "+91 77XXXXXXXX"}
        onUpgradeNow={onUpgradeClick}
      />
    );
  }
);
ProfileContactModal.displayName = "ProfileContactModal";

// 4. Matrimony Branches Locator Modal
export interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchesModal = memo<BranchesModalProps>(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sampleBranches = [
    { city: "Mumbai", area: "Andheri West & Dadar", count: "8 Branches", phone: "022-2839401" },
    { city: "Delhi NCR", area: "Connaught Place, Noida & Gurgaon", count: "12 Branches", phone: "011-4729100" },
    { city: "Ahmedabad", area: "C.G. Road & Navrangpura", count: "6 Branches", phone: "079-2658110" },
    { city: "Jaipur", area: "C-Scheme & Tonk Road", count: "4 Branches", phone: "0141-236780" },
    { city: "Raipur", area: "Pandri & Telibandha", count: "3 Branches", phone: "0771-401928" },
    { city: "Bangalore", area: "Indiranagar & Jayanagar", count: "7 Branches", phone: "080-4123890" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="branches-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 space-y-4 max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 id="branches-modal-title" className="text-xl font-bold text-stone-900">
            Our 140+ Branches Across India
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Walk into any branch for relationship counseling and face-to-face assistance.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-1">
          {sampleBranches.map((b) => (
            <div key={b.city} className="py-2.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DB2F3C] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{b.city}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{b.area}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block">
                  {b.count}
                </span>
                <span className="text-xs text-stone-500 mt-1 block font-mono">
                  {b.phone}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});
BranchesModal.displayName = "BranchesModal";
