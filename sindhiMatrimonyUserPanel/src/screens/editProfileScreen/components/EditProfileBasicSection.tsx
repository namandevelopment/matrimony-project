"use client";

import React, { memo, useCallback } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { CustomTextInput } from "@/components/CustomTextInput";
import { FormFieldRow } from "./FormFieldRow";
import {
  BasicInfoFormData,
  MaritalStatus,
  PhysicalStatus,
  ManglikStatus,
  EatingHabits,
  SmokingHabits,
  DrinkingHabits,
} from "../types";
import {
  PROFILE_CREATED_BY_OPTIONS,
  DAYS_OPTIONS,
  MONTHS_OPTIONS,
  YEARS_OPTIONS,
  HEIGHT_OPTIONS,
  WEIGHT_KG_OPTIONS,
  WEIGHT_LBS_OPTIONS,
  CASTE_DIVISION_OPTIONS,
  SUBCASTE_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  ALL_LANGUAGES_LIST,
  GOTHRA_OPTIONS,
  STAR_NAKSHATRA_OPTIONS,
  RAASI_ZODIAC_OPTIONS,
} from "../staticData";

export interface EditProfileBasicSectionProps {
  data: BasicInfoFormData;
  onChange: (updates: Partial<BasicInfoFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const MARITAL_STATUSES: MaritalStatus[] = [
  "Unmarried",
  "Widow / Widower",
  "Divorced",
  "Separated",
];

const PHYSICAL_STATUSES: PhysicalStatus[] = ["Normal", "Physically Challenged"];

const MANGLIK_STATUSES: ManglikStatus[] = ["Yes", "No", "Don't Know"];

const EATING_HABITS: EatingHabits[] = [
  "Vegetarian",
  "Non-vegetarian",
  "Eggetarian",
  "Vegan",
];

const SMOKING_HABITS: SmokingHabits[] = [
  "Non-smoker",
  "Light / Social smoker",
  "Regular smoker",
];

const DRINKING_HABITS: DrinkingHabits[] = [
  "Non-drinker",
  "Light / Social drinker",
  "Regular drinker",
];

const EditProfileBasicSectionComponent: React.FC<EditProfileBasicSectionProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
  className = "",
}) => {
  const handleLanguagesChange = useCallback(
    (languages: string[]) => {
      onChange({ languagesKnown: languages });
    },
    [onChange]
  );

  const characterCount = (data.aboutMe || "").length;
  const isAboutMeValid = characterCount >= 50;

  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Section Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
          Basic Information
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Fields marked as <span className="text-[#DB2F3C] font-bold">*</span> are Mandatory
        </span>
      </div>

      {/* Form Fields Container */}
      <div className="p-5 sm:p-7 space-y-1">
        {/* 1. Profile created by * */}
        <FormFieldRow label="Profile created by" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.profileCreatedBy}
              onChange={(val) => onChange({ profileCreatedBy: val })}
              options={PROFILE_CREATED_BY_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 2. Name * */}
        <FormFieldRow label="Name" required>
          <div className="w-full sm:w-64">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Enter your full name"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* 3. Date of Birth * */}
        <FormFieldRow label="Date of Birth" required>
          <div className="flex items-center gap-2 max-w-sm">
            <div className="w-20">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={data.dobDay}
                onChange={(val) => onChange({ dobDay: val })}
                options={DAYS_OPTIONS}
                triggerClassName="rounded-md border-stone-300 text-xs"
              />
            </div>
            <div className="flex-1 min-w-[110px]">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={data.dobMonth}
                onChange={(val) => onChange({ dobMonth: val })}
                options={MONTHS_OPTIONS}
                triggerClassName="rounded-md border-stone-300 text-xs"
              />
            </div>
            <div className="w-24">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={data.dobYear}
                onChange={(val) => onChange({ dobYear: val })}
                options={YEARS_OPTIONS}
                triggerClassName="rounded-md border-stone-300 text-xs"
              />
            </div>
          </div>
        </FormFieldRow>

        {/* 4. Marital Status * */}
        <FormFieldRow label="Marital Status" required>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-1">
            {MARITAL_STATUSES.map((status) => (
              <label
                key={status}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="maritalStatus"
                  value={status}
                  checked={data.maritalStatus === status}
                  onChange={() => onChange({ maritalStatus: status })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 5. Height * */}
        <FormFieldRow label="Height" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.height}
              onChange={(val) => onChange({ height: val })}
              options={HEIGHT_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 6. Weight */}
        <FormFieldRow label="Weight">
          <div className="flex items-center gap-2 max-w-sm">
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={data.weightKg}
                onChange={(val) => onChange({ weightKg: val, weightUnit: "kg" })}
                options={WEIGHT_KG_OPTIONS}
                triggerClassName="rounded-md border-stone-300 text-xs"
              />
            </div>
            <span className="text-[11px] font-bold text-stone-400 px-1">OR</span>
            <div className="w-28 sm:w-32">
              <CustomDropDown
                size="sm"
                activeColor="brand"
                value={data.weightLbs}
                onChange={(val) => onChange({ weightLbs: val, weightUnit: "lbs" })}
                options={WEIGHT_LBS_OPTIONS}
                triggerClassName="rounded-md border-stone-300 text-xs"
              />
            </div>
          </div>
        </FormFieldRow>

        {/* 7. Physical Status * */}
        <FormFieldRow label="Physical Status" required>
          <div className="flex flex-wrap items-center gap-6 py-1">
            {PHYSICAL_STATUSES.map((status) => (
              <label
                key={status}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="physicalStatus"
                  value={status}
                  checked={data.physicalStatus === status}
                  onChange={() => onChange({ physicalStatus: status })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 8. Caste / Division * */}
        <FormFieldRow label="Caste / Division" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.casteDivision}
              onChange={(val) => onChange({ casteDivision: val })}
              options={CASTE_DIVISION_OPTIONS}
              placeholder="Select Caste"
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 9. Subcaste * */}
        <FormFieldRow label="Subcaste" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.subcaste}
              onChange={(val) => onChange({ subcaste: val })}
              options={SUBCASTE_OPTIONS}
              placeholder="Select Subcaste"
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 10. Mother Tongue * */}
        <FormFieldRow label="Mother Tongue" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.motherTongue}
              onChange={(val) => onChange({ motherTongue: val })}
              options={MOTHER_TONGUE_OPTIONS}
              placeholder="Select Mother Tongue"
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 11. Languages Known */}
        <FormFieldRow label="Languages Known" alignTop>
          <div className="w-full sm:w-80">
            <CustomDropDown
              size="sm"
              isMultiSelect={true}
              searchable={true}
              searchPlaceholder="Search languages..."
              placeholder="Select languages known"
              options={ALL_LANGUAGES_LIST}
              value={data.languagesKnown}
              onChange={(selected) => handleLanguagesChange(selected as string[])}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Select all languages you can speak, read, or write
            </p>
          </div>
        </FormFieldRow>

        {/* 12. Gothra * */}
        <FormFieldRow label="Gothra" required>
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.gothra}
              onChange={(val) => onChange({ gothra: val })}
              options={GOTHRA_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 13. Star (Nakshatra) */}
        <FormFieldRow label="Star">
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.star}
              onChange={(val) => onChange({ star: val })}
              options={STAR_NAKSHATRA_OPTIONS}
              placeholder="Select Star / Nakshatra"
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 14. Raasi */}
        <FormFieldRow label="Raasi">
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.raasi}
              onChange={(val) => onChange({ raasi: val })}
              options={RAASI_ZODIAC_OPTIONS}
              placeholder="Select Raasi / Zodiac"
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* 15. Manglik */}
        <FormFieldRow label="Manglik">
          <div className="flex flex-wrap items-center gap-6 py-1">
            {MANGLIK_STATUSES.map((status) => (
              <label
                key={status}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="manglik"
                  value={status}
                  checked={data.manglik === status}
                  onChange={() => onChange({ manglik: status })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 16. Eating Habits */}
        <FormFieldRow label="Eating Habits">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-1">
            {EATING_HABITS.map((habit) => (
              <label
                key={habit}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="eatingHabits"
                  value={habit}
                  checked={data.eatingHabits === habit}
                  onChange={() => onChange({ eatingHabits: habit })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{habit}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 17. Smoking Habits */}
        <FormFieldRow label="Smoking Habits">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-1">
            {SMOKING_HABITS.map((habit) => (
              <label
                key={habit}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="smokingHabits"
                  value={habit}
                  checked={data.smokingHabits === habit}
                  onChange={() => onChange({ smokingHabits: habit })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{habit}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 18. Drinking Habits */}
        <FormFieldRow label="Drinking Habits">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-1">
            {DRINKING_HABITS.map((habit) => (
              <label
                key={habit}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="drinkingHabits"
                  value={habit}
                  checked={data.drinkingHabits === habit}
                  onChange={() => onChange({ drinkingHabits: habit })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{habit}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* 19. About Me * */}
        <FormFieldRow label="About Me" required alignTop>
          <div className="w-full">
            <textarea
              rows={4}
              value={data.aboutMe}
              onChange={(e) => onChange({ aboutMe: e.target.value })}
              placeholder="Write a brief introduction about yourself, your background, values, interests and expectations..."
              className={`w-full p-3 rounded-lg border text-xs sm:text-[13px] leading-relaxed transition-all focus:outline-hidden resize-y ${
                !isAboutMeValid && characterCount > 0
                  ? "border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30"
                  : "border-stone-300 focus:border-[#DB2F3C] focus:ring-1 focus:ring-[#DB2F3C]"
              }`}
            />
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-stone-500">Min. 50 characters</span>
              <span
                className={`font-medium ${
                  isAboutMeValid ? "text-emerald-700" : "text-amber-600"
                }`}
              >
                {characterCount} Characters typed
              </span>
            </div>
          </div>
        </FormFieldRow>
      </div>

      {/* Save Button Row */}
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
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
};

export const EditProfileBasicSection = memo(EditProfileBasicSectionComponent);
EditProfileBasicSection.displayName = "EditProfileBasicSection";
