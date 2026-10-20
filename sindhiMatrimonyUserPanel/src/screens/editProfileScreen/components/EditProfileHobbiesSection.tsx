"use client";

import React, { memo, useState, useMemo } from "react";
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
  "Sindhi Curry",
  "Dal Pakwan",
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
  // Input states for each category
  const [customHobbyInput, setCustomHobbyInput] = useState("");
  const [customMusicInput, setCustomMusicInput] = useState("");
  const [customSportsInput, setCustomSportsInput] = useState("");
  const [customFoodInput, setCustomFoodInput] = useState("");

  // Track user-added custom items
  const [addedCustomHobbies, setAddedCustomHobbies] = useState<string[]>([]);
  const [addedCustomMusic, setAddedCustomMusic] = useState<string[]>([]);
  const [addedCustomSports, setAddedCustomSports] = useState<string[]>([]);
  const [addedCustomFood, setAddedCustomFood] = useState<string[]>([]);

  // Helper to compute all custom items (from existing data + locally added)
  const computeCustomList = (
    selectedItems: string[] = [],
    popularList: string[],
    addedCustomList: string[]
  ) => {
    const popularSet = new Set(popularList.map((item) => item.toLowerCase().trim()));
    const fromSelected = (selectedItems || []).filter(
      (item) => !popularSet.has(item.toLowerCase().trim())
    );
    const result: string[] = [];
    const seen = new Set<string>();

    for (const item of [...fromSelected, ...addedCustomList]) {
      const lower = item.toLowerCase().trim();
      if (lower && !seen.has(lower) && !popularSet.has(lower)) {
        seen.add(lower);
        result.push(item);
      }
    }
    return result;
  };

  const customHobbies = useMemo(
    () => computeCustomList(data.hobbies, POPULAR_HOBBIES, addedCustomHobbies),
    [data.hobbies, addedCustomHobbies]
  );

  const customMusic = useMemo(
    () => computeCustomList(data.music, POPULAR_MUSIC, addedCustomMusic),
    [data.music, addedCustomMusic]
  );

  const customSports = useMemo(
    () => computeCustomList(data.sports, POPULAR_SPORTS, addedCustomSports),
    [data.sports, addedCustomSports]
  );

  const customFood = useMemo(
    () => computeCustomList(data.food, POPULAR_FOOD, addedCustomFood),
    [data.food, addedCustomFood]
  );

  // Toggle selection for an item
  const toggleItem = (
    field: keyof HobbiesInterestsFormData,
    value: string
  ) => {
    const list = data[field] || [];
    const lower = value.toLowerCase().trim();
    const exists = list.some((i) => i.toLowerCase().trim() === lower);

    if (exists) {
      onChange({
        [field]: list.filter((i) => i.toLowerCase().trim() !== lower),
      });
    } else {
      onChange({
        [field]: [...list, value],
      });
    }
  };

  // Add custom item(s) to a category
  const addCustomItem = (
    field: keyof HobbiesInterestsFormData,
    rawInput: string,
    popularList: string[],
    setAddedCustom: React.Dispatch<React.SetStateAction<string[]>>,
    setInputState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmedInput = rawInput.trim();
    if (!trimmedInput) return;

    // Support comma-separated items
    const rawTokens = trimmedInput.includes(",")
      ? trimmedInput.split(",")
      : [trimmedInput];
    const popularMap = new Map(
      popularList.map((item) => [item.toLowerCase().trim(), item])
    );

    let currentList = [...(data[field] || [])];
    const newCustomsToAdd: string[] = [];

    for (const token of rawTokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      const lower = trimmed.toLowerCase();

      if (popularMap.has(lower)) {
        const canonical = popularMap.get(lower)!;
        if (!currentList.some((item) => item.toLowerCase().trim() === lower)) {
          currentList.push(canonical);
        }
      } else {
        if (!currentList.some((item) => item.toLowerCase().trim() === lower)) {
          currentList.push(trimmed);
        }
        newCustomsToAdd.push(trimmed);
      }
    }

    onChange({ [field]: currentList });

    if (newCustomsToAdd.length > 0) {
      setAddedCustom((prev) => {
        const updated = [...prev];
        for (const item of newCustomsToAdd) {
          if (!updated.some((u) => u.toLowerCase().trim() === item.toLowerCase().trim())) {
            updated.push(item);
          }
        }
        return updated;
      });
    }

    setInputState("");
  };

  // Remove a custom item entirely
  const removeCustomItem = (
    field: keyof HobbiesInterestsFormData,
    itemToRemove: string,
    setAddedCustom: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const lower = itemToRemove.toLowerCase().trim();
    setAddedCustom((prev) =>
      prev.filter((i) => i.toLowerCase().trim() !== lower)
    );
    const currentList = (data[field] || []).filter(
      (i) => i.toLowerCase().trim() !== lower
    );
    onChange({ [field]: currentList });
  };

  const totalSelectedCount = useMemo(() => {
    return (
      (data.hobbies?.length || 0) +
      (data.music?.length || 0) +
      (data.sports?.length || 0) +
      (data.food?.length || 0)
    );
  }, [data]);

  return (
    <div
      className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}
    >
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
            Hobbies &amp; Interest
          </h2>
          {totalSelectedCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#DB2F3C] border border-red-200">
              {totalSelectedCount} Selected
            </span>
          )}
        </div>
        <span className="text-[11px] sm:text-xs text-stone-500">
          Select or add your favourite hobbies &amp; leisure activities
        </span>
      </div>

      {/* Fields */}
      <div className="p-5 sm:p-7 space-y-2">
        {/* Hobbies */}
        <FormFieldRow label="Hobbies" alignTop>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {/* Popular Hobbies */}
              {POPULAR_HOBBIES.map((hobby) => {
                const isSelected = (data.hobbies || []).some(
                  (h) => h.toLowerCase().trim() === hobby.toLowerCase().trim()
                );
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleItem("hobbies", hobby)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}

              {/* Custom Added Hobbies */}
              {customHobbies.map((hobby) => {
                const isSelected = (data.hobbies || []).some(
                  (h) => h.toLowerCase().trim() === hobby.toLowerCase().trim()
                );
                return (
                  <div
                    key={hobby}
                    className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs transition-colors border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem("hobbies", hobby)}
                      className="cursor-pointer font-medium"
                    >
                      {hobby}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomItem(
                          "hobbies",
                          hobby,
                          setAddedCustomHobbies
                        );
                      }}
                      title={`Remove ${hobby}`}
                      className={`cursor-pointer p-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "hover:bg-red-700 text-white/80 hover:text-white"
                          : "hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom Hobby Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={customHobbyInput}
                onChange={(e) => setCustomHobbyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomItem(
                      "hobbies",
                      customHobbyInput,
                      POPULAR_HOBBIES,
                      setAddedCustomHobbies,
                      setCustomHobbyInput
                    );
                  }
                }}
                placeholder="Add other hobby..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-stone-300 focus:outline-hidden focus:border-[#DB2F3C] transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomItem(
                    "hobbies",
                    customHobbyInput,
                    POPULAR_HOBBIES,
                    setAddedCustomHobbies,
                    setCustomHobbyInput
                  )
                }
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </FormFieldRow>

        {/* Music */}
        <FormFieldRow label="Favourite Music" alignTop>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_MUSIC.map((item) => {
                const isSelected = (data.music || []).some(
                  (m) => m.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem("music", item)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Custom Music */}
              {customMusic.map((item) => {
                const isSelected = (data.music || []).some(
                  (m) => m.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <div
                    key={item}
                    className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs transition-colors border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem("music", item)}
                      className="cursor-pointer font-medium"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomItem("music", item, setAddedCustomMusic);
                      }}
                      title={`Remove ${item}`}
                      className={`cursor-pointer p-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "hover:bg-red-700 text-white/80 hover:text-white"
                          : "hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom Music Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={customMusicInput}
                onChange={(e) => setCustomMusicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomItem(
                      "music",
                      customMusicInput,
                      POPULAR_MUSIC,
                      setAddedCustomMusic,
                      setCustomMusicInput
                    );
                  }
                }}
                placeholder="Add other music / genre..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-stone-300 focus:outline-hidden focus:border-[#DB2F3C] transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomItem(
                    "music",
                    customMusicInput,
                    POPULAR_MUSIC,
                    setAddedCustomMusic,
                    setCustomMusicInput
                  )
                }
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </FormFieldRow>

        {/* Sports */}
        <FormFieldRow label="Sports / Fitness" alignTop>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_SPORTS.map((item) => {
                const isSelected = (data.sports || []).some(
                  (s) => s.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem("sports", item)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Custom Sports */}
              {customSports.map((item) => {
                const isSelected = (data.sports || []).some(
                  (s) => s.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <div
                    key={item}
                    className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs transition-colors border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem("sports", item)}
                      className="cursor-pointer font-medium"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomItem(
                          "sports",
                          item,
                          setAddedCustomSports
                        );
                      }}
                      title={`Remove ${item}`}
                      className={`cursor-pointer p-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "hover:bg-red-700 text-white/80 hover:text-white"
                          : "hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom Sports Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={customSportsInput}
                onChange={(e) => setCustomSportsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomItem(
                      "sports",
                      customSportsInput,
                      POPULAR_SPORTS,
                      setAddedCustomSports,
                      setCustomSportsInput
                    );
                  }
                }}
                placeholder="Add other sport / activity..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-stone-300 focus:outline-hidden focus:border-[#DB2F3C] transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomItem(
                    "sports",
                    customSportsInput,
                    POPULAR_SPORTS,
                    setAddedCustomSports,
                    setCustomSportsInput
                  )
                }
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </FormFieldRow>

        {/* Food */}
        <FormFieldRow label="Favourite Food" alignTop>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_FOOD.map((item) => {
                const isSelected = (data.food || []).some(
                  (f) => f.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem("food", item)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Custom Food */}
              {customFood.map((item) => {
                const isSelected = (data.food || []).some(
                  (f) => f.toLowerCase().trim() === item.toLowerCase().trim()
                );
                return (
                  <div
                    key={item}
                    className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs transition-colors border ${
                      isSelected
                        ? "bg-[#DB2F3C] text-white border-[#DB2F3C] font-medium shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem("food", item)}
                      className="cursor-pointer font-medium"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomItem("food", item, setAddedCustomFood);
                      }}
                      title={`Remove ${item}`}
                      className={`cursor-pointer p-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "hover:bg-red-700 text-white/80 hover:text-white"
                          : "hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom Food Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={customFoodInput}
                onChange={(e) => setCustomFoodInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomItem(
                      "food",
                      customFoodInput,
                      POPULAR_FOOD,
                      setAddedCustomFood,
                      setCustomFoodInput
                    );
                  }
                }}
                placeholder="Add other food / cuisine..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-stone-300 focus:outline-hidden focus:border-[#DB2F3C] transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomItem(
                    "food",
                    customFoodInput,
                    POPULAR_FOOD,
                    setAddedCustomFood,
                    setCustomFoodInput
                  )
                }
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
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

export const EditProfileHobbiesSection = memo(EditProfileHobbiesSectionComponent);
EditProfileHobbiesSection.displayName = "EditProfileHobbiesSection";
