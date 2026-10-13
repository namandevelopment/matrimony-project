import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Share2,
  Copy,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Phone,
  User,
  Building,
  GraduationCap,
  Compass,
  History,
  Camera,
  Ban,
  Clock,
} from 'lucide-react';
import { memoWithDeepEqual } from '../utils/memoUtils';
import { toast } from '../utils/CustomToast';
import { CustomTextInput } from '../components/CustomTextInput';
import { biodataService } from '../services/biodataService';
import type { MatrimonialMember } from '../services/memberDataService';
import type {
  BiodataTemplateId,
  BiodataPrivacyMode,
} from '../types/biodata.types';
import { getStoredUser, getSimulatedUser } from '../storage';
import type { Role } from '../types/auth.types';

export interface BiodataGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MatrimonialMember | null;
  prefillRecipientPhone?: string;
  prefillRecipientName?: string;
  sourceContext?: string; // e.g. "MATCHMAKING" or "PROFILE_360"
}

export const BiodataGeneratorModal: React.FC<BiodataGeneratorModalProps> = memoWithDeepEqual(({
  isOpen,
  onClose,
  member,
  prefillRecipientPhone,
  prefillRecipientName,
  sourceContext,
}) => {
  // Current user & role resolution
  const currentUser = getSimulatedUser() || getStoredUser() || {
    id: 'emp_001',
    fullName: 'Admin User',
    role: 'SUPER_ADMIN' as Role,
  };
  const userRole = (currentUser.role || 'SUPER_ADMIN') as Role;
  const canAccessFullMode = useMemo(() => {
    return biodataService.canGenerateFullBiodata(userRole);
  }, [userRole]);

  // Form State
  const [templateId, setTemplateId] = useState<BiodataTemplateId>('TRADITIONAL');
  const [privacyMode, setPrivacyMode] = useState<BiodataPrivacyMode>('BLIND');
  const [allowReligiousMotif, setAllowReligiousMotif] = useState(true);
  const [hasPhotoConsent, setHasPhotoConsent] = useState(true);
  const [isConsentWithdrawn, setIsConsentWithdrawn] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState(prefillRecipientPhone || '');
  const [recipientName, setRecipientName] = useState(prefillRecipientName || '');
  const [customNote, setCustomNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWhatsAppGuidance, setShowWhatsAppGuidance] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'SETTINGS' | 'HISTORY'>('PREVIEW');
  const [lastAuditId, setLastAuditId] = useState<string | null>(null);

  // Sync state on member change
  useEffect(() => {
    if (member) {
      setPrivacyMode('BLIND');
      setRecipientPhone(prefillRecipientPhone || '');
      setRecipientName(prefillRecipientName || '');
      setCustomNote('');
      setShowWhatsAppGuidance(false);
      setCopiedText(false);
      setHasPhotoConsent(true);
      setIsConsentWithdrawn(false);
      setLastAuditId(null);
    }
  }, [member, prefillRecipientPhone, prefillRecipientName]);

  // Completeness & Warnings
  const completeness = useMemo(() => {
    if (!member) return { score: 0, warnings: [] };
    return biodataService.calculateCompleteness(member);
  }, [member]);

  // Computed Render Payload
  const payload = useMemo(() => {
    if (!member) return null;
    return biodataService.buildBiodataPayload(
      member,
      privacyMode,
      currentUser.id || 'emp_001',
      currentUser.fullName || 'Admin User',
      userRole,
      templateId,
      {
        hasPhotoConsent,
        isConsentWithdrawn,
      }
    );
  }, [member, privacyMode, currentUser, userRole, templateId, hasPhotoConsent, isConsentWithdrawn]);

  // Formatted WhatsApp message preview
  const whatsAppMessage = useMemo(() => {
    if (!payload) return '';
    return biodataService.formatWhatsAppBiodataMessage(
      payload,
      customNote,
      payload.assignedRmName,
      payload.assignedRmContact
    );
  }, [payload, customNote]);

  // Member Audit History
  const memberAuditLogs = useMemo(() => {
    if (!member) return [];
    return biodataService.getAuditLogsForMember(member.id);
  }, [member, isGenerating, showWhatsAppGuidance, lastAuditId]);

  if (!isOpen || !member || !payload) return null;

  // Direct PDF Download Handler
  const handleDownloadPdf = () => {
    try {
      setIsGenerating(true);
      const config = biodataService.getSettings();
      config.allowReligiousMotif = allowReligiousMotif;

      const { doc, fileName } = biodataService.generateBiodataPdf(templateId, payload, config);
      doc.save(fileName);

      const log = biodataService.recordAuditEvent({
        eventType: 'BIODATA_DOWNLOAD_REQUESTED',
        memberId: member.id,
        memberUniqueId: member.uniqueId,
        memberName: member.fullName,
        employeeId: currentUser.id || 'emp_001',
        employeeName: currentUser.fullName || 'Admin User',
        employeeRole: userRole,
        templateId,
        privacyMode,
        shareMethod: 'DOWNLOAD',
        notes: `Downloaded ${fileName} locally. Context: ${sourceContext || 'Direct'}.`,
      });
      setLastAuditId(log.id);

      toast.success(`Biodata PDF downloaded: ${fileName}`);
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct Print / Open in new tab
  const handlePrintPdf = () => {
    try {
      const config = biodataService.getSettings();
      config.allowReligiousMotif = allowReligiousMotif;
      const { doc } = biodataService.generateBiodataPdf(templateId, payload, config);
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } catch (err) {
      console.error('Print preview failed:', err);
      toast.error('Failed to open PDF preview.');
    }
  };

  // Copy WhatsApp Message
  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(whatsAppMessage);
    setCopiedText(true);
    toast.success('WhatsApp text copied to clipboard!');
    setTimeout(() => setCopiedText(false), 2500);
  };

  // 1-Click WhatsApp Web Share with Honest Guidance
  const handleShareOnWhatsApp = () => {
    try {
      setIsGenerating(true);
      const config = biodataService.getSettings();
      config.allowReligiousMotif = allowReligiousMotif;

      // 1. Generate & download the PDF file locally so user has it ready
      const { doc, fileName } = biodataService.generateBiodataPdf(templateId, payload, config);
      doc.save(fileName);

      // 2. Format WhatsApp Web target URL
      const waUrl = biodataService.generateWhatsAppShareUrl(recipientPhone, whatsAppMessage);

      // 3. Log audit event
      const log = biodataService.recordAuditEvent({
        eventType: 'BIODATA_SHARE_INITIATED',
        memberId: member.id,
        memberUniqueId: member.uniqueId,
        memberName: member.fullName,
        employeeId: currentUser.id || 'emp_001',
        employeeName: currentUser.fullName || 'Admin User',
        employeeRole: userRole,
        templateId,
        privacyMode,
        recipientReference: recipientPhone || recipientName || 'WhatsApp Target',
        shareMethod: 'WHATSAPP_WEB',
        notes: `Launched WhatsApp Web with prefilled message. Downloaded ${fileName}. Context: ${sourceContext || 'Direct'}.`,
      });
      setLastAuditId(log.id);

      // 4. Open WhatsApp Web in new tab
      window.open(waUrl, '_blank');

      // 5. Open honest instruction modal
      setShowWhatsAppGuidance(true);
      toast.success('PDF downloaded & WhatsApp Web launched!');
    } catch (err) {
      console.error('WhatsApp share failed:', err);
      toast.error('Failed to prepare WhatsApp share.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmWhatsAppSent = () => {
    if (lastAuditId) {
      biodataService.updateAuditLog(lastAuditId, {
        eventType: 'BIODATA_DELIVERED',
        notes: 'Operator confirmed PDF attachment and message transmission in WhatsApp.',
      });
      toast.success('Sharing marked as delivered in audit history.');
    }
    setShowWhatsAppGuidance(false);
  };

  const handleCancelWhatsAppShare = () => {
    if (lastAuditId) {
      biodataService.updateAuditLog(lastAuditId, {
        eventType: 'BIODATA_SHARE_FAILED',
        notes: 'Operator indicated share was cancelled or aborted in WhatsApp Web.',
      });
      toast.info('Share cancelled. Status archived as not sent.');
    }
    setShowWhatsAppGuidance(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#88131B] text-white flex items-center justify-center shadow-md shadow-rose-900/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  1-Click WhatsApp Biodata Maker & Formatter
                </h3>
                {sourceContext && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {sourceContext}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Generating official matrimonial dossier for{' '}
                <strong className="text-slate-900">{member.fullName}</strong> ({member.uniqueId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('PREVIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'PREVIEW' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SETTINGS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'SETTINGS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Options</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('HISTORY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'HISTORY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({memberAuditLogs.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Profile Quick Health & Completeness Bar */}
        <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <User className="w-3.5 h-3.5 text-[#88131B]" />
              {member.subcaste} • {member.age} yrs • {member.city}
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              {member.isVerified ? 'KYC Verified Profile' : 'Community Profile'}
            </span>
            {isConsentWithdrawn && (
              <span className="flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <Ban className="w-3 h-3" /> Consent Revoked
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Profile Completeness:</span>
            <div className="w-24 sm:w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completeness.score >= 80 ? 'bg-emerald-500' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${completeness.score}%` }}
              />
            </div>
            <span className="font-black text-slate-900">{completeness.score}%</span>
          </div>
        </div>

        {/* Missing Fields Warning Banner */}
        {completeness.warnings.length > 0 && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between gap-2 text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold shrink-0">Note for RM:</span>
              <span className="truncate text-amber-800">
                Non-critical fields omitted: {completeness.warnings.slice(0, 3).map((w) => w.label).join(', ')}
                {completeness.warnings.length > 3 ? ` (+${completeness.warnings.length - 3} more)` : ''}
              </span>
            </div>
            <span className="text-amber-700 font-bold shrink-0">PDF Generation Permitted</span>
          </div>
        )}

        {/* TAB 1 & 2: Main Split View (Settings + Preview) */}
        {activeTab !== 'HISTORY' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
            {/* LEFT COLUMN: Controls & Settings */}
            <div
              className={`lg:col-span-5 space-y-5 ${
                activeTab === 'SETTINGS' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* 1. Template Selector */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Select Template
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">A4 Print Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTemplateId('TRADITIONAL')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      templateId === 'TRADITIONAL'
                        ? 'border-[#88131B] bg-rose-50/40 ring-2 ring-[#88131B]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-[#88131B]">Traditional</span>
                      {templateId === 'TRADITIONAL' && <CheckCircle2 className="w-3.5 h-3.5 text-[#88131B]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Warm cream background, maroon & gold borders, auspicious header.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplateId('MODERN_MINIMAL')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      templateId === 'MODERN_MINIMAL'
                        ? 'border-slate-900 bg-slate-100/60 ring-2 ring-slate-900/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-slate-900">Modern Minimal</span>
                      {templateId === 'MODERN_MINIMAL' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Crisp white background, sleek slate typography, clean metric cards.
                    </p>
                  </button>
                </div>

                {/* Additional Toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  {templateId === 'TRADITIONAL' && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium flex items-center gap-1.5">
                        <span className="text-amber-600 font-bold">🕉️</span> Include Auspicious Om / Ganesh Motif
                      </span>
                      <input
                        type="checkbox"
                        checked={allowReligiousMotif}
                        onChange={(e) => setAllowReligiousMotif(e.target.checked)}
                        className="rounded text-[#88131B] focus:ring-[#88131B]"
                      />
                    </div>
                  )}

                  {/* Photo Sharing Consent Checkbox */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" /> Include Profile Photograph
                    </span>
                    <input
                      type="checkbox"
                      checked={hasPhotoConsent}
                      onChange={(e) => setHasPhotoConsent(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                  </div>

                  {/* Member Revoke Simulation */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 text-rose-600" /> Member Consent Revoked
                    </span>
                    <input
                      type="checkbox"
                      checked={isConsentWithdrawn}
                      onChange={(e) => setIsConsentWithdrawn(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Privacy Mode Selector */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Privacy Protection Mode
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">Server Allowlist</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPrivacyMode('BLIND')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      privacyMode === 'BLIND'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-emerald-900">Blind Biodata</span>
                      {privacyMode === 'BLIND' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      Shielded Safe Mode
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                      Phone, email, and exact address are physically masked.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!canAccessFullMode) {
                        toast.error('Only Super Admin, Operations Admin, or CRM Manager can generate Full Biodata.');
                      } else if (isConsentWithdrawn) {
                        toast.error('Cannot select Full Biodata: Member consent has been withdrawn.');
                      } else {
                        setPrivacyMode('FULL');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      !canAccessFullMode || isConsentWithdrawn
                        ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
                        : privacyMode === 'FULL'
                        ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20 cursor-pointer'
                        : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        Full Biodata {(!canAccessFullMode || isConsentWithdrawn) && <Lock className="w-3 h-3 text-slate-400" />}
                      </span>
                      {privacyMode === 'FULL' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                      Direct Contact Mode
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                      Includes verified phone and address under active consent.
                    </p>
                  </button>
                </div>

                {privacyMode === 'FULL' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Sensitive Information Included</p>
                      <p className="text-[11px] text-amber-800">
                        Direct mobile number ({member.mobile}) will be visible in the exported PDF.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. WhatsApp Recipient Information */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Target Recipient & Message Note
                </label>

                <div className="space-y-2.5">
                  <CustomTextInput
                    label="Recipient WhatsApp Phone (Optional)"
                    type="tel"
                    placeholder="e.g. 9820012345 (Leave blank for general share)"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    size="sm"
                    leftIcon={<Phone className="w-3.5 h-3.5 text-slate-400" />}
                  />

                  <CustomTextInput
                    label="Recipient Name / Relationship"
                    type="text"
                    placeholder="e.g. Deepak Advani (Candidate's Father)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    size="sm"
                    leftIcon={<User className="w-3.5 h-3.5 text-slate-400" />}
                  />

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Personalized RM Note for Recipient
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking for Amil/Bhaiband matches based in Mumbai or Dubai..."
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-[#88131B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Interactive A4 Preview */}
            <div
              className={`lg:col-span-7 flex flex-col space-y-3 ${
                activeTab === 'PREVIEW' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Live Document Preview (A4 Format)
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {templateId === 'TRADITIONAL' ? 'Traditional Maroon & Gold' : 'Modern Minimal'} •{' '}
                  <span className={privacyMode === 'BLIND' ? 'text-emerald-700' : 'text-amber-700'}>
                    {privacyMode === 'BLIND' ? 'Blind Mode' : 'Full Mode'}
                  </span>
                </span>
              </div>

              {/* A4 Paper Canvas */}
              <div className="flex-1 min-h-[480px] bg-slate-200/70 p-3 sm:p-5 rounded-3xl border border-slate-300/80 flex items-center justify-center overflow-auto shadow-inner">
                <div
                  className={`w-full max-w-[540px] aspect-[1/1.414] rounded-xl shadow-xl transition-all duration-300 p-5 sm:p-7 flex flex-col justify-between text-slate-800 relative overflow-hidden select-none ${
                    templateId === 'TRADITIONAL'
                      ? 'bg-[#FDFBF7] border-2 border-[#88131B]'
                      : 'bg-white border border-slate-300'
                  }`}
                >
                  {templateId === 'TRADITIONAL' && (
                    <div className="absolute inset-1.5 border border-[#C59B27] pointer-events-none rounded-lg" />
                  )}
                  {templateId === 'MODERN_MINIMAL' && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#991B1B]" />
                  )}

                  {/* Header */}
                  <div className="text-center relative z-10">
                    {templateId === 'TRADITIONAL' && allowReligiousMotif && (
                      <div className="mb-1">
                        <p className="text-[11px] font-bold text-[#88131B] leading-none">||  ||</p>
                        <p className="text-[8px] font-bold text-[#B8860B] tracking-widest mt-0.5">
                          OM SHREE GANESHAYA NAMAHA
                        </p>
                      </div>
                    )}

                    {templateId === 'TRADITIONAL' ? (
                      <div className="inline-block bg-[#88131B] text-white px-4 py-1 rounded text-xs font-black tracking-wider uppercase mb-2 shadow-2xs">
                        Matrimonial Biodata
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 text-left">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#991B1B]">
                            Matrimonial Profile
                          </span>
                          <h4 className="text-base font-black text-slate-900 leading-tight">
                            {payload.fullName}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-800">
                          ID: {payload.uniqueId}
                        </span>
                      </div>
                    )}

                    {templateId === 'TRADITIONAL' && (
                      <>
                        <h4 className="text-base sm:text-lg font-black text-[#88131B] tracking-wide uppercase">
                          {payload.fullName}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {payload.subcaste} • Profile ID: {payload.uniqueId} • {payload.age} Yrs • {payload.city}
                        </p>
                        <div className="w-3/4 mx-auto h-[1px] bg-[#C59B27] my-2" />
                      </>
                    )}
                  </div>

                  {/* Fields Sections */}
                  <div className="space-y-2 text-[10px] relative z-10 my-auto">
                    {/* Personal */}
                    <div className={`p-1.5 rounded ${templateId === 'TRADITIONAL' ? 'bg-[#F5EDDC]/60' : 'bg-slate-50'}`}>
                      <div className="font-bold text-[9px] uppercase tracking-wider text-[#88131B] mb-1 flex items-center justify-between">
                        <span>1. Personal & Physical Attributes</span>
                        <span className="text-slate-400 font-normal">A4 Preview</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-700">
                        <div><strong>Age / DOB:</strong> {payload.age} Yrs {payload.dateOfBirth ? `(${payload.dateOfBirth})` : ''}</div>
                        <div><strong>Height:</strong> {payload.height || '5 ft 6 in'}</div>
                        <div><strong>Marital Status:</strong> {payload.maritalStatus}</div>
                        <div><strong>Diet:</strong> {payload.diet || 'Vegetarian'}</div>
                        <div><strong>Subcaste & Gotra:</strong> {payload.subcaste} ({payload.gotra || '—'})</div>
                        <div><strong>Location:</strong> {payload.city}, {payload.country}</div>
                      </div>
                    </div>

                    {/* Education & Profession */}
                    <div className={`p-1.5 rounded ${templateId === 'TRADITIONAL' ? 'bg-[#F5EDDC]/60' : 'bg-slate-50'}`}>
                      <div className="font-bold text-[9px] uppercase tracking-wider text-[#88131B] mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        <span>2. Education & Profession</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-700">
                        <div><strong>Education:</strong> {payload.education || payload.educationArea || 'Graduate'}</div>
                        <div><strong>Employed In:</strong> {payload.employedIn || 'Private Sector'}</div>
                        <div><strong>Designation:</strong> {payload.profession || 'Professional'}</div>
                        <div><strong>Annual Income:</strong> {payload.annualIncome || 'Confidential'}</div>
                      </div>
                    </div>

                    {/* Astro */}
                    <div className={`p-1.5 rounded ${templateId === 'TRADITIONAL' ? 'bg-[#F5EDDC]/60' : 'bg-slate-50'}`}>
                      <div className="font-bold text-[9px] uppercase tracking-wider text-[#88131B] mb-1 flex items-center gap-1">
                        <Compass className="w-3 h-3" />
                        <span>3. Astro Coordinates</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-700">
                        <div><strong>Manglik:</strong> {payload.manglik || 'Non-Manglik'}</div>
                        <div><strong>Birth Place:</strong> {payload.birthPlace || payload.city || 'On Request'}</div>
                        <div><strong>Rashi / Sign:</strong> {payload.rashi || payload.sunSign || '—'}</div>
                        <div><strong>Nakshatra:</strong> {payload.nakshatra || '—'}</div>
                      </div>
                    </div>

                    {/* Family */}
                    <div className={`p-1.5 rounded ${templateId === 'TRADITIONAL' ? 'bg-[#F5EDDC]/60' : 'bg-slate-50'}`}>
                      <div className="font-bold text-[9px] uppercase tracking-wider text-[#88131B] mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>4. Family Heritage</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-700">
                        <div><strong>Father:</strong> {payload.fatherName || 'Family Head'} ({payload.fatherOccupation || 'Business'})</div>
                        <div><strong>Mother:</strong> {payload.motherName || 'Homemaker'}</div>
                        <div><strong>Family Structure:</strong> {payload.familyType || 'Nuclear'}</div>
                        <div><strong>Siblings:</strong> {payload.aboutBrother || '—'} / {payload.aboutSister || '—'}</div>
                      </div>
                    </div>

                    {/* Contact Desk */}
                    <div className={`p-1.5 rounded border ${
                      payload.privacyMode === 'FULL'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}>
                      <div className="font-bold text-[9px] uppercase tracking-wider mb-0.5 flex items-center justify-between">
                        <span className={payload.privacyMode === 'FULL' ? 'text-amber-900' : 'text-emerald-900'}>
                          {payload.privacyMode === 'FULL' ? '★ Full Contact Disclosure' : '🛡️ Blind Privacy Shield'}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500">
                          {payload.privacyMode === 'FULL' ? 'Consent Active' : 'Masked'}
                        </span>
                      </div>
                      {payload.privacyMode === 'FULL' ? (
                        <div className="grid grid-cols-2 gap-x-2 text-[9px] text-slate-800">
                          <div><strong>Phone:</strong> {payload.mobile}</div>
                          <div><strong>Email:</strong> {payload.email || '—'}</div>
                        </div>
                      ) : (
                        <p className="text-[9px] text-slate-600 leading-tight">
                          Direct phone and address masked. Connect with RM <strong>{payload.assignedRmName}</strong> ({payload.assignedRmContact}) to express interest.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-200 text-center relative z-10">
                    <div className="flex items-center justify-between text-[8px] text-slate-500 font-semibold">
                      <span>✓ Sindhi Matrimony Official CRM</span>
                      <span>Document: {payload.uniqueId}</span>
                      <span>RM: {payload.assignedRmName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prefilled WhatsApp Message Box */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Prefilled WhatsApp Message Preview
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedText ? 'Copied!' : 'Copy Text'}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl whitespace-pre-wrap font-sans max-h-20 overflow-y-auto border border-slate-100">
                  {whatsAppMessage}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHARING HISTORY (Audit Trail) */}
        {activeTab === 'HISTORY' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Biodata Sharing & Generation History
                </h4>
                <p className="text-xs text-slate-500">
                  Immutable audit records tracking every export, download, and WhatsApp dispatch for {member.fullName}.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                {memberAuditLogs.length} Total Events
              </span>
            </div>

            {memberAuditLogs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Prior Biodata Generation Records</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  When an RM or Super Admin generates or shares a biodata for this member, it will be permanently archived here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Generated By</th>
                        <th className="p-3">Template</th>
                        <th className="p-3">Privacy Mode</th>
                        <th className="p-3">Target Recipient</th>
                        <th className="p-3">Action Outcome</th>
                        <th className="p-3">Correlation ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {memberAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-medium text-slate-600 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                            {log.employeeName}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">({log.employeeRole})</span>
                          </td>
                          <td className="p-3 text-slate-700">
                            {log.templateId === 'TRADITIONAL' ? 'Traditional' : 'Modern Minimal'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.privacyMode === 'BLIND'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {log.privacyMode}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700 font-mono text-[11px]">
                            {log.recipientReference || 'Local Download'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                log.eventType === 'BIODATA_DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.eventType === 'BIODATA_SHARE_INITIATED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : log.eventType === 'BIODATA_DOWNLOAD_REQUESTED'
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {log.eventType.replace('BIODATA_', '')}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[10px]">
                            {log.correlationId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Action Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="hidden sm:inline">
              1-Click generates an official A4 PDF & launches WhatsApp Web with prefilled message.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#88131B]" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleShareOnWhatsApp}
              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>Download & Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Attachment Instructions Guidance Modal */}
      {showWhatsAppGuidance && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 mx-auto">
              <Share2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-slate-900">
                PDF Ready! Attach on WhatsApp Web
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The high-resolution matrimonial biodata has been downloaded to your computer and WhatsApp Web opened in your browser.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>The message text has been prefilled in WhatsApp Web.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Click the <strong>Paperclip (📎)</strong> or <strong>(+)</strong> attachment icon in WhatsApp.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Select the downloaded PDF from your <strong>Downloads</strong> folder and click Send!</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelWhatsAppShare}
                className="py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Share Cancelled
              </button>
              <button
                type="button"
                onClick={handleConfirmWhatsAppSent}
                className="py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
              >
                Mark as Sent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default BiodataGeneratorModal;
