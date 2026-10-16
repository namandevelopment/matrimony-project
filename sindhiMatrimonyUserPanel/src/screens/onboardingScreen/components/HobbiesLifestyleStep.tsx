"use client";

import React, { memo, useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { CustomButton } from "@/components";
import { LifestyleTab, LifestyleFormData } from "../types";
import {
  SPORTS_ACTIVITIES,
  CUISINES,
  HOBBIES_LIST,
  MUSIC_GENRES,
} from "../data";

export interface HobbiesLifestyleStepProps {
  onSubmit: (data: LifestyleFormData) => void;
  onSkip?: () => void;
}

export const HobbiesLifestyleStep: React.FC<HobbiesLifestyleStepProps> = memo(
  ({ onSubmit }) => {
    const [activeTab, setActiveTab] = useState<LifestyleTab>("sports");
    const [showAllSports, setShowAllSports] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Selected collections
    const [selectedSports, setSelectedSports] = useState<string[]>([
      "Badminton",
      "Cricket",
    ]);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
      "Sindhi",
      "I'm A Foodie",
    ]);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
      "Traveling",
      "Music",
    ]);
    const [selectedMusic, setSelectedMusic] = useState<string[]>([
      "Bollywood Songs",
      "Sufi",
    ]);

    const toggleSelection = (
      item: string,
      selectedList: string[],
      setList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      setList((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    };

    const sportsToDisplay = showAllSports
      ? SPORTS_ACTIVITIES
      : SPORTS_ACTIVITIES.slice(0, 11);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmit({
          sports: selectedSports,
          food: selectedCuisines,
          hobbies: selectedHobbies,
          music: selectedMusic,
        });
      }, 400);
    };

    return (
      <div className="w-full text-left">
        {/* Tab Navigation Row (Matching Screenshot 1) */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-6 overflow-x-auto gap-3 text-xs sm:text-sm font-semibold text-stone-500">
          <button
            type="button"
            onClick={() => setActiveTab("hobbies")}
            className={`pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "hobbies"
                ? "text-[#DB2F3C] font-bold"
                : "hover:text-stone-800"
            }`}
          >
            Hobbies & Interests
            {activeTab === "hobbies" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB2F3C] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("music")}
            className={`pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "music"
                ? "text-[#DB2F3C] font-bold"
                : "hover:text-stone-800"
            }`}
          >
            Music
            {activeTab === "music" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB2F3C] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sports")}
            className={`pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "sports"
                ? "text-[#DB2F3C] font-bold"
                : "hover:text-stone-800"
            }`}
          >
            Sports And Fitness
            {activeTab === "sports" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB2F3C] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("food")}
            className={`pb-2.5 relative transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "food"
                ? "text-[#DB2F3C] font-bold"
                : "hover:text-stone-800"
            }`}
          >
            Food
            {activeTab === "food" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB2F3C] rounded-full" />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: SPORTS AND FITNESS (Active by default matching Screenshot 1) */}
          {activeTab === "sports" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Section 1: Select Sports/ Fitness Activities/ Games */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-3">
                  Select Sports/ Fitness Activities/ Games
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {sportsToDisplay.map((sport) => {
                    const isSelected = selectedSports.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() =>
                          toggleSelection(sport, selectedSports, setSelectedSports)
                        }
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                            : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                        }`}
                      >
                        {sport}
                      </button>
                    );
                  })}
                </div>

                {/* Show more toggle */}
                <button
                  type="button"
                  onClick={() => setShowAllSports((prev) => !prev)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#DB2F3C] hover:underline cursor-pointer"
                >
                  <span>{showAllSports ? "Show less" : "Show more"}</span>
                  {showAllSports ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Section 2: Choose your favourite cuisine */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-3">
                  Choose your favourite cuisine
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {CUISINES.map((cuisine) => {
                    const isSelected = selectedCuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            cuisine,
                            selectedCuisines,
                            setSelectedCuisines
                          )
                        }
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                            : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                        }`}
                      >
                        {cuisine}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOBBIES & INTERESTS */}
          {activeTab === "hobbies" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-3">
                Select your hobbies & favorite activities
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {HOBBIES_LIST.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() =>
                        toggleSelection(hobby, selectedHobbies, setSelectedHobbies)
                      }
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                          : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                      }`}
                    >
                      {hobby}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MUSIC */}
          {activeTab === "music" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-3">
                Choose the music genres you listen to
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {MUSIC_GENRES.map((music) => {
                  const isSelected = selectedMusic.includes(music);
                  return (
                    <button
                      key={music}
                      type="button"
                      onClick={() =>
                        toggleSelection(music, selectedMusic, setSelectedMusic)
                      }
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                          : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                      }`}
                    >
                      {music}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FOOD */}
          {activeTab === "food" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] mb-3">
                Choose your favourite cuisines & food habits
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {CUISINES.map((cuisine) => {
                  const isSelected = selectedCuisines.includes(cuisine);
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() =>
                        toggleSelection(
                          cuisine,
                          selectedCuisines,
                          setSelectedCuisines
                        )
                      }
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FEE2E2] border border-[#FCA5A5] text-[#1A1A1A] font-semibold shadow-2xs"
                          : "bg-white border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                      }`}
                    >
                      {cuisine}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <CustomButton
              type="submit"
              fullWidth
              size="lg"
              shape="rounded-2xl"
              isLoading={isSubmitting}
              loadingText="Saving interests..."
            >
              Submit
            </CustomButton>
          </div>
        </form>
      </div>
    );
  }
);

HobbiesLifestyleStep.displayName = "HobbiesLifestyleStep";
