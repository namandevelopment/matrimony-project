import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Heart,
  Send,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sliders,
  User,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Mail,
  Smartphone,
  FileText,
  History,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomDropDown } from '../../components/CustomDropDown';
import { CustomTextInput } from '../../components/CustomTextInput';
import { memberDataService, type MatrimonialMember } from '../../services/memberDataService';
import {
  horoscopeService,
  type KundliMilanResult,
  type HoroscopeSettings,
} from '../../services/horoscopeService';
import { toast } from '../../toastMessage/toast';
import { usePerformanceTracker } from '../../customHooks/usePerformanceTracker';
import { useInputs } from '../../customHooks/useInputs';
import { memoWithDeepEqual } from '../../utils/memoUtils';

interface HoroscopeSimulatorFormValues {
  selectedGroomId: string;
  selectedBrideId: string;
}

interface HoroscopeDispatchFormValues {
  dispatchMemberId: string;
  dispatchReportType: 'PERSONAL' | 'MATCH';
  dispatchPartnerId: string;
  dispatchChannel: 'PUSH' | 'WHATSAPP' | 'SMS' | 'EMAIL';
  dispatchCustomNote: string;
}

interface HoroscopeDirectoryFilterValues {
  memberSearch: string;
  manglikFilter: string;
}

interface HoroscopeBatchFormValues {
  batchCandidateId: string;
}

