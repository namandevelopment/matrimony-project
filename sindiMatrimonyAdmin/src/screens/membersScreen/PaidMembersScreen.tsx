import React, { useMemo, useEffect } from 'react';
import {
  Download,
  Search,
  Users,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { memberDataService } from '../../services/memberDataService';
import type { MatrimonialMember } from '../../services/memberDataService';
import { AllottedMembersModal } from './components/AllottedMembersModal';
import { toast } from '../../toastMessage/toast';
import { useGlobalModal } from '../../customModals/ModalContext';
import { useInputs } from '../../customHooks/useInputs';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';

export interface PaidMembersState {
  members: MatrimonialMember[];
  search: string;
  selectedPlan: string;
  selectedMemberForAllotment: MatrimonialMember | null;
}

export const PaidMembersScreen: React.FC = () => {
  const { openUserProfile } = useGlobalModal();

  const { values, setFieldValue } = useInputs<PaidMembersState>(() => ({
    members: memberDataService.getPaidMembers(),
    search: '',
    selectedPlan: 'ALL',
    selectedMemberForAllotment: null,
  }));

  // Subscribe to real-time member updates
  useEffect(() => {
    const unsub = memberDataService.subscribe(() => {
      setFieldValue('members', memberDataService.getPaidMembers());
    });
    return unsub;
  }, [setFieldValue]);

  // Filter paid members by Name, ID, Mobile, or Plan
  const filtered = useMemo(() => {
    return values.members.filter((m) => {
      if (values.selectedPlan !== 'ALL' && m.plan !== values.selectedPlan) return false;

      if (!values.search.trim()) return true;
      const q = values.search.trim().toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchId = m.id.toLowerCase().includes(q) || m.uniqueId.toLowerCase().includes(q);
      const matchMobile = m.mobile.toLowerCase().includes(q);
      const matchCity = m.city.toLowerCase().includes(q);

      return matchName || matchId || matchMobile || matchCity;
    });
  }, [values.members, values.search, values.selectedPlan]);

  const handleDownloadFullExcel = () => {
    memberDataService.exportMembersCSV(filtered, 'paid_members_backup');
    toast.success(`Exported ${filtered.length} paid member records to Excel.`);
  };

  const handleDownloadSingleExcel = (member: MatrimonialMember) => {
    memberDataService.exportSingleMemberSlip(member);
    toast.success(`Excel dossier for ${member.fullName} downloaded.`);
  };

  return (
    <div className="space-y-5">
      {/* Page Header matching exact screenshot layout */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Paid Members
            </h1>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-600">Members</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-[#C81E28] font-bold">Paid Members</span>
            </nav>
          </div>

          {/* Right Controls: Search Name / ID / Mobile and Plan filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-72">
              <CustomTextInput
                value={values.search}
                onChange={(e) => setFieldValue('search', e.target.value)}
                placeholder="Search Name / ID / Mobile"
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                clearable={true}
                onClear={() => setFieldValue('search', '')}
                size="sm"
              />
            </div>

            <CustomDropDown
              value={values.selectedPlan}
              onChange={(val) => setFieldValue('selectedPlan', String(val))}
              options={[
                { value: 'ALL', label: 'All Paid Tiers' },
                { value: 'PLATINUM', label: 'Platinum' },
                { value: 'GOLD', label: 'Gold' },
                { value: 'SILVER', label: 'Silver' },
                { value: 'TILL_MARRIAGE', label: 'Till Marriage' },
              ]}
              size="sm"
            />
          </div>
        </div>

        {/* Action Button: Download Full Excel Backup */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadFullExcel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download Full Excel Backup</span>
            </button>
            <span className="text-xs text-slate-500 font-medium ml-2">
              Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
              <strong className="text-slate-800">{values.members.length}</strong> Paid Members
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <Crown className="w-3 h-3 text-purple-600" />
              {values.members.filter((m) => m.plan === 'PLATINUM').length} Platinum
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Crown className="w-3 h-3 text-amber-600" />
              {values.members.filter((m) => m.plan === 'GOLD').length} Gold
            </span>
          </div>
        </div>
      </div>

      {/* Paid Members Table with Crimson Red Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#B91C1C] text-white font-black tracking-wider text-[11px] uppercase">
                <th className="py-3 px-3.5 whitespace-nowrap">Action</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Action</th>
                <th className="py-3 px-3 whitespace-nowrap">ID</th>
                <th className="py-3 px-3 whitespace-nowrap">Unique ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Name</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Mobile</th>
                <th className="py-3 px-3 whitespace-nowrap">Gender</th>
                <th className="py-3 px-2.5 whitespace-nowrap">Age</th>
                <th className="py-3 px-3.5 whitespace-nowrap">City</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Plan</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No paid members found matching your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((member, idx) => (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/90 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Action 1: Allotted Members button */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setFieldValue('selectedMemberForAllotment', member)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#C81E28] hover:bg-[#a61720] text-white shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                        title="View allotted matrimonial candidates"
                      >
                        Allotted Members
                      </button>
                    </td>

                    {/* Action 2: Excel button */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleExcel(member)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#C81E28] hover:bg-[#a61720] text-white shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                        title="Download member excel dossier"
                      >
                        Excel
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openUserProfile(member)}
                        className="hover:text-[#C81E28] hover:underline cursor-pointer"
                        title="View user details"
                      >
                        {member.id}
                      </button>
                    </td>

                    {/* Unique ID */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openUserProfile(member)}
                        className="hover:text-[#C81E28] hover:underline cursor-pointer"
                        title="View user details"
                      >
                        {member.uniqueId}
                      </button>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openUserProfile(member)}
                        className="text-left hover:text-[#C81E28] hover:underline cursor-pointer font-bold"
                        title="View user details"
                      >
                        {member.fullName}
                      </button>
                    </td>

                    {/* Mobile */}
                    <td className="py-3 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {member.mobile}
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {member.gender}
                    </td>

                    {/* Age */}
                    <td className="py-3 px-2.5 text-slate-700 whitespace-nowrap">
                      {member.age}
                    </td>

                    {/* City */}
                    <td className="py-3 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {member.city}
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`font-black text-[11px] uppercase tracking-wider ${
                          member.plan === 'PLATINUM'
                            ? 'text-emerald-600'
                            : member.plan === 'GOLD'
                            ? 'text-amber-600'
                            : member.plan === 'SILVER'
                            ? 'text-sky-600'
                            : 'text-purple-600'
                        }`}
                      >
                        {member.plan}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-[#C81E28] bg-rose-50 border border-rose-200">
                        Active
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {member.created}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allotted Members Modal */}
      <AllottedMembersModal
        isOpen={Boolean(values.selectedMemberForAllotment)}
        member={values.selectedMemberForAllotment}
        onClose={() => setFieldValue('selectedMemberForAllotment', null)}
      />
    </div>
  );
};

export default PaidMembersScreen;
