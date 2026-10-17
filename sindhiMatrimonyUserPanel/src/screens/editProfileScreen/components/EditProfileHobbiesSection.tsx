"use client";

import React, { memo, useState } from "react";
import { Plus, X } from "lucide-react";
import { FormFieldRow } from "./FormFieldRow";
import { HobbiesInterestsFormData } from "../types";

export interface EditProfileHobbiesSectionProps {
  data: HobbiesInterestsFormData;
  onChange: (updates: Partial<HobbiesInterestsFormData>) => void;
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

const POPULAR_HOBBIES = [
  "Reading Books",
  "Cooking",
  "Traveling",
  "Photography",
  "Writing",
  "Gardening",
  "Painting",
  "Singing",
  "Dancing",
  "Yoga / Meditation",
  "Coding",
  "Gaming",
];

const POPULAR_MUSIC = [
  "Classical",
  "Sufi",
  "Bollywood Classics",
  "Romantic",
  "Devotional / Bhajans",
  "Ghazals",
  "Western Pop / Rock",
  "Instrumental",
];

const POPULAR_SPORTS = [
  "Cricket",
  "Badminton",
  "Chess",
  "Football",
  "Table Tennis",
  "Swimming",
  "Cycling",
  "Running / Marathon",
];

const POPULAR_FOOD = [
  "Sindhi Cuisine",
  "North Indian",
  "South Indian",
  "Gujarati / Rajasthani",
  "Italian / Pizza / Pasta",
  "Chinese / Asian",
  "Continental",
  "Street Food",
];

const EditProfileHobbiesSectionComponent: React.FC<EditProfileHobbiesSectionProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
  className = "",
}) => {
  const [customHobbyInput, setCustomHobbyInput] = useState("");

  const toggleItem = (
    field: keyof HobbiesInterestsFormData,
    value: string
  ) => {
    const list = data[field] || [];
    if (list.includes(value)) {
      onChange({ [field]: list.filter((i) => i !== value) });
    } else {
      onChange({ [field]: [...list, value] });
    }
  };

  const addCustomHobby = () => {
    if (!customHobbyInput.trim()) return;
    const item = customHobbyInput.trim();
    if (!data.hobbies.includes(item)) {
      onChange({ hobbies: [...data.hobbies, item] });
    }
    setCustomHobbyInput("");
  };

  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
          Hobbies &amp; Interest
        </h2>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Select or add your favourite hobbies &amp; leisure activities
        </span>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-7 space-y-1">
        {/* Hobbies */}
        <FormFieldRow label="Hobbies" alignTop>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_HOBBIES.map((hobby) => {
                const isSelected = data.hobbies.includes(hobby);
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleItem("hobbies", hobby)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>

            {/* Custom Hobby Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={customHobbyInput}
                onChange={(e) => setCustomHobbyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomHobby()}
                placeholder="Add other hobby..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-stone-300 focus:outline-hidden focus:border-[#DB2F3C]"
              />
              <button
                type="button"
                onClick={addCustomHobby}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </FormFieldRow>

        {/* Music */}
        <FormFieldRow label="Favourite Music" alignTop>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MUSIC.map((item) => {
              const isSelected = data.music.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem("music", item)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </FormFieldRow>

        {/* Sports */}
        <FormFieldRow label="Sports / Fitness" alignTop>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SPORTS.map((item) => {
              const isSelected = data.sports.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem("sports", item)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </FormFieldRow>

        {/* Food */}
        <FormFieldRow label="Favourite Food" alignTop>
          <div className="flex flex-wrap gap-2">
            {POPULAR_FOOD.map((item) => {
              const isSelected = data.food.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem("food", item)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
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

export const EditProfileHobbiesSection = memo(EditProfileHobbiesSectionComponent);
EditProfileHobbiesSection.displayName = "EditProfileHobbiesSection";
