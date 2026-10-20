"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Bell,
  MessageSquare,
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  FemaleSilhouetteAvatar,
  MaleSilhouetteAvatar,
} from "@/screens/dashboardScreen/components/DashboardIcons";
import type { InterestItem, InterestSection } from "../types";

export interface InterestCardProps {
  interest: InterestItem;
  section: InterestSection;
  onAccept?: (interestId: string) => Promise<void> | void;
  onDecline?: (interestId: string) => Promise<void> | void;
  onRemind?: (interestId: string) => Promise<void> | void;
  onCancel?: (interestId: string) => Promise<void> | void;
  onViewContact?: (candidateId: string) => void;
  className?: string;
}

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const InterestCardComponent: React.FC<InterestCardProps> = ({
  interest,
  section,
  onAccept,
  onDecline,
  onRemind,
  onCancel,
  onViewContact,
  className = "",
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Candidate profile based on direction
  const profile = section === "received" ? interest.senderProfile : interest.receiverProfile;
  const profileId = profile?._id || "candidate";
  const candidateMatrimonyId = profile?.matrimonyId || profileId;
  const candidateName = profile?.name || "Member";
  const avatarUrl = profile?.avatar;

  const handleAccept = async () => {
    if (!onAccept || isAccepting) return;
    try {
      setIsAccepting(true);
      await onAccept(interest._id);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!onDecline || isDeclining) return;
    try {
      setIsDeclining(true);
      await onDecline(interest._id);
    } finally {
      setIsDeclining(false);
    }
  };

  const handleRemind = async () => {
    if (!onRemind || isReminding) return;
    try {
      setIsReminding(true);
      await onRemind(interest._id);
    } finally {
      setIsReminding(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancel || isCancelling) return;
    try {
      setIsCancelling(true);
      await onCancel(interest._id);
    } finally {
      setIsCancelling(false);
    }
  };

  const status = interest.status?.toUpperCase() || "PENDING";
  const isPending = status === "PENDING";
  const isAccepted = status === "ACCEPTED";
  const isDeclined = status === "DECLINED";

  return (
    <article
      aria-label={`Interest request from ${candidateName}`}
      className={`group w-full bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#DB2F3C]/40 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row items-stretch ${className}`}
    >
      {/* 1. Left Column: Compact Photo / Silhouette Container */}
      <div className="relative w-full sm:w-44 md:w-48 shrink-0 min-h-[160px] sm:min-h-0 sm:max-h-[188px] bg-stone-100 flex items-center justify-center overflow-hidden">
        <Link
          href={`/matches/viewprofile/${candidateMatrimonyId}`}
          className="w-full h-full block"
          aria-label={`View profile of ${candidateName}`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={candidateName}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <FemaleSilhouetteAvatar className="w-full h-full" />
          )}
        </Link>

        {/* Verified Shield Badge on Photo */}
        {profile?.verified && (
          <div
            title="Verified Profile"
            className="absolute top-2.5 left-2.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs border-2 border-white z-10"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Direction Badge */}
        <div className="absolute bottom-2.5 inset-x-2 flex justify-center z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs tracking-wide uppercase">
            {section === "received" ? "Received Interest" : "Sent Interest"}
          </span>
        </div>
      </div>

      {/* 2. Right Column: Structured Information & Actions */}
      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 min-w-0">
        <div>
          {/* Header Row: Name, Age/Height, Badges & Timestamp */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <Link
                href={`/matches/viewprofile/${candidateMatrimonyId}`}
                className="text-base sm:text-[17px] font-bold text-stone-900 hover:text-[#DB2F3C] transition-colors truncate tracking-tight"
              >
                {candidateName}
              </Link>
              {profile?.matrimonyId && (
                <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {profile.matrimonyId}
                </span>
              )}
              {profile?.age && (
                <span className="text-xs text-stone-600 font-medium">
                  {profile.age} yrs{profile.height ? `, ${profile.height}` : ""}
                </span>
              )}
            </div>

            {/* Status Pill & Timestamp */}
            <div className="flex items-center gap-2 shrink-0">
              {isPending && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                  <Clock className="w-3 h-3" />
                  {section === "received" ? "Awaiting your response" : "Awaiting response"}
                </span>
              )}
              {isAccepted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <Check className="w-3 h-3" />
                  Accepted
                </span>
              )}
              {isDeclined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  <X className="w-3 h-3" />
                  Declined
                </span>
              )}
              <span className="text-[11px] text-stone-600 font-medium hidden sm:inline">
                {formatTimestamp(interest.sentAt)}
              </span>
            </div>
          </div>

          {/* 2-Column Key Attributes Grid */}
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-stone-600">
            {/* Caste / Community */}
            <div className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="text-stone-700 font-medium">
                Sindhi : {profile?.subcaste || "All Sindhis"}
              </span>
            </div>

            {/* Profession */}
            <div className="flex items-center gap-1.5 truncate">
              <Briefcase className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="truncate">
                {[profile?.profession, profile?.companyName].filter(Boolean).join(" · ") || "Professional"}
              </span>
            </div>

            {/* Education */}
            <div className="flex items-center gap-1.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="truncate">{profile?.education || "Graduate"}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="truncate">
                {profile?.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ""}` : "India"}
              </span>
            </div>
          </div>

          {/* Personalized Note */}
          {interest.personalizedNote && (
            <div className="mt-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-700 italic flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#DB2F3C] shrink-0 mt-0.5" />
              <span className="line-clamp-2">&ldquo;{interest.personalizedNote}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
          <Link
            href={`/matches/viewprofile/${candidateMatrimonyId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#DB2F3C] transition-colors"
          >
            <span>View Full Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {section === "received" && isPending && (
              <>
                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={isDeclining || isAccepting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isDeclining ? "Declining..." : "Decline"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isDeclining || isAccepting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF525F] to-[#DB2F3C] hover:from-[#E03B49] hover:to-[#B71F2A] rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAccepting ? "Accepting..." : "Accept Interest"}</span>
                </button>
              </>
            )}

            {section === "received" && isAccepted && (
              <>
                {onViewContact && (
                  <button
                    type="button"
                    onClick={() => onViewContact(profileId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Contact</span>
                  </button>
                )}
                <Link
                  href={`/messages?userId=${profileId}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#DB2F3C] hover:bg-[#B71F2A] rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </Link>
              </>
            )}

            {section === "sent" && isPending && (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isCancelling ? "Cancelling..." : "Withdraw"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemind}
                  disabled={isReminding || !!interest.remindedAt}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    interest.remindedAt
                      ? "bg-stone-100 text-stone-600 cursor-not-allowed"
                      : "text-white bg-[#DB2F3C] hover:bg-[#B71F2A] shadow-2xs"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {interest.remindedAt
                      ? "Reminder Sent"
                      : isReminding
                      ? "Sending..."
                      : "Send Reminder"}
                  </span>
                </button>
              </>
            )}

            {section === "sent" && isAccepted && (
              <Link
                href={`/messages?userId=${profileId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#DB2F3C] hover:bg-[#B71F2A] rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Now</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const InterestCard = memo(InterestCardComponent);
InterestCard.displayName = "InterestCard";
export default InterestCard;
