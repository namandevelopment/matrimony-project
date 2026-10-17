"use client";

import React, { memo } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { CustomTextInput } from "@/components/CustomTextInput";
import { FormFieldRow } from "./FormFieldRow";
import { ContactDetailsFormData } from "../types";

export interface EditProfileContactSectionProps {
  data: ContactDetailsFormData;
  subType?: "location" | "email" | "contact_number";
  onChange: (updates: Partial<ContactDetailsFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const EditProfileContactSectionComponent: React.FC<EditProfileContactSectionProps> = ({
  data,
  subType = "location",
  onChange,
  onSave,
  isSaving = false,
  className = "",
}) => {
  const title =
    subType === "email"
      ? "E-mail Address"
      : subType === "contact_number"
      ? "Contact Numbers & Calling Preference"
      : "Location Details";

  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
          {title}
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Fields marked as <span className="text-[#DB2F3C] font-bold">*</span> are Mandatory
        </span>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-7 space-y-1">
        {(subType === "location" || !subType) && (
          <>
            <FormFieldRow label="City" required>
              <div className="w-full sm:w-72">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  placeholder="e.g. Ajmer"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="State" required>
              <div className="w-full sm:w-72">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.state}
                  onChange={(e) => onChange({ state: e.target.value })}
                  placeholder="e.g. Rajasthan"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="Country" required>
              <div className="w-full sm:w-72">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.country}
                  onChange={(e) => onChange({ country: e.target.value })}
                  placeholder="e.g. India"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="Citizenship">
              <div className="w-full sm:w-72">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.citizenship}
                  onChange={(e) => onChange({ citizenship: e.target.value })}
                  placeholder="e.g. Indian"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="Ancestral Origin">
              <div className="w-full sm:w-72">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.ancestralOrigin}
                  onChange={(e) => onChange({ ancestralOrigin: e.target.value })}
                  placeholder="e.g. Sindh / Shikarpur / Ajmer"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>
          </>
        )}

        {(subType === "email" || !subType) && (
          <FormFieldRow label="E-mail Address" required>
            <div className="space-y-1.5 w-full sm:w-80">
              <div className="relative">
                <CustomTextInput
                  type="email"
                  inputSize="sm"
                  variant="outlined"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  placeholder="name@example.com"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9 pr-8"
                />
                {data.isEmailVerified ? (
                  <span title="Verified Email" className="absolute right-2.5 top-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </span>
                ) : (
                  <span title="Verification Pending" className="absolute right-2.5 top-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {data.isEmailVerified
                  ? "✓ Your email is verified. Communications & match alerts are sent here."
                  : "Please verify your email to ensure match notifications reach you."}
              </p>
            </div>
          </FormFieldRow>
        )}

        {(subType === "contact_number" || !subType) && (
          <>
            <FormFieldRow label="Mobile Number" required>
              <div className="space-y-1.5 w-full sm:w-80">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1.5 bg-stone-100 border border-stone-300 rounded-md text-xs font-semibold text-stone-700">
                    {data.mobileCountryCode || "+91"}
                  </span>
                  <div className="flex-1 relative">
                    <CustomTextInput
                      type="tel"
                      inputSize="sm"
                      variant="outlined"
                      value={data.mobileNumber}
                      onChange={(e) => onChange({ mobileNumber: e.target.value })}
                      placeholder="9876543210"
                      inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9 pr-8"
                    />
                    {data.isMobileVerified && (
                      <span title="Verified Number" className="absolute right-2.5 top-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </FormFieldRow>

            <FormFieldRow label="Alternate Number">
              <div className="w-full sm:w-80">
                <CustomTextInput
                  type="tel"
                  inputSize="sm"
                  variant="outlined"
                  value={data.alternateNumber}
                  onChange={(e) => onChange({ alternateNumber: e.target.value })}
                  placeholder="Optional alternate / family phone"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="Contact Person">
              <div className="w-full sm:w-80">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.contactPerson}
                  onChange={(e) => onChange({ contactPerson: e.target.value })}
                  placeholder="e.g. Self / Father / Mother"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>

            <FormFieldRow label="Convenient Time to Call">
              <div className="w-full sm:w-80">
                <CustomTextInput
                  inputSize="sm"
                  variant="outlined"
                  value={data.convenientTimeToCall}
                  onChange={(e) =>
                    onChange({ convenientTimeToCall: e.target.value })
                  }
                  placeholder="e.g. 10:00 AM to 8:00 PM"
                  inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
                />
              </div>
            </FormFieldRow>
          </>
        )}
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

export const EditProfileContactSection = memo(EditProfileContactSectionComponent);
EditProfileContactSection.displayName = "EditProfileContactSection";
