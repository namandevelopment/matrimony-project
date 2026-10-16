"use client";

import React, { memo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { CustomButton } from "@/components";

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

const PERIODS: string[] = ["AM", "PM"];

export const TimeOfBirthModal: React.FC<TimeOfBirthModalProps> = memo(
  ({ isOpen, initialTime, onClose, onSelect }) => {
    const [selectedHour, setSelectedHour] = useState("01");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [selectedPeriod, setSelectedPeriod] = useState("AM");

    // Parse initialTime if present (e.g. "02:02 AM")
    useEffect(() => {
      if (initialTime && initialTime.includes(":") && initialTime.includes(" ")) {
        const [timePart, periodPart] = initialTime.split(" ");
        const [h, m] = timePart.split(":");
        if (h) setSelectedHour(h.padStart(2, "0"));
        if (m) setSelectedMinute(m.padStart(2, "0"));
        if (periodPart) setSelectedPeriod(periodPart.toUpperCase());
      }
    }, [initialTime]);

    if (!isOpen) return null;

    const handleOk = () => {
      onSelect(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window (Matching Screenshot 3) */}
        <div className="relative w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 p-6 z-10 animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
              Select time of birth
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time Picker Columns (Hour : Minute AM/PM) */}
          <div className="my-6 flex items-center justify-center gap-2 sm:gap-3">
            {/* Hours Select */}
            <div className="relative">
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="w-18 h-12 text-center text-base sm:text-lg font-bold text-[#1A1A1A] bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745] cursor-pointer"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xl font-bold text-stone-700">:</span>

            {/* Minutes Select */}
            <div className="relative">
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="w-18 h-12 text-center text-base sm:text-lg font-bold text-[#1A1A1A] bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745] cursor-pointer"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* AM / PM Select */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-18 h-12 text-center text-base sm:text-lg font-bold text-[#1A1A1A] bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#28A745] focus:ring-1 focus:ring-[#28A745] cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions: Ok / Cancel */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <CustomButton
              type="button"
              onClick={handleOk}
              fullWidth
              size="md"
              shape="rounded-xl"
            >
              Ok
            </CustomButton>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-red-300 text-[#DB2F3C] hover:bg-rose-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
);

TimeOfBirthModal.displayName = "TimeOfBirthModal";
