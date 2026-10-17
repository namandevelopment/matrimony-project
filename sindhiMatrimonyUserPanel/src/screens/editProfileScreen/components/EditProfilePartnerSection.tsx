"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { FormFieldRow } from "./FormFieldRow";
import { PartnerPreferenceFormData } from "../types";
import { HEIGHT_OPTIONS } from "../staticData";

export interface EditProfilePartnerSectionProps {
  data: PartnerPreferenceFormData;
  onChange: (updates: Partial<PartnerPreferenceFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(i + 18));

const MARITAL_STATUS_PREFERENCES = [
  "Doesn't Matter",
  "Never married",
  "Widow / Widower",
  "Divorced",
  "Separated",
];

const EATING_PREFERENCES = [
  "Doesn't Matter",
  "Vegetarian",
  "Non-vegetarian",
  "Eggetarian",
  "Vegan",
];

const SMOKING_PREFERENCES = [
  "Doesn't Matter",
  "Never",
  "Occasionally",
  "Regularly",
];

const DRINKING_PREFERENCES = [
  "Doesn't Matter",
  "Never",
  "Occasionally",
  "Regularly",
];

const PHYSICAL_STATUS_PREFERENCES = [
  "Normal",
  "Physically Challenged",
  "Doesn't Matter",
];

const MANGLIK_PREFERENCES = [
  "Doesn't Matter",
  "Must be Manglik",
  "Must be Non-Manglik",
];

const RELIGION_PREFERENCES = ["Hindu", "Any", "Jain", "Sikh"];

const EMPLOYMENT_TYPE_PREFERENCES = [
  "Any",
  "Private Sector",
  "Government / PSU",
  "Business / Self Employed",
  "Not Working",
];

const ANNUAL_INCOME_PREFERENCES = [
  "Any",
  "Rs. 3 Lakh & Above",
  "Rs. 5 Lakh & Above",
  "Rs. 10 Lakh & Above",
  "Rs. 15 Lakh & Above",
  "Rs. 25 Lakh & Above",
  "Doesn't Matter",
];

const MOTHER_TONGUE_OPTIONS = [
  "Hindi",
  "Sindhi",
  "English",
  "Gujarati",
  "Marathi",
  "Punjabi",
  "Bengali",
  "Any",
];

const EDUCATION_OPTIONS = [
  "Any",
  "BE / B.Tech., BCA, Aeronautical Engineering",
  "B.Arch, B.Plan",
  "MCA, M.Tech, MS",
  "MBA, PGDM",
  "MBBS, MD, MS",
  "B.A., B.Sc., B.Com",
  "Ph.D., Doctorate",
];

const EditProfilePartnerSectionComponent: React.FC<EditProfilePartnerSectionProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
  className = "",
}) => {
  const toggleArrayItem = (
    field: "maritalStatus" | "castePreference" | "eatingHabitsPreference" | "motherTonguePreference",
    value: string
  ) => {
    const list = data[field] || [];
    if (list.includes(value)) {
      onChange({ [field]: list.filter((i) => i !== value) });
    } else {
      onChange({ [field]: [...list, value] });
    }
  };

  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Main Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
            Partner Preferences
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
            Matches are curated based on your partner preferences
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-8">
        {/* 1. Basic Preferences */}
        <section className="space-y-4">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 border-l-4 border-[#DB2F3C]">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              1. Basic Preferences
            </h3>
          </div>

          <div className="space-y-1 pt-1">
            {/* Age Range */}
            <FormFieldRow label="Preferred Age">
              <div className="flex items-center gap-2 max-w-sm">
                <div className="w-24">
                  <CustomDropDown
                    size="sm"
                    activeColor="brand"
                    value={data.ageFrom || "21"}
                    onChange={(val) => onChange({ ageFrom: val })}
                    options={AGE_OPTIONS}
                    triggerClassName="rounded-md border-stone-300 text-xs"
                  />
                </div>
                <span className="text-stone-400 text-xs font-medium">to</span>
                <div className="w-24">
                  <CustomDropDown
                    size="sm"
                    activeColor="brand"
                    value={data.ageTo || "28"}
                    onChange={(val) => onChange({ ageTo: val })}
                    options={AGE_OPTIONS}
                    triggerClassName="rounded-md border-stone-300 text-xs"
                  />
                </div>
                <span className="text-stone-500 text-xs">Years</span>
              </div>
            </FormFieldRow>

            {/* Height Range */}
            <FormFieldRow label="Preferred Height">
              <div className="flex items-center gap-2 max-w-md">
                <div className="w-36">
                  <CustomDropDown
                    size="sm"
                    activeColor="brand"
                    value={data.heightFrom || HEIGHT_OPTIONS[6]}
                    onChange={(val) => onChange({ heightFrom: val })}
                    options={HEIGHT_OPTIONS}
                    triggerClassName="rounded-md border-stone-300 text-xs"
                  />
                </div>
                <span className="text-stone-400 text-xs font-medium">to</span>
                <div className="w-36">
                  <CustomDropDown
                    size="sm"
                    activeColor="brand"
                    value={data.heightTo || HEIGHT_OPTIONS[18]}
                    onChange={(val) => onChange({ heightTo: val })}
                    options={HEIGHT_OPTIONS}
                    triggerClassName="rounded-md border-stone-300 text-xs"
                  />
                </div>
              </div>
            </FormFieldRow>

            {/* Marital Status */}
            <FormFieldRow label="Preferred Marital Status" alignTop>
              <div className="flex flex-wrap items-center gap-4 py-1">
                {MARITAL_STATUS_PREFERENCES.map((status) => {
                  const isChecked = data.maritalStatus?.includes(status);
                  return (
                    <label
                      key={status}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem("maritalStatus", status)}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] rounded border-stone-300 focus:ring-[#DB2F3C] cursor-pointer transition-colors"
                      />
                      <span className={isChecked ? "font-semibold text-stone-900" : ""}>{status}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Mother Tongue */}
            <FormFieldRow label="Preferred Mother Tongue" alignTop>
              <div className="flex flex-wrap items-center gap-3 py-1">
                {MOTHER_TONGUE_OPTIONS.map((lang) => {
                  const isChecked = data.motherTonguePreference?.includes(lang) || false;
                  return (
                    <label
                      key={lang}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem("motherTonguePreference", lang)}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] rounded border-stone-300 focus:ring-[#DB2F3C] cursor-pointer transition-colors"
                      />
                      <span className={isChecked ? "font-semibold text-stone-900" : ""}>{lang}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Physical Status */}
            <FormFieldRow label="Preferred Physical Status">
              <div className="flex flex-wrap items-center gap-5 py-1">
                {PHYSICAL_STATUS_PREFERENCES.map((opt) => {
                  const isSelected = (data.physicalStatusPreference || "Normal") === opt;
                  return (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="physicalStatusPreference"
                        value={opt}
                        checked={isSelected}
                        onChange={() => onChange({ physicalStatusPreference: opt })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Eating Habits */}
            <FormFieldRow label="Preferred Eating Habits" alignTop>
              <div className="flex flex-wrap items-center gap-4 py-1">
                {EATING_PREFERENCES.map((diet) => {
                  const isChecked = data.eatingHabitsPreference?.includes(diet);
                  return (
                    <label
                      key={diet}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem("eatingHabitsPreference", diet)}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] rounded border-stone-300 focus:ring-[#DB2F3C] cursor-pointer transition-colors"
                      />
                      <span className={isChecked ? "font-semibold text-stone-900" : ""}>{diet}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Smoking Habits */}
            <FormFieldRow label="Preferred Smoking Habits">
              <div className="flex flex-wrap items-center gap-5 py-1">
                {SMOKING_PREFERENCES.map((opt) => {
                  const isSelected = (data.smokingHabitsPreference || "Doesn't Matter") === opt;
                  return (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="smokingHabitsPreference"
                        value={opt}
                        checked={isSelected}
                        onChange={() => onChange({ smokingHabitsPreference: opt })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Drinking Habits */}
            <FormFieldRow label="Preferred Drinking Habits">
              <div className="flex flex-wrap items-center gap-5 py-1">
                {DRINKING_PREFERENCES.map((opt) => {
                  const isSelected = (data.drinkingHabitsPreference || "Doesn't Matter") === opt;
                  return (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="drinkingHabitsPreference"
                        value={opt}
                        checked={isSelected}
                        onChange={() => onChange({ drinkingHabitsPreference: opt })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>
          </div>
        </section>

        {/* 2. Religious Preferences */}
        <section className="space-y-4">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 border-l-4 border-purple-500">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              2. Religious Preferences
            </h3>
          </div>

          <div className="space-y-1 pt-1">
            {/* Preferred Religion */}
            <FormFieldRow label="Preferred Religion">
              <div className="flex flex-wrap items-center gap-5 py-1">
                {RELIGION_PREFERENCES.map((rel) => {
                  const isSelected = (data.religionPreference || "Hindu") === rel;
                  return (
                    <label
                      key={rel}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="religionPreference"
                        value={rel}
                        checked={isSelected}
                        onChange={() => onChange({ religionPreference: rel })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{rel}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Preferred Subcaste */}
            <FormFieldRow label="Preferred Subcaste">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.subcastePreference || "Any"}
                  onChange={(e) => onChange({ subcastePreference: e.target.value })}
                  placeholder="e.g. Any, Dwivedi/Dubey, Saryuparin, Gaur"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Star */}
            <FormFieldRow label="Preferred Star">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.starPreference || "Any"}
                  onChange={(e) => onChange({ starPreference: e.target.value })}
                  placeholder="e.g. Any, Bharani, Rohini, Mrigashirsha"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Manglik */}
            <FormFieldRow label="Preferred Manglik">
              <div className="flex flex-wrap items-center gap-6 py-1">
                {MANGLIK_PREFERENCES.map((opt) => {
                  const isSelected = (data.manglikPreference || "Doesn't Matter") === opt;
                  return (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="manglikPreference"
                        value={opt}
                        checked={isSelected}
                        onChange={() => onChange({ manglikPreference: opt })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Preferred Gothram */}
            <FormFieldRow label="Preferred Gothram">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.gothramPreference || "Not Specified"}
                  onChange={(e) => onChange({ gothramPreference: e.target.value })}
                  placeholder="e.g. Not Specified, Any, Bharadwaj, Kashyap"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>
          </div>
        </section>

        {/* 3. Professional Preferences */}
        <section className="space-y-4">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 border-l-4 border-blue-500">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              3. Professional Preferences
            </h3>
          </div>

          <div className="space-y-1 pt-1">
            {/* Preferred Education */}
            <FormFieldRow label="Preferred Education">
              <div className="w-full sm:w-96">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.educationPreference?.[0] || EDUCATION_OPTIONS[0]}
                  onChange={(val) => onChange({ educationPreference: [val] })}
                  options={EDUCATION_OPTIONS}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Employment Type */}
            <FormFieldRow label="Preferred Employment Type">
              <div className="flex flex-wrap items-center gap-4 py-1">
                {EMPLOYMENT_TYPE_PREFERENCES.map((opt) => {
                  const isSelected = (data.employmentTypePreference || "Any") === opt;
                  return (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
                    >
                      <input
                        type="radio"
                        name="employmentTypePreference"
                        value={opt}
                        checked={isSelected}
                        onChange={() => onChange({ employmentTypePreference: opt })}
                        className="w-4 h-4 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer transition-colors"
                      />
                      <span className={isSelected ? "font-semibold text-stone-900" : ""}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </FormFieldRow>

            {/* Preferred Occupation */}
            <FormFieldRow label="Preferred Occupation">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.occupationPreference?.[0] || "Any"}
                  onChange={(e) => onChange({ occupationPreference: [e.target.value] })}
                  placeholder="e.g. Any, Software Engineer, Executive, Doctor"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Annual Income */}
            <FormFieldRow label="Preferred Annual Income">
              <div className="w-full sm:w-80">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.annualIncomePreference || ANNUAL_INCOME_PREFERENCES[0]}
                  onChange={(val) => onChange({ annualIncomePreference: val })}
                  options={ANNUAL_INCOME_PREFERENCES}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </FormFieldRow>
          </div>
        </section>

        {/* 4. Location Preferences */}
        <section className="space-y-4">
          <div className="bg-[#FAF7F6] rounded-xl px-4 py-2.5 border-l-4 border-emerald-500">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              4. Location Preferences
            </h3>
          </div>

          <div className="space-y-1 pt-1">
            {/* Preferred Country */}
            <FormFieldRow label="Preferred Country">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.preferredCountry || "Any"}
                  onChange={(e) => onChange({ preferredCountry: e.target.value })}
                  placeholder="e.g. Any, India, USA, UAE"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Residing State */}
            <FormFieldRow label="Preferred Residing State">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.preferredState || "Any"}
                  onChange={(e) => onChange({ preferredState: e.target.value })}
                  placeholder="e.g. Any, Rajasthan, Maharashtra, Delhi NCR"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Residing City */}
            <FormFieldRow label="Preferred Residing City">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.preferredCity || "Any"}
                  onChange={(e) => onChange({ preferredCity: e.target.value })}
                  placeholder="e.g. Any, Jaipur, Indore, Mumbai, Raipur"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>

            {/* Preferred Citizenship */}
            <FormFieldRow label="Preferred Citizenship">
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={data.preferredCitizenship || "Any"}
                  onChange={(e) => onChange({ preferredCitizenship: e.target.value })}
                  placeholder="e.g. Any, Indian"
                  className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-[13px] focus:outline-hidden focus:border-[#DB2F3C]"
                />
              </div>
            </FormFieldRow>
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="px-5 sm:px-7 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-center sm:justify-start">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>
    </div>
  );
};

export const EditProfilePartnerSection = memo(EditProfilePartnerSectionComponent);
EditProfilePartnerSection.displayName = "EditProfilePartnerSection";
export default EditProfilePartnerSection;
