"use client";

import React, { memo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDashboardAdsQuery } from "@/tanstackQuery";
import { isDeepEqual } from "@/utils";
import {
  ChevronDown,
  ChevronUp,
  Camera,
  ShieldCheck,
  Award,
  User,
  GraduationCap,
  Users,
  Heart,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Lock,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  ProfileSectionId,
  ProfileSectionGroup,
  SidebarNavGroup,
} from "../types";

export interface EditProfileSidebarProps {
  activeSection: ProfileSectionId;
  onSelectSection: (sectionId: ProfileSectionId) => void;
  onOpenPhotoModal: () => void;
  photoCount?: number;
  avatarUrl?: string;
  className?: string;
}

const SECTION_ICONS: Record<ProfileSectionId, React.ReactNode> = {
  basic_info: <User className="w-3.5 h-3.5" />,
  education_occupation: <GraduationCap className="w-3.5 h-3.5" />,
  family_details: <Users className="w-3.5 h-3.5" />,
  hobbies_interest: <Heart className="w-3.5 h-3.5" />,
  partner_preference: <HeartHandshake className="w-3.5 h-3.5" />,
  location: <MapPin className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  contact_number: <Phone className="w-3.5 h-3.5" />,
  photos: <Camera className="w-3.5 h-3.5" />,
  horoscope: <Sparkles className="w-3.5 h-3.5" />,
  identity_badge: <ShieldCheck className="w-3.5 h-3.5 text-[#DB2F3C]" />,
  professional_badge: <Award className="w-3.5 h-3.5 text-[#1D68CD]" />,
};

const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    id: "profile_info",
    title: "Profile Info",
    items: [
      { id: "basic_info", label: "Basic Information", actionText: "edit" },
      { id: "education_occupation", label: "Education & Occupation", actionText: "edit" },
      { id: "family_details", label: "Family Details", actionText: "edit" },
      { id: "hobbies_interest", label: "Hobbies & Interest", actionText: "edit" },
      { id: "partner_preference", label: "Partner Preference", actionText: "edit" },
    ],
  },
  {
    id: "contact_details",
    title: "Contact Details",
    items: [
      { id: "location", label: "Location", actionText: "edit" },
      { id: "email", label: "E-mail", actionText: "edit" },
      { id: "contact_number", label: "Contact Number", actionText: "edit" },
    ],
  },
  {
    id: "enhance_profile",
    title: "Enhance Profile",
    items: [
      { id: "photos", label: "Photos (0/10)", actionText: "add" },
      { id: "horoscope", label: "Horoscope", actionText: "edit" },
    ],
  },
  {
    id: "trust_badge",
    title: "Trust Badge",
    items: [
      { id: "identity_badge", label: "Identity Badge", actionText: "view" },
      { id: "professional_badge", label: "Professional Badge", actionText: "add" },
    ],
  },
];

