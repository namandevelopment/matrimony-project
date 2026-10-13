import React from 'react';
import { Clock } from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface RecentMemberItem {
  sNo: number;
  name: string;
  businessType: string;
  email: string;
  joinedOn: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface RecentRegistrationsTableProps {
  members?: RecentMemberItem[];
}

export const defaultRecentMembers: RecentMemberItem[] = [
  {
    sNo: 1,
    name: 'JITAMITRA DHARMADHIKARY',
    businessType: 'Software Architect',
    email: 'jitamitra@example.com',
    joinedOn: '10 Oct 2026',
    status: 'Active',
  },
  {
    sNo: 2,
    name: 'ABHISHEK SINGH RAIZADA',
    businessType: 'Business & Real Estate',
    email: 'abhishek.r@example.com',
    joinedOn: '08 Oct 2026',
    status: 'Active',
  },
  {
    sNo: 3,
    name: 'SACHIN CHAUHAN',
    businessType: 'Civil Services',
    email: 'sachin.c@example.com',
    joinedOn: '08 Oct 2026',
    status: 'Active',
  },
  {
    sNo: 4,
    name: 'HARSHIT PUROHIT',
    businessType: 'Chartered Accountant',
    email: 'harshit.p@example.com',
    joinedOn: '08 Oct 2026',
    status: 'Active',
  },
  {
    sNo: 5,
    name: 'MANISH KUMAR',
    businessType: 'Senior Data Scientist',
    email: 'manish.k@example.com',
    joinedOn: '07 Oct 2026',
    status: 'Active',
  },
  {
    sNo: 6,
    name: 'VARUN ROHRA (LOHANA)',
    businessType: 'FinTech Entrepreneur',
    email: 'varun.rohra@example.com',
    joinedOn: '07 Oct 2026',
    status: 'Active',
  },
];

interface RecentMemberRowProps {
  member: RecentMemberItem;
}

export const RecentMemberRow: React.FC<RecentMemberRowProps> = memoWithDeepEqual(({ member }) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-500">
        {member.sNo}
      </td>
      <td className="py-3.5 px-4 font-bold text-slate-900 tracking-wide">
        {member.name}
      </td>
      <td className="py-3.5 px-4 text-slate-600 font-medium">
        {member.businessType}
      </td>
      <td className="py-3.5 px-4 text-slate-500 font-mono">
        {member.email}
      </td>
      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
        {member.joinedOn}
      </td>
      <td className="py-3.5 px-4 text-center whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
          {member.status}
        </span>
      </td>
    </tr>
  );
});

RecentMemberRow.displayName = 'RecentMemberRow';

export const RecentRegistrationsTable: React.FC<RecentRegistrationsTableProps> = memoWithDeepEqual(({
  members = defaultRecentMembers,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Section Title */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Member Registrations
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing latest verified candidates
        </span>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto p-4 sm:p-6">
        <table className="w-full text-left border-collapse">
          {/* Table Header: Crimson Ruby Red Banner with rounded corners matching screenshot */}
          <thead>
            <tr className="bg-gradient-to-r from-[#DB2F3C] to-[#B71F2A] text-white text-xs font-bold uppercase tracking-wider rounded-xl overflow-hidden shadow-sm">
              <th className="py-3.5 px-4 rounded-l-xl w-16 text-center">S.No</th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Business / Profession</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Joined On</th>
              <th className="py-3.5 px-4 rounded-r-xl text-center">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs">
            {members.map((member) => (
              <RecentMemberRow key={member.sNo} member={member} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RecentRegistrationsTable.displayName = 'RecentRegistrationsTable';
