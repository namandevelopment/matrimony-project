"use client";

import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  HelpCircle,
} from "lucide-react";

export interface TimeOfBirthModalProps {
  isOpen: boolean;
  initialTime?: string;
  onClose: () => void;
  onSelect: (timeStr: string) => void;
}

const HOURS: string[] = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return h < 10 ? `0${h}` : `${h}`;
});

const MINUTES: string[] = Array.from({ length: 60 }, (_, i) => {
  return i < 10 ? `0${i}` : `${i}`;
});

const QUICK_MINUTES = ["00", "15", "30", "45"];

const QUICK_PRESETS = [
  { label: "Morning", time: "06:30 AM", icon: Sunrise },
  { label: "Noon", time: "12:00 PM", icon: Sun },
  { label: "Evening", time: "06:30 PM", icon: Sunset },
  { label: "Night", time: "10:15 PM", icon: Moon },
];

export const TimeOfBirthModal: React.FC<TimeOfBirthModalProps> = memo(
  ({ isOpen, initialTime, onClose, onSelect }) => {
    const [selectedHour, setSelectedHour] = useState("02");
    const [selectedMinute, setSelectedMinute] = useState("02");
    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
    const [isApproximate, setIsApproximate] = useState(false);

    // Parse initialTime (e.g. "02:02 AM")
    useEffect(() => {
      if (initialTime && initialTime.includes(":") && initialTime.includes(" ")) {
        const [timePart, periodPart] = initialTime.split(" ");
        const [h, m] = timePart.split(":");
        if (h) setSelectedHour(h.padStart(2, "0"));
        if (m) setSelectedMinute(m.padStart(2, "0"));
        if (periodPart) {
          const p = periodPart.toUpperCase();
          if (p === "AM" || p === "PM") setSelectedPeriod(p);
        }
      }
    }, [initialTime, isOpen]);

    // Keyboard support: Escape closes modal, Enter confirms
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        } else if (e.key === "Enter") {
          handleConfirm();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedHour, selectedMinute, selectedPeriod, isApproximate]);

    // Increment / Decrement Handlers
    const incrementHour = useCallback(() => {
      setSelectedHour((prev) => {
        const val = parseInt(prev, 10);
        const next = val === 12 ? 1 : val + 1;
        return next < 10 ? `0${next}` : `${next}`;
      });
      setIsApproximate(false);
    }, []);

    const decrementHour = useCallback(() => {
      setSelectedHour((prev) => {
        const val = parseInt(prev, 10);
        const next = val === 1 ? 12 : val - 1;
        return next < 10 ? `0${next}` : `${next}`;
      });
      setIsApproximate(false);
    }, []);

    const incrementMinute = useCallback(() => {
      setSelectedMinute((prev) => {
        const val = parseInt(prev, 10);
        const next = val === 59 ? 0 : val + 1;
        return next < 10 ? `0${next}` : `${next}`;
      });
      setIsApproximate(false);
    }, []);

    const decrementMinute = useCallback(() => {
      setSelectedMinute((prev) => {
        const val = parseInt(prev, 10);
        const next = val === 0 ? 59 : val - 1;
        return next < 10 ? `0${next}` : `${next}`;
      });
      setIsApproximate(false);
    }, []);

    const handleApplyPreset = useCallback((presetTime: string) => {
      const [timePart, periodPart] = presetTime.split(" ");
      const [h, m] = timePart.split(":");
      setSelectedHour(h.padStart(2, "0"));
      setSelectedMinute(m.padStart(2, "0"));
      setSelectedPeriod(periodPart as "AM" | "PM");
      setIsApproximate(false);
    }, []);

    const handleApproximateToggle = useCallback(() => {
      setIsApproximate((prev) => {
        const next = !prev;
        if (next) {
          // Set to standard noon
          setSelectedHour("12");
          setSelectedMinute("00");
          setSelectedPeriod("PM");
        }
        return next;
      });
    }, []);

    const handleConfirm = useCallback(() => {
      const timeString = isApproximate
        ? `${selectedHour}:${selectedMinute} ${selectedPeriod} (Approx.)`
        : `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
      onSelect(timeString);
      onClose();
    }, [selectedHour, selectedMinute, selectedPeriod, isApproximate, onSelect, onClose]);

    // Astrological Period / Time of Day calculation
    const timeOfDayInfo = useMemo(() => {
      const hourNum = parseInt(selectedHour, 10);
      const isAm = selectedPeriod === "AM";

      if (isAm) {
        if (hourNum === 12 || hourNum <= 3) {
          return { label: "Midnight / Ratri (रात्रि)", icon: Moon, color: "text-indigo-600 bg-indigo-50" };
        }
        if (hourNum >= 4 && hourNum <= 5) {
          return { label: "Brahma Muhurta (Early Dawn)", icon: Sunrise, color: "text-amber-600 bg-amber-50" };
        }
        return { label: "Morning / Subah (सुबह)", icon: Sun, color: "text-amber-700 bg-amber-50" };
      } else {
        if (hourNum === 12 || hourNum <= 3) {
          return { label: "Afternoon / Dopahar (दोपहर)", icon: Sun, color: "text-orange-600 bg-orange-50" };
        }
        if (hourNum >= 4 && hourNum <= 7) {
          return { label: "Evening / Sandhya (संध्या)", icon: Sunset, color: "text-rose-600 bg-rose-50" };
        }
        return { label: "Night / Ratri (रात्रि)", icon: Moon, color: "text-indigo-700 bg-indigo-50" };
      }
    }, [selectedHour, selectedPeriod]);

    if (!isOpen) return null;

    const TimeIcon = timeOfDayInfo.icon;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="time-of-birth-modal-title"
      >
        <div
          className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Header with Gradient Accent */}
          <div className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-stone-100 flex items-start justify-between bg-gradient-to-b from-stone-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/60 flex items-center justify-center text-[#DB2F3C] shadow-2xs shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="time-of-birth-modal-title"
                  className="text-base sm:text-lg font-bold text-stone-900 leading-tight font-heading"
                >
                  Select Time of Birth
                </h3>
                <p className="text-[11.5px] text-stone-500 mt-0.5">
                  Helps calculate accurate Kundali &amp; Guna Milan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer -mr-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* 2. Big Digital Clock Showcase Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 p-4 text-center text-white shadow-md border border-stone-800">
              {/* Subtle astrological glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                Selected Birth Time
              </span>

              {/* Big Digital Numbers */}
              <div className="my-1.5 flex items-center justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-xs">
                  {selectedHour}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-red-400 animate-pulse select-none">
                  :
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-xs">
                  {selectedMinute}
                </span>
                <span className="ml-1.5 text-xl sm:text-2xl font-black text-rose-400">
                  {selectedPeriod}
                </span>
              </div>

              {/* Astrological Muhurta / Period Tag */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-stone-200 border border-white/10 backdrop-blur-md">
                <TimeIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{timeOfDayInfo.label}</span>
              </div>
            </div>

            {/* 3. Ergonomic Time Selector Columns (Hours, Minutes, AM/PM) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 items-center">
              {/* Column 1: Hours */}
              <div className="flex flex-col items-center">
                <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Hours
                </span>

                {/* Up Arrow */}
                <button
                  type="button"
                  onClick={incrementHour}
                  aria-label="Increase hour"
                  className="w-full py-1.5 rounded-t-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-b-0 border-stone-200"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Custom Styled Select / Display Box */}
                <div className="relative w-full">
                  <select
                    value={selectedHour}
                    onChange={(e) => {
                      setSelectedHour(e.target.value);
                      setIsApproximate(false);
                    }}
                    aria-label="Select hour"
                    className="w-full h-12 text-center text-lg sm:text-xl font-bold font-mono text-stone-900 bg-white border border-stone-300 outline-none focus:border-[#DB2F3C] focus:ring-2 focus:ring-red-100 cursor-pointer appearance-none"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Down Arrow */}
                <button
                  type="button"
                  onClick={decrementHour}
                  aria-label="Decrease hour"
                  className="w-full py-1.5 rounded-b-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-t-0 border-stone-200"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Column 2: Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Minutes
                </span>

                {/* Up Arrow */}
                <button
                  type="button"
                  onClick={incrementMinute}
                  aria-label="Increase minute"
                  className="w-full py-1.5 rounded-t-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-b-0 border-stone-200"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Custom Styled Select / Display Box */}
                <div className="relative w-full">
                  <select
                    value={selectedMinute}
                    onChange={(e) => {
                      setSelectedMinute(e.target.value);
                      setIsApproximate(false);
                    }}
                    aria-label="Select minute"
                    className="w-full h-12 text-center text-lg sm:text-xl font-bold font-mono text-stone-900 bg-white border border-stone-300 outline-none focus:border-[#DB2F3C] focus:ring-2 focus:ring-red-100 cursor-pointer appearance-none"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Down Arrow */}
                <button
                  type="button"
                  onClick={decrementMinute}
                  aria-label="Decrease minute"
                  className="w-full py-1.5 rounded-b-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-t-0 border-stone-200"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Column 3: AM / PM Segmented Switch */}
              <div className="flex flex-col items-center h-full justify-between">
                <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Period
                </span>

                <div className="w-full flex-1 flex flex-col gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPeriod("AM");
                      setIsApproximate(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                      selectedPeriod === "AM"
                        ? "bg-[#DB2F3C] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                  >
                    <Sunrise className="w-3.5 h-3.5" />
                    <span>AM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPeriod("PM");
                      setIsApproximate(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                      selectedPeriod === "PM"
                        ? "bg-[#DB2F3C] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>PM</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Quick Minute Step Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">
                Quick Minute Select:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedMinute(m);
                      setIsApproximate(false);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedMinute === m
                        ? "bg-red-50 border-red-300 text-[#DB2F3C] font-bold"
                        : "bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    :{m}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Astrological Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">
                Popular Times:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUICK_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isMatching =
                    `${selectedHour}:${selectedMinute} ${selectedPeriod}` ===
                    preset.time;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset.time)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        isMatching
                          ? "bg-red-50 border-red-300 text-[#DB2F3C]"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Approximate Time Helper Checkbox */}
            <div
              onClick={handleApproximateToggle}
              className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2.5 cursor-pointer hover:bg-amber-50 transition-colors select-none"
            >
              <input
                type="checkbox"
                checked={isApproximate}
                onChange={handleApproximateToggle}
                className="mt-0.5 w-4 h-4 rounded text-[#DB2F3C] focus:ring-red-200 cursor-pointer"
              />
              <div className="text-xs text-amber-900">
                <span className="font-semibold block">
                  Don&apos;t know exact time of birth?
                </span>
                <span className="text-[11px] text-amber-800">
                  Select approximate time (defaults to 12:00 PM standard chart).
                </span>
              </div>
            </div>

            {/* 7. Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#DB2F3C] via-[#E53935] to-[#B71F2A] hover:from-[#B71F2A] hover:to-[#961720] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Time</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimeOfBirthModal.displayName = "TimeOfBirthModal";
export default TimeOfBirthModal;
