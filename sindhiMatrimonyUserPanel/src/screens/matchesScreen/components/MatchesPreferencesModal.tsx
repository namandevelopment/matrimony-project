"use client";

import React, { memo, useState, useEffect } from "react";
import {
  X,
  Check,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Users,
  Heart,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { PartnerPreferences, defaultPreferences } from "../types";

export interface MatchesPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: PartnerPreferences;
  onSavePreferences: (updated: PartnerPreferences) => void;
}

// Available options for multi-select
const SUB_CASTE_OPTIONS = [
  "All Sindhis",
  "Baibhand (Bhaiband)",
  "Amil",
  "Sahiti",
  "Larai",
  "Shikarpuri",
  "Dadu",
  "Rohiri",
  "Sakhar",
  "Hyderabadi",
  "Larkana",
];

const LOCATION_OPTIONS = [
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Delhi",
  "Karnataka",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Telangana",
  "Dubai",
  "USA / Canada",
  "UK / Europe",
];

const MARITAL_STATUS_OPTIONS = [
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
  "Annulled",
];

const INCOME_OPTIONS = [
  "No Bar / Any",
  "₹ 5 Lakh & above",
  "₹ 10 Lakh & above",
  "₹ 15 Lakh & above",
  "₹ 25 Lakh & above",
  "₹ 50 Lakh & above",
  "₹ 1 Crore & above",
];

const EDUCATION_OPTIONS = [
  "B.Tech / Engineering",
  "MBA / Management",
  "CA / CS / CFA",
  "MBBS / Medical",
  "Masters / Post Graduate",
  "Bachelors / Graduate",
  "Ph.D / Doctorate",
  "Civil Services",
];

const OCCUPATION_OPTIONS = [
  "Software / IT",
  "Business / Entrepreneur",
  "Banking & Finance",
  "Doctor / Healthcare",
  "Chartered Accountant",
  "Corporate Executive",
  "Civil Services",
  "Any Occupation",
];

const DIET_OPTIONS = [
  "Vegetarian",
  "Non-Vegetarian",
  "Jain Vegetarian",
  "Eggetarian",
];

const MANGLIK_OPTIONS = [
  "Doesn't Matter",
  "Non-Manglik",
  "Manglik",
  "Anshik Manglik",
];

const HEIGHT_LIST = [
  "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"",
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"",
];

