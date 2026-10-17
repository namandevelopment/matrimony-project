"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { CustomTextInput } from "@/components/CustomTextInput";
import { FormFieldRow } from "./FormFieldRow";
import { FamilyDetailsFormData } from "../types";
import {
  FAMILY_VALUES_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  FAMILY_STATUS_OPTIONS,
} from "../staticData";

export interface EditProfileFamilySectionProps {
  data: FamilyDetailsFormData;
  onChange: (updates: Partial<FamilyDetailsFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const COUNT_OPTIONS = ["0", "1", "2", "3", "4", "5+"];

const EditProfileFamilySectionComponent: React.FC<EditProfileFamilySectionProps> = ({
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
          Family Details
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Fields marked as <span className="text-[#DB2F3C] font-bold">*</span> are Mandatory
        </span>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-7 space-y-1">
        {/* Family Values */}
        <FormFieldRow label="Family Values" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.familyValues}
              onChange={(val) => onChange({ familyValues: val })}
              options={FAMILY_VALUES_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Family Type */}
        <FormFieldRow label="Family Type" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.familyType}
              onChange={(val) => onChange({ familyType: val })}
              options={FAMILY_TYPE_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Family Status */}
        <FormFieldRow label="Family Status" required>
          <div className="w-full sm:w-72">
            <CustomDropDown
              size="sm"
              activeColor="brand"
              value={data.familyStatus}
              onChange={(val) => onChange({ familyStatus: val })}
              options={FAMILY_STATUS_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        {/* Father's Occupation */}
        <FormFieldRow label="Father's Occupation" required>
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.fatherOccupation}
              onChange={(e) => onChange({ fatherOccupation: e.target.value })}
              placeholder="e.g. Business Owner / Retired Officer"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* Mother's Occupation */}
        <FormFieldRow label="Mother's Occupation" required>
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.motherOccupation}
              onChange={(e) => onChange({ motherOccupation: e.target.value })}
              placeholder="e.g. Homemaker / Teacher"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* Brothers */}
        <FormFieldRow label="Brothers">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-600">Total:</span>
              <div className="w-20">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.brothersCount}
                  onChange={(val) => onChange({ brothersCount: val })}
                  options={COUNT_OPTIONS}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-600">Married:</span>
              <div className="w-20">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.brothersMarried}
                  onChange={(val) => onChange({ brothersMarried: val })}
                  options={COUNT_OPTIONS}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>
        </FormFieldRow>

        {/* Sisters */}
        <FormFieldRow label="Sisters">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-600">Total:</span>
              <div className="w-20">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.sistersCount}
                  onChange={(val) => onChange({ sistersCount: val })}
                  options={COUNT_OPTIONS}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-600">Married:</span>
              <div className="w-20">
                <CustomDropDown
                  size="sm"
                  activeColor="brand"
                  value={data.sistersMarried}
                  onChange={(val) => onChange({ sistersMarried: val })}
                  options={COUNT_OPTIONS}
                  triggerClassName="rounded-md border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>
        </FormFieldRow>

        {/* Living with parents */}
        <FormFieldRow label="Living with parents?">
          <div className="flex items-center gap-6 py-1">
            {["Yes", "No"].map((opt) => (
              <label
                key={opt}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="livingWithParents"
                  value={opt}
                  checked={data.livingWithParents === opt}
                  onChange={() => onChange({ livingWithParents: opt })}
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        {/* Family Location */}
        <FormFieldRow label="Family Location">
          <div className="w-full sm:w-80">
            <CustomTextInput
              inputSize="sm"
              variant="outlined"
              value={data.familyLocation}
              onChange={(e) => onChange({ familyLocation: e.target.value })}
              placeholder="City, State, Country"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        {/* About Family */}
        <FormFieldRow label="About Family" alignTop>
          <div className="w-full">
            <textarea
              rows={3}
              value={data.aboutFamily}
              onChange={(e) => onChange({ aboutFamily: e.target.value })}
              placeholder="Tell prospective matches more about your family culture, traditions, and roots..."
              className="w-full p-3 rounded-lg border border-stone-300 text-xs sm:text-[13px] leading-relaxed transition-all focus:outline-hidden focus:border-[#DB2F3C] focus:ring-1 focus:ring-[#DB2F3C] resize-y"
            />
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

export const EditProfileFamilySection = memo(EditProfileFamilySectionComponent);
EditProfileFamilySection.displayName = "EditProfileFamilySection";