export const HoroscopeScreen: React.FC = memoWithDeepEqual(() => {
  usePerformanceTracker('HoroscopeScreen');

  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'MEMBERS' | 'BATCH' | 'SETTINGS' | 'DISPATCH'>('SIMULATOR');

  // Members list
  const [members] = useState<MatrimonialMember[]>(() => memberDataService.getMembers());

  // Simulator selections & state
  const maleMembers = useMemo(() => members.filter((m) => m.gender === 'Male' && m.status === 'ACTIVE'), [members]);
  const femaleMembers = useMemo(() => members.filter((m) => m.gender === 'Female' && m.status === 'ACTIVE'), [members]);

  const {
    values: simulatorForm,
    setFieldValue: setSimulatorFieldValue,
  } = useInputs<HoroscopeSimulatorFormValues>(() => ({
    selectedGroomId: maleMembers[0]?.id || '',
    selectedBrideId: femaleMembers[0]?.id || '',
  }));

  // Computed Milan Result
  const milanResult = useMemo<KundliMilanResult | null>(() => {
    const groom = maleMembers.find((m) => m.id === simulatorForm.selectedGroomId);
    const bride = femaleMembers.find((m) => m.id === simulatorForm.selectedBrideId);
    if (!groom || !bride) return null;
    return horoscopeService.calculateKundliMilan(groom, bride);
  }, [simulatorForm.selectedGroomId, simulatorForm.selectedBrideId, maleMembers, femaleMembers]);

  // Batch Matching State
  const {
    values: batchForm,
    setFieldValue: setBatchFieldValue,
  } = useInputs<HoroscopeBatchFormValues>(() => ({
    batchCandidateId: members[0]?.id || '',
  }));
  const batchCandidate = useMemo(() => members.find((m) => m.id === batchForm.batchCandidateId), [members, batchForm.batchCandidateId]);
  const batchMatches = useMemo(() => {
    if (!batchCandidate) return [];
    return horoscopeService.runBatchHoroscopeMatching(batchCandidate);
  }, [batchCandidate]);

  // Settings State
  const {
    values: settings,
    setFieldValue: setSettingsFieldValue,
    setValues: setSettingsValues,
  } = useInputs<HoroscopeSettings>(() => horoscopeService.getSettings());

  useEffect(() => {
    const unsub = horoscopeService.subscribe(() => {
      setSettingsValues(horoscopeService.getSettings());
    });
    return unsub;
  }, [setSettingsValues]);

  // Search in Members Directory tab
  const {
    values: directoryFilters,
    setFieldValue: setDirectoryFilterValue,
  } = useInputs<HoroscopeDirectoryFilterValues>({
    memberSearch: '',
    manglikFilter: 'ALL',
  });

  // Direct Dispatch state
  const {
    values: dispatchForm,
    setFieldValue: setDispatchFieldValue,
    setValues: setDispatchValues,
  } = useInputs<HoroscopeDispatchFormValues>(() => ({
    dispatchMemberId: members[0]?.id || '',
    dispatchReportType: 'PERSONAL',
    dispatchPartnerId: '',
    dispatchChannel: 'WHATSAPP',
    dispatchCustomNote: 'Pandit ji dwara verified Kundli report attach ki gayi hai. Kripya check karein.',
  }));

  const [dispatchHistory, setDispatchHistory] = useState<Array<{
    id: string;
    recipientName: string;
    recipientId: string;
    reportType: string;
    channel: string;
    timestamp: string;
    status: 'Delivered';
  }>>([
    {
      id: 'disp_1',
      recipientName: 'Rohit Vazirani',
      recipientId: 'SM-1042',
      reportType: 'Personal Janam Kundli',
      channel: 'WHATSAPP',
      timestamp: 'Today, 10:15 AM',
      status: 'Delivered',
    },
    {
      id: 'disp_2',
      recipientName: 'Priya Advani',
      recipientId: 'SM-7741',
      reportType: 'Kundli Milan (28/36 Gunas)',
      channel: 'PUSH',
      timestamp: 'Today, 09:30 AM',
      status: 'Delivered',
    },
  ]);

  // Send single notification
  const handleSendNotification = (milan: KundliMilanResult) => {
    const res = horoscopeService.sendHoroscopeMatchNotification(milan);
    toast.success(res.message);
  };

  // Send batch notifications
  const handleSendBatchNotifications = () => {
    const favorable = batchMatches.filter((m) => m.totalGunas >= settings.minGunasThreshold && !m.sameGotraViolation);
    if (favorable.length === 0) {
      toast.warning('No matches meeting threshold found to notify.');
      return;
    }
    favorable.slice(0, 3).forEach((m) => {
      horoscopeService.sendHoroscopeMatchNotification(m);
    });
    toast.success(`Kundli match notifications sent for top ${Math.min(3, favorable.length)} auspicious matches!`);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    horoscopeService.updateSettings(settings);
    toast.success('Horoscope & Kundli matching policies saved successfully!');
  };

  // Dispatch direct horoscope to user
  const handleDispatchHoroscope = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = members.find((m) => m.id === dispatchForm.dispatchMemberId);
    if (!recipient) {
      toast.error('Please select a valid member.');
      return;
    }

    if (dispatchForm.dispatchReportType === 'PERSONAL') {
      const res = horoscopeService.sendIndividualHoroscopeReport(recipient, dispatchForm.dispatchChannel, dispatchForm.dispatchCustomNote);
      toast.success(res.message);
      setDispatchHistory((prev) => [
        {
          id: `disp_${Date.now()}`,
          recipientName: recipient.fullName,
          recipientId: recipient.id,
          reportType: 'Personal Janam Kundli',
          channel: dispatchForm.dispatchChannel,
          timestamp: 'Just now',
          status: 'Delivered',
        },
        ...prev,
      ]);
    } else {
      const partner = members.find((m) => m.id === dispatchForm.dispatchPartnerId);
      if (!partner) {
        toast.error('Please select a partner for Kundli Milan matching.');
        return;
      }
      const groom = recipient.gender === 'Male' ? recipient : partner;
      const bride = recipient.gender === 'Female' ? recipient : partner;
      const milan = horoscopeService.calculateKundliMilan(groom, bride);
      const res = horoscopeService.sendKundliMilanToSpecificUser(milan, recipient.id, dispatchForm.dispatchChannel, dispatchForm.dispatchCustomNote);
      toast.success(res.message);
      setDispatchHistory((prev) => [
        {
          id: `disp_${Date.now()}`,
          recipientName: recipient.fullName,
          recipientId: recipient.id,
          reportType: `Kundli Milan (${milan.totalGunas}/36 with ${partner.fullName})`,
          channel: dispatchForm.dispatchChannel,
          timestamp: 'Just now',
          status: 'Delivered',
        },
        ...prev,
      ]);
    }
  };

  const openDispatchForMember = (memberId: string) => {
    setDispatchValues({
      dispatchMemberId: memberId,
      dispatchReportType: 'PERSONAL',
    });
    setActiveTab('DISPATCH');
  };

  // Filtered members for directory tab
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (directoryFilters.manglikFilter !== 'ALL' && (m.manglik || 'Non-Manglik') !== directoryFilters.manglikFilter) return false;
      if (directoryFilters.memberSearch.trim()) {
        const q = directoryFilters.memberSearch.toLowerCase().trim();
        const rashiVal = m.rashi || m.sunSign || '';
        return (
          m.fullName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.gotra && m.gotra.toLowerCase().includes(q)) ||
          rashiVal.toLowerCase().includes(q) ||
          (m.subcaste && m.subcaste.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [members, directoryFilters.memberSearch, directoryFilters.manglikFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Horoscope & Kundli Milan Desk (कुंडली एवं जन्मपत्री)"
        description="Vedic Ashtakoota 36-Guna matching algorithm, Gotra exogamy safeguards, Manglik Dosha validation & automated match notifications."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#DB2F3C]" />
            Jeevansathi & BharatMatrimony Standard
          </span>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Horoscopes Indexed</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{members.length}</div>
          <span className="text-[11px] text-slate-400">Birth charts & Gotras linked</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Auspicious (24+ Gunas)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {Math.round(members.length * 0.42)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">High compatibility potential</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Manglik Candidates</span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {members.filter((m) => m.manglik === 'Manglik' || m.manglik === 'Anshik Manglik').length}
          </div>
          <span className="text-[11px] text-slate-400">Tracked for Kuja Dosha</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Min. Guna Threshold</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{settings.minGunasThreshold} / 36</div>
          <span className="text-[11px] text-purple-600 font-semibold">Configured policy</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('SIMULATOR')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SIMULATOR'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Kundli Milan Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MEMBERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'MEMBERS'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Member Horoscopes Directory</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BATCH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'BATCH'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Batch Notifications Desk</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SETTINGS'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Astro Matching Policies</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DISPATCH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'DISPATCH'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-rose-300" />
          <span>Send Horoscope to User (प्रेषण डेस्क)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. KUNDLI MILAN SIMULATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6">
          {/* Pair Selector Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#88131B]" />
              Select Groom & Bride to Run 36-Guna Kundli Milan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Groom Picker */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  Groom (वर पक्ष)
                </span>
                <CustomDropDown
                  value={simulatorForm.selectedGroomId}
                  onChange={(val) => setSimulatorFieldValue('selectedGroomId', String(val))}
                  options={maleMembers.map((m) => ({
                    value: m.id,
                    label: `${m.fullName} (${m.uniqueId}) • Gotra: ${m.gotra || 'Kashyap'}`,
                  }))}
                  size="sm"
                />
              </div>

              {/* Bride Picker */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-rose-700" />
                  Bride (वधू पक्ष)
                </span>
                <CustomDropDown
                  value={simulatorForm.selectedBrideId}
                  onChange={(val) => setSimulatorFieldValue('selectedBrideId', String(val))}
                  options={femaleMembers.map((m) => ({
                    value: m.id,
                    label: `${m.fullName} (${m.uniqueId}) • Gotra: ${m.gotra || 'Vashishta'}`,
                  }))}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Milan Result Presentation */}
          {milanResult && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
              {/* Top Score Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200/80">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#88131B] text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-black text-amber-300 leading-none">
                      {milanResult.totalGunas}
                    </span>
                    <span className="text-[10px] font-bold text-white/80">/ 36 Gunas</span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        milanResult.verdict === 'EXCELLENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : milanResult.verdict === 'VERY_GOOD'
                          ? 'bg-blue-100 text-blue-800'
                          : milanResult.verdict === 'AVERAGE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {milanResult.verdictLabel}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {milanResult.groomName} & {milanResult.brideName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Gotras: {milanResult.groomGotra} × {milanResult.brideGotra} • {milanResult.percentage}% Compatibility Match
                    </p>
                  </div>
                </div>

                {/* Send Notification Button */}
                <button
                  type="button"
                  onClick={() => handleSendNotification(milanResult)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Kundli Match Notification to Both Users</span>
                </button>
              </div>

              {/* Gotra & Manglik Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gotra Exogamy Check Card */}
                <div
                  className={`p-4 rounded-2xl border ${
                    milanResult.sameGotraViolation
                      ? 'bg-rose-50/80 border-rose-300 text-rose-900'
                      : 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5 uppercase">
                    {milanResult.sameGotraViolation ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    Sindhi Gotra Exogamy Status
                  </span>
                  <p className="text-xs mt-1 font-medium">
                    {milanResult.sameGotraViolation
                      ? `⚠️ Sagotra Collision: Both belong to "${milanResult.groomGotra}" Gotra. Same gotra marriage is prohibited in traditional Sindhi Vedic customs.`
                      : `✅ Gotra Clean: Groom (${milanResult.groomGotra}) and Bride (${milanResult.brideGotra}) belong to different Vedic Gotras.`}
                  </p>
                </div>

                {/* Manglik Status Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
                  <span className="text-xs font-bold flex items-center gap-1.5 uppercase text-slate-700">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Manglik (Kuja Dosha) Compatibility
                  </span>
                  <p className="text-xs mt-1 text-slate-600">
                    Groom: <strong>{milanResult.groomManglik}</strong> • Bride: <strong>{milanResult.brideManglik}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{milanResult.manglikNote}</p>
                </div>
              </div>

              {/* Ashtakoota 8-Guna Milan Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#88131B]" />
                  Ashtakoota 8-Guna Breakdown Table (अष्टकूट 36 गुण मिलान विवरण)
                </h4>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3"># Koota</th>
                        <th className="p-3">Name (कूट नाम)</th>
                        <th className="p-3">Meaning / Area of Life</th>
                        <th className="p-3 text-center">Max Points</th>
                        <th className="p-3 text-center">Obtained</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { num: 1, name: 'Varna (वर्ण)', ...milanResult.breakdown.varna },
                        { num: 2, name: 'Vashya (वश्य)', ...milanResult.breakdown.vashya },
                        { num: 3, name: 'Tara (तारा)', ...milanResult.breakdown.tara },
                        { num: 4, name: 'Yoni (योनि)', ...milanResult.breakdown.yoni },
                        { num: 5, name: 'Graha Maitri (ग्रह मैत्री)', ...milanResult.breakdown.grahaMaitri },
                        { num: 6, name: 'Gana (गण)', ...milanResult.breakdown.gana },
                        { num: 7, name: 'Bhakoot (भकूट)', ...milanResult.breakdown.bhakoot },
                        { num: 8, name: 'Nadi (नाड़ी)', ...milanResult.breakdown.nadi },
                      ].map((k) => (
                        <tr key={k.num} className="hover:bg-slate-50/70 transition">
                          <td className="p-3 text-slate-400 font-mono text-[11px]">{k.num}</td>
                          <td className="p-3 font-bold text-slate-900">{k.name}</td>
                          <td className="p-3 text-slate-500">{k.description}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-600">{k.max}</td>
                          <td className="p-3 text-center font-mono font-bold text-[#88131B]">{k.obtained}</td>
                          <td className="p-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                k.obtained === k.max
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : k.obtained > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {k.obtained === k.max ? 'Full Score' : k.obtained > 0 ? 'Partial' : 'Dosha / 0'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                        <td colSpan={3} className="p-3 text-slate-900 uppercase tracking-wider text-xs">
                          Total Ashtakoota Score
                        </td>
                        <td className="p-3 text-center font-mono font-black text-slate-900">36</td>
                        <td className="p-3 text-center font-mono font-black text-[#88131B] text-sm">
                          {milanResult.totalGunas}
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-bold text-emerald-700">{milanResult.percentage}% Match</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations Box */}
              {milanResult.recommendations.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <span className="text-xs font-bold text-amber-900 block">
                    Astrological Observations & Recommendations:
                  </span>
                  {milanResult.recommendations.map((rec, i) => (
                    <div key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MEMBER HOROSCOPES DIRECTORY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registered Members Kundli Dossier</h3>
              <p className="text-xs text-slate-500">
                Inspect Gotra, Rashi, Nakshatra, and Manglik status for active candidates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-64">
                <CustomTextInput
                  type="text"
                  placeholder="Search name, gotra, rashi..."
                  value={directoryFilters.memberSearch}
                  onChange={(e) => setDirectoryFilterValue('memberSearch', e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                  size="sm"
                />
              </div>

              <div className="w-44">
                <CustomDropDown
                  value={directoryFilters.manglikFilter}
                  onChange={(val) => setDirectoryFilterValue('manglikFilter', String(val))}
                  options={[
                    { value: 'ALL', label: 'All Manglik Status' },
                    { value: 'NON_MANGLIK', label: 'Non-Manglik' },
                    { value: 'MANGLIK', label: 'Manglik' },
                    { value: 'ANSHIK_MANGLIK', label: 'Anshik Manglik' },
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Profile</th>
                  <th className="p-3">Gender & Age</th>
                  <th className="p-3">Subcaste</th>
                  <th className="p-3">Vedic Gotra</th>
                  <th className="p-3">Rashi (Moon Sign)</th>
                  <th className="p-3">Nakshatra</th>
                  <th className="p-3">Manglik Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold text-slate-900">
                      {m.fullName}
                      <span className="block text-[10px] font-mono text-slate-400">{m.uniqueId}</span>
                    </td>
                    <td className="p-3 text-slate-700">
                      {m.gender} ({m.age} yrs)
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{m.subcaste}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {m.gotra || 'Kashyap'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{m.rashi || m.sunSign || 'Mesha'}</td>
                    <td className="p-3 text-slate-600">{m.nakshatra || m.nakshatram || 'Ashwini'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.manglik === 'Manglik'
                            ? 'bg-rose-100 text-rose-800'
                            : m.manglik === 'Anshik Manglik'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {m.manglik || 'Non-Manglik'}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openDispatchForMember(m.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold transition text-[11px] cursor-pointer mr-2 border border-rose-200"
                        title="Directly send horoscope to this user"
                      >
                        <Send className="w-3 h-3 text-rose-600" />
                        <span>Send Kundli</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBatchFieldValue('batchCandidateId', m.id);
                          setActiveTab('BATCH');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition text-[11px] cursor-pointer border border-slate-200"
                      >
                        <span>Find Astro Matches</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BATCH MATCHING & NOTIFICATION DESK TAB */}
      {/* ========================================================================= */}
      {activeTab === 'BATCH' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Kundli Match Dispatch Desk</h3>
              <p className="text-xs text-slate-500">
                Run batch horoscope matching for a candidate and broadcast instant match notifications to users.
              </p>
            </div>

            <div className="w-72">
              <CustomDropDown
                label="Target Candidate"
                value={batchForm.batchCandidateId}
                onChange={(val) => setBatchFieldValue('batchCandidateId', String(val))}
                options={members.map((m) => ({
                  value: m.id,
                  label: `${m.fullName} (${m.gender}, ${m.subcaste})`,
                }))}
                size="sm"
              />
            </div>
          </div>

          {batchCandidate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Top Astro Matches for {batchCandidate.fullName} (Sorted by Highest Guna Milan):
                </span>

                <button
                  type="button"
                  onClick={handleSendBatchNotifications}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Notifications for Top 3 Auspicious Matches</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchMatches.slice(0, 9).map((m, idx) => {
                  const partnerName = batchCandidate.gender === 'Male' ? m.brideName : m.groomName;
                  const partnerGotra = batchCandidate.gender === 'Male' ? m.brideGotra : m.groomGotra;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#88131B] transition shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{partnerName}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            m.totalGunas >= 24
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.totalGunas >= 18
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {m.totalGunas} / 36 Gunas
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div>Gotra: <strong className="text-slate-800">{partnerGotra}</strong></div>
                        <div>Verdict: <span className="font-semibold text-slate-700">{m.verdictLabel}</span></div>
                        {m.sameGotraViolation && (
                          <div className="text-rose-600 font-bold">⚠️ Same Gotra Violation</div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendNotification(m)}
                        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-[#88131B] border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Kundli Alert</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASTRO MATCHING POLICIES SETTINGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Vedic Horoscope & Kundli Policies</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure system-wide minimum Guna thresholds, Gotra exogamy safeguards, and auto-notification rules.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Minimum Guna Threshold to Recommend ({settings.minGunasThreshold} / 36 Gunas)
              </label>
              <input
                type="range"
                min={12}
                max={28}
                value={settings.minGunasThreshold}
                onChange={(e) => setSettingsFieldValue('minGunasThreshold', Number(e.target.value))}
                className="w-full accent-[#88131B] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Standard Vedic recommendation is 18 gunas. Pairs scoring below this will show as 'Not Recommended'.
              </span>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Strict Gotra Exogamy Rule</span>
                <span className="text-[11px] text-slate-500">
                  Block recommendations between candidates belonging to identical Gotra
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.strictGotraExogamy}
                onChange={(e) => setSettingsFieldValue('strictGotraExogamy', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Strict Manglik Matching</span>
                <span className="text-[11px] text-slate-500">
                  Enforce Kuja Dosha mutual cancellation (Manglik married to Manglik only)
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.strictManglikMatching}
                onChange={(e) => setSettingsFieldValue('strictManglikMatching', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Auto-Send Horoscope Notifications</span>
                <span className="text-[11px] text-slate-500">
                  Automatically alert users when a verified profile with 24+ Guna match registers
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSendMatchNotification}
                onChange={(e) => setSettingsFieldValue('autoSendMatchNotification', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600"
              />
            </label>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Save Policies
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DIRECT DISPATCH TAB: SEND HOROSCOPE TO USER */}
      {/* ========================================================================= */}
      {activeTab === 'DISPATCH' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-900 to-[#88131B] p-6 rounded-3xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/10 text-white">
                  <Send className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold">Direct Horoscope Dispatch Desk (कुंडली प्रेषण डेस्क)</h3>
              </div>
              <p className="text-xs text-rose-100 mt-1 max-w-2xl leading-relaxed">
                Send personal Janam Kundli reports or 36-Guna Kundli Milan compatibility summaries directly to any member via In-App Push, WhatsApp, SMS, or Email.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Relationship Manager & Pandit Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Dispatch Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#88131B]" />
                <span>Configure Horoscope Dispatch</span>
              </h4>

              <form onSubmit={handleDispatchHoroscope} className="space-y-4">
                {/* 1. Recipient Member Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Recipient Member (किसे भेजना है?):
                  </label>
                  <CustomDropDown
                    options={members.map((m) => ({
                      label: `${m.fullName} (${m.id}) — Gotra: ${m.gotra || 'Kashyap'} • ${m.gender}`,
                      value: m.id,
                    }))}
                    value={dispatchForm.dispatchMemberId}
                    onChange={(val) => setDispatchFieldValue('dispatchMemberId', String(val))}
                    placeholder="Choose member"
                  />
                </div>

                {/* 2. Report Type Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Report Type (कुंडली का प्रकार):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDispatchFieldValue('dispatchReportType', 'PERSONAL')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        dispatchForm.dispatchReportType === 'PERSONAL'
                          ? 'border-[#88131B] bg-rose-50/50 text-[#88131B] font-bold ring-1 ring-[#88131B]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mb-1 text-rose-700" />
                      <div className="text-xs font-bold">Personal Janam Kundli</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">User's birth chart, Rashi, Nakshatra & Manglik</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDispatchFieldValue('dispatchReportType', 'MATCH');
                        const recipient = members.find((m) => m.id === dispatchForm.dispatchMemberId);
                        const oppositeGender = recipient?.gender === 'Female' ? 'Male' : 'Female';
                        const firstOpposite = members.find((m) => m.gender === oppositeGender);
                        if (firstOpposite && !dispatchForm.dispatchPartnerId) {
                          setDispatchFieldValue('dispatchPartnerId', firstOpposite.id);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        dispatchForm.dispatchReportType === 'MATCH'
                          ? 'border-[#88131B] bg-rose-50/50 text-[#88131B] font-bold ring-1 ring-[#88131B]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className="w-4 h-4 mb-1 text-rose-700" />
                      <div className="text-xs font-bold">Kundli Milan (Match Report)</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">36-Guna compatibility with a candidate</div>
                    </button>
                  </div>
                </div>

                {/* 3. Partner Candidate (if MATCH mode) */}
                {dispatchForm.dispatchReportType === 'MATCH' && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <label className="text-xs font-bold text-amber-900 block">
                      Select Match Candidate (किसके साथ मिलान रिपोर्ट भेजनी है?):
                    </label>
                    <CustomDropDown
                      options={members
                        .filter((m) => {
                          const recipient = members.find((rec) => rec.id === dispatchForm.dispatchMemberId);
                          return recipient ? m.gender !== recipient.gender : true;
                        })
                        .map((m) => ({
                          label: `${m.fullName} (${m.id}) — Gotra: ${m.gotra || 'Kashyap'} • ${m.subcaste}`,
                          value: m.id,
                        }))}
                      value={dispatchForm.dispatchPartnerId}
                      onChange={(val) => setDispatchFieldValue('dispatchPartnerId', String(val))}
                      placeholder="Select candidate partner"
                    />
                  </div>
                )}

                {/* 4. Delivery Channel Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Delivery Channel (किस माध्यम से भेजें?):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare, desc: 'Instant PDF' },
                      { id: 'PUSH', label: 'Push Alert', icon: Bell, desc: 'Mobile App' },
                      { id: 'SMS', label: 'SMS Text', icon: Smartphone, desc: 'Web Link' },
                      { id: 'EMAIL', label: 'Email', icon: Mail, desc: 'Full Report' },
                    ].map((ch) => {
                      const Icon = ch.icon;
                      const active = dispatchForm.dispatchChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setDispatchFieldValue('dispatchChannel', ch.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            active
                              ? 'border-[#88131B] bg-[#88131B] text-white font-bold shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                          <span className="text-xs">{ch.label}</span>
                          <span className={`text-[9px] ${active ? 'text-rose-100' : 'text-slate-400'}`}>
                            {ch.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Custom Note / Relationship Manager Remarks */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Pandit / Relationship Manager Remarks (संदेश):
                  </label>
                  <textarea
                    rows={3}
                    value={dispatchForm.dispatchCustomNote}
                    onChange={(e) => setDispatchFieldValue('dispatchCustomNote', e.target.value)}
                    placeholder="E.g. Kundli match verified by Pandit Ji: 28/36 Gunas matched..."
                    className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#88131B] bg-slate-50 resize-none text-slate-800"
                  />
                </div>

                {/* Submit Dispatch Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-rose-300" />
                    <span>Send Horoscope to User Now (अभी कुंडली भेजें)</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Live Preview & Dispatch History (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Preview Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Live User Notification Preview</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {dispatchForm.dispatchChannel} Preview
                  </span>
                </div>

                {/* Simulated Notification Box */}
                {(() => {
                  const recipient = members.find((m) => m.id === dispatchForm.dispatchMemberId);
                  const partner = members.find((m) => m.id === dispatchForm.dispatchPartnerId);
                  return (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/80 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#88131B] text-white flex items-center justify-center text-xs font-black">
                            🕉️
                          </span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-900 block">
                              Sindhi Matrimony Astro Desk
                            </span>
                            <span className="text-[9px] text-slate-400">Just now • Direct Dispatch</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <p className="text-xs font-black text-rose-950">
                          {dispatchForm.dispatchReportType === 'PERSONAL'
                            ? `📜 Janam Kundli Report for ${recipient?.fullName || 'Member'}`
                            : `✨ Auspicious Kundli Match: ${partner ? `${recipient?.fullName} & ${partner.fullName}` : 'Candidates'}`}
                        </p>
                        <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                          {dispatchForm.dispatchReportType === 'PERSONAL'
                            ? `Gotra: ${recipient?.gotra || 'Kashyap'} • Rashi: ${recipient?.rashi || recipient?.sunSign || 'Mesha'} • Nakshatra: ${recipient?.nakshatra || recipient?.nakshatram || 'Ashwini'}. Manglik: ${recipient?.manglik || 'Non-Manglik'}.`
                            : `Astrological match indicates high marital harmony. Gotras verified: ${recipient?.gotra || 'Kashyap'} & ${partner?.gotra || 'Nankani'}.`}
                        </p>
                        {dispatchForm.dispatchCustomNote && (
                          <p className="text-[10px] text-amber-900 bg-white/70 p-2 rounded-xl mt-2 italic border border-amber-200/50">
                            "{dispatchForm.dispatchCustomNote}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-end">
                        <span className="text-[10px] font-bold text-[#88131B] flex items-center gap-1">
                          <span>View Full Kundli PDF</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Recent Dispatches Log */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Recent Dispatches Audit Log</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{dispatchHistory.length} sent today</span>
                </div>

                <div className="space-y-2">
                  {dispatchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.recipientName}</span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.reportType} • {item.channel}
                        </span>
                        <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{item.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HoroscopeScreen.displayName = 'HoroscopeScreen';
export default HoroscopeScreen;
