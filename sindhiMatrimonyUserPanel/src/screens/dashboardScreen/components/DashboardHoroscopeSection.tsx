"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { apiFetch, ApiURL } from "@/redux/apiService";
import {
  Sparkles,
  Heart,
  Briefcase,
  Activity,
  Compass,
  Star,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Flame,
  Droplets,
  Wind,
  Mountain,
  MessageCircle,
  X,
} from "lucide-react";

export interface ZodiacRasi {
  id: string;
  nameEn: string;
  nameHi: string;
  dateRange: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  elementHi: string;
  rulingPlanet: string;
  rulingPlanetHi: string;
  ratingStars: number;
  loveMarriageForecast: string;
  careerFinanceForecast: string;
  healthWellnessForecast: string;
  luckyNumber: string;
  luckyColor: string;
  luckyColorHex: string;
  shubhMuhurat: string;
  bestCompatSign: string;
  todayTip: string;
}

export const ZODIAC_RASIS: ZodiacRasi[] = [
  {
    id: "aries",
    nameEn: "Aries",
    nameHi: "मेष (Mesh)",
    dateRange: "Mar 21 - Apr 19",
    symbol: "♈",
    element: "Fire",
    elementHi: "अग्नि तत्व",
    rulingPlanet: "Mars",
    rulingPlanetHi: "मंगल देव",
    ratingStars: 4.5,
    loveMarriageForecast:
      "Venus and Moon align auspiciously. High possibility of pleasant conversations with matrimonial prospects. Mutual understanding and emotional connection will deepen today.",
    careerFinanceForecast:
      "Dynamic energy aids key negotiations and creative ideas. An unexpected financial opportunity through an acquaintance may arise.",
    healthWellnessForecast:
      "Vitality is strong. Maintain hydration and take evening leisure walks with family for restful sleep.",
    luckyNumber: "9, 18",
    luckyColor: "Crimson Red / केसरिया",
    luckyColorHex: "#DB2F3C",
    shubhMuhurat: "10:15 AM - 11:45 AM",
    bestCompatSign: "Leo (सिंह) & Sagittarius (धनु)",
    todayTip: "Be open and articulate in matrimonial communications today.",
  },
  {
    id: "taurus",
    nameEn: "Taurus",
    nameHi: "वृषभ (Vrishabh)",
    dateRange: "Apr 20 - May 20",
    symbol: "♉",
    element: "Earth",
    elementHi: "पृथ्वी तत्व",
    rulingPlanet: "Venus",
    rulingPlanetHi: "शुक्र देव",
    ratingStars: 5,
    loveMarriageForecast:
      "Ruled by Venus, today brings utmost romance and harmony. Elders in the family will enthusiastically support match proposals and horoscope compatibility discussions.",
    careerFinanceForecast:
      "Financial stability strengthens. Thoughtful long-term investments will yield favorable returns.",
    healthWellnessForecast:
      "Peaceful mental state. A serene atmosphere at home uplifts overall wellbeing.",
    luckyNumber: "6, 15",
    luckyColor: "Lotus Pink / गुलाबी",
    luckyColorHex: "#E11D48",
    shubhMuhurat: "02:30 PM - 04:00 PM",
    bestCompatSign: "Virgo (कन्या) & Capricorn (मकर)",
    todayTip: "Express your genuine expectations with prospective partners gently.",
  },
  {
    id: "gemini",
    nameEn: "Gemini",
    nameHi: "मिथुन (Mithun)",
    dateRange: "May 21 - Jun 20",
    symbol: "♊",
    element: "Air",
    elementHi: "वायु तत्व",
    rulingPlanet: "Mercury",
    rulingPlanetHi: "बुध देव",
    ratingStars: 4,
    loveMarriageForecast:
      "Your witty communication and charisma shine bright. An interesting matrimonial profile from an intellectual background might respond to your interest today.",
    careerFinanceForecast:
      "Productive multi-tasking day. Communication with overseas or distant clients will be very rewarding.",
    healthWellnessForecast:
      "Mind is active; practice 10 minutes of deep meditation to ease restlessness.",
    luckyNumber: "5, 14",
    luckyColor: "Emerald Green / पन्ना हरा",
    luckyColorHex: "#059669",
    shubhMuhurat: "09:00 AM - 10:30 AM",
    bestCompatSign: "Libra (तुला) & Aquarius (कुंभ)",
    todayTip: "Clear, transparent dialogue will resolve any partner preference doubts.",
  },
  {
    id: "cancer",
    nameEn: "Cancer",
    nameHi: "कर्क (Kark)",
    dateRange: "Jun 21 - Jul 22",
    symbol: "♋",
    element: "Water",
    elementHi: "जल तत्व",
    rulingPlanet: "Moon",
    rulingPlanetHi: "चंद्रमा",
    ratingStars: 4.5,
    loveMarriageForecast:
      "Emotional warmth prevails. Family discussions regarding marriage arrangements or horoscope matching will progress with deep mutual respect.",
    careerFinanceForecast:
      "Co-workers will be exceptionally supportive. Intuitive decisions at work prove accurate.",
    healthWellnessForecast:
      "Nourishing homemade food and bonding with close loved ones will restore your energy.",
    luckyNumber: "2, 11",
    luckyColor: "Pearl White / दूधिया सफेद",
    luckyColorHex: "#F3F4F6",
    shubhMuhurat: "04:15 PM - 05:45 PM",
    bestCompatSign: "Scorpio (वृश्चिक) & Pisces (मीन)",
    todayTip: "Trust your gut feeling when reviewing prospective profiles today.",
  },
  {
    id: "leo",
    nameEn: "Leo",
    nameHi: "सिंह (Singh)",
    dateRange: "Jul 23 - Aug 22",
    symbol: "♌",
    element: "Fire",
    elementHi: "अग्नि तत्व",
    rulingPlanet: "Sun",
    rulingPlanetHi: "सूर्य देव",
    ratingStars: 5,
    loveMarriageForecast:
      "Surya's radiant blessing brings immense charm. High match response rate expected. Profiles from respectable family traditions will appreciate your confidence and values.",
    careerFinanceForecast:
      "Leadership qualities will be recognized. Splendid day for presentations and pitching new initiatives.",
    healthWellnessForecast:
      "High stamina and glowing spirits throughout the day.",
    luckyNumber: "1, 10",
    luckyColor: "Golden Amber / सुनहरा",
    luckyColorHex: "#D97706",
    shubhMuhurat: "11:30 AM - 01:00 PM",
    bestCompatSign: "Aries (मेष) & Sagittarius (धनु)",
    todayTip: "Take the initiative to send interest or follow-up with shortlisted profiles.",
  },
  {
    id: "virgo",
    nameEn: "Virgo",
    nameHi: "कन्या (Kanya)",
    dateRange: "Aug 23 - Sep 22",
    symbol: "♍",
    element: "Earth",
    elementHi: "पृथ्वी तत्व",
    rulingPlanet: "Mercury",
    rulingPlanetHi: "बुध देव",
    ratingStars: 4,
    loveMarriageForecast:
      "Analytical clarity helps you assess partner compatibility objectively. A prospective partner with similar life goals will impress you with their sincerity.",
    careerFinanceForecast:
      "Attention to detail resolves a long-pending workflow obstacle. Praises from seniors expected.",
    healthWellnessForecast:
      "Maintain a wholesome digestive diet and avoid late-night caffeine.",
    luckyNumber: "5, 23",
    luckyColor: "Sage Green / पिस्ता",
    luckyColorHex: "#10B981",
    shubhMuhurat: "08:15 AM - 09:45 AM",
    bestCompatSign: "Taurus (वृषभ) & Capricorn (मकर)",
    todayTip: "Look at the larger emotional picture rather than minor trivial details.",
  },
  {
    id: "libra",
    nameEn: "Libra",
    nameHi: "तुला (Tula)",
    dateRange: "Sep 23 - Oct 22",
    symbol: "♎",
    element: "Air",
    elementHi: "वायु तत्व",
    rulingPlanet: "Venus",
    rulingPlanetHi: "शुक्र देव",
    ratingStars: 4.5,
    loveMarriageForecast:
      "Sweet planetary harmony enhances your romantic prospects. Favorable day for exchanging horoscopes, family calls, and planning introductory virtual meets.",
    careerFinanceForecast:
      "Partnerships and collaborative projects thrive. Diplomatic skills bring financial consensus.",
    healthWellnessForecast:
      "Equilibrium between work and rest brings glowing composure.",
    luckyNumber: "6, 24",
    luckyColor: "Sky Blue / आसमानी नीला",
    luckyColorHex: "#0284C7",
    shubhMuhurat: "03:00 PM - 04:30 PM",
    bestCompatSign: "Gemini (मिथुन) & Aquarius (कुंभ)",
    todayTip: "A polite, warm greeting message can spark an enduring bond.",
  },
  {
    id: "scorpio",
    nameEn: "Scorpio",
    nameHi: "वृश्चिक (Vrishchik)",
    dateRange: "Oct 23 - Nov 21",
    symbol: "♏",
    element: "Water",
    elementHi: "जल तत्व",
    rulingPlanet: "Mars",
    rulingPlanetHi: "मंगल देव",
    ratingStars: 4,
    loveMarriageForecast:
      "Deep emotional loyalty will be valued. A thoughtful prospective match who values cultural ethos and family heritage will connect strongly with you.",
    careerFinanceForecast:
      "Focus and research uncover a profitable strategy. Keep confidential business plans guarded.",
    healthWellnessForecast:
      "Practice pranayama or mindful breathing to release pent-up stress.",
    luckyNumber: "9, 18",
    luckyColor: "Deep Maroon / महरून",
    luckyColorHex: "#991B1B",
    shubhMuhurat: "01:15 PM - 02:45 PM",
    bestCompatSign: "Cancer (कर्क) & Pisces (मीन)",
    todayTip: "Be open to sharing your authentic life passions with suitable matches.",
  },
  {
    id: "sagittarius",
    nameEn: "Sagittarius",
    nameHi: "धनु (Dhanu)",
    dateRange: "Nov 22 - Dec 21",
    symbol: "♐",
    element: "Fire",
    elementHi: "अग्नि तत्व",
    rulingPlanet: "Jupiter",
    rulingPlanetHi: "बृहस्पति (गुरु)",
    ratingStars: 5,
    loveMarriageForecast:
      "Guru's divine grace shines bright upon matrimonial affairs. Auspicious period for finalising relationship milestones, Gun Milan, and wedding preparations.",
    careerFinanceForecast:
      "Optimism and expansive thinking attract fortunate contracts. Mentorship from an elder brings fruitful gains.",
    healthWellnessForecast:
      "High vitality and good cheer. Outdoor activities will invigorate you.",
    luckyNumber: "3, 12",
    luckyColor: "Saffron Yellow / पीला",
    luckyColorHex: "#EAB308",
    shubhMuhurat: "10:00 AM - 11:30 AM",
    bestCompatSign: "Aries (मेष) & Leo (सिंह)",
    todayTip: "Share your philosophical and spiritual viewpoints with prospective matches.",
  },
  {
    id: "capricorn",
    nameEn: "Capricorn",
    nameHi: "मकर (Makar)",
    dateRange: "Dec 22 - Jan 19",
    symbol: "♑",
    element: "Earth",
    elementHi: "पृथ्वी तत्व",
    rulingPlanet: "Saturn",
    rulingPlanetHi: "शनि देव",
    ratingStars: 4,
    loveMarriageForecast:
      "Practicality and dedication impress prospective in-laws and partners. Sincere, grounded matches from well-settled family backgrounds align with your vision.",
    careerFinanceForecast:
      "Steadfast perseverance is rewarded with career elevation. Solid long-term asset building progresses.",
    healthWellnessForecast:
      "Pay gentle attention to posture and joint flexibility with light stretches.",
    luckyNumber: "8, 17",
    luckyColor: "Navy Blue / गहरा नीला",
    luckyColorHex: "#1E3A8A",
    shubhMuhurat: "05:00 PM - 06:30 PM",
    bestCompatSign: "Taurus (वृषभ) & Virgo (कन्या)",
    todayTip: "Show your caring, supportive side along with your ambitious professional drive.",
  },
  {
    id: "aquarius",
    nameEn: "Aquarius",
    nameHi: "कुंभ (Kumbh)",
    dateRange: "Jan 20 - Feb 18",
    symbol: "♒",
    element: "Air",
    elementHi: "वायु तत्व",
    rulingPlanet: "Saturn",
    rulingPlanetHi: "शनि देव",
    ratingStars: 4.5,
    loveMarriageForecast:
      "Open-minded and progressive prospects will appreciate your progressive mindset. An engaging conversation about shared humanitarian values will spark chemistry.",
    careerFinanceForecast:
      "Innovative, out-of-the-box ideas gain widespread acclaim in your team.",
    healthWellnessForecast:
      "Ensure plenty of water intake and take frequent screen breaks.",
    luckyNumber: "4, 13",
    luckyColor: "Electric Violet / जामुनी",
    luckyColorHex: "#7C3AED",
    shubhMuhurat: "12:00 PM - 01:30 PM",
    bestCompatSign: "Gemini (मिथुन) & Libra (तुला)",
    todayTip: "Value intellectual compatibility as a cornerstone of your bond.",
  },
  {
    id: "pisces",
    nameEn: "Pisces",
    nameHi: "मीन (Meen)",
    dateRange: "Feb 19 - Mar 20",
    symbol: "♓",
    element: "Water",
    elementHi: "जल तत्व",
    rulingPlanet: "Jupiter",
    rulingPlanetHi: "बृहस्पति (गुरु)",
    ratingStars: 5,
    loveMarriageForecast:
      "Deep spiritual harmony and soulful bonding. High probability of receiving affirmative responses from shortlisted profiles. Auspicious for family consultations.",
    careerFinanceForecast:
      "Creative intuition and artistic perception produce sterling professional results.",
    healthWellnessForecast:
      "Serenity and rejuvenation. Listening to devotional hymns or meditative music soothes the soul.",
    luckyNumber: "7, 16",
    luckyColor: "Sea Green / समुद्री हरा",
    luckyColorHex: "#0D9488",
    shubhMuhurat: "09:30 AM - 11:00 AM",
    bestCompatSign: "Cancer (कर्क) & Scorpio (वृश्चिक)",
    todayTip: "Let your gentle kindness and empathy shine through in conversations.",
  },
];

