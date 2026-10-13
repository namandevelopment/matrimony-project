import React, { useState, useEffect } from 'react';
import {
  Search,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { MatchRecommendation } from '../../types/crm.types';
import { PageHeader } from '../../components/PageHeader';
import { CustomTextInput } from '../../components/CustomTextInput';
import { useInputs } from '../../customHooks/useInputs';

export interface MatchResponsesFilterValues {
  filterStatus: string;
  search: string;
}

export const MatchResponsesScreen: React.FC = () => {
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const { values: filters, setFieldValue } = useInputs<MatchResponsesFilterValues>({
    filterStatus: 'ALL',
    search: '',
  });

  const refresh = () => {
    setMatches(crmDataService.getMatches());
  };

  useEffect(() => {
    refresh();
    return crmDataService.subscribe(refresh);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filters.filterStatus === 'MUTUAL' && m.overallStatus !== 'MUTUAL_INTEREST') return false;
    if (filters.filterStatus === 'PENDING_CLIENT' && m.clientResponse !== 'PENDING') return false;
    if (filters.filterStatus === 'PENDING_CANDIDATE' && m.candidateResponse !== 'PENDING') return false;
    if (filters.filterStatus === 'DECLINED' && !m.overallStatus.includes('DECLINED')) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        m.matchId.toLowerCase().includes(q) ||
        m.clientName.toLowerCase().includes(q) ||
        m.candidateName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Client & Candidate Response Management"
        description="Centralized clearinghouse for assisted matchmaking responses. Accurately tracks independent client vs candidate acceptances without conflation."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Independent Response Engine
          </span>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFieldValue('filterStatus', 'ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'ALL' ? 'bg-[#88131B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'MUTUAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'MUTUAL' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            Mutual Interests ({matches.filter((m) => m.overallStatus === 'MUTUAL_INTEREST').length})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'PENDING_CLIENT')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'PENDING_CLIENT' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            Pending Client ({matches.filter((m) => m.clientResponse === 'PENDING').length})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'PENDING_CANDIDATE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'PENDING_CANDIDATE' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            Pending Candidate ({matches.filter((m) => m.candidateResponse === 'PENDING').length})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'DECLINED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'DECLINED' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            Declined
          </button>
        </div>

        <div className="w-64">
          <CustomTextInput
            type="text"
            placeholder="Search by Match ID or Name..."
            value={filters.search}
            onChange={(e) => setFieldValue('search', e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            size="sm"
          />
        </div>
      </div>

      {/* Response Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-3">Match ID & Date</th>
                <th className="py-3 px-3">Client Party</th>
                <th className="py-3 px-3">Client Response</th>
                <th className="py-3 px-3">Candidate Party</th>
                <th className="py-3 px-3">Candidate Response</th>
                <th className="py-3 px-3">Mutual Status</th>
                <th className="py-3 px-3">Curator</th>
                <th className="py-3 px-3 text-right">Record Call Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatches.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900">{m.matchId}</span>
                    <div className="text-[10px] text-slate-400">{m.createdAt}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{m.clientName}</div>
                    <div className="text-[10px] text-slate-400">{m.clientSubcaste} • {m.clientCity}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        m.clientResponse === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.clientResponse === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.clientResponse}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {m.clientResponseRecordedBy === 'EMPLOYEE' ? 'Staff Phone Call' : 'Client App'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{m.candidateName}</div>
                    <div className="text-[10px] text-slate-400">{m.candidateSubcaste} • {m.candidateCity}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        m.candidateResponse === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.candidateResponse === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.candidateResponse}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {m.candidateResponseRecordedBy === 'EMPLOYEE' ? 'Staff Phone Call' : 'Candidate App'}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
                      {m.overallStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{m.reviewedByEmployeeName}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => crmDataService.recordClientResponse(m.matchId, 'ACCEPTED', 'EMPLOYEE', 'Agreed via telephone')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold border border-emerald-200"
                      >
                        Client Accept
                      </button>
                      <button
                        onClick={() => crmDataService.recordCandidateResponse(m.matchId, 'ACCEPTED', 'EMPLOYEE', 'Agreed via telephone')}
                        className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-[10px] font-bold border border-teal-200"
                      >
                        Candidate Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchResponsesScreen;