const MatchesPreferencesModalComponent: React.FC<MatchesPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [currentPrefs, setCurrentPrefs] = useState<PartnerPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "basic" | "community" | "location" | "career">("all");

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentPrefs({
        ...defaultPreferences,
        ...preferences,
        subCastes: preferences.subCastes || defaultPreferences.subCastes || ["All Sindhis", "Baibhand", "Amil"],
      });
      setSavedSuccess(false);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  // Multi-select toggle helper
  const toggleArrayItem = (key: keyof PartnerPreferences, value: string) => {
    const list = Array.isArray(currentPrefs[key]) ? (currentPrefs[key] as string[]) : [];
    const exists = list.includes(value);
    const updated = exists ? list.filter((item) => item !== value) : [...list, value];
    setCurrentPrefs({ ...currentPrefs, [key]: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(currentPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetToDefault = () => {
    setCurrentPrefs(defaultPreferences);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[92vh] ring-1 ring-black/5">
        
        {/* Premium Gradient Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#7B1113] via-[#9F1722] to-[#DB2F3C] text-white overflow-hidden shrink-0">
          {/* Radial Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-amber-200 border border-white/20 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Sindhi Matrimony AI Matchmaker
                </span>
                <span className="text-[11px] text-white/70 font-medium hidden sm:inline">
                  • Instant Filter Updates
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                Partner Preferences
              </h3>
              <p className="text-xs sm:text-[13px] text-white/85 max-w-md leading-relaxed">
                Matches and daily recommendations are curated based on these criteria.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer backdrop-blur-md border border-white/20 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Navigation Tabs */}
          <div className="flex items-center gap-1.5 pt-4 mt-1 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: "all", label: "✨ All Filters" },
              { id: "basic", label: "👤 Basic & Physical" },
              { id: "community", label: "🕉️ Community & Roots" },
              { id: "location", label: "📍 Locations" },
              { id: "career", label: "💼 Career & Income" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#9F1722] shadow-sm font-semibold"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-[13px] bg-stone-50/50">
          
          {/* SECTION 1: Age & Physical Attributes */}
          {(activeTab === "all" || activeTab === "basic") && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB2F3C] flex items-center justify-center font-bold">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Age & Physical Range</h4>
                    <p className="text-[11px] text-stone-500">Target age gap and suitable height criteria</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                  {currentPrefs.ageRange[0]} - {currentPrefs.ageRange[1]} Yrs ({currentPrefs.ageRange[1] - currentPrefs.ageRange[0]} Yrs Span)
                </span>
              </div>

              {/* Age Range with Quick Presets */}
              <div className="space-y-2">
                <label className="block font-semibold text-stone-800">
                  Age Range (Years)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    [21, 27],
                    [23, 29],
                    [25, 32],
                    [27, 35],
                    [30, 40],
                  ].map(([min, max]) => {
                    const isSelected =
                      currentPrefs.ageRange[0] === min && currentPrefs.ageRange[1] === max;
                    return (
                      <button
                        key={`${min}-${max}`}
                        type="button"
                        onClick={() =>
                          setCurrentPrefs({ ...currentPrefs, ageRange: [min, max] })
                        }
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {min} – {max} Yrs
                      </button>
                    );
                  })}
                </div>

                {/* Custom Number Inputs */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative">
                    <input
                      type="number"
                      min={18}
                      max={65}
                      value={currentPrefs.ageRange[0]}
                      onChange={(e) =>
                        setCurrentPrefs({
                          ...currentPrefs,
                          ageRange: [Math.max(18, parseInt(e.target.value) || 18), currentPrefs.ageRange[1]],
                        })
                      }
                      className="w-24 px-3 py-2 border border-stone-300 rounded-xl text-center font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#DB2F3C]/30 focus:border-[#DB2F3C] bg-stone-50/50"
                    />
                    <span className="text-[10px] text-stone-400 block text-center mt-0.5">Min Age</span>
                  </div>
                  <span className="text-stone-400 font-medium">to</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={18}
                      max={75}
                      value={currentPrefs.ageRange[1]}
                      onChange={(e) =>
                        setCurrentPrefs({
                          ...currentPrefs,
                          ageRange: [currentPrefs.ageRange[0], Math.max(currentPrefs.ageRange[0], parseInt(e.target.value) || 30)],
                        })
                      }
                      className="w-24 px-3 py-2 border border-stone-300 rounded-xl text-center font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#DB2F3C]/30 focus:border-[#DB2F3C] bg-stone-50/50"
                    />
                    <span className="text-[10px] text-stone-400 block text-center mt-0.5">Max Age</span>
                  </div>
                </div>
              </div>

              {/* Height Range */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800">
                  Height Range
                </label>
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  {[
                    ["5'0\"", "5'8\""],
                    ["5'2\"", "5'10\""],
                    ["5'4\"", "6'2\""],
                    ["4'10\"", "6'6\""],
                  ].map(([minH, maxH]) => {
                    const isSelected =
                      currentPrefs.heightRange[0] === minH && currentPrefs.heightRange[1] === maxH;
                    return (
                      <button
                        key={`${minH}-${maxH}`}
                        type="button"
                        onClick={() =>
                          setCurrentPrefs({ ...currentPrefs, heightRange: [minH, maxH] })
                        }
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {minH} to {maxH}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={currentPrefs.heightRange[0]}
                      onChange={(e) =>
                        setCurrentPrefs({
                          ...currentPrefs,
                          heightRange: [e.target.value, currentPrefs.heightRange[1]],
                        })
                      }
                      className="w-full appearance-none px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#DB2F3C]/30 focus:border-[#DB2F3C] cursor-pointer"
                    >
                      {HEIGHT_LIST.map((h) => (
                        <option key={h} value={h}>
                          Min: {h}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  <span className="text-stone-400 font-medium">to</span>
                  <div className="relative flex-1">
                    <select
                      value={currentPrefs.heightRange[1]}
                      onChange={(e) =>
                        setCurrentPrefs({
                          ...currentPrefs,
                          heightRange: [currentPrefs.heightRange[0], e.target.value],
                        })
                      }
                      className="w-full appearance-none px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#DB2F3C]/30 focus:border-[#DB2F3C] cursor-pointer"
                    >
                      {HEIGHT_LIST.map((h) => (
                        <option key={h} value={h}>
                          Max: {h}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Marital Status (Multi-Select) */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800">
                  Marital Status (Multiple Allowed)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MARITAL_STATUS_OPTIONS.map((status) => {
                    const isSelected = currentPrefs.maritalStatus?.includes(status);
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => toggleArrayItem("maritalStatus", status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Community & Sub-castes */}
          {(activeTab === "all" || activeTab === "community") && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB2F3C] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Community & Sindhi Sub-Castes</h4>
                    <p className="text-[11px] text-stone-500">Pick preferred Sindhi clans & traditions</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {currentPrefs.subCastes?.length || 1} Selected
                </span>
              </div>

              {/* Sub-caste Multi-Select Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-800">
                    Sindhi Sub-Castes (Multiple Allowed)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPrefs({
                        ...currentPrefs,
                        subCastes: SUB_CASTE_OPTIONS,
                      })
                    }
                    className="text-[11px] text-[#DB2F3C] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUB_CASTE_OPTIONS.map((caste) => {
                    const isSelected =
                      currentPrefs.subCastes?.includes(caste) ||
                      (caste === "All Sindhis" && currentPrefs.community === "Sindhi");
                    return (
                      <button
                        key={caste}
                        type="button"
                        onClick={() => {
                          if (caste === "All Sindhis") {
                            setCurrentPrefs({
                              ...currentPrefs,
                              community: "Sindhi",
                              subCastes: ["All Sindhis"],
                            });
                          } else {
                            const withoutAll = (currentPrefs.subCastes || []).filter(
                              (c) => c !== "All Sindhis"
                            );
                            const updated = withoutAll.includes(caste)
                              ? withoutAll.filter((c) => c !== caste)
                              : [...withoutAll, caste];
                            setCurrentPrefs({
                              ...currentPrefs,
                              subCastes: updated.length ? updated : ["All Sindhis"],
                              community: updated.join(", ") || "Sindhi",
                            });
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {caste}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manglik & Horoscope */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800">
                  Kundli / Manglik Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {MANGLIK_OPTIONS.map((manglik) => {
                    const isSelected = (currentPrefs.manglik || "Doesn't Matter") === manglik;
                    return (
                      <button
                        key={manglik}
                        type="button"
                        onClick={() => setCurrentPrefs({ ...currentPrefs, manglik })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {manglik}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Locations & Global Sindhi Hubs */}
          {(activeTab === "all" || activeTab === "location") && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB2F3C] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Preferred Locations & Hubs</h4>
                    <p className="text-[11px] text-stone-500">Pick states & international Sindhi diaspora hubs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPrefs({ ...currentPrefs, state: LOCATION_OPTIONS })}
                    className="text-[11px] text-[#DB2F3C] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-stone-300">•</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPrefs({ ...currentPrefs, state: [] })}
                    className="text-[11px] text-stone-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Location Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {LOCATION_OPTIONS.map((st) => {
                  const isSelected = currentPrefs.state?.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleArrayItem("state", st)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                          : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: Career, Education & Annual Income */}
          {(activeTab === "all" || activeTab === "career") && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DB2F3C] flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Career, Education & Income</h4>
                    <p className="text-[11px] text-stone-500">Qualifications and lifestyle expectations</p>
                  </div>
                </div>
              </div>

              {/* Annual Income Expectation Cards */}
              <div className="space-y-2">
                <label className="block font-semibold text-stone-800">
                  Annual Income Expectation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INCOME_OPTIONS.map((inc) => {
                    const isSelected = currentPrefs.annualIncome === inc;
                    return (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setCurrentPrefs({ ...currentPrefs, annualIncome: inc })}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs font-semibold"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="truncate">{inc}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Education Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-800">
                    Highest Education (Multiple Allowed)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPrefs({ ...currentPrefs, education: EDUCATION_OPTIONS })
                    }
                    className="text-[11px] text-[#DB2F3C] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EDUCATION_OPTIONS.map((edu) => {
                    const isSelected = currentPrefs.education?.includes(edu);
                    return (
                      <button
                        key={edu}
                        type="button"
                        onClick={() => toggleArrayItem("education", edu)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {edu}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Occupation Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800">
                  Occupation / Profession (Multiple Allowed)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {OCCUPATION_OPTIONS.map((occ) => {
                    const isSelected = currentPrefs.occupation?.includes(occ);
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => toggleArrayItem("occupation", occ)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Diet Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800">
                  Dietary Habits
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIET_OPTIONS.map((diet) => {
                    const isSelected = currentPrefs.diet?.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleArrayItem("diet", diet)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#DB2F3C] to-[#E63946] text-white border-transparent shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {diet}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sticky Footer Actions with Gradient Sheen */}
          <div className="sticky -bottom-5 sm:-bottom-6 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-between gap-3 shadow-lg z-20">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DB2F3C] via-[#E23846] to-[#B71F2A] hover:from-[#B71F2A] hover:to-[#8B121A] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-500/25 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 animate-in zoom-in" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Update Preferences</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MatchesPreferencesModal = memo(MatchesPreferencesModalComponent);
MatchesPreferencesModal.displayName = "MatchesPreferencesModal";
export default MatchesPreferencesModal;
