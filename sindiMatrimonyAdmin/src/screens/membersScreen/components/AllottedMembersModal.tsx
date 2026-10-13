import React from 'react';
import { X, HeartHandshake, Phone } from 'lucide-react';
import type { MatrimonialMember, AllottedMemberRecord } from '../../../services/memberDataService';
import { memberDataService } from '../../../services/memberDataService';
import { toast } from '../../../toastMessage/toast';

interface AllottedMembersModalProps {
  isOpen: boolean;
  member: MatrimonialMember | null;
  onClose: () => void;
}

export const AllottedMembersModal: React.FC<AllottedMembersModalProps> = ({
  isOpen,
  member,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  const allottedList: AllottedMemberRecord[] = memberDataService.getAllottedMembers(member.id);

  const handleShareContact = (candidateName: string) => {
    toast.success(`Contact coordinates for ${candidateName} shared with client via WhatsApp.`);
  };

  return (
    <div className="fixed inset-y-0 right-0 left-0 md:left-[var(--admin-sidebar-width,16rem)] z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#88131B] via-[#C81E28] to-[#DB2F3C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <HeartHandshake className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Allotted Profiles & Matchmaking</h2>
                <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                  {allottedList.length} Candidates
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Client: <strong className="text-white">{member.fullName}</strong> ({member.uniqueId}) • {member.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Plan Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Plan:</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {member.plan}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">RM: <strong>{member.assignedMatchmaker || 'Priya Sharma'}</strong></span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Mobile: <strong>{member.mobile}</strong>
          </div>
        </div>

        {/* Allotted Candidates List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {allottedList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matrimonial candidates currently allotted to this profile.
            </div>
          ) : (
            allottedList.map((item) => (
              <div
                key={item.allottedId}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-red-200 hover:shadow-xs transition bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#C81E28] font-black text-xs flex items-center justify-center border border-rose-100">
                    {item.candidateName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.candidateName}</h4>
                      <span className="text-[10px] font-mono text-slate-400">({item.candidateId})</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {item.matchScore}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{item.gender}</span>
                      <span>•</span>
                      <span>{item.age} yrs</span>
                      <span>•</span>
                      <span>{item.subcaste}</span>
                      <span>•</span>
                      <span>{item.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'MEETING_FIXED'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleShareContact(item.candidateName)}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Send Contact via Telephony/SMS"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Contact</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Assisted Matchmaking Desk • Priority Coordination
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