const EditProfileSidebarComponent: React.FC<EditProfileSidebarProps> = ({
  activeSection,
  onSelectSection,
  onOpenPhotoModal,
  photoCount = 0,
  avatarUrl,
  className = "",
}) => {
  const { data: adsRes } = useDashboardAdsQuery();
  const adsData = (adsRes as any)?.data || adsRes;
  const discount = adsData?.paidMember?.discountPercent ?? 71;

  // State for which accordion groups are open
  const [openGroups, setOpenGroups] = useState<Record<ProfileSectionGroup, boolean>>({
    profile_info: true,
    contact_details: true,
    enhance_profile: true,
    trust_badge: true,
  });

  const toggleGroup = useCallback((groupId: ProfileSectionGroup) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  return (
    <aside className={`w-full lg:w-[260px] xl:w-[280px] shrink-0 space-y-4 ${className}`}>
      {/* 1. Improved Premium Photo Upload Box */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs hover:shadow-md transition-shadow duration-200">
        {/* Silhouette / Photo Container */}
        <div className="relative w-40 h-48 sm:w-44 sm:h-52 mx-auto rounded-xl overflow-hidden border border-stone-200/80 bg-gradient-to-b from-stone-50 via-red-50/20 to-stone-100 flex flex-col items-center justify-center group shadow-inner">
          {avatarUrl ? (
            <>
              <Image
                src={avatarUrl}
                alt="Profile photo"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={onOpenPhotoModal}
                className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Change Photo</span>
              </button>
            </>
          ) : (
            <>
              {/* Premium Matrimonial Avatar Silhouette Artwork */}
              <div className="w-full h-full flex flex-col items-center justify-center pt-2 text-stone-400">
                <div className="relative">
                  <svg
                    className="w-24 h-24 text-stone-300 drop-shadow-xs"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Head */}
                    <circle cx="50" cy="34" r="16" fill="#B8C4CE" />
                    {/* Shoulders */}
                    <path
                      d="M23 78C23 63.5 35 55 50 55C65 55 77 63.5 77 78V82H23V78Z"
                      fill="#9BA8B4"
                    />
                  </svg>

                  {/* Circular Camera Upload Badge overlay */}
                  <div
                    onClick={onOpenPhotoModal}
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white text-[#DB2F3C] shadow-md border border-red-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Sleek Gradient Pill: "Photo Not Added" */}
              <div className="absolute bottom-2.5 inset-x-3 bg-gradient-to-r from-[#FF4A57] to-[#DB2F3C] text-white py-1 rounded-lg text-[11.5px] font-semibold tracking-wide text-center shadow-xs flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Photo Not Added</span>
              </div>
            </>
          )}
        </div>

        {/* Motivational Subtext */}
        <div className="mt-3 space-y-1">
          <p className="text-[12.5px] font-medium text-stone-800">
            Members would like to see you
          </p>
          <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
            <span>Get up to <strong>20x more responses</strong></span>
          </p>
        </div>

        {/* Signature Add Photos Button with Gradient & Shadow */}
        <button
          type="button"
          onClick={onOpenPhotoModal}
          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] text-white text-xs sm:text-[13px] font-bold tracking-wide transition-all shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Add Photos</span>
        </button>

        {/* Privacy Note */}
        <p className="mt-2.5 text-[10.5px] text-stone-400 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 shrink-0" />
          <span>100% Privacy • Control who views</span>
        </p>
      </div>

      {/* 2. Accordion Navigation Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs divide-y divide-stone-100">
        {SIDEBAR_NAV_GROUPS.map((group) => {
          const isOpen = openGroups[group.id];

          return (
            <div key={group.id} className="text-left">
              {/* Accordion Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-2.5 bg-stone-50/70 hover:bg-stone-100/70 flex items-center justify-between text-xs sm:text-[13px] font-bold text-stone-800 transition-colors cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <span>{group.title}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                )}
              </button>

              {/* Group Menu Items */}
              {isOpen && (
                <div className="py-1 px-1.5 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const isPhotoItem = item.id === "photos";
                    const displayLabel = isPhotoItem
                      ? `Photos (${photoCount}/10)`
                      : item.label;

                    const handleItemClick = () => {
                      onSelectSection(item.id);
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={handleItemClick}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-[12.5px] cursor-pointer transition-all ${isActive
                            ? "bg-red-50 text-[#DB2F3C] font-semibold border-l-3 border-[#DB2F3C] pl-2.5"
                            : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 border-l-3 border-transparent pl-2.5"
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={
                              isActive
                                ? "text-[#DB2F3C]"
                                : "text-stone-400 group-hover:text-stone-600"
                            }
                          >
                            {SECTION_ICONS[item.id] || <User className="w-3.5 h-3.5" />}
                          </span>
                          <span className="truncate">{displayLabel}</span>
                        </div>

                        {/* Action link e.g. [edit], [add], [view] */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick();
                          }}
                          className={`text-[11.5px] font-medium lowercase ml-2 cursor-pointer transition-colors ${item.actionText === "add"
                              ? "text-[#1D68CD] hover:underline"
                              : item.actionText === "view"
                                ? "text-[#1D68CD] hover:underline"
                                : isActive
                                  ? "text-[#DB2F3C] font-bold"
                                  : "text-[#1D68CD] hover:underline"
                            }`}
                        >
                          {item.actionText}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* API-Driven Promo Card */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#FFF5F6] to-[#FCEAEF] border border-[#FDCED3] shadow-2xs">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#DB2F3C]">
          <Sparkles className="w-3.5 h-3.5 text-[#DB2F3C]" />
          <span>Special Offer • {discount}% OFF</span>
        </div>
        <p className="text-xs font-bold text-stone-900 mt-1.5 leading-snug">
          Get Direct Verified Mobile Numbers & Unlimited Chat
        </p>
        <Link
          href="/subscription"
          className="mt-3 w-full py-2 px-3 rounded-lg bg-[#DB2F3C] hover:bg-[#B71F2A] active:scale-[0.98] text-white text-[11.5px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
        >
          <span>Upgrade Now</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};

export const EditProfileSidebar = memo(
  EditProfileSidebarComponent,
  (prev, next) => isDeepEqual(prev, next)
);
EditProfileSidebar.displayName = "EditProfileSidebar";
