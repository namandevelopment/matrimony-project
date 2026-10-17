"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, CheckCircle2, ChevronRight } from "lucide-react";
import { DashboardHeader } from "@/screens/dashboardScreen/components/DashboardHeader";
import { DashboardFooter } from "@/screens/dashboardScreen/components/DashboardFooter";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";
import {
  EditProfilePromoBanner,
  EditProfileSidebar,
  EditProfileBasicSection,
  EditProfileEducationSection,
  EditProfileFamilySection,
  EditProfileHobbiesSection,
  EditProfilePartnerSection,
  EditProfileContactSection,
  EditProfileEnhanceSection,
  EditProfileTrustBadgeSection,
  EditProfilePhotoModal,
  EditProfilePreviewModal,
} from "./components";
import {
  EditProfileScreenProps,
  ProfileSectionId,
  EditProfileState,
  PhotoItem,
} from "./types";
import { INITIAL_EDIT_PROFILE_DATA } from "./staticData";
import type { UserProfile } from "@/screens/dashboardScreen/types";

const EditProfileScreenComponent: React.FC<EditProfileScreenProps> = ({
  initialSection = "basic_info",
  onViewProfile,
  onUpgradeClick,
  className = "",
}) => {
  const router = useRouter();

  // Primary state for active section
  const [activeSection, setActiveSection] = useState<ProfileSectionId>(initialSection);

  // Form State
  const [profileData, setProfileData] = useState<EditProfileState>(INITIAL_EDIT_PROFILE_DATA);

  // Modal states
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Saving states & Toast Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  }, []);

  // Header User profile data
  const user: UserProfile = useMemo(
    () => ({
      name: profileData.basicInfo.name || "Naman",
      matrimonyId: "SM1029482",
      community: profileData.basicInfo.casteDivision || "Sindhi",
      membershipStatus: "Free member",
      completenessScore: profileData.photos.length > 0 ? 85 : 70,
      avatarUrl: profileData.photos.find((p) => p.isPrimary)?.url,
    }),
    [profileData.basicInfo.name, profileData.basicInfo.casteDivision, profileData.photos]
  );

  // Handlers for updating form parts
  const handleBasicInfoChange = useCallback(
    (updates: Partial<typeof profileData.basicInfo>) => {
      setProfileData((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, ...updates },
      }));
    },
    []
  );

  const handleEducationChange = useCallback(
    (updates: Partial<typeof profileData.educationOccupation>) => {
      setProfileData((prev) => ({
        ...prev,
        educationOccupation: { ...prev.educationOccupation, ...updates },
      }));
    },
    []
  );

  const handleFamilyChange = useCallback(
    (updates: Partial<typeof profileData.familyDetails>) => {
      setProfileData((prev) => ({
        ...prev,
        familyDetails: { ...prev.familyDetails, ...updates },
      }));
    },
    []
  );

  const handleHobbiesChange = useCallback(
    (updates: Partial<typeof profileData.hobbiesInterests>) => {
      setProfileData((prev) => ({
        ...prev,
        hobbiesInterests: { ...prev.hobbiesInterests, ...updates },
      }));
    },
    []
  );

  const handlePartnerChange = useCallback(
    (updates: Partial<typeof profileData.partnerPreference>) => {
      setProfileData((prev) => ({
        ...prev,
        partnerPreference: { ...prev.partnerPreference, ...updates },
      }));
    },
    []
  );

  const handleContactChange = useCallback(
    (updates: Partial<typeof profileData.contactDetails>) => {
      setProfileData((prev) => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, ...updates },
      }));
    },
    []
  );

  const handleHoroscopeChange = useCallback(
    (updates: Partial<typeof profileData.horoscope>) => {
      setProfileData((prev) => ({
        ...prev,
        horoscope: { ...prev.horoscope, ...updates },
      }));
    },
    []
  );

  // Photo handlers
  const handleAddPhoto = useCallback((newPhoto: PhotoItem) => {
    setProfileData((prev) => {
      const updatedPhotos = [
        ...prev.photos.map((p) => ({ ...p, isPrimary: false })),
        newPhoto,
      ];
      return {
        ...prev,
        photos: updatedPhotos,
      };
    });
    showToast("Profile photo uploaded successfully!");
  }, [showToast]);

  const handleDeletePhoto = useCallback((photoId: string) => {
    setProfileData((prev) => {
      const filtered = prev.photos.filter((p) => p.id !== photoId);
      if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return {
        ...prev,
        photos: filtered,
      };
    });
    showToast("Photo removed.");
  }, [showToast]);

  const handleSetPrimaryPhoto = useCallback((photoId: string) => {
    setProfileData((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => ({
        ...p,
        isPrimary: p.id === photoId,
      })),
    }));
    showToast("Primary profile photo updated.");
  }, [showToast]);

  // Document upload for Trust Badges
  const handleUploadDocument = useCallback(
    (badgeType: "identity" | "professional", docName: string) => {
      setProfileData((prev) => ({
        ...prev,
        trustBadge: {
          ...prev.trustBadge,
          ...(badgeType === "identity"
            ? { identityBadgeStatus: "pending", identityDocumentType: docName }
            : { professionalBadgeStatus: "pending", professionalDocumentType: docName }),
        },
      }));
      showToast(`${docName} submitted for verification. Under review.`);
    },
    [showToast]
  );

  // Generic Save Handler with simulated network delay
  const handleSaveSection = useCallback(
    (sectionName: string) => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        showToast(`${sectionName} updated successfully!`);
      }, 600);
    },
    [showToast]
  );

  const handleViewProfileClick = useCallback(() => {
    if (onViewProfile) {
      onViewProfile();
    } else {
      setIsPreviewModalOpen(true);
    }
  }, [onViewProfile]);

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 ${className}`}>
      {/* 1. Dashboard Standard Header */}
      <DashboardHeader
        user={user}
        onUpgradeClick={onUpgradeClick || (() => router.push("/subscription"))}
        onLogout={() => router.push("/")}
      />

      {/* 2. Photo Reminder Notice Banner */}
      {profileData.photos.length === 0 && (
        <EditProfilePromoBanner
          onAddPhotoClick={() => setIsPhotoModalOpen(true)}
        />
      )}

      {/* 3. Main Edit Profile Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Top Header Row: "Edit Profile" title & "View my profile" link */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-heading">
              Edit Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={handleViewProfileClick}
            className="text-xs sm:text-[13px] font-semibold text-[#1D68CD] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View my profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Horizontal Quick Navigation Bar */}
        <div className="lg:hidden mb-4 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          {[
            { id: "basic_info", label: "Basic Info" },
            { id: "education_occupation", label: "Education" },
            { id: "family_details", label: "Family" },
            { id: "hobbies_interest", label: "Hobbies" },
            { id: "partner_preference", label: "Partner Pref" },
            { id: "location", label: "Contact & Location" },
            { id: "photos", label: "Photos" },
            { id: "horoscope", label: "Horoscope" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as ProfileSectionId)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                activeSection === tab.id
                  ? "bg-[#DB2F3C] text-white border-[#DB2F3C] shadow-xs"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-7">
          {/* Left Column: Sidebar with Photo Card and Accordion Navigation */}
          <EditProfileSidebar
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            photoCount={profileData.photos.length}
            avatarUrl={profileData.photos.find((p) => p.isPrimary)?.url}
          />

          {/* Right Column: Active Form Section Component */}
          <div className="flex-1 w-full min-w-0">
            {activeSection === "basic_info" && (
              <EditProfileBasicSection
                data={profileData.basicInfo}
                onChange={handleBasicInfoChange}
                onSave={() => handleSaveSection("Basic Information")}
                isSaving={isSaving}
              />
            )}

            {activeSection === "education_occupation" && (
              <EditProfileEducationSection
                data={profileData.educationOccupation}
                onChange={handleEducationChange}
                onSave={() => handleSaveSection("Education & Occupation")}
                isSaving={isSaving}
              />
            )}

            {activeSection === "family_details" && (
              <EditProfileFamilySection
                data={profileData.familyDetails}
                onChange={handleFamilyChange}
                onSave={() => handleSaveSection("Family Details")}
                isSaving={isSaving}
              />
            )}

            {activeSection === "hobbies_interest" && (
              <EditProfileHobbiesSection
                data={profileData.hobbiesInterests}
                onChange={handleHobbiesChange}
                onSave={() => handleSaveSection("Hobbies & Interests")}
                isSaving={isSaving}
              />
            )}

            {activeSection === "partner_preference" && (
              <EditProfilePartnerSection
                data={profileData.partnerPreference}
                onChange={handlePartnerChange}
                onSave={() => handleSaveSection("Partner Preferences")}
                isSaving={isSaving}
              />
            )}

            {(activeSection === "location" ||
              activeSection === "email" ||
              activeSection === "contact_number") && (
              <EditProfileContactSection
                subType={activeSection}
                data={profileData.contactDetails}
                onChange={handleContactChange}
                onSave={() => handleSaveSection("Contact Details")}
                isSaving={isSaving}
              />
            )}

            {activeSection === "photos" && (
              <EditProfileEnhanceSection
                subType="photos"
                photos={profileData.photos}
                horoscope={profileData.horoscope}
                onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
                onDeletePhoto={handleDeletePhoto}
                onSetPrimaryPhoto={handleSetPrimaryPhoto}
                onHoroscopeChange={handleHoroscopeChange}
                onSaveHoroscope={() => handleSaveSection("Horoscope Details")}
                isSavingHoroscope={isSaving}
              />
            )}

            {activeSection === "horoscope" && (
              <EditProfileEnhanceSection
                subType="horoscope"
                photos={profileData.photos}
                horoscope={profileData.horoscope}
                onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
                onDeletePhoto={handleDeletePhoto}
                onSetPrimaryPhoto={handleSetPrimaryPhoto}
                onHoroscopeChange={handleHoroscopeChange}
                onSaveHoroscope={() => handleSaveSection("Horoscope Details")}
                isSavingHoroscope={isSaving}
              />
            )}

            {(activeSection === "identity_badge" ||
              activeSection === "professional_badge") && (
              <EditProfileTrustBadgeSection
                subType={activeSection}
                trustBadge={profileData.trustBadge}
                onUploadDocument={handleUploadDocument}
              />
            )}
          </div>
        </div>
      </main>

      {/* 4. Modals */}
      <EditProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={handleAddPhoto}
      />

      <EditProfilePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        data={profileData}
      />

      {/* 5. Floating Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 6. Footer & Floating Chat Widget */}
      <DashboardFooter />
      <FloatingChatWidget />
    </div>
  );
};

export const EditProfileScreen = memo(EditProfileScreenComponent);
EditProfileScreen.displayName = "EditProfileScreen";
export default EditProfileScreen;
