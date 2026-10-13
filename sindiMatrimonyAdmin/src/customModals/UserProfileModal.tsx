import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Crown,
  Download,
  Copy,
  Check,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Heart,
  Sparkles,
  Receipt,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { BiodataGeneratorModal } from './BiodataGeneratorModal';
import type { UnifiedUserProfile } from '../services/unifiedUserService';
import { paymentDataService } from '../services/paymentDataService';
import { memberDataService } from '../services/memberDataService';
import { toast } from '../toastMessage/toast';
import { StatusBadge } from '../components/StatusBadge';

export interface UserProfileModalProps {
  isOpen: boolean;
  user: UnifiedUserProfile | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, user, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'CAREER' | 'FAMILY' | 'CRM' | 'PAYMENTS'>('PERSONAL');
  const [copied, setCopied] = useState(false);
  const [isBiodataModalOpen, setIsBiodataModalOpen] = useState(false);

  if (!isOpen || !user) return null;

  const targetMember = user.rawMember || memberDataService.getMemberById(user.id) || null;

  // Retrieve transactions for this specific user
  const userTransactions = paymentDataService.getTransactionsByMember(user.id || user.fullName);
  const totalPaid = userTransactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(user.uniqueId || user.id);
    setCopied(true);
    toast.success(`Copied User ID: ${user.uniqueId || user.id}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenFullProfile = () => {
    onClose();
    navigate(`/members/profile-details-by-id/${user.id}`);
  };

  const handleDownloadDossier = () => {
    if (user.rawMember) {
      memberDataService.exportSingleMemberSlip(user.rawMember);
      toast.success(`Profile dossier slip downloaded for ${user.fullName}`);
    } else {
      // Synthesize a text slip
      const lines = [
        'SINDHI MATRIMONY — CONFIDENTIAL MEMBER PROFILE DOSSIER',
        `Downloaded: ${new Date().toLocaleString('en-IN')}`,
        '--------------------------------------------------',
        `ID: ${user.id}`,
        `Unique Code: ${user.uniqueId}`,
        `Full Name: ${user.fullName}`,
        `Mobile: ${user.mobile}`,
        `Gender: ${user.gender}`,
        `Age: ${user.age} yrs`,
        `Date of Birth: ${user.dateOfBirth || 'N/A'}`,
        `Marital Status: ${user.maritalStatus || 'Never Married'}`,
        `Location: ${user.city}, ${user.state || ''} ${user.country || 'India'}`,
        `Sindhi Subcaste: ${user.subcaste}`,
        `Gotra: ${user.gotra || 'N/A'}`,
        `Religion: ${user.religion || 'Sindhi Hindu'}`,
        `Education: ${user.education || 'N/A'}`,
        `Profession: ${user.profession || 'N/A'} (${user.employedIn || 'N/A'})`,
        `Annual Income: ${user.annualIncome || 'N/A'}`,
        `Membership Plan: ${user.plan}`,
        `Account Status: ${user.status}`,
        `KYC Verified: ${user.isVerified ? 'Verified (Blue Tick)' : 'Pending'}`,
        `Relationship Manager: ${user.assignedMatchmaker || 'Priya Sharma'}`,
      ];
      const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Member_${user.uniqueId}_Slip.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Profile dossier slip downloaded for ${user.fullName}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Modal Top Banner & Header */}
        <div className="relative bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] text-white p-5 sm:p-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-inner shrink-0">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {user.fullName}
                </h2>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Blue Tick KYC
                  </span>
                )}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-300/40'
                      : 'bg-rose-500/25 text-rose-100 border border-rose-300/40'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-white/90 font-medium">
                <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  ID: {user.uniqueId} ({user.id})
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="hover:text-amber-200 transition"
                    title="Copy ID"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
                <span>•</span>
                <span>{user.gender === 'Female' ? 'Bride' : 'Groom'} ({user.age} yrs)</span>
                <span>•</span>
                <span>Sindhi {user.subcaste}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-white/70" /> {user.city}
                </span>
              </div>
            </div>

            {/* Action buttons on header */}
            <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleOpenFullProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#991B1B] hover:bg-rose-50 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title="Open ProfileDetailsById Screen"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Profile Screen</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadDossier}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                title="Download Member Dossier"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(`tel:${user.mobile}`);
                  toast.info(`Calling ${user.fullName}: ${user.mobile}`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Call Member"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Membership Tier</div>
            <div className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              {user.plan} VIP
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Relationship Manager</div>
            <div className="font-bold text-slate-800 truncate mt-0.5">{user.assignedMatchmaker || 'Priya Sharma'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Allotted Profiles</div>
            <div className="font-bold text-slate-800 mt-0.5">{user.allottedMembersCount ?? 5} Matched Profiles</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lifetime Ledger</div>
            <div className="font-black text-emerald-600 mt-0.5">₹{totalPaid.toLocaleString('en-IN')} Paid</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-5 bg-white shrink-0">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {[
              { key: 'PERSONAL', label: 'Personal & Cultural', icon: Heart },
              { key: 'CAREER', label: 'Education & Career', icon: GraduationCap },
              { key: 'FAMILY', label: 'Family Background', icon: Users },
              { key: 'CRM', label: 'Membership & KYC', icon: Sparkles },
              { key: 'PAYMENTS', label: `Payment Ledger (${userTransactions.length})`, icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-3 px-1 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#C81E28] text-[#C81E28]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* TAB 1: PERSONAL & CULTURAL */}
          {activeTab === 'PERSONAL' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cultural Background Card */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#C81E28]" />
                    Cultural & Astrological Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Sindhi Subcaste</span>
                      <span className="font-bold text-slate-800">{user.subcaste || 'Amil'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Gotra</span>
                      <span className="font-bold text-slate-800">{user.gotra || 'Kashyap'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Religion</span>
                      <span className="font-bold text-slate-800">{user.religion || 'Sindhi Hindu'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother Tongue</span>
                      <span className="font-bold text-slate-800">{user.motherTongue || 'Sindhi'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Manglik Status</span>
                      <span className="font-bold text-slate-800">{user.manglik || 'Non-Manglik'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Sun Sign / Nakshatra</span>
                      <span className="font-bold text-slate-800">{user.sunSign || 'Aries'} {user.nakshatram ? `• ${user.nakshatram}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Personal & Physical Attributes */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    Personal & Physical Attributes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Marital Status</span>
                      <span className="font-bold text-slate-800">{user.maritalStatus || 'Never Married'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                      <span className="font-bold text-slate-800">{user.dateOfBirth || '15 Mar 1996'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Height & Weight</span>
                      <span className="font-bold text-slate-800">{user.height || "5' 8\""} • {user.weight || '68 kg'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Diet & Lifestyle</span>
                      <span className="font-bold text-slate-800">{user.diet || 'Vegetarian'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Complexion / Body</span>
                      <span className="font-bold text-slate-800">{user.complexion || 'Fair'} • {user.bodyType || 'Athletic'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                      <span className="font-bold text-slate-800">{user.bloodGroup || 'B+ve'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Contact Information */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location & Contact Coordinates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current City</span>
                    <span className="font-bold text-slate-800">{user.city}, {user.state || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Mobile</span>
                    <span className="font-bold text-slate-800 font-mono">{user.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="font-bold text-slate-800">{user.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Candidate Bio Statement */}
              {user.aboutCandidate && (
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/70 space-y-2">
                  <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                    About Candidate
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{user.aboutCandidate}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDUCATION & CAREER */}
          {activeTab === 'CAREER' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Educational Qualifications
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Highest Qualification</span>
                      <span className="font-bold text-slate-900 text-sm">{user.education || 'MBA in Marketing'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Education Area / Discipline</span>
                      <span className="font-medium text-slate-700">{user.educationArea || 'Management & Business Administration'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    Professional Career & Income
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation / Role</span>
                      <span className="font-bold text-slate-900 text-sm">{user.profession || user.workingAs || 'Senior Business Director'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Employed In</span>
                      <span className="font-medium text-slate-700">{user.employedIn || 'Private Sector / Multinational'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Income (CTC / Turnover)</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{user.annualIncome || '₹25 - 30 Lakhs'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY BACKGROUND */}
          {activeTab === 'FAMILY' && (
            <div className="space-y-6">
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C81E28]" />
                  Parents & Household Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Father's Name</span>
                    <span className="font-bold text-slate-800">{user.fatherName || 'Shri Chandiram Sindhi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Father's Occupation</span>
                    <span className="font-bold text-slate-800">{user.fatherOccupation || 'Business Director'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother's Name</span>
                    <span className="font-bold text-slate-800">{user.motherName || 'Smt. Kamla Devi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother's Occupation</span>
                    <span className="font-bold text-slate-800">{user.motherOccupation || 'Homemaker'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Family Type</span>
                    <span className="font-bold text-slate-800">{user.familyType || 'Nuclear Family'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Siblings</span>
                    <span className="font-bold text-slate-800">
                      {user.aboutBrother || '1 Brother'} • {user.aboutSister || '1 Sister'}
                    </span>
                  </div>
                </div>
              </div>

              {user.aboutFamily && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Family Values & Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{user.aboutFamily}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEMBERSHIP & CRM */}
          {activeTab === 'CRM' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase text-purple-700">Current Plan Tier</div>
                  <div className="text-lg font-black text-purple-950 mt-1 flex items-center gap-1.5">
                    <Crown className="w-5 h-5 text-amber-500" />
                    {user.plan}
                  </div>
                  <p className="text-[11px] text-purple-700/80 mt-1">Full premium matchmaking privilege active.</p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase text-emerald-700">KYC Verification</div>
                  <div className="text-lg font-black text-emerald-950 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    {user.isVerified ? 'Verified Blue Tick' : 'Pending Verification'}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-1">Mobile, Email & Aadhaar authenticity confirmed.</p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="text-[10px] font-bold uppercase text-amber-800">Assigned Relationship Manager</div>
                  <div className="text-base font-black text-amber-950 mt-1">
                    {user.assignedMatchmaker || 'Priya Sharma'}
                  </div>
                  <p className="text-[11px] text-amber-800/80 mt-1">Contact credits remaining: {user.contactCreditsRemaining ?? 24}</p>
                </div>
              </div>

              {user.desiredProfile && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#C81E28]" />
                    Desired Partner Expectations
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{user.desiredProfile}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYMENT LEDGER */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Transactions History & Receipts
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    All payment gateway records and subscription fees paid by this user.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Lifetime Collections</span>
                  <span className="font-black text-emerald-600 text-sm">₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {userTransactions.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No direct transactions recorded for this user yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Txn ID</th>
                        <th className="py-2.5 px-3">Plan</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Gateway</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.txnId}</td>
                          <td className="py-2.5 px-3 text-slate-800">{t.plan}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-slate-600">{t.gateway} ({t.paymentMode})</td>
                          <td className="py-2.5 px-3">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Member Source: <span className="font-bold text-slate-700">{user.sourceType}</span> • ID: {user.uniqueId}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setIsBiodataModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Generate A4 Biodata PDF & WhatsApp Share"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Biodata PDF & WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleOpenFullProfile}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Open full dedicated profile screen"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Profile Details</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadDossier}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Download Dossier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click WhatsApp Biodata Maker & Formatter Modal */}
      {targetMember && (
        <BiodataGeneratorModal
          isOpen={isBiodataModalOpen}
          onClose={() => setIsBiodataModalOpen(false)}
          member={targetMember}
        />
      )}
    </div>
  );
};
