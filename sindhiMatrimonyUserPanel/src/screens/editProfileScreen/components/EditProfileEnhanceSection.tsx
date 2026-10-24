"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Camera, Plus, Trash2, Star, FileText, CheckCircle2 } from "lucide-react";
import { CustomDropDown } from "@/components/CustomDropDown";
import { CustomTextInput } from "@/components/CustomTextInput";
import { FormFieldRow } from "./FormFieldRow";
import { PhotoItem, HoroscopeFormData } from "../types";
import { STAR_NAKSHATRA_OPTIONS, RAASI_ZODIAC_OPTIONS } from "../staticData";

export interface EditProfileEnhanceSectionProps {
  subType: "photos" | "horoscope";
  photos: PhotoItem[];
  horoscope: HoroscopeFormData;
  onOpenPhotoModal: () => void;
  onDeletePhoto: (id: string) => void;
  onSetPrimaryPhoto: (id: string) => void;
  onHoroscopeChange: (updates: Partial<HoroscopeFormData>) => void;
  onSaveHoroscope: () => void;
  isSavingHoroscope?: boolean;
  className?: string;
}

const EditProfileEnhanceSectionComponent: React.FC<EditProfileEnhanceSectionProps> = ({
  subType,
  photos,
  horoscope,
  onOpenPhotoModal,
  onDeletePhoto,
  onSetPrimaryPhoto,
  onHoroscopeChange,
  onSaveHoroscope,
  isSavingHoroscope = false,
  className = "",
}) => {
  if (subType === "photos") {
    return (
      <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
        {/* Header */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
              Manage Photos ({photos.length}/10)
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
              Profiles with photos get up to 20x more responses &amp; interest requests.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="px-4 py-2 rounded-md bg-[#DB2F3C] hover:bg-[#C22430] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Add New Photo</span>
          </button>
        </div>

        {/* Photos Grid */}
        <div className="p-5 sm:p-7">
          {photos.length === 0 ? (
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#DB2F3C] flex items-center justify-center mb-3">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">
                No Photos Added Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                Upload clear frontal photos. We support JPG, PNG up to 10MB.
                You can add up to 10 photos.
              </p>
              <button
                type="button"
                onClick={onOpenPhotoModal}
                className="mt-4 px-5 py-2 rounded-md bg-[#DB2F3C] text-white text-xs font-bold hover:bg-[#C22430] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Profile Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-100 aspect-3/4 flex flex-col"
                >
                  <Image
                    src={photo.url}
                    alt="User photo"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {photo.isPrimary && (
                    <span className="absolute top-1.5 left-1.5 bg-[#DB2F3C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Primary
                    </span>
                  )}
                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!photo.isPrimary && (
                      <button
                        type="button"
                        onClick={() => onSetPrimaryPhoto(photo.id)}
                        className="p-1.5 bg-white text-stone-800 rounded-md hover:bg-stone-100 text-xs font-medium cursor-pointer"
                        title="Make Primary"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeletePhoto(photo.id)}
                      className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-medium cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add slot if < 10 */}
              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={onOpenPhotoModal}
                  className="rounded-lg border-2 border-dashed border-stone-300 hover:border-[#DB2F3C] aspect-3/4 flex flex-col items-center justify-center text-stone-500 hover:text-[#DB2F3C] transition-colors bg-stone-50 hover:bg-red-50/20 cursor-pointer"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horoscope section
  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
          Horoscope &amp; Kundali Details
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Astrological match compatibility data
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-1">
        <FormFieldRow label="Time of Birth">
          <div className="w-full sm:w-64">
            <CustomTextInput
              type="text"
              inputSize="sm"
              variant="outlined"
              value={horoscope.timeOfBirth}
              onChange={(e) =>
                onHoroscopeChange({ timeOfBirth: e.target.value })
              }
              placeholder="e.g. 10:30 AM"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        <FormFieldRow label="Place of Birth">
          <div className="w-full sm:w-80">
            <CustomTextInput
              type="text"
              inputSize="sm"
              variant="outlined"
              value={horoscope.placeOfBirth}
              onChange={(e) =>
                onHoroscopeChange({ placeOfBirth: e.target.value })
              }
              placeholder="e.g. Ajmer, Rajasthan, India"
              inputClassName="rounded-md border-stone-300 text-xs sm:text-[13px] h-9"
            />
          </div>
        </FormFieldRow>

        <FormFieldRow label="Star / Nakshatra">
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={horoscope.nakshatra}
              onChange={(val) => onHoroscopeChange({ nakshatra: val })}
              options={STAR_NAKSHATRA_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        <FormFieldRow label="Raasi / Moon Sign">
          <div className="w-full sm:w-64">
            <CustomDropDown
              size="sm"
              searchable
              activeColor="brand"
              value={horoscope.raasi}
              onChange={(val) => onHoroscopeChange({ raasi: val })}
              options={RAASI_ZODIAC_OPTIONS}
              triggerClassName="rounded-md border-stone-300 text-xs sm:text-[13px]"
            />
          </div>
        </FormFieldRow>

        <FormFieldRow label="Horoscope Match">
          <div className="flex items-center gap-6 py-1">
            {["Must", "Not Necessary"].map((opt) => (
              <label
                key={opt}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs sm:text-[13px] text-stone-700 select-none hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="horoscopeMatchRequired"
                  value={opt}
                  checked={horoscope.horoscopeMatchRequired === opt}
                  onChange={() =>
                    onHoroscopeChange({ horoscopeMatchRequired: opt })
                  }
                  className="w-3.5 h-3.5 accent-[#DB2F3C] text-[#DB2F3C] focus:ring-[#DB2F3C] border-stone-300 cursor-pointer"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </FormFieldRow>

        <FormFieldRow label="Kundali Document" alignTop>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-stone-300 rounded-md bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Upload Kundali (PDF/Image)</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Generated kundali helps prospective match families evaluate Guna Milan accurately.
            </p>
          </div>
        </FormFieldRow>
      </div>

      {/* Save Button */}
      <div className="px-5 sm:px-7 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-center sm:justify-start">
        <button
          type="button"
          onClick={onSaveHoroscope}
          disabled={isSavingHoroscope}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {isSavingHoroscope ? (
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

export const EditProfileEnhanceSection = memo(EditProfileEnhanceSectionComponent);
EditProfileEnhanceSection.displayName = "EditProfileEnhanceSection";
