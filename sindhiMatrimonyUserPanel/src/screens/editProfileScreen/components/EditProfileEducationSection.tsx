"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { CustomTextInput } from "@/components/CustomTextInput";
import { FormFieldRow } from "./FormFieldRow";
import { EducationOccupationFormData } from "../types";
import {
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYED_IN_OPTIONS,
  OCCUPATION_OPTIONS,
  ANNUAL_INCOME_OPTIONS,
} from "../staticData";

export interface EditProfileEducationSectionProps {
  data: EducationOccupationFormData;
  onChange: (updates: Partial<EducationOccupationFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const EditProfileEducationSectionComponent: React.FC<EditProfileEducationSectionProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
  className = "",
}) => {
  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
          Education &amp; Occupation
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Fields marked as <span className="text-[#DB2F3C] font-bold">*</span> are Mandatory
        </span>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-7 space-y-1">
        {/* Highest Education */}
        <FormFieldRow label="Highest Education" required>
          <div className="w-full sm:w-80">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.highestEducation}
              onChange={(val) => onChange({ highestEducation: val })}
              options={EDUCATION_LEVEL_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Education Detail */}
        <FormFieldRow label="Education Detail">
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.educationDetail}
              onChange={(e) => onChange({ educationDetail: e.target.value })}
              placeholder="e.g. B.Tech in Computer Science"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* College / Institute */}
        <FormFieldRow label="College / Institute">
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.collegeInstitute}
              onChange={(e) => onChange({ collegeInstitute: e.target.value })}
              placeholder="e.g. Government Engineering College"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* Employed in */}
        <FormFieldRow label="Employed in" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.employedIn}
              onChange={(val) => onChange({ employedIn: val })}
              options={EMPLOYED_IN_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Occupation */}
        <FormFieldRow label="Occupation" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={data.occupation}
              onChange={(val) => onChange({ occupation: val })}
              options={OCCUPATION_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Occupation Detail */}
        <FormFieldRow label="Occupation Detail">
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.occupationDetail}
              onChange={(e) => onChange({ occupationDetail: e.target.value })}
              placeholder="e.g. Full Stack Engineer"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* Annual Income */}
        <FormFieldRow label="Annual Income" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.annualIncome}
              onChange={(val) => onChange({ annualIncome: val })}
              options={ANNUAL_INCOME_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Work Location */}
        <FormFieldRow label="Work Location">
          <div className="flex flex-wrap items-center gap-2 max-w-md">
            <div className="w-32">
              <CustomTextInput
                inputSize="sm"
                variant="outlined"
                value={data.workCity}
                onChange={(e) => onChange({ workCity: e.target.value })}
                placeholder="City (e.g. Ajmer)"
                inputClassName="rounded-md border-stone-300 text-xs h-9"
              />
            </div>
            <div className="w-36">
              <CustomTextInput
                inputSize="sm"
                variant="outlined"
                value={data.workState}
                onChange={(e) => onChange({ workState: e.target.value })}
                placeholder="State (e.g. Rajasthan)"
                inputClassName="rounded-md border-stone-300 text-xs h-9"
              />
            </div>
            <div className="w-28">
              <CustomTextInput
                inputSize="sm"
                variant="outlined"
                value={data.workCountry}
                onChange={(e) => onChange({ workCountry: e.target.value })}
                placeholder="Country"
                inputClassName="rounded-md border-stone-300 text-xs h-9"
              />
            </div>
          </div>
        </FormFieldRow>
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
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
};

export const EditProfileEducationSection = memo(EditProfileEducationSectionComponent);
EditProfileEducationSection.displayName = "EditProfileEducationSection";
