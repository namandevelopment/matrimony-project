"use client";

import React, { memo, useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Compass,
  Smile,
  Landmark,
  Users2,
  Utensils,
  ArrowUp,
} from "lucide-react";
import { DashboardHeader } from "@/screens/dashboardScreen/components/DashboardHeader";
import { DashboardFooter } from "@/screens/dashboardScreen/components/DashboardFooter";
import { FloatingChatWidget } from "@/screens/matchesScreen/components";
import type { UserProfile } from "@/screens/dashboardScreen/types";
import {
  HoroscopeHeroCard,
  HoroscopeNavTabs,
  HoroscopeTimelineSection,
  HoroscopeAboutSection,
  HoroscopeAstrologySection,
  HoroscopePartnerSection,
  HoroscopeChartModal,
} from "./components";
import { useProfileQuery } from "@/tanstackQuery";
import { HoroscopeProfileData, HoroscopeScreenProps } from "./types";

const HoroscopeScreenComponent: React.FC<HoroscopeScreenProps> = ({
  initialData,
  className = "",
}) => {
  const router = useRouter();
  const { data: profileRes, isLoading } = useProfileQuery();
  const rawProfile =
    (profileRes as any)?.profile ||
    (profileRes as any)?.data?.profile ||
    (profileRes as any)?.data;
  const userDoc =
    rawProfile && typeof rawProfile === "object" && !rawProfile.error && (rawProfile._id || rawProfile.matrimonyId || rawProfile.name)
      ? rawProfile
      : null;
  const partnerPref =
    (profileRes as any)?.partnerPreference ||
    (profileRes as any)?.data?.partnerPreference ||
    {};

  const liveData: HoroscopeProfileData = useMemo(() => {
    const safeJoin = (val: any, fallback = "Any"): string => {
      if (Array.isArray(val)) {
        const filtered = val.filter(Boolean);
        return filtered.length > 0 ? filtered.join(", ") : fallback;
      }
      if (typeof val === "string" && val.trim().length > 0) {
        return val.trim();
      }
      return fallback;
    };

    const safeFormatDob = (dobInput?: any): string => {
      if (!dobInput) return "Not Specified";
      try {
        const d = new Date(dobInput);
        if (isNaN(d.getTime())) return "Not Specified";
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      } catch {
        return "Not Specified";
      }
    };

    if (!userDoc) {
      return (
        initialData || {
          matrimonyId: "Not Assigned",
          profileCreatedFor: "Self",
          name: "Member Profile",
          age: 0,
          height: "",
          heightCm: 0,
          education: "",
          occupation: "",
          location: "",
          mobileNumber: "",
          aboutMe: "",
          basicDetails: { profileCreatedFor: "Self", name: "Member Profile", age: "", height: "", gender: "", maritalStatus: "Unmarried", motherTongue: "Sindhi", physicalStatus: "Normal" },
          religiousInfo: { subcaste: "Sindhi", casteDivision: "Sindhi", star: "Not Specified", raasi: "Not Specified", gothram: "Not Specified" },
          professionalInfo: { education: "", educationDetail: "", occupation: "" },
          locationInfo: { country: "India", state: "", city: "", citizenship: "India" },
          horoscopeInfo: { name: "Member Profile", dateOfBirth: "Not Specified", timeOfBirth: "Not Specified", timeZone: "(Hrs. Mins): 05.30E", timeCorrection: "Standard Time", placeOfBirth: "Not Specified" },
          familyDetails: { familyStatus: "Middle class" },
          lifestyleInfo: { eatingHabits: "Vegetarian", drinkingHabits: "Non-drinker", smokingHabits: "Non-smoker" },
          partnerPreference: { maritalStatus: "Never Married", haveChildren: "No", age: "21 - 35 yrs", height: "150 cm - 195 cm", motherTongue: "Sindhi", physicalStatus: "Normal", eatingHabits: "Vegetarian", drinkingHabits: "Non-drinker", smokingHabits: "Non-smoker", casteDivision: "Sindhi", subcaste: "Any", star: "Any", manglik: "Any", education: "Any" },
        }
      );
    }
    const h = userDoc.horoscope || {};
    const loc = userDoc.location || {};
    const prof = userDoc.profession || {};
    const edu = userDoc.education || {};
    const fam = userDoc.family || {};

    const ageRangeStr = partnerPref.ageRange
      ? `${partnerPref.ageRange[0]} - ${partnerPref.ageRange[1]} yrs`
      : partnerPref.ageMin && partnerPref.ageMax
      ? `${partnerPref.ageMin} - ${partnerPref.ageMax} yrs`
      : "Not Specified";

    const heightRangeStr = partnerPref.heightRange
      ? `${partnerPref.heightRange[0]} - ${partnerPref.heightRange[1]}`
      : partnerPref.heightMin && partnerPref.heightMax
      ? `${partnerPref.heightMin} cm - ${partnerPref.heightMax} cm`
      : "Not Specified";

    return {
      matrimonyId: userDoc.matrimonyId || "",
      profileCreatedFor: userDoc.profileCreatedFor || "Self",
      name: userDoc.name || "",
      age: Number(userDoc.age) || 0,
      height: userDoc.heightFormatted || (userDoc.height ? `${userDoc.height} cm` : ""),
      heightCm: Number(userDoc.height) || 0,
      education: typeof edu === "string" ? edu : edu.degree || "",
      occupation: typeof prof === "string" ? prof : prof.occupation || "",
      location: loc.city ? `${loc.city}, ${loc.state || ""}` : "",
      mobileNumber: userDoc.phone || "",
      photoUrl: userDoc.avatar || userDoc.photoUrl,
      aboutMe: userDoc.aboutMe || "",
      basicDetails: {
        profileCreatedFor: userDoc.profileCreatedFor || "Self",
        name: userDoc.name || "",
        age: userDoc.age ? `${userDoc.age} yrs` : "",
        height: userDoc.heightFormatted || (userDoc.height ? `${userDoc.height} cm` : ""),
        gender: userDoc.gender || "",
        maritalStatus: userDoc.maritalStatus || "Unmarried",
        motherTongue: userDoc.motherTongue || "Sindhi",
        physicalStatus: userDoc.physicalStatus || "Normal",
      },
      religiousInfo: {
        subcaste: userDoc.subcaste || "",
        casteDivision: userDoc.caste || "Sindhi",
        star: h.nakshatra || userDoc.nakshatra || "Not Specified",
        raasi: h.rashi || userDoc.rashi || "Not Specified",
        gothram: userDoc.gotra || "Not Specified",
      },
      professionalInfo: {
        education: typeof edu === "string" ? edu : edu.degree || "",
        educationDetail: edu.college || "",
        occupation: typeof prof === "string" ? prof : prof.occupation || "",
        annualIncome: prof.annualIncome ? `₹ ${prof.annualIncome}` : undefined,
      },
      locationInfo: {
        country: loc.country || "India",
        state: loc.state || "",
        city: loc.city || "",
        citizenship: loc.citizenship || "India",
      },
      horoscopeInfo: {
        name: userDoc.name || "",
        dateOfBirth: safeFormatDob(userDoc.dob),
        timeOfBirth: h.birthTime || "Not Specified",
        timeZone: "(Hrs. Mins): 05.30E",
        timeCorrection: "Standard Time",
        placeOfBirth: h.birthPlace || loc.city || "Not Specified",
        sunSign: h.sunSign,
        moonSign: h.rashi,
        nakshatraPada: h.nakshatra ? `${h.nakshatra}${h.charan ? ` - Pada ${h.charan}` : ""}` : undefined,
      },
      familyDetails: {
        familyStatus: fam.familyStatus || "Middle class",
        familyValues: fam.familyValues || "Moderate",
        familyType: fam.familyType || "Nuclear",
        fatherOccupation: fam.fatherOccupation,
        motherOccupation: fam.motherOccupation,
      },
      lifestyleInfo: {
        eatingHabits: userDoc.eatingHabits || "Vegetarian",
        drinkingHabits: userDoc.drinkingHabits || "Non-drinker",
        smokingHabits: userDoc.smokingHabits || "Non-smoker",
      },
      partnerPreference: {
        maritalStatus: safeJoin(partnerPref.maritalStatus, "Never Married"),
        haveChildren: "No",
        age: ageRangeStr,
        height: heightRangeStr,
        motherTongue: safeJoin(partnerPref.motherTongue, "Sindhi"),
        physicalStatus: "Normal",
        eatingHabits: "Vegetarian",
        drinkingHabits: "Non-drinker",
        smokingHabits: "Non-smoker",
        casteDivision: "Sindhi",
        subcaste: safeJoin(partnerPref.subcastes || partnerPref.subcaste, "Any"),
        star: "Any",
        manglik: safeJoin(partnerPref.manglikPreference || partnerPref.manglik, "Any"),
        education: safeJoin(partnerPref.education, "Any"),
      },
    };
  }, [userDoc, partnerPref, initialData]);

  const data = liveData;
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "partner">("personal");
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Monitor scroll for Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const openChart = useCallback(() => {
    setIsChartModalOpen(true);
  }, []);

  const closeChart = useCallback(() => {
    setIsChartModalOpen(false);
  }, []);

  // Header user object
  const headerUser: UserProfile = {
    name: data.name,
    matrimonyId: data.matrimonyId,
    community: "Sindhi",
    membershipStatus: "Free member",
    completenessScore: 85,
    avatarUrl: data.photoUrl,
  };

  if (isLoading && !initialData) {
    return (
      <div className={`min-h-screen bg-[#F5F7F9] text-stone-900 flex flex-col ${className}`}>
        <DashboardHeader />
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
          <div className="w-full bg-white rounded-xl border border-stone-200/90 p-6 animate-pulse space-y-4">
            <div className="h-5 bg-stone-200 rounded w-48" />
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="w-36 h-40 bg-stone-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-6 bg-stone-200 rounded w-1/3" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
                <div className="h-4 bg-stone-100 rounded w-2/5" />
                <div className="h-10 bg-stone-100 rounded mt-4" />
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-xl border border-stone-200/90 p-6 animate-pulse space-y-4">
            <div className="h-5 bg-stone-200 rounded w-36" />
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-3/4" />
              <div className="h-4 bg-stone-100 rounded w-5/6" />
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F5F7F9] text-stone-900 flex flex-col ${className}`}>
      {/* 1. Global Header */}
      <DashboardHeader
        user={headerUser}
        onUpgradeClick={() => router.push("/subscription")}
      />

      {/* 2. Main Page Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Hero Card */}
        <HoroscopeHeroCard
          data={data}
          onViewHoroscope={openChart}
          onAddPhoto={() => {
            router.push("/profile/edit?section=photos");
          }}
        />

        {/* Content Card with Tabs & Timeline Sections */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          {/* Sub Navigation Bar: Personal Info & Partner Preference */}
          <HoroscopeNavTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Timeline Wrapper */}
          <div id="personal-information-section" className="p-4 sm:p-7 sm:pl-8">
            {/* 1. A Few Lines About Naman */}
            <HoroscopeAboutSection
              name={data.name}
              aboutMe={data.aboutMe}
            />

            {/* 2. Basic Details */}
            <HoroscopeTimelineSection
              icon={<span className="text-xl font-bold font-serif leading-none">अ</span>}
              iconBgColor="bg-[#8BC34A]"
              title="Basic Details"
              editSectionKey="basic"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Profile Created for</span>
                  <span className="font-semibold text-stone-800">{data.basicDetails.profileCreatedFor}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Name</span>
                  <span className="font-semibold text-stone-800">{data.basicDetails.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Age</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.age}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Height</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.height}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Gender</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.gender}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Marital Status</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.maritalStatus}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Mother Tongue</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.motherTongue}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Physical Status</span>
                  <span className="font-medium text-stone-800">{data.basicDetails.physicalStatus}</span>
                </div>
              </div>
            </HoroscopeTimelineSection>

            {/* 3. Religious Information */}
            <HoroscopeTimelineSection
              icon={<Compass className="w-5 h-5 text-white" />}
              iconBgColor="bg-[#FFA726]"
              title="Religious Information"
              editSectionKey="religious"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Subcaste</span>
                  <span className="font-medium text-stone-800">{data.religiousInfo.subcaste}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Caste / Division</span>
                  <span className="font-medium text-stone-800">{data.religiousInfo.casteDivision}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Star</span>
                  <span className="font-medium text-stone-800">{data.religiousInfo.star}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Raasi</span>
                  <span className="font-medium text-stone-800">{data.religiousInfo.raasi}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Gothram</span>
                  <span className="font-medium text-stone-800">{data.religiousInfo.gothram}</span>
                </div>
              </div>
            </HoroscopeTimelineSection>

            {/* 4. Professional Information */}
            <HoroscopeTimelineSection
              icon={<Smile className="w-5 h-5 text-white" />}
              iconBgColor="bg-[#26C6DA]"
              title="Professional Information"
              editSectionKey="professional"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Education</span>
                  <span className="font-medium text-stone-800">{data.professionalInfo.education}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Education Detail</span>
                  <span className="font-medium text-stone-800">{data.professionalInfo.educationDetail}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Occupation</span>
                  <span className="font-medium text-stone-800">{data.professionalInfo.occupation}</span>
                </div>
                {data.professionalInfo.annualIncome && (
                  <div className="flex flex-col sm:flex-row">
                    <span className="text-stone-400 sm:w-36 shrink-0">Annual Income</span>
                    <span className="font-medium text-stone-800">{data.professionalInfo.annualIncome}</span>
                  </div>
                )}
              </div>
            </HoroscopeTimelineSection>

            {/* 5. Location */}
            <HoroscopeTimelineSection
              icon={<Landmark className="w-5 h-5 text-white" />}
              iconBgColor="bg-[#42A5F5]"
              title="Location"
              editSectionKey="location"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Country</span>
                  <span className="font-medium text-stone-800">{data.locationInfo.country}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">State</span>
                  <span className="font-medium text-stone-800">{data.locationInfo.state}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">City</span>
                  <span className="font-medium text-stone-800">{data.locationInfo.city}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Citizenship</span>
                  <span className="font-medium text-stone-800">{data.locationInfo.citizenship}</span>
                </div>
              </div>
            </HoroscopeTimelineSection>

            {/* 6. Horoscope Section (with dedicated View Horoscope button) */}
            <HoroscopeAstrologySection
              horoscopeInfo={data.horoscopeInfo}
              onViewHoroscope={openChart}
            />

            {/* 7. Family Details */}
            <HoroscopeTimelineSection
              icon={<Users2 className="w-5 h-5 text-white" />}
              iconBgColor="bg-[#26A69A]"
              title="Family Details"
              editSectionKey="family"
            >
              <div className="flex items-center gap-2 text-[14px] py-1">
                <span className="text-stone-400 sm:w-36 shrink-0">Family</span>
                <div className="inline-flex items-center gap-2">
                  <span className="text-3xl font-light text-stone-300 leading-none select-none">&#123;</span>
                  <div className="space-y-0.5">
                    <span className="text-stone-500 text-[13px]">Status : </span>
                    <strong className="font-medium text-stone-800">{data.familyDetails.familyStatus}</strong>
                  </div>
                  <span className="text-3xl font-light text-stone-300 leading-none select-none">&#125;</span>
                </div>
              </div>
            </HoroscopeTimelineSection>

            {/* 8. Lifestyle */}
            <HoroscopeTimelineSection
              icon={<Utensils className="w-5 h-5 text-white" />}
              iconBgColor="bg-[#9CCC65]"
              title="Lifestyle"
              editSectionKey="lifestyle"
              isLast={true}
            >
              <div className="space-y-3 text-[14px]">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Eating Habits</span>
                  <span className="font-medium text-stone-800">{data.lifestyleInfo.eatingHabits}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Drinking Habits</span>
                  <span className="font-medium text-stone-800">{data.lifestyleInfo.drinkingHabits}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-stone-400 sm:w-36 shrink-0">Smoking Habits</span>
                  <span className="font-medium text-stone-800">{data.lifestyleInfo.smokingHabits}</span>
                </div>
              </div>
            </HoroscopeTimelineSection>

            {/* 9. Partner Preference Section */}
            <div className="border-t border-stone-200 mt-6 pt-2">
              <HoroscopePartnerSection preferences={data.partnerPreference} />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Floating Action Elements: TOP Button & Chat Widget */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 bg-stone-200/90 hover:bg-stone-300 text-stone-700 hover:text-stone-900 w-11 h-12 rounded-lg flex flex-col items-center justify-center shadow-md transition-all cursor-pointer group"
          aria-label="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">TOP</span>
        </button>
      )}

      {/* Floating Red Chat Widget matching bottom-right circle in screenshot */}
      <FloatingChatWidget />

      {/* 4. Kundali / Horoscope Modal */}
      <HoroscopeChartModal
        isOpen={isChartModalOpen}
        onClose={closeChart}
        data={data}
      />

      {/* 5. Global Footer */}
      <DashboardFooter />
    </div>
  );
};

export const HoroscopeScreen = memo(HoroscopeScreenComponent);
HoroscopeScreen.displayName = "HoroscopeScreen";
