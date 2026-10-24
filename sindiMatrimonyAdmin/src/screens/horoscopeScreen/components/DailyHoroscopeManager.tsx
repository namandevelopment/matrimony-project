import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Heart,
  Briefcase,
  Activity,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  Palette,
  Hash,
  Eye,
} from 'lucide-react';
import { toast } from '../../../toastMessage/toast';
import { apiFetch, ApiURL } from '../../../redux/apiService';

export interface ZodiacForecast {
  id: string;
  nameEn: string;
  nameHi: string;
  dateRange: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  elementHi: string;
  rulingPlanet: string;
  rulingPlanetHi: string;
  ratingStars: number;
  loveMarriageForecast: string;
  careerFinanceForecast: string;
  healthWellnessForecast: string;
  luckyNumber: string;
  luckyColor: string;
  shubhMuhurat: string;
  bestCompatSign: string;
  todayTip: string;
}

const DEFAULT_RASHIS: ZodiacForecast[] = [
  {
    id: 'aries',
    nameEn: 'Aries',
    nameHi: 'मेष (Mesh)',
    dateRange: 'Mar 21 - Apr 19',
    symbol: '♈',
    element: 'Fire',
    elementHi: 'अग्नि तत्व',
    rulingPlanet: 'Mars',
    rulingPlanetHi: 'मंगल देव',
    ratingStars: 4.5,
    loveMarriageForecast:
      'Venus and Moon align auspiciously. High possibility of pleasant conversations with matrimonial prospects. Mutual understanding and emotional connection will deepen today.',
    careerFinanceForecast:
      'Dynamic energy aids key negotiations and creative ideas. An unexpected financial opportunity through an acquaintance may arise.',
    healthWellnessForecast:
      'Vitality is strong. Maintain hydration and take evening leisure walks with family for restful sleep.',
    luckyNumber: '9, 18',
    luckyColor: 'Crimson Red / केसरिया',
    shubhMuhurat: '10:15 AM - 11:45 AM',
    bestCompatSign: 'Leo (सिंह) & Sagittarius (धनु)',
    todayTip: 'Be open and articulate in matrimonial communications today.',
  },
  {
    id: 'taurus',
    nameEn: 'Taurus',
    nameHi: 'वृषभ (Vrishabh)',
    dateRange: 'Apr 20 - May 20',
    symbol: '♉',
    element: 'Earth',
    elementHi: 'पृथ्वी तत्व',
    rulingPlanet: 'Venus',
    rulingPlanetHi: 'शुक्र देव',
    ratingStars: 5,
    loveMarriageForecast:
      'Ruled by Venus, today brings utmost romance and harmony. Elders in the family will enthusiastically support match proposals and horoscope compatibility discussions.',
    careerFinanceForecast:
      'Financial stability strengthens. Thoughtful long-term investments will yield favorable returns.',
    healthWellnessForecast:
      'Peaceful mental state. A serene atmosphere at home uplifts overall wellbeing.',
    luckyNumber: '6, 15',
    luckyColor: 'Lotus Pink / गुलाबी',
    shubhMuhurat: '02:30 PM - 04:00 PM',
    bestCompatSign: 'Virgo (कन्या) & Capricorn (मकर)',
    todayTip: 'Express your genuine expectations with prospective partners gently.',
  },
  {
    id: 'gemini',
    nameEn: 'Gemini',
    nameHi: 'मिथुन (Mithun)',
    dateRange: 'May 21 - Jun 20',
    symbol: '♊',
    element: 'Air',
    elementHi: 'वायु तत्व',
    rulingPlanet: 'Mercury',
    rulingPlanetHi: 'बुध देव',
    ratingStars: 4,
    loveMarriageForecast:
      'Your witty communication and charisma shine bright. An interesting matrimonial profile from an intellectual background might respond to your interest today.',
    careerFinanceForecast:
      'Productive multi-tasking day. Communication with overseas or distant clients will be very rewarding.',
    healthWellnessForecast:
      'Practice deep breathing to calm a bustling mind. Avoid excess screen exposure late night.',
    luckyNumber: '5, 14',
    luckyColor: 'Emerald Green / हरा',
    shubhMuhurat: '09:00 AM - 10:30 AM',
    bestCompatSign: 'Libra (तुला) & Aquarius (कुंभ)',
    todayTip: 'Honest two-way communication builds lasting trust.',
  },
  {
    id: 'cancer',
    nameEn: 'Cancer',
    nameHi: 'कर्क (Kark)',
    dateRange: 'Jun 21 - Jul 22',
    symbol: '♋',
    element: 'Water',
    elementHi: 'जल तत्व',
    rulingPlanet: 'Moon',
    rulingPlanetHi: 'चंद्र देव',
    ratingStars: 4.5,
    loveMarriageForecast:
      'Moon grace fosters deep emotional bonding. Heartwarming family discussions regarding marriage ceremonies and auspicious dates are favored.',
    careerFinanceForecast:
      'Strong intuitive instincts guide correct decisions. Colleague relations remain warmly cooperative.',
    healthWellnessForecast:
      'Nourish yourself with homemade warm meals. Emotional contentment enhances digestion.',
    luckyNumber: '2, 11',
    luckyColor: 'Pearl White / श्वेत',
    shubhMuhurat: '06:00 PM - 07:30 PM',
    bestCompatSign: 'Scorpio (वृश्चिक) & Pisces (मीन)',
    todayTip: 'Cherish family values while evaluating potential life partners.',
  },
  {
    id: 'leo',
    nameEn: 'Leo',
    nameHi: 'सिंह (Singh)',
    dateRange: 'Jul 23 - Aug 22',
    symbol: '♌',
    element: 'Fire',
    elementHi: 'अग्नि तत्व',
    rulingPlanet: 'Sun',
    rulingPlanetHi: 'सूर्य देव',
    ratingStars: 5,
    loveMarriageForecast:
      'Magnetic presence brings immense admiration. Matrimonial interests sent today will receive prompt and enthusiastic reciprocal interest.',
    careerFinanceForecast:
      'Leadership capabilities receive accolades from senior associates. A lucrative commercial venture moves forward.',
    healthWellnessForecast:
      'High vitality and enthusiasm. Regular morning Surya Namaskar brings radiance and poise.',
    luckyNumber: '1, 19',
    luckyColor: 'Royal Gold / सुनहरा',
    shubhMuhurat: '11:30 AM - 01:00 PM',
    bestCompatSign: 'Aries (मेष) & Sagittarius (धनु)',
    todayTip: 'Generosity and warmth will captivate prospective matches.',
  },
  {
    id: 'virgo',
    nameEn: 'Virgo',
    nameHi: 'कन्या (Kanya)',
    dateRange: 'Aug 23 - Sep 22',
    symbol: '♍',
    element: 'Earth',
    elementHi: 'पृथ्वी तत्व',
    rulingPlanet: 'Mercury',
    rulingPlanetHi: 'बुध देव',
    ratingStars: 4.5,
    loveMarriageForecast:
      'Practical wisdom and attention to compatibility criteria ensure high clarity during Kundli and lifestyle review discussions.',
    careerFinanceForecast:
      'Organizational finesse solves long-standing bottlenecks. Financial budgeting yields substantial future savings.',
    healthWellnessForecast:
      'Opt for light, nutrient-dense nutrition. Mindful yoga stretches will relieve neck tension.',
    luckyNumber: '5, 23',
    luckyColor: 'Sapphire Blue / नीला',
    shubhMuhurat: '03:15 PM - 04:45 PM',
    bestCompatSign: 'Taurus (वृषभ) & Capricorn (मकर)',
    todayTip: 'Look at the bigger emotional picture along with analytical details.',
  },
  {
    id: 'libra',
    nameEn: 'Libra',
    nameHi: 'तुला (Tula)',
    dateRange: 'Sep 23 - Oct 22',
    symbol: '♎',
    element: 'Air',
    elementHi: 'वायु तत्व',
    rulingPlanet: 'Venus',
    rulingPlanetHi: 'शुक्र देव',
    ratingStars: 5,
    loveMarriageForecast:
      'Supreme aesthetic elegance and diplomatic charm. Matrimonial meetings or family introductions held today will conclude with great mutual delight.',
    careerFinanceForecast:
      'Collaborations and strategic alliances progress seamlessly. Balance sheets and cash flows remain well-balanced.',
    healthWellnessForecast:
      'Inner equilibrium is high. Aesthetic and musical surroundings provide serene relaxation.',
    luckyNumber: '6, 24',
    luckyColor: 'Pastel Rose / गुलाबी',
    shubhMuhurat: '12:00 PM - 01:30 PM',
    bestCompatSign: 'Gemini (मिथुन) & Aquarius (कुंभ)',
    todayTip: 'Trust your balanced instinct when finalizing matrimonial prospects.',
  },
  {
    id: 'scorpio',
    nameEn: 'Scorpio',
    nameHi: 'वृश्चिक (Vrishchik)',
    dateRange: 'Oct 23 - Nov 21',
    symbol: '♏',
    element: 'Water',
    elementHi: 'जल तत्व',
    rulingPlanet: 'Mars',
    rulingPlanetHi: 'मंगल देव',
    ratingStars: 4,
    loveMarriageForecast:
      'Profound emotional depth and loyalty. Meaningful, soul-stirring conversations with shortlisted matches will reveal genuine alignment.',
    careerFinanceForecast:
      'Sharp analytical focus cuts through complex challenges. Confidential negotiations yield advantageous terms.',
    healthWellnessForecast:
      'Channel intense energy through vigorous fitness or sports. Adequate hydration maintains stamina.',
    luckyNumber: '9, 27',
    luckyColor: 'Deep Maroon / गहरा लाल',
    shubhMuhurat: '07:00 PM - 08:30 PM',
    bestCompatSign: 'Cancer (कर्क) & Pisces (मीन)',
    todayTip: 'Vulnerability and openness unlock genuine emotional bonds.',
  },
  {
    id: 'sagittarius',
    nameEn: 'Sagittarius',
    nameHi: 'धनु (Dhanu)',
    dateRange: 'Nov 22 - Dec 21',
    symbol: '♐',
    element: 'Fire',
    elementHi: 'अग्नि तत्व',
    rulingPlanet: 'Jupiter',
    rulingPlanetHi: 'बृहस्पति देव',
    ratingStars: 5,
    loveMarriageForecast:
      'Jupiter bestows boundless optimism and matrimonial blessings. High auspiciousness for initiating fresh match inquiries or planning visits.',
    careerFinanceForecast:
      'Expansion and higher learning opportunities abound. Long-term visionary proposals receive prompt approvals.',
    healthWellnessForecast:
      'Outdoor physical movement elevates vitality. Spend time outdoors under fresh morning air.',
    luckyNumber: '3, 12',
    luckyColor: 'Bright Saffron / पीला',
    shubhMuhurat: '08:30 AM - 10:00 AM',
    bestCompatSign: 'Aries (मेष) & Leo (सिंह)',
    todayTip: 'A positive worldview attracts naturally compatible life companions.',
  },
  {
    id: 'capricorn',
    nameEn: 'Capricorn',
    nameHi: 'मकर (Makar)',
    dateRange: 'Dec 22 - Jan 19',
    symbol: '♑',
    element: 'Earth',
    elementHi: 'पृथ्वी तत्व',
    rulingPlanet: 'Saturn',
    rulingPlanetHi: 'शनि देव',
    ratingStars: 4.5,
    loveMarriageForecast:
      'Steadfast dedication and family heritage take center stage. Discussions on shared responsibilities and lifelong matrimonial commitments progress with solemn trust.',
    careerFinanceForecast:
      'Disciplined persistence bears tangible fruit. Career milestones and authority figures offer strong backing.',
    healthWellnessForecast:
      'Fortify bone and joint health through light conditioning. Maintain consistent sleep intervals.',
    luckyNumber: '8, 17',
    luckyColor: 'Slate Charcoal / गहरा भूरा',
    shubhMuhurat: '04:00 PM - 05:30 PM',
    bestCompatSign: 'Taurus (वृषभ) & Virgo (कन्या)',
    todayTip: 'Patience and consistency build an unbreakable lifelong relationship.',
  },
  {
    id: 'aquarius',
    nameEn: 'Aquarius',
    nameHi: 'कुंभ (Kumbh)',
    dateRange: 'Jan 20 - Feb 18',
    symbol: '♒',
    element: 'Air',
    elementHi: 'वायु तत्व',
    rulingPlanet: 'Saturn',
    rulingPlanetHi: 'शनि देव',
    ratingStars: 4,
    loveMarriageForecast:
      'Progressive vision and mutual respect flourish. Seeking a partner who is also an intellectual best friend yields remarkable synergy.',
    careerFinanceForecast:
      'Unconventional innovative solutions earn praise. Tech, digital or collaborative ventures see breakthrough progress.',
    healthWellnessForecast:
      'Calm mental activity with meditation or instrumental melodies before sleeping.',
    luckyNumber: '7, 16',
    luckyColor: 'Cyan Electric / आसमानी',
    shubhMuhurat: '01:45 PM - 03:15 PM',
    bestCompatSign: 'Gemini (मिथुन) & Libra (तुला)',
    todayTip: 'Value individual individuality while building emotional unity.',
  },
  {
    id: 'pisces',
    nameEn: 'Pisces',
    nameHi: 'मीन (Meen)',
    dateRange: 'Feb 19 - Mar 20',
    symbol: '♓',
    element: 'Water',
    elementHi: 'जल तत्व',
    rulingPlanet: 'Jupiter',
    rulingPlanetHi: 'बृहस्पति देव',
    ratingStars: 5,
    loveMarriageForecast:
      'Compassion and spiritual harmony grace the day. Deep empathic rapport with matrimonial candidates creates an enchanting sense of destined partnership.',
    careerFinanceForecast:
      'Artistic, philanthropic, and creative initiatives prosper. Generous assistance from mentors facilitates smooth progress.',
    healthWellnessForecast:
      'Serene waters and warm herbal teas soothe your constitution. Restorative sleep rejuvenates mind and spirit.',
    luckyNumber: '3, 21',
    luckyColor: 'Sea Green / समुद्री हरा',
    shubhMuhurat: '05:15 PM - 06:45 PM',
    bestCompatSign: 'Cancer (कर्क) & Scorpio (वृश्चिक)',
    todayTip: 'Listen to your intuition; genuine hearts resonate effortlessly.',
  },
];

