import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Send,
  History,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  X,
  FileText,
  Share2,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import { memberDataService, type MatrimonialMember } from '../../services/memberDataService';
import { BiodataGeneratorModal } from '../../customModals/BiodataGeneratorModal';
import type { ClientProfile, MatchRecommendation, MatchAuditRecord } from '../../types/crm.types';
import { PageHeader } from '../../components/PageHeader';
import { toast } from '../../toastMessage/toast';
import { useInputs } from '../../customHooks/useInputs';

export interface MatchmakingFormValues {
  selectedClientForEngine: string;
  selectedCandidateForEngine: string;
  biodataRecipientPhone: string;
  biodataRecipientName: string;
}

export const MatchmakingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'responses' | 'mutual' | 'engine'>('pending');
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const {
    values: engineValues,
    setFieldValue,
    setValues: setEngineValues,
  } = useInputs<MatchmakingFormValues>({
    selectedClientForEngine: 'SIND001',
    selectedCandidateForEngine: 'SIND002',
    biodataRecipientPhone: '',
    biodataRecipientName: '',
  });
  const [engineNotification, setEngineNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedMatchForAudit, setSelectedMatchForAudit] = useState<MatchRecommendation | null>(null);
  const [selectedMemberForBiodata, setSelectedMemberForBiodata] = useState<MatrimonialMember | null>(null);

  const refresh = () => {
    setMatches(crmDataService.getMatches());
    setClients(crmDataService.getClients());
  };

  useEffect(() => {
    refresh();
    const unsub = crmDataService.subscribe(refresh);
    return unsub;
  }, []);

  const pendingReviewMatches = matches.filter((m) => m.reviewStatus === 'PENDING_EMPLOYEE_REVIEW');
  const awaitingResponsesMatches = matches.filter(
    (m) => m.reviewStatus === 'APPROVED' || m.reviewStatus === 'SHARED_WITH_CLIENT'
  );
  const mutualInterestMatches = matches.filter((m) => m.overallStatus === 'MUTUAL_INTEREST');

  // Dynamic duplicate / existing match lookup for the currently selected pair
  const existingCandidateMatch = crmDataService.findMatchByPair(
    engineValues.selectedClientForEngine,
    engineValues.selectedCandidateForEngine
  );

  const handleApprove = (matchId: string) => {
    crmDataService.reviewMatch(matchId, 'emp_003', 'APPROVED', 'Verified by Matchmaker');
    toast.success(`Match ${matchId} verified and approved!`);
  };

  const handleReject = (matchId: string) => {
    crmDataService.reviewMatch(matchId, 'emp_003', 'REJECTED_BY_EMPLOYEE', 'Criteria did not match client preferences');
    toast.info(`Match ${matchId} rejected.`);
  };

  const handleShare = (matchId: string) => {
    crmDataService.shareMatchWithClient(matchId);
    toast.success(`Match ${matchId} shared with client successfully!`);
  };

  const handleOpenBiodataForMatch = (m: MatchRecommendation) => {
    const clientRecord = crmDataService.getClientById(m.clientId);
    const candidate =
      memberDataService.getMemberById(m.candidateId) ||
      memberDataService.getMembers().find((mem) => mem.uniqueId === m.candidateId || mem.fullName === m.candidateName) ||
      ({
        id: m.candidateId,
        uniqueId: m.candidateId,
        fullName: m.candidateName,
        gender: m.candidateGender as any,
        age: (m as any).candidateAge || 27,
        subcaste: m.candidateSubcaste,
        city: m.candidateCity,
        maritalStatus: 'Never Married',
        plan: 'PLATINUM',
        status: 'ACTIVE',
        isVerified: true,
        mobile: '+91 98201 12345',
        created: 'Recently',
        createdAtTimestamp: Date.now(),
      } as MatrimonialMember);

    const clientMember = memberDataService.getMemberById(m.clientId);
    const recipientPhone =
      clientMember?.mobile ||
      (clientRecord as any)?.mobile ||
      (clientRecord as any)?.phone ||
      (m as any).clientPhone ||
      '';

    setSelectedMemberForBiodata(candidate);
    setEngineValues((prev) => ({
      ...prev,
      biodataRecipientPhone: recipientPhone,
      biodataRecipientName: `${m.clientName} (Seeking Alliance)`,
    }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setEngineNotification(null);
    const client = clients.find((c) => c.clientId === engineValues.selectedClientForEngine);
    const candidate = clients.find((c) => c.clientId === engineValues.selectedCandidateForEngine);
    if (!client || !candidate) {
      const err = 'Please select valid client and candidate.';
      setEngineNotification({ type: 'error', message: err });
      toast.error(err);
      return;
    }

    const result = crmDataService.generateMatch(client, candidate, 'emp_003');
    if (!result.success) {
      const err = result.error || 'Failed to generate match.';
      setEngineNotification({ type: 'error', message: err });
      toast.error(err);
    } else {
      const msg = `Match ${result.match?.matchId} generated with ${result.match?.compatibilityScore}% compatibility!`;
      setEngineNotification({
        type: 'success',
        message: msg,
      });
      toast.success(msg);
      setActiveTab('pending');
    }
  };

  const handleRecommendAssistedFollowUp = () => {
    const client = clients.find((c) => c.clientId === engineValues.selectedClientForEngine);
    const candidate = clients.find((c) => c.clientId === engineValues.selectedCandidateForEngine);
    if (!client || !candidate) return;

    const res = crmDataService.suggestHybridMatch({
      client,
      candidate,
      actorId: 'emp_001',
      actorRole: 'SUPER_ADMIN',
      sourceType: 'ADMIN_SUGGESTED',
      reason: 'Admin approved assisted matchmaking follow-up for existing match.',
    });

    if (res.success) {
      const msg = res.isExisting
        ? `Added Admin recommendation to existing canonical match ${res.match?.matchId} without duplicate!`
        : `Created new hybrid match ${res.match?.matchId}!`;
      toast.success(msg);
      refresh();
      setActiveTab('pending');
    } else {
      toast.error(res.error || 'Failed to suggest match.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Assisted Matchmaking Engine & Responses"
        description="Curate bespoke matches, run gotra/subcaste compatibility validations, review match approvals, and manage client & candidate responses."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <HeartHandshake className="w-3 h-3 text-[#DB2F3C]" />
            AI Compatibility + Human Review
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingReviewMatches.length}</div>
          <span className="text-[11px] text-slate-400">Requires Matchmaker approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Awaiting Response</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{awaitingResponsesMatches.length}</div>
          <span className="text-[11px] text-slate-400">Shared with clients</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Mutual Interests</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{mutualInterestMatches.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Accepted by both parties</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Canonical Matches</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{matches.length}</div>
          <span className="text-[11px] text-slate-400">Zero duplicate recommendations</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending Review ({pendingReviewMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('responses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'responses'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Awaiting Responses ({awaitingResponsesMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('mutual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'mutual'
              ? 'bg-[#88131B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Mutual Interests ({mutualInterestMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('engine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'engine'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
          <span>Generate / Suggest Match</span>
        </button>
      </div>

      {engineNotification && (
        <div
          className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
            engineNotification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span>{engineNotification.message}</span>
          <button onClick={() => setEngineNotification(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* GENERATE MATCH ENGINE TAB */}
      {activeTab === 'engine' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Pair Candidates & Verify Compatibility
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a client and an eligible candidate profile. The hybrid engine checks subcaste, Gotra non-conflict, age distance, city preference and prevents duplicate recommendations automatically across backend, admin, and employee suggestions.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Client (Seeking Alliance)</label>
              <select
                value={engineValues.selectedClientForEngine}
                onChange={(e) => setFieldValue('selectedClientForEngine', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.clientId}>
                    {c.fullName} ({c.clientId}) — {c.gender}, {c.age} yrs, {c.subcaste} ({c.gotra})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Candidate to Recommend</label>
              <select
                value={engineValues.selectedCandidateForEngine}
                onChange={(e) => setFieldValue('selectedCandidateForEngine', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.clientId}>
                    {c.fullName} ({c.clientId}) — {c.gender}, {c.age} yrs, {c.subcaste} ({c.gotra})
                  </option>
                ))}
              </select>
            </div>

            {/* MANDATORY ADMIN REQUIREMENT: Informative duplicate detection banner */}
            {existingCandidateMatch && (
              <div className="md:col-span-2 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-amber-900">
                      Match Identity Already Exists ({existingCandidateMatch.matchId})
                    </h4>
                    <p className="text-xs text-amber-800 mt-1">
                      This candidate has already been recommended by the{' '}
                      <strong>
                        {existingCandidateMatch.primarySource === 'AUTOMATIC_BACKEND'
                          ? 'automatic matchmaking engine'
                          : 'assisted matchmaking system'}
                      </strong>
                      . You can review the existing match or add an authorized assisted-match recommendation without creating a duplicate.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-white font-semibold text-slate-700 border border-amber-200">
                        Overall Status: {existingCandidateMatch.overallStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white font-semibold text-slate-700 border border-amber-200">
                        Review Status: {existingCandidateMatch.reviewStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white font-semibold text-slate-700 border border-amber-200">
                        Client Response: {existingCandidateMatch.clientResponse}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white font-semibold text-slate-700 border border-amber-200">
                        Candidate Response: {existingCandidateMatch.candidateResponse}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={() => setSelectedMatchForAudit(existingCandidateMatch)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Open Match History</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRecommendAssistedFollowUp}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Recommend for Assisted Follow-up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('pending')}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    View Existing Matches
                  </button>
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={!!existingCandidateMatch}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 ${
                  existingCandidateMatch
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#88131B] to-rose-700 hover:from-rose-900 hover:to-rose-800 text-white cursor-pointer'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {existingCandidateMatch
                    ? 'Pair Already Exists (Use Assisted Action Above)'
                    : 'Run Compatibility Check & Generate Match'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MATCHES LIST VIEW (PENDING, RESPONSES, MUTUAL) */}
      {activeTab !== 'engine' && (
        <div className="space-y-4">
          {(activeTab === 'pending'
            ? pendingReviewMatches
            : activeTab === 'responses'
            ? awaitingResponsesMatches
            : mutualInterestMatches
          ).map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs hover:border-slate-300 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {m.matchId}
                  </span>
                  <span className="text-xs text-slate-400">• Curated by {m.reviewedByEmployeeName}</span>

                  {/* Source Attribution Badges */}
                  <div className="flex items-center gap-1.5 ml-2">
                    {(m.sources || [m.primarySource || 'EMPLOYEE_ASSISTED']).map((src, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          src === 'AUTOMATIC_BACKEND'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : src === 'ADMIN_SUGGESTED'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {src === 'AUTOMATIC_BACKEND'
                          ? '🤖 Auto Engine'
                          : src === 'ADMIN_SUGGESTED'
                          ? '🛡️ Admin Suggested'
                          : '👤 Employee Assisted'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {m.compatibilityScore}% Compatibility
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {m.overallStatus}
                  </span>
                  <button
                    onClick={() => setSelectedMatchForAudit(m)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="View Match Audit Trail"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profiles Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Client Profile
                  </span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{m.clientName}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {m.clientGender} • {m.clientSubcaste} • {m.clientCity}
                  </div>
                  <div className="mt-2 text-xs">
                    Client Response:{' '}
                    <strong
                      className={
                        m.clientResponse === 'ACCEPTED'
                          ? 'text-emerald-700'
                          : m.clientResponse === 'DECLINED'
                          ? 'text-rose-700'
                          : 'text-slate-500'
                      }
                    >
                      {m.clientResponse}
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recommended Candidate
                  </span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{m.candidateName}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {m.candidateGender} • {m.candidateSubcaste} • {m.candidateCity}
                  </div>
                  <div className="mt-2 text-xs">
                    Candidate Response:{' '}
                    <strong
                      className={
                        m.candidateResponse === 'ACCEPTED'
                          ? 'text-emerald-700'
                          : m.candidateResponse === 'DECLINED'
                          ? 'text-rose-700'
                          : 'text-slate-500'
                      }
                    >
                      {m.candidateResponse}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Compatibility Highlights */}
              <div className="flex flex-wrap items-center gap-2">
                {m.compatibilityReasons.map((reason, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100"
                  >
                    ✓ {reason}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedMatchForAudit(m)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Audit Trail ({m.auditHistory?.length || 0})</span>
                </button>

                <div className="flex items-center gap-2">
                  {m.reviewStatus === 'PENDING_EMPLOYEE_REVIEW' && (
                    <>
                      <button
                        onClick={() => handleReject(m.matchId)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        Reject Match
                      </button>
                      <button
                        onClick={() => handleApprove(m.matchId)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Approve Match
                      </button>
                    </>
                  )}

                  {m.reviewStatus === 'APPROVED' && (
                    <button
                      onClick={() => handleShare(m.matchId)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share with Client</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenBiodataForMatch(m)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    title="Generate and Share Candidate Biodata PDF on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Share Biodata PDF</span>
                  </button>

                  {m.overallStatus === 'MUTUAL_INTEREST' && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Mutual Consent Established — Ready for Family Conference
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(activeTab === 'pending'
            ? pendingReviewMatches
            : activeTab === 'responses'
            ? awaitingResponsesMatches
            : mutualInterestMatches
          ).length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No matches found in this category.
            </div>
          )}
        </div>
      )}

      {/* MATCH AUDIT TRAIL MODAL */}
      {selectedMatchForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Match Audit Trail — {selectedMatchForAudit.matchId}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Canonical Pair: {selectedMatchForAudit.pairKey || `${selectedMatchForAudit.clientId}:${selectedMatchForAudit.candidateId}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMatchForAudit(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Summary overview */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Client</span>
                  <span className="font-semibold text-slate-800">{selectedMatchForAudit.clientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Candidate</span>
                  <span className="font-semibold text-slate-800">{selectedMatchForAudit.candidateName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Sources</span>
                  <span className="font-semibold text-purple-700">
                    {(selectedMatchForAudit.sources || [selectedMatchForAudit.primarySource]).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Current Status</span>
                  <span className="font-semibold text-emerald-700">{selectedMatchForAudit.overallStatus}</span>
                </div>
              </div>

              {/* Action History Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Immutable Action History ({selectedMatchForAudit.auditHistory?.length || 0})
                </h4>

                {(!selectedMatchForAudit.auditHistory || selectedMatchForAudit.auditHistory.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No historical actions logged yet.</p>
                ) : (
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
                    {selectedMatchForAudit.auditHistory.map((entry: MatchAuditRecord, index: number) => (
                      <div key={entry.id || index} className="text-xs space-y-0.5 relative pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{entry.actionType}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-600">
                            {entry.sourceType}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Actor: <strong>{entry.actorName}</strong> ({entry.actorRole})
                        </div>
                        {entry.reason && (
                          <div className="text-[11px] text-slate-500 italic">Reason: {entry.reason}</div>
                        )}
                        {entry.previousStatus && entry.resultingStatus && (
                          <div className="text-[10px] text-slate-400">
                            Transition: {entry.previousStatus} ➔ {entry.resultingStatus}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedMatchForAudit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click WhatsApp Biodata Maker & Formatter Modal */}
      {selectedMemberForBiodata && (
        <BiodataGeneratorModal
          isOpen={Boolean(selectedMemberForBiodata)}
          onClose={() => setSelectedMemberForBiodata(null)}
          member={selectedMemberForBiodata}
          prefillRecipientPhone={engineValues.biodataRecipientPhone}
          prefillRecipientName={engineValues.biodataRecipientName}
          sourceContext="MATCHMAKING"
        />
      )}
    </div>
  );
};

export default MatchmakingScreen;
