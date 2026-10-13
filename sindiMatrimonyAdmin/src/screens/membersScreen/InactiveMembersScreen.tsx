import React, { useMemo, useEffect } from 'react';
import {
  Search,
  UserX,
  RotateCcw,
  Trash2,
  Download,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { memberDataService } from '../../services/memberDataService';
import type { MatrimonialMember } from '../../services/memberDataService';
import { toast } from '../../toastMessage/toast';
import { useGlobalModal } from '../../customModals/ModalContext';
import { useInputs } from '../../customHooks/useInputs';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';

export interface InactiveMembersState {
  members: MatrimonialMember[];
  search: string;
  statusFilter: string;
}

export const InactiveMembersScreen: React.FC = () => {
  const { openUserProfile } = useGlobalModal();

  const { values, setFieldValue } = useInputs<InactiveMembersState>(() => ({
    members: memberDataService.getInactiveMembers(),
    search: '',
    statusFilter: 'ALL',
  }));

  useEffect(() => {
    const unsub = memberDataService.subscribe(() => {
      setFieldValue('members', memberDataService.getInactiveMembers());
    });
    return unsub;
  }, [setFieldValue]);

  const filtered = useMemo(() => {
    return values.members.filter((m) => {
      if (values.statusFilter !== 'ALL' && m.status !== values.statusFilter) return false;

      if (!values.search.trim()) return true;
      const q = values.search.trim().toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchId = m.id.toLowerCase().includes(q) || m.uniqueId.toLowerCase().includes(q);
      const matchMobile = m.mobile.toLowerCase().includes(q);
      const matchCity = m.city.toLowerCase().includes(q);

      return matchName || matchId || matchMobile || matchCity;
    });
  }, [values.members, values.search, values.statusFilter]);

  const handleActivate = (member: MatrimonialMember) => {
    memberDataService.updateMember(member.id, { status: 'ACTIVE' });
    toast.success(`Member ${member.fullName} (${member.uniqueId}) has been reactivated successfully!`);
  };

  const handleDelete = (member: MatrimonialMember) => {
    if (window.confirm(`Are you sure you want to permanently delete profile of ${member.fullName}?`)) {
      memberDataService.deleteMember(member.id);
      toast.info(`Member ${member.fullName} permanently removed.`);
    }
  };

  const handleExport = () => {
    memberDataService.exportMembersCSV(filtered, 'inactive_members_list');
    toast.success(`Exported ${filtered.length} inactive profiles.`);
  };

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  All Inactive Members
                </h1>
                <nav className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-600">Members</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-amber-600 font-bold">Inactive Profiles</span>
                </nav>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-xl">
              Directory of paused accounts, expired memberships, and moderation-flagged profiles. You can review details or reactivate them with 1 click.
            </p>
          </div>

          {/* Search Box */}
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
              value={values.statusFilter}
              onChange={(val) => setFieldValue('statusFilter', String(val))}
              options={[
                { value: 'ALL', label: 'All Inactive Reasons' },
                { value: 'INACTIVE', label: 'Deactivated' },
                { value: 'EXPIRED', label: 'Subscription Expired' },
                { value: 'SUSPENDED', label: 'Moderation Suspended' },
              ]}
              size="sm"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Inactive List</span>
            </button>
            <span className="text-xs text-slate-500 font-medium ml-2">
              Showing <strong className="text-slate-800">{filtered.length}</strong> Inactive Records
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              {values.members.filter((m) => m.status === 'SUSPENDED').length} Suspended
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              {values.members.filter((m) => m.status === 'EXPIRED').length} Expired
            </span>
          </div>
        </div>
      </div>

      {/* Inactive Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white font-black tracking-wider text-[11px] uppercase">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Unique ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3.5">Mobile</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3">Age</th>
                <th className="py-3 px-3.5">City</th>
                <th className="py-3 px-3.5">Last Plan</th>
                <th className="py-3 px-3.5">Status Reason</th>
                <th className="py-3 px-4 text-right">Reactivate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    No inactive members found matching criteria.
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
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleActivate(member)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 cursor-pointer"
                          title="Restore and activate this member"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

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

                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openUserProfile(member)}
                        className="text-left hover:text-[#C81E28] hover:underline cursor-pointer font-bold"
                        title="View user details"
                      >
                        {member.fullName}
                      </button>
                      {member.notes && (
                        <div className="text-[10px] font-normal text-slate-400 truncate max-w-xs">
                          {member.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {member.mobile}
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {member.gender}
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {member.age}
                    </td>

                    <td className="py-3 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {member.city}
                    </td>

                    <td className="py-3 px-3.5 font-bold text-slate-600 whitespace-nowrap">
                      {member.plan}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          member.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : member.status === 'EXPIRED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleActivate(member)}
                        className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#C81E28] hover:bg-[#a61720] text-white shadow-2xs transition cursor-pointer"
                      >
                        Activate Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InactiveMembersScreen;