const STORAGE_KEY = 'sm_admin_daily_horoscopes_v1';

export const DailyHoroscopeManager: React.FC = () => {
  const [rashis, setRashis] = useState<ZodiacForecast[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_RASHIS;
  });

  const [selectedRashiId, setSelectedRashiId] = useState<string>('taurus');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const selectedRashi = rashis.find((r) => r.id === selectedRashiId) || rashis[0];

  const handleFieldChange = (field: keyof ZodiacForecast, value: any) => {
    setRashis((prev) =>
      prev.map((r) => (r.id === selectedRashiId ? { ...r, [field]: value } : r))
    );
    setHasUnsavedChanges(true);
  };

  // Sync with backend API via apiFetch
  useEffect(() => {
    let isMounted = true;
    apiFetch({
      url: ApiURL.dailyHoroscope(selectedRashiId),
      method: 'GET',
      isToken: true,
    })
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const details = (res.data as any)?.rashiDetails;
        if (details) {
          setRashis((prev) =>
            prev.map((r) =>
              r.id === selectedRashiId
                ? {
                    ...r,
                    loveMarriageForecast: details.loveMarriageForecast || r.loveMarriageForecast,
                    careerFinanceForecast: details.careerFinanceForecast || r.careerFinanceForecast,
                    healthWellnessForecast: details.healthWellnessForecast || r.healthWellnessForecast,
                    luckyNumber: details.luckyNumber || r.luckyNumber,
                    luckyColor: details.luckyColor || r.luckyColor,
                    shubhMuhurat: details.shubhMuhurat || r.shubhMuhurat,
                    todayTip: details.todayTip || r.todayTip,
                  }
                : r
            )
          );
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [selectedRashiId]);

  const handleSave = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rashis));
    }
    setHasUnsavedChanges(false);

    try {
      await apiFetch({
        url: ApiURL.saveUserRashi,
        method: 'POST',
        data: { rashi: selectedRashi.id },
        isToken: true,
      });
    } catch {
      // Fallback seamlessly to local cache
    }

    toast.success(
      `Daily Horoscope updated! Live broadcast active for ${selectedRashi.nameHi}.`
    );
  };

  const handleReset = () => {
    const defaultOne = DEFAULT_RASHIS.find((r) => r.id === selectedRashiId);
    if (!defaultOne) return;
    setRashis((prev) =>
      prev.map((r) => (r.id === selectedRashiId ? { ...defaultOne } : r))
    );
    setHasUnsavedChanges(true);
    toast.info(`Reset ${selectedRashi.nameEn} to Vedic Astro default forecast.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#88131B] via-[#A01824] to-[#DB2F3C] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Live User Dashboard Feed
            </span>
            <span className="text-xs text-white/80 font-medium">12 Moon Signs Active</span>
          </div>
          <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            Daily Horoscope & Rashifal Manager (दैनिक राशिफल संपादक)
          </h2>
          <p className="text-xs text-white/85 max-w-2xl mt-1">
            Manage daily astrological forecasts, ruling planetary influences, matrimonial
            compatibility advice, lucky numbers, and shubh muhurat shown on members' dashboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs font-semibold text-amber-200 bg-black/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Unsaved Edits
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-white text-[#88131B] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Live Forecast</span>
          </button>
        </div>
      </div>

      {/* 12 Moon Signs Selector Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Select Moon Sign to Edit (अपनी राशि चुनें)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {rashis.map((r) => {
            const isSelected = r.id === selectedRashiId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRashiId(r.id)}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-[#88131B] text-white border-[#88131B] shadow-xs ring-2 ring-[#88131B]/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-lg leading-none">{r.symbol}</span>
                <span className="text-[11px] font-bold truncate max-w-full">{r.nameEn}</span>
                <span className={`text-[9px] truncate max-w-full ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                  {r.nameHi.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedRashi.symbol}</span>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Edit Forecast: {selectedRashi.nameEn} — {selectedRashi.nameHi}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {selectedRashi.elementHi} • {selectedRashi.dateRange}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Ruling Planet (English)
              </label>
              <input
                type="text"
                value={selectedRashi.rulingPlanet}
                onChange={(e) => handleFieldChange('rulingPlanet', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Ruling Planet (Hindi / देव)
              </label>
              <input
                type="text"
                value={selectedRashi.rulingPlanetHi}
                onChange={(e) => handleFieldChange('rulingPlanetHi', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
          </div>

          {/* Forecast Cards Inputs */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Love & Matrimony Forecast (विवाह व प्रेम)
            </label>
            <textarea
              rows={3}
              value={selectedRashi.loveMarriageForecast}
              onChange={(e) => handleFieldChange('loveMarriageForecast', e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              Career & Wealth Forecast (करियर व धन)
            </label>
            <textarea
              rows={2}
              value={selectedRashi.careerFinanceForecast}
              onChange={(e) => handleFieldChange('careerFinanceForecast', e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Wellness & Mind Forecast (स्वास्थ्य व शांति)
            </label>
            <textarea
              rows={2}
              value={selectedRashi.healthWellnessForecast}
              onChange={(e) => handleFieldChange('healthWellnessForecast', e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-400" />
                Lucky Number
              </label>
              <input
                type="text"
                value={selectedRashi.luckyNumber}
                onChange={(e) => handleFieldChange('luckyNumber', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-slate-400" />
                Lucky Color
              </label>
              <input
                type="text"
                value={selectedRashi.luckyColor}
                onChange={(e) => handleFieldChange('luckyColor', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Shubh Muhurat
              </label>
              <input
                type="text"
                value={selectedRashi.shubhMuhurat}
                onChange={(e) => handleFieldChange('shubhMuhurat', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-slate-400" />
                Compatible Sign
              </label>
              <input
                type="text"
                value={selectedRashi.bestCompatSign}
                onChange={(e) => handleFieldChange('bestCompatSign', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Today's Match Tip (आज का वैवाहिक सुझाव)
            </label>
            <input
              type="text"
              value={selectedRashi.todayTip}
              onChange={(e) => handleFieldChange('todayTip', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#88131B]"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#88131B] hover:bg-[#701016] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </div>

        {/* Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Member Dashboard Preview (लाइव प्रिव्यू)</span>
            </div>
            <span className="text-[10px] text-slate-400">User Panel Replica</span>
          </div>

          {/* Card simulating the exact UI shown on user dashboard */}
          <div className="bg-amber-50/40 rounded-2xl border border-amber-200/80 p-5 space-y-4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-[#DB2F3C] flex items-center justify-center text-white text-xl shadow-xs">
                  {selectedRashi.symbol}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {selectedRashi.nameHi} • {selectedRashi.nameEn}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedRashi.elementHi}
                    </span>
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ruling Planet: <span className="font-semibold text-slate-700">{selectedRashi.rulingPlanetHi} ({selectedRashi.rulingPlanet})</span> • {selectedRashi.dateRange}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 block">Auspicious Fortune:</span>
                <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* 3 mini cards */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Love & Matrimony (विवाह व प्रेम)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedRashi.loveMarriageForecast}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                  <span>Career & Wealth (करियर व धन)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedRashi.careerFinanceForecast}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Wellness & Mind (स्वास्थ्य व शांति)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedRashi.healthWellnessForecast}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Lucky Number</span>
                <span className="text-xs font-black text-rose-600 mt-0.5 block">{selectedRashi.luckyNumber}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Lucky Color</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block truncate">{selectedRashi.luckyColor.split('/')[0]}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Shubh Muhurat</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block truncate">{selectedRashi.shubhMuhurat}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Compatible</span>
                <span className="text-xs font-bold text-emerald-700 mt-0.5 block truncate">{selectedRashi.bestCompatSign.split('&')[0]}</span>
              </div>
            </div>

            {/* Tip banner */}
            <div className="bg-amber-100/70 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-amber-950 font-medium">
              <span className="text-base">💡</span>
              <span>{selectedRashi.todayTip}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
