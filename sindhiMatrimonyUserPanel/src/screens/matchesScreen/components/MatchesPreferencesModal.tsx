"use client";

import React, { memo, useState } from "react";
import { X, Check } from "lucide-react";
import { PartnerPreferences } from "../types";

export interface MatchesPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: PartnerPreferences;
  onSavePreferences: (updated: PartnerPreferences) => void;
}

const MatchesPreferencesModalComponent: React.FC<MatchesPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [currentPrefs, setCurrentPrefs] = useState<PartnerPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(currentPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
              Partner Preferences
            </h3>
            <p className="text-xs text-stone-500">
              Matches are curated based on these criteria
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-[13px]">
          {/* Age Range */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Age Range
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={18}
                max={60}
                value={currentPrefs.ageRange[0]}
                onChange={(e) =>
                  setCurrentPrefs({
                    ...currentPrefs,
                    ageRange: [parseInt(e.target.value) || 18, currentPrefs.ageRange[1]],
                  })
                }
                className="w-24 px-3 py-1.5 border border-stone-300 rounded-lg text-center"
              />
              <span className="text-stone-500">to</span>
              <input
                type="number"
                min={18}
                max={70}
                value={currentPrefs.ageRange[1]}
                onChange={(e) =>
                  setCurrentPrefs({
                    ...currentPrefs,
                    ageRange: [currentPrefs.ageRange[0], parseInt(e.target.value) || 30],
                  })
                }
                className="w-24 px-3 py-1.5 border border-stone-300 rounded-lg text-center"
              />
              <span className="text-stone-500">Yrs</span>
            </div>
          </div>

          {/* Height Range */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Height Range
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={currentPrefs.heightRange[0]}
                onChange={(e) =>
                  setCurrentPrefs({
                    ...currentPrefs,
                    heightRange: [e.target.value, currentPrefs.heightRange[1]],
                  })
                }
                className="w-24 px-3 py-1.5 border border-stone-300 rounded-lg text-center"
              />
              <span className="text-stone-500">to</span>
              <input
                type="text"
                value={currentPrefs.heightRange[1]}
                onChange={(e) =>
                  setCurrentPrefs({
                    ...currentPrefs,
                    heightRange: [currentPrefs.heightRange[0], e.target.value],
                  })
                }
                className="w-24 px-3 py-1.5 border border-stone-300 rounded-lg text-center"
              />
            </div>
          </div>

          {/* Community */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Community / Caste
            </label>
            <input
              type="text"
              value={currentPrefs.community}
              onChange={(e) =>
                setCurrentPrefs({ ...currentPrefs, community: e.target.value })
              }
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>

          {/* Preferred States */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Locations (States)
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentPrefs.state.map((st) => (
                <span
                  key={st}
                  className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200"
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Annual Income Expectation
            </label>
            <input
              type="text"
              value={currentPrefs.annualIncome}
              onChange={(e) =>
                setCurrentPrefs({ ...currentPrefs, annualIncome: e.target.value })
              }
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Update Preferences</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MatchesPreferencesModal = memo(MatchesPreferencesModalComponent);
MatchesPreferencesModal.displayName = "MatchesPreferencesModal";
export default MatchesPreferencesModal;