export interface DashboardHoroscopeSectionProps {
  userRasiId?: string;
  className?: string;
}

// Interactive Kundli Milan Quick Calculator Modal
const KundliMilanModal = memo<{
  isOpen: boolean;
  onClose: () => void;
  selectedRasi: ZodiacRasi;
}>(({ isOpen, onClose, selectedRasi }) => {
  const [partnerRasiId, setPartnerRasiId] = useState<string>("leo");
  const [isCalculated, setIsCalculated] = useState(false);

  const partnerRasi = useMemo(
    () => ZODIAC_RASIS.find((r) => r.id === partnerRasiId) || ZODIAC_RASIS[0],
    [partnerRasiId]
  );

  // Deterministic Gun Milan Score (out of 36)
  const gunMilanScore = useMemo(() => {
    const combined = selectedRasi.id + partnerRasi.id;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash * 31 + combined.charCodeAt(i)) % 1000;
    }
    // Realistic score between 24 and 34
    return 24 + (hash % 11);
  }, [selectedRasi.id, partnerRasi.id]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kundli-modal-title"
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#DB2F3C] via-[#E54848] to-[#991B1B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
              ✨
            </div>
            <div>
              <h3 id="kundli-modal-title" className="text-base sm:text-lg font-bold">
                Kundli Milan (36 Gun Matching)
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Vedic Astrological Compatibility Calculator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close Kundli Milan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Rasi Comparison Header */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
              <span className="text-2xl">{selectedRasi.symbol}</span>
              <p className="text-xs text-stone-500 font-semibold mt-1">Your Sign</p>
              <p className="text-sm font-bold text-stone-900">{selectedRasi.nameHi}</p>
              <p className="text-[11px] text-stone-500">{selectedRasi.nameEn}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
              <label htmlFor="partner-rasi-select" className="block text-xs text-stone-500 font-semibold mb-1">
                Partner&apos;s Sign
              </label>
              <select
                id="partner-rasi-select"
                value={partnerRasiId}
                onChange={(e) => {
                  setPartnerRasiId(e.target.value);
                  setIsCalculated(true);
                }}
                className="w-full text-xs font-bold text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#DB2F3C]"
              >
                {ZODIAC_RASIS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.symbol} {r.nameHi} - {r.nameEn}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">{partnerRasi.elementHi}</p>
            </div>
          </div>

          {/* Gun Milan Score Banner */}
          <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EC] to-[#FDE5D6] border border-[#FCD7C0] rounded-2xl p-5 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DB2F3C]/10 text-[#DB2F3C] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Compatibility Result</span>
            </div>
            <div className="flex items-baseline justify-center gap-1.5 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-[#DB2F3C] font-heading">
                {gunMilanScore}
              </span>
              <span className="text-stone-500 font-bold text-lg sm:text-xl">/ 36 Gunas</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              {gunMilanScore >= 28
                ? "✨ Excellent Match (अति उत्तम मिलान) – Highly Auspicious!"
                : gunMilanScore >= 21
                ? "🌟 Very Good Match (उत्तम मिलान) – Auspicious for Matrimony"
                : "Good Match (सामान्य मिलान) – Consult Astrologer"}
            </p>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Mental wavelength, family harmony, and health vitality show strong resonance between{" "}
              {selectedRasi.nameEn} and {partnerRasi.nameEn}.
            </p>
          </div>

          {/* 8 Kootas Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Ashtakoota Milan Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">1. Varna (Ego):</span>
                <span className="font-bold text-emerald-700">1 / 1</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">2. Vashya (Mutual):</span>
                <span className="font-bold text-emerald-700">2 / 2</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">3. Tara (Destiny):</span>
                <span className="font-bold text-emerald-700">3 / 3</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">4. Yoni (Intimacy):</span>
                <span className="font-bold text-emerald-700">3 / 4</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">5. Graha Maitri:</span>
                <span className="font-bold text-emerald-700">4 / 5</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">6. Gana (Temperament):</span>
                <span className="font-bold text-emerald-700">5 / 6</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">7. Bhakoot (Love):</span>
                <span className="font-bold text-emerald-700">7 / 7</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-stone-600 font-medium">8. Nadi (Genetic Health):</span>
                <span className="font-bold text-emerald-700">6 / 8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <Link
            href="/search"
            onClick={onClose}
            className="text-xs font-bold text-[#DB2F3C] hover:underline cursor-pointer"
          >
            Find {partnerRasi.nameEn} Matches &rarr;
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
});
KundliMilanModal.displayName = "KundliMilanModal";

const DashboardHoroscopeSectionComponent: React.FC<DashboardHoroscopeSectionProps> = ({
  userRasiId = "leo",
  className = "",
}) => {
  // Current active Rasi selection (defaults to user's saved sign, Leo / Singh)
  const [selectedRasiId, setSelectedRasiId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_user_rasi");
      if (saved) return saved;
    }
    return userRasiId;
  });

  const [isSavedAsDefault, setIsSavedAsDefault] = useState(false);
  const [isKundliModalOpen, setIsKundliModalOpen] = useState(false);

  // Active Rasi Object
  const currentRasi: ZodiacRasi = useMemo(() => {
    return (
      ZODIAC_RASIS.find((r) => r.id === selectedRasiId) || ZODIAC_RASIS[4] // Leo default
    );
  }, [selectedRasiId]);

  // Handle setting as default
  const handleSetAsDefault = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_user_rasi", currentRasi.id);
    }
    // Sync preferred rashi to user profile in backend database
    apiFetch.post(ApiURL.saveRashi, { rashi: currentRasi.id }, { isToken: true, showErrorToast: false }).catch(() => {});
    setIsSavedAsDefault(true);
    setTimeout(() => {
      setIsSavedAsDefault(false);
    }, 3000);
  }, [currentRasi.id]);

  // Dynamic Today Date display
  const todayFormatted = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // Element icon helper
  const getElementBadge = useCallback((element: ZodiacRasi["element"]) => {
    switch (element) {
      case "Fire":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-amber-600" />
            <span>Agni (Fire)</span>
          </span>
        );
      case "Water":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
            <Droplets className="w-3 h-3 text-sky-600" />
            <span>Jal (Water)</span>
          </span>
        );
      case "Air":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            <Wind className="w-3 h-3 text-indigo-600" />
            <span>Vayu (Air)</span>
          </span>
        );
      case "Earth":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <Mountain className="w-3 h-3 text-emerald-600" />
            <span>Prithvi (Earth)</span>
          </span>
        );
    }
  }, []);

  return (
    <section
      aria-label="Daily Horoscope and Astrological Compatibility Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5 ${className}`}
    >
      {/* 1. Header with Radiant Astrological Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DB2F3C] to-[#F59E0B] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
              Daily Horoscope (दैनिक राशिफल)
            </h3>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-[#DB2F3C] text-[10.5px] font-bold border border-red-200">
              Today&apos;s Forecast
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{todayFormatted}</span>
            <span className="text-stone-300">•</span>
            <span>Vedic Astrological Guidance for Matrimony & Life</span>
          </p>
        </div>

        {/* Action Buttons: Kundli Milan & Astrologer Chat */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsKundliModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0F2] hover:bg-[#FFE0E4] text-[#DB2F3C] border border-[#FDCED3] text-xs font-bold shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Kundli Milan (36 Gunas)</span>
          </button>
        </div>
      </div>

      {/* 2. 12 Zodiac Rasis Quick Selection Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700">Select Your Moon Sign (अपनी राशि चुनें):</span>
          <button
            type="button"
            onClick={handleSetAsDefault}
            className="text-[11px] font-bold text-[#DB2F3C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {isSavedAsDefault ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Saved as My Rasi!</span>
              </>
            ) : (
              <span>Save {currentRasi.nameEn} as My Rasi</span>
            )}
          </button>
        </div>

        {/* Scrollable Horizontal Pill List of 12 Rasis */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {ZODIAC_RASIS.map((rasi) => {
            const isSelected = rasi.id === selectedRasiId;
            return (
              <button
                key={rasi.id}
                type="button"
                onClick={() => setSelectedRasiId(rasi.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#DB2F3C] to-[#B71F2A] text-white border-transparent shadow-xs scale-102"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                }`}
              >
                <span className="text-sm">{rasi.symbol}</span>
                <span>{rasi.nameHi.split(" ")[0]}</span>
                <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-stone-400"}`}>
                  ({rasi.nameEn})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Astrological Forecast Card */}
      <div className="w-full bg-gradient-to-br from-[#FFFDFB] via-[#FFF8F4] to-[#FFF1EA] border border-[#FCD7C0] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-5">
        {/* Decorative Celestial Watermark */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 text-9xl font-serif text-[#DB2F3C]/5 pointer-events-none select-none">
          {currentRasi.symbol}
        </div>

        {/* Hero Row: Sign Details, Planet, Element & Star Rating */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9DAC7] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DB2F3C] via-[#E54848] to-[#991B1B] text-white flex items-center justify-center text-3xl shadow-sm border border-white/20">
              {currentRasi.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg sm:text-xl font-black text-stone-900 font-heading">
                  {currentRasi.nameHi} • {currentRasi.nameEn}
                </h4>
                {getElementBadge(currentRasi.element)}
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Ruling Planet: <span className="font-bold text-stone-900">{currentRasi.rulingPlanetHi} ({currentRasi.rulingPlanet})</span>
                <span className="mx-1.5 text-stone-300">•</span>
                <span>{currentRasi.dateRange}</span>
              </p>
            </div>
          </div>

          {/* Today's Star Rating */}
          <div className="flex items-center gap-1.5 sm:self-center bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#FCD7C0] shadow-2xs">
            <span className="text-xs font-bold text-stone-700">Auspicious Fortune:</span>
            <div className="flex items-center text-amber-500 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(currentRasi.ratingStars)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-100 text-amber-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3 Pillars Forecast Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Love & Matrimony */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#FCD7C0]/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#DB2F3C]">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <h5 className="text-xs sm:text-[13px] font-bold text-stone-900">
                Love & Matrimony (विवाह व प्रेम)
              </h5>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentRasi.loveMarriageForecast}
            </p>
          </div>

          {/* Pillar 2: Career & Wealth */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#FCD7C0]/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h5 className="text-xs sm:text-[13px] font-bold text-stone-900">
                Career & Wealth (करियर व धन)
              </h5>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentRasi.careerFinanceForecast}
            </p>
          </div>

          {/* Pillar 3: Health & Peace */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#FCD7C0]/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h5 className="text-xs sm:text-[13px] font-bold text-stone-900">
                Wellness & Mind (स्वास्थ्य व शांति)
              </h5>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentRasi.healthWellnessForecast}
            </p>
          </div>
        </div>

        {/* 4. Auspicious Key Indicators Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Lucky Number */}
          <div className="p-3 bg-white/95 rounded-xl border border-stone-200/90 text-center">
            <p className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
              Lucky Number (शुभ अंक)
            </p>
            <p className="text-sm sm:text-base font-extrabold text-[#DB2F3C] mt-0.5">
              {currentRasi.luckyNumber}
            </p>
          </div>

          {/* Lucky Color */}
          <div className="p-3 bg-white/95 rounded-xl border border-stone-200/90 text-center">
            <p className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
              Lucky Color (शुभ रंग)
            </p>
            <p className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5 truncate">
              {currentRasi.luckyColor}
            </p>
          </div>

          {/* Shubh Muhurat */}
          <div className="p-3 bg-white/95 rounded-xl border border-stone-200/90 text-center">
            <p className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
              Shubh Muhurat (शुभ समय)
            </p>
            <p className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
              {currentRasi.shubhMuhurat}
            </p>
          </div>

          {/* Best Match Sign */}
          <div className="p-3 bg-white/95 rounded-xl border border-stone-200/90 text-center">
            <p className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
              Best Compatible (शुभ राशि)
            </p>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 truncate">
              {currentRasi.bestCompatSign.split("&")[0]}
            </p>
          </div>
        </div>

        {/* 5. Astrological Daily Wisdom Banner */}
        <div className="relative z-10 bg-white/90 border border-[#FCD7C0] rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
              💡
            </div>
            <p className="text-xs text-stone-700 font-medium">
              <span className="font-bold text-stone-900">Today&apos;s Match Tip: </span>
              {currentRasi.todayTip}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsKundliModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#DB2F3C] hover:text-[#B71F2A] hover:underline cursor-pointer"
            >
              <span>Calculate Gun Milan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Kundli Milan Modal */}
      <KundliMilanModal
        isOpen={isKundliModalOpen}
        onClose={() => setIsKundliModalOpen(false)}
        selectedRasi={currentRasi}
      />
    </section>
  );
};

export const DashboardHoroscopeSection = memo(DashboardHoroscopeSectionComponent);
DashboardHoroscopeSection.displayName = "DashboardHoroscopeSection";
export default DashboardHoroscopeSection;
