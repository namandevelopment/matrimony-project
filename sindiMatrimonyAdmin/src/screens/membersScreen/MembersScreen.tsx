import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Crown,
  Eye,
  Download,
  UserPlus,
  Users,
  ExternalLink,
  User,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { FilterBar } from '../../components/FilterBar';
import { DataTable } from '../../components/DataTable';
import { CustomButton } from '../../components/CustomButton';
import type { Column } from '../../components/DataTable';
import { memberDataService } from '../../services/memberDataService';
import type { MatrimonialMember } from '../../services/memberDataService';
import { subcasteGotraService } from '../../services/subcasteGotraService';
import { toast } from '../../toastMessage/toast';
import { useGlobalModal } from '../../customModals/ModalContext';
import { useInputs } from '../../customHooks/useInputs';
import { useMembersQuery } from '../../tanstackQuery';

export interface MembersScreenState {
  members: MatrimonialMember[];
  search: string;
  selectedSubcaste: string;
  selectedPlan: string;
}

export const MembersScreen: React.FC = () => {
  const { openUserProfile } = useGlobalModal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // TanStack Query: Cached for 5 minutes, 0 repeated API hits on navigation
  const { members: apiMembers, isLoading } = useMembersQuery();

  // Fallback dummy members preserved per project guidelines
  // const initialFallbackMembers = memberDataService.getMembers();

  const { values, setFieldValue, bind } = useInputs<MembersScreenState>(() => ({
    members: memberDataService.getMembers(),
    search: '',
    selectedSubcaste: 'ALL',
    selectedPlan: 'ALL',
  }));

  // Sync live API members into state when available
  useEffect(() => {
    if (apiMembers && apiMembers.length > 0) {
      const mapped: MatrimonialMember[] = apiMembers.map((m: any, idx: number) => ({
        id: String(m._id || m.id || idx + 101000),
        uniqueId: m.profileId || m.uniqueId || `S${idx + 1000}`,
        fullName: m.fullName || m.name || 'Sindhi Candidate',
        mobile: m.mobile || m.phone || '—',
        gender: m.gender === 'Female' ? 'Female' : 'Male',
        age: Number(m.age) || 27,
        subcaste: m.subcaste || 'Amil',
        city: m.city || 'Mumbai',
        state: m.state || 'Maharashtra',
        plan: (m.membershipTier || m.plan || 'FREE').toUpperCase() as any,
        status: (m.status || 'ACTIVE').toUpperCase() as any,
        isVerified: Boolean(m.isVerified ?? m.isProfileVerified),
        created: m.createdAt
          ? new Date(m.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '10 Oct 2026',
        createdAtTimestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
        gotra: m.gotra,
        maritalStatus: m.maritalStatus || 'Never Married',
      }));
      setFieldValue('members', mapped);
    }
  }, [apiMembers, setFieldValue]);

  const genderQuery = searchParams.get('gender')?.toLowerCase();

  useEffect(() => {
    const unsub = memberDataService.subscribe(() => {
      setFieldValue('members', memberDataService.getMembers());
    });
    return unsub;
  }, [setFieldValue]);

  const filtered = useMemo(() => {
    return values.members.filter((m) => {
      // Gender query filter from URL (?gender=male or ?gender=female)
      if (genderQuery) {
        if (genderQuery === 'male' && m.gender !== 'Male') return false;
        if (genderQuery === 'female' && m.gender !== 'Female') return false;
      }

      if (values.selectedSubcaste !== 'ALL' && m.subcaste !== values.selectedSubcaste) return false;
      if (values.selectedPlan !== 'ALL' && m.plan !== values.selectedPlan) return false;

      if (values.search) {
        const q = values.search.toLowerCase();
        return (
          m.fullName.toLowerCase().includes(q) ||
          m.uniqueId.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.mobile.includes(q)
        );
      }
      return true;
    });
  }, [values.members, genderQuery, values.selectedSubcaste, values.selectedPlan, values.search]);

  const handleExport = () => {
    memberDataService.exportMembersCSV(filtered, 'members_directory');
    toast.success(`Exported ${filtered.length} member profiles to CSV.`);
  };

  const columns = useMemo<Column<MatrimonialMember>[]>(() => [
    {
      key: 'profile',
      header: 'Profile ID & Member',
      render: (member) => (
        <div>
          <button
            type="button"
            onClick={() => openUserProfile(member)}
            className="font-bold text-slate-900 hover:text-[#C81E28] hover:underline text-left cursor-pointer transition"
            title="Click to view full user profile"
          >
            {member.fullName}
          </button>
          <div className="text-[10px] font-mono text-slate-400">
            <button
              type="button"
              onClick={() => openUserProfile(member)}
              className="hover:text-slate-600 cursor-pointer"
            >
              {member.uniqueId} (ID: {member.id})
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'genderAge',
      header: 'Gender & Age',
      render: (member) => (
        <span className="text-slate-700">
          {member.gender === 'Female' ? 'Bride' : 'Groom'} ({member.age} yrs)
        </span>
      ),
    },
    {
      key: 'subcaste',
      header: 'Sindhi Subcaste',
      render: (member) => <span className="font-medium text-slate-800">{member.subcaste}</span>,
    },
    {
      key: 'city',
      header: 'Location',
      render: (member) => <span className="text-slate-600">{member.city}</span>,
    },
    {
      key: 'plan',
      header: 'Plan Tier',
      render: (member) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
            member.plan === 'PLATINUM'
              ? 'bg-purple-100 text-purple-700'
              : member.plan === 'GOLD'
              ? 'bg-amber-100 text-amber-800'
              : member.plan === 'SILVER'
              ? 'bg-sky-100 text-sky-800'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Crown className="w-3 h-3" />
          {member.plan}
        </span>
      ),
    },
    {
      key: 'isVerified',
      header: 'KYC Verified',
      render: (member) =>
        member.isVerified ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Blue Tick
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            Pending KYC
          </span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (member) => (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
            member.status === 'ACTIVE'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {member.status}
        </span>
      ),
    },
    {
      key: 'joinedDate',
      header: 'Joined Date',
      render: (member) => <span className="text-slate-500">{member.created}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (member) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            title="Download Member Slip"
            onClick={() => {
              memberDataService.exportSingleMemberSlip(member);
              toast.success(`Dossier for ${member.fullName} downloaded.`);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            title="Quick Profile Modal Preview"
            onClick={() => {
              openUserProfile(member);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#C81E28] hover:bg-rose-50 cursor-pointer transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            title="Open Dedicated Profile Details Screen"
            onClick={() => {
              navigate(`/members/profile-details-by-id/${member.id}`);
            }}
            className="p-1.5 rounded-lg text-[#C81E28] hover:text-[#991B1B] hover:bg-rose-100 cursor-pointer transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ], [openUserProfile, navigate]);

  return (
    <div className="space-y-5">
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => navigate('/members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              !genderQuery
                ? 'bg-[#C81E28] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Members ({values.members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/members/paid')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Paid Members ({memberDataService.getPaidMembers().length})</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/members/inactive')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <span>Inactive Members ({memberDataService.getInactiveMembers().length})</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/members/profile-details-by-id/101037')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#C81E28] hover:bg-rose-50 transition cursor-pointer"
            title="Open Dedicated Profile Details by ID Screen"
          >
            <User className="w-4 h-4 text-[#C81E28]" />
            <span>Profile Details by ID</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/members/add')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer ml-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      <PageHeader
        title={
          genderQuery === 'male'
            ? 'Groom Profiles Directory'
            : genderQuery === 'female'
            ? 'Bride Profiles Directory'
            : 'Member Profiles Directory'
        }
        description="Manage registered brides, grooms, KYC verifications, and subscription tiers"
        actions={
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              size="md"
              onClick={handleExport}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export Members
            </CustomButton>
            <button
              type="button"
              onClick={() => navigate('/members/add')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#C81E28] hover:bg-[#a61720] text-white shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        }
      />

      <FilterBar
        search={values.search}
        onSearchChange={(val) => setFieldValue('search', val)}
        placeholder="Search Member by Profile ID, Name, City, Mobile..."
        filters={
          <>
            <select
              {...bind('selectedSubcaste')}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Subcastes</option>
              {subcasteGotraService.getSubcastes().filter((s) => s.active).map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              {...bind('selectedPlan')}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Plans</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
              <option value="FREE">Free</option>
            </select>
          </>
        }
      />

      {/* Initial loading indicator: shows only once when starting with zero data */}
      {isLoading && values.members.length === 0 && (
        <div className="flex items-center justify-center p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold gap-2 animate-pulse mb-4">
          <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          Loading member directory from server...
        </div>
      )}

      <DataTable columns={columns} data={filtered} totalRecords={filtered.length} />
    </div>
  );
};

export default MembersScreen;
