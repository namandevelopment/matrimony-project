"use client";

import React, { memo } from "react";
import { X, Printer, Sparkles, CheckCircle2 } from "lucide-react";
import { HoroscopeProfileData, KundaliPlanetaryPosition } from "../types";
import { MOCK_KUNDALI_PLANETS } from "../staticData";

export interface HoroscopeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HoroscopeProfileData;
  planets?: KundaliPlanetaryPosition[];
  className?: string;
}

const HoroscopeChartModalComponent: React.FC<HoroscopeChartModalProps> = ({
  isOpen,
  onClose,
  data,
  planets = MOCK_KUNDALI_PLANETS,
  className = "",
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white px-5 sm:px-7 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DB2F3C] flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Vedic Horoscope Chart (Kundali / Rasi)
              </h2>
              <p className="text-[12.5px] text-stone-300">
                {data.name} &bull; DOB: {data.horoscopeInfo.dateOfBirth} &bull; Time: {data.horoscopeInfo.timeOfBirth}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="text-stone-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Print Chart"
            >
              <span title="Print Chart">
                <Printer className="w-5 h-5" />
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Birth Details Overview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-[13px]">
            <div>
              <span className="text-stone-400 block text-[11.5px] uppercase font-semibold">Birth Place</span>
              <span className="font-semibold text-stone-800">{data.horoscopeInfo.placeOfBirth}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11.5px] uppercase font-semibold">Moon Sign (Raasi)</span>
              <span className="font-semibold text-stone-800">{data.religiousInfo.raasi}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11.5px] uppercase font-semibold">Birth Star (Nakshatra)</span>
              <span className="font-semibold text-stone-800">{data.religiousInfo.star}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11.5px] uppercase font-semibold">Manglik Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Non-Manglik
              </span>
            </div>
          </div>

          {/* Kundali Chart Graphic (North Indian Vedic Diamond Layout) */}
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Left: Interactive North-Indian Vedic Chart SVG */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center">
              <h3 className="text-[14px] font-bold text-stone-700 mb-2">Lagna / Rasi Kundali</h3>
              <div className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] relative bg-amber-50/40 rounded-xl border-2 border-stone-800 shadow-md p-1">
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full text-stone-800 font-sans select-none"
                >
                  {/* Outer border */}
                  <rect x="2" y="2" width="296" height="296" fill="none" stroke="#292524" strokeWidth="2" />

                  {/* Diagonal X lines */}
                  <line x1="2" y1="2" x2="298" y2="298" stroke="#292524" strokeWidth="1.5" />
                  <line x1="298" y1="2" x2="2" y2="298" stroke="#292524" strokeWidth="1.5" />

                  {/* Inner diamond connecting midpoints */}
                  <polygon
                    points="150,2 298,150 150,298 2,150"
                    fill="none"
                    stroke="#292524"
                    strokeWidth="1.5"
                  />

                  {/* House 1 (Top Center Diamond - Ascendant / Lagna) */}
                  <text x="150" y="35" textAnchor="middle" fontSize="10" fill="#78716C">H1</text>
                  <text x="150" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B91C1C">Lagna (Sc)</text>
                  <text x="150" y="75" textAnchor="middle" fontSize="10" fill="#1C1917">Moon (Ch)</text>

                  {/* House 2 (Top Left Triangle) */}
                  <text x="80" y="35" textAnchor="middle" fontSize="10" fill="#78716C">H2</text>
                  <text x="80" y="55" textAnchor="middle" fontSize="10" fill="#78716C">Sagittarius</text>

                  {/* House 3 (Left Top Triangle) */}
                  <text x="40" y="75" textAnchor="middle" fontSize="10" fill="#78716C">H3</text>
                  <text x="45" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">Ketu</text>

                  {/* House 4 (Left Diamond) */}
                  <text x="75" y="150" textAnchor="middle" fontSize="10" fill="#78716C">H4</text>
                  <text x="75" y="165" textAnchor="middle" fontSize="10" fill="#78716C">Aquarius</text>

                  {/* House 5 (Left Bottom Triangle) */}
                  <text x="40" y="225" textAnchor="middle" fontSize="10" fill="#78716C">H5</text>
                  <text x="45" y="240" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">Mer, Jup</text>

                  {/* House 6 (Bottom Left Triangle) */}
                  <text x="80" y="265" textAnchor="middle" fontSize="10" fill="#78716C">H6</text>
                  <text x="80" y="280" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">Sun, Sat</text>

                  {/* House 7 (Bottom Center Diamond) */}
                  <text x="150" y="265" textAnchor="middle" fontSize="10" fill="#78716C">H7</text>
                  <text x="150" y="235" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1C1917">Venus (Sh)</text>
                  <text x="150" y="250" textAnchor="middle" fontSize="10" fill="#78716C">Taurus</text>

                  {/* House 8 (Bottom Right Triangle) */}
                  <text x="220" y="265" textAnchor="middle" fontSize="10" fill="#78716C">H8</text>
                  <text x="220" y="280" textAnchor="middle" fontSize="10" fill="#78716C">Gemini</text>

                  {/* House 9 (Right Bottom Triangle) */}
                  <text x="260" y="225" textAnchor="middle" fontSize="10" fill="#78716C">H9</text>
                  <text x="255" y="240" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">Rahu</text>

                  {/* House 10 (Right Center Diamond) */}
                  <text x="225" y="150" textAnchor="middle" fontSize="10" fill="#78716C">H10</text>
                  <text x="225" y="165" textAnchor="middle" fontSize="10" fill="#78716C">Leo</text>

                  {/* House 11 (Right Top Triangle) */}
                  <text x="260" y="75" textAnchor="middle" fontSize="10" fill="#78716C">H11</text>
                  <text x="260" y="95" textAnchor="middle" fontSize="10" fill="#78716C">Virgo</text>

                  {/* House 12 (Top Right Triangle) */}
                  <text x="220" y="35" textAnchor="middle" fontSize="10" fill="#78716C">H12</text>
                  <text x="220" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">Mars (R)</text>
                </svg>
              </div>
            </div>

            {/* Right: Planetary Positions Table */}
            <div className="flex-1 w-full overflow-x-auto">
              <h3 className="text-[14px] font-bold text-stone-700 mb-2">Planetary Positions (Graha Sthiti)</h3>
              <table className="w-full text-left text-[13px] border border-stone-200 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Planet</th>
                    <th className="py-2.5 px-3">Sign (Raasi)</th>
                    <th className="py-2.5 px-3">Degree</th>
                    <th className="py-2.5 px-3">House</th>
                    <th className="py-2.5 px-3">Motion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {planets.map((p, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-2 px-3 font-semibold text-stone-800">{p.planet}</td>
                      <td className="py-2 px-3 text-stone-600">{p.sign}</td>
                      <td className="py-2 px-3 font-mono text-stone-700">{p.degree}</td>
                      <td className="py-2 px-3 text-stone-600">House {p.house}</td>
                      <td className="py-2 px-3">
                        {p.isRetrograde ? (
                          <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            Retrograde
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-stone-500">Direct</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-7 py-3 flex items-center justify-between">
          <span className="text-[12.5px] text-stone-500">
            Ayanamsha: {data.horoscopeInfo.ayanamsha || "Lahiri"}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-[13.5px] font-semibold rounded-md shadow-xs transition-colors"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
};

export const HoroscopeChartModal = memo(HoroscopeChartModalComponent);
HoroscopeChartModal.displayName = "HoroscopeChartModal";
