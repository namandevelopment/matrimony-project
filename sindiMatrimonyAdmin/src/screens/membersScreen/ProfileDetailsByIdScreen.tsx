import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  Trash2,
  Ban,
  CheckCircle2,
  RotateCw,
  Eye,
  EyeOff,
  User,
  Heart,
  GraduationCap,
  Users,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  Receipt,
  Home,
  Copy,
  Check,
  Image as ImageIcon,
  Plus,
  FileText,
  X,
} from 'lucide-react';
import {
  memberDataService,
  type MatrimonialMember,
  type MemberPlan,
} from '../../services/memberDataService';
import {
  paymentDataService,
  type PaymentTransaction,
  type PlanTier,
  type PaymentGateway,
} from '../../services/paymentDataService';
import { EditProfileModal } from './components/EditProfileModal';
import { StatusBadge } from '../../components/StatusBadge';
import { ReasonModal } from '../../customModals/ReasonModal';
import { BiodataGeneratorModal } from '../../customModals/BiodataGeneratorModal';
import { toast } from '../../toastMessage/toast';
import { useInputs } from '../../customHooks/useInputs';
import { CustomDropDown, type CustomDropDownOption } from '../../components/CustomDropDown';
import { CustomTextInput } from '../../components/CustomTextInput';

const PLAN_TIER_OPTIONS: CustomDropDownOption[] = [
  { value: 'FREE', label: 'Free Plan - ₹0', description: 'Standard listing with basic limits' },
  { value: 'SILVER', label: 'Silver Plan - ₹999', description: '90 Days matchmaking access' },
  { value: 'GOLD', label: 'Gold Plan - ₹2,999', description: '180 Days with verified contacts', badge: 'Popular' },
  { value: 'PLATINUM', label: 'Platinum VIP - ₹5,999', description: 'Priority assistance & unlimited view', badge: 'VIP' },
  { value: 'TILL_MARRIAGE', label: 'Till Marriage - ₹85,000', description: 'Dedicated matchmaker till wedding', badge: 'Elite' },
];

export interface ManualPaymentFormValues {
  amount: number;
  planTier: PlanTier;
  planName: string;
  gateway: PaymentGateway;
  paymentMode: 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Offline';
  receiptNo: string;
}

const getInitialPaymentValues = (): ManualPaymentFormValues => ({
  amount: 999,
  planTier: 'SILVER',
  planName: 'Silver Membership (90 Days)',
  gateway: 'Razorpay',
  paymentMode: 'UPI',
  receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
});

export interface ProfileDetailsScreenState {
  member: MatrimonialMember | null;
  editModalOpen: boolean;
  editInitialTab: 'PERSONAL' | 'CAREER' | 'FAMILY' | 'RELIGION' | 'ADDRESS' | 'ABOUT' | 'PHOTOS';
  showPassword: boolean;
  selectedPlanTier: MemberPlan;
  copiedField: string | null;
  refundTxn: PaymentTransaction | null;
  lightboxImage: string | null;
  isAddPaymentModalOpen: boolean;
  paymentSubmitAttempted: boolean;
  isBiodataModalOpen: boolean;
}

export const ProfileDetailsByIdScreen: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve target member ID: URL param -> Query string -> Fallback to Radhika Chopra ('101037') or first member
  const memberId = params.id || searchParams.get('id') || '101037';

  const {
    values: screenValues,
    setFieldValue: setScreenField,
    setValues: setScreenValues,
  } = useInputs<ProfileDetailsScreenState>(() => {
    const initialMember =
      memberDataService.getMemberById(memberId) ||
      memberDataService.getMembers()[0] ||
      null;
    return {
      member: initialMember,
      editModalOpen: false,
      editInitialTab: 'PERSONAL',
      showPassword: false,
      selectedPlanTier: initialMember?.plan || 'FREE',
      copiedField: null,
      refundTxn: null,
      lightboxImage: null,
      isAddPaymentModalOpen: false,
      paymentSubmitAttempted: false,
      isBiodataModalOpen: false,
    };
  });

  const {
    member,
    editModalOpen,
    editInitialTab,
    showPassword,
    selectedPlanTier,
    copiedField,
    refundTxn,
    lightboxImage,
    isAddPaymentModalOpen,
    paymentSubmitAttempted,
    isBiodataModalOpen,
  } = screenValues;

  const setMember = (val: MatrimonialMember | null) => setScreenField('member', val);
  const setEditModalOpen = (val: boolean) => setScreenField('editModalOpen', val);
  const setEditInitialTab = (tab: ProfileDetailsScreenState['editInitialTab']) => setScreenField('editInitialTab', tab);
  const setShowPassword = (val: boolean | ((prev: boolean) => boolean)) => setScreenField('showPassword', val);
  const setSelectedPlanTier = (plan: MemberPlan) => setScreenField('selectedPlanTier', plan);
  const setCopiedField = (field: string | null) => setScreenField('copiedField', field);
  const setRefundTxn = (txn: PaymentTransaction | null) => setScreenField('refundTxn', txn);
  const setLightboxImage = (img: string | null) => setScreenField('lightboxImage', img);
  const setIsAddPaymentModalOpen = (val: boolean) => setScreenField('isAddPaymentModalOpen', val);
  const setPaymentSubmitAttempted = (val: boolean) => setScreenField('paymentSubmitAttempted', val);
  const setIsBiodataModalOpen = (val: boolean) => setScreenField('isBiodataModalOpen', val);

  // Manual payment receipt modal with useInputs
  const {
    values: paymentForm,
    setValues: setPaymentForm,
    reset: resetPaymentForm,
    errors: paymentErrors,
    touched: paymentTouched,
    validateForm: validatePaymentForm,
  } = useInputs<ManualPaymentFormValues>(getInitialPaymentValues, {
    validate: (vals) => {
      const errs: Partial<Record<keyof ManualPaymentFormValues, string>> = {};
      if (!vals.amount || Number(vals.amount) <= 0) {
        errs.amount = 'Amount must be greater than ₹0';
      }
      if (!vals.receiptNo?.trim()) {
        errs.receiptNo = 'Receipt number is required';
      }
      return errs;
    },
    validateOnChange: true,
  });

  const handleOpenAddPayment = () => {
    setPaymentSubmitAttempted(false);
    resetPaymentForm(getInitialPaymentValues());
    setIsAddPaymentModalOpen(true);
  };

  // Sync member when ID changes or when memberDataService updates
  useEffect(() => {
    const target = memberDataService.getMemberById(memberId);
    if (target) {
      setScreenValues({ member: target, selectedPlanTier: target.plan });
    } else {
      const all = memberDataService.getMembers();
      const fallback = all.find((m) => m.id === memberId || m.uniqueId.toLowerCase() === memberId.toLowerCase()) || all[0];
      if (fallback) {
        setScreenValues({ member: fallback, selectedPlanTier: fallback.plan });
      }
    }
  }, [memberId, setScreenValues]);

  useEffect(() => {
    const unsub = memberDataService.subscribe(() => {
      if (member) {
        const refreshed = memberDataService.getMemberById(member.id);
        if (refreshed) {
          setScreenValues({ member: refreshed, selectedPlanTier: refreshed.plan });
        }
      }
    });
    return unsub;
  }, [member?.id, setScreenValues]);

  // Retrieve transactions for this member
  const userTransactions = useMemo(() => {
    if (!member) return [];
    return paymentDataService.getTransactionsByMember(member.id || member.fullName);
  }, [member]);

  const totalPaid = useMemo(() => {
    return userTransactions
      .filter((t) => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [userTransactions]);

  if (!member) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Member Profile Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md mb-6">
          Could not locate member with ID: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono">{memberId}</code>.
        </p>
        <button
          type="button"
          onClick={() => navigate('/members')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] text-white hover:bg-[#a61720] transition cursor-pointer"
        >
          Return to Members Directory
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openEditTab = (tab: 'PERSONAL' | 'CAREER' | 'FAMILY' | 'RELIGION' | 'ADDRESS' | 'ABOUT' | 'PHOTOS') => {
    setEditInitialTab(tab);
    setEditModalOpen(true);
  };

  const handleToggleStatus = () => {
    const updated = memberDataService.toggleMemberStatus(member.id);
    if (updated) {
      setMember(updated);
      toast.success(
        `Member status changed to ${updated.status === 'ACTIVE' ? 'Active' : 'Inactive'} successfully!`
      );
    }
  };

  const handleDeleteMember = () => {
    if (window.confirm(`Are you sure you want to permanently delete profile of ${member.fullName}?`)) {
      memberDataService.deleteMember(member.id);
      toast.info(`Member ${member.fullName} removed.`);
      navigate('/members');
    }
  };

  const handleUpdatePlan = () => {
    const updated = memberDataService.updateMember(member.id, { plan: selectedPlanTier });
    if (updated) {
      setMember(updated);
      toast.success(`Membership plan upgraded to ${selectedPlanTier} successfully!`);
    }
  };

  const handleDownloadPDF = () => {
    memberDataService.exportSingleMemberSlip(member);
    toast.success(`Profile Dossier PDF/Text slip downloaded for ${member.fullName}`);
  };

  const handleConfirmRefund = (reason: string) => {
    if (!refundTxn) return;
    const ok = paymentDataService.issueRefund(refundTxn.txnId, reason);
    if (ok) {
      toast.success(`Refund processed for ${refundTxn.txnId}.`);
    }
    setRefundTxn(null);
  };

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSubmitAttempted(true);
    if (!validatePaymentForm()) {
      if (paymentErrors.amount) {
        toast.error(paymentErrors.amount);
      } else if (paymentErrors.receiptNo) {
        toast.error(paymentErrors.receiptNo);
      }
      return;
    }

    const created = paymentDataService.addTransaction({
      txnId: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      memberId: member.id,
      memberUniqueId: member.uniqueId,
      memberName: member.fullName,
      memberMobile: member.mobile,
      memberCity: member.city,
      plan: paymentForm.planName,
      planTier: paymentForm.planTier,
      amount: Number(paymentForm.amount),
      gateway: paymentForm.gateway,
      paymentMode: paymentForm.paymentMode,
      status: 'SUCCESS',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + `, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: Date.now(),
      receiptNo: paymentForm.receiptNo.trim(),
    });

    if (created) {
      toast.success(`Manual payment receipt recorded: ₹${created.amount} (Txn: ${created.txnId})`);
      setIsAddPaymentModalOpen(false);
      // Also update member plan if higher
      if (paymentForm.planTier !== 'FREE') {
        memberDataService.updateMember(member.id, { plan: paymentForm.planTier });
      }
    }
  };

  const handleDownloadInvoiceSlip = (txn: PaymentTransaction) => {
    const lines = [
      '====================================================',
      '        SINDHI MATRIMONY — OFFICIAL INVOICE RECEIPT',
      '====================================================',
      `Date & Time: ${txn.date}`,
      `Transaction ID: ${txn.txnId}`,
      `Receipt No: ${txn.receiptNo}`,
      '----------------------------------------------------',
      'CLIENT DETAILS:',
      `Name: ${txn.memberName}`,
      `Member ID: ${txn.memberId} (Unique Code: ${txn.memberUniqueId})`,
      `Mobile: ${txn.memberMobile}`,
      `City: ${txn.memberCity}`,
      '----------------------------------------------------',
      'MEMBERSHIP PACKAGE:',
      `Plan: ${txn.plan} [${txn.planTier}]`,
      `Gross Amount: ₹${txn.amount.toLocaleString('en-IN')}`,
      `Payment Gateway: ${txn.gateway}`,
      `Payment Mode: ${txn.paymentMode}`,
      `Status: ${txn.status}`,
      ...(txn.refundReason ? [`Refund Reason: ${txn.refundReason}`] : []),
      '----------------------------------------------------',
      'Thank you for trusting Sindhi Matrimony Services!',
      'For support: support@sindhimarriage.in / +91-9818022636',
      '====================================================',
    ];

    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${txn.receiptNo}_${txn.txnId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Invoice slip downloaded for ${txn.txnId}`);
  };

  // Image preview: use candidate photo or default placeholder
  const candidatePhoto =
    member.profilePhoto ||
    (member.gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Action Bar matching reference screenshots */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center border border-rose-200">
              <User className="w-4 h-4" />
            </div>
            <span>Profile Details</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
            <span className="hover:text-slate-700 cursor-pointer" onClick={() => navigate('/')}>
              Dashboard
            </span>
            <span>&gt;</span>
            <span className="hover:text-slate-700 cursor-pointer" onClick={() => navigate('/members')}>
              Members
            </span>
            <span>&gt;</span>
            <span className="text-[#C81E28] font-bold uppercase">{member.fullName}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBiodataModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20 cursor-pointer active:scale-95"
            title="Generate A4 Matrimonial Biodata PDF & 1-Click WhatsApp Share"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate Biodata PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow-2xs cursor-pointer active:scale-95"
            title="Download member dossier PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#C81E28]" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => openEditTab('PERSONAL')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition shadow-2xs cursor-pointer active:scale-95"
            title="Edit all fields of this profile"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Profile</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteMember}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition shadow-2xs cursor-pointer active:scale-95"
            title="Delete member"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={handleToggleStatus}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition shadow-2xs cursor-pointer active:scale-95"
            title="Toggle active/inactive status"
          >
            {member.status === 'ACTIVE' ? (
              <>
                <Ban className="w-3.5 h-3.5" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Activate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Red Banner Card matching Screenshot 1 */}
      <div className="relative rounded-3xl shadow-md">
        {/* Banner Top Gradient */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#991B1B] w-full rounded-t-3xl" />

        {/* Content Box Overlapping Banner */}
        <div className="bg-white px-5 pb-6 pt-0 border border-slate-200/90 border-t-0 rounded-b-3xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 -mt-14 sm:-mt-16">
            {/* Candidate Photo & Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
              {/* Profile Photo */}
              <div
                onClick={() => setLightboxImage(candidatePhoto)}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white p-1 shadow-lg shrink-0 border-2 border-white cursor-pointer group"
                title="Click to view full photo"
              >
                <img
                  src={candidatePhoto}
                  alt={member.fullName}
                  className="w-full h-full object-cover rounded-xl group-hover:opacity-95 transition"
                />
                {/* Status Dot Indicator */}
                <div
                  className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                    member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  title={member.status}
                />
              </div>

              {/* Title & Key Pills */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase truncate">
                    {member.fullName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      member.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {member.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="font-mono text-[#C81E28] font-bold flex items-center gap-1">
                    # {member.uniqueId} (ID: {member.id})
                    <button
                      type="button"
                      onClick={() => handleCopy(member.uniqueId, 'Unique ID')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      {copiedField === 'Unique ID' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </span>
                  <span>•</span>
                  <span>Registered — {member.created}</span>
                </div>

                {/* Key Attributes Pills Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-900 border border-rose-200/60">
                    <User className="w-3 h-3 text-[#C81E28]" />
                    {member.gender === 'Female' ? 'Female' : 'Male'}, {member.age} yrs
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-900 border border-rose-200/60">
                    <Heart className="w-3 h-3 text-[#C81E28]" />
                    {member.religion || 'Hindu'} - {member.community || 'Sindhi'} ({member.subcaste})
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-900 border border-rose-200/60">
                    <MapPin className="w-3 h-3 text-[#C81E28]" />
                    {member.city}, {member.state || member.country || 'India'}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-900 border border-rose-200/60">
                    {member.maritalStatus || 'Single'}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {member.mobile}
                  </span>

                  {member.email && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {member.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Current Plan Card (Right side of Hero Banner in screenshot) */}
            <div className="w-full lg:w-72 bg-gradient-to-br from-rose-50/60 to-white rounded-2xl p-4 border border-rose-200/80 shadow-2xs shrink-0 space-y-3 relative z-20">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C81E28] block">
                  CURRENT PLAN
                </span>
                <span className="text-xl font-black text-rose-950 block mt-0.5">
                  {member.plan === 'PLATINUM'
                    ? 'Platinum VIP'
                    : member.plan === 'GOLD'
                    ? 'Gold Plan'
                    : member.plan === 'SILVER'
                    ? 'Silver Plan'
                    : member.plan === 'TILL_MARRIAGE'
                    ? 'Till Marriage'
                    : 'Free Plan'}
                </span>
              </div>

              <div className="relative z-30">
                <CustomDropDown
                  value={selectedPlanTier}
                  onChange={(val) => setSelectedPlanTier(val as MemberPlan)}
                  options={PLAN_TIER_OPTIONS}
                  size="sm"
                  variant="outline"
                  triggerClassName="bg-white border-rose-200 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#C81E28]"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdatePlan}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Update Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Information Sections with Red Card Headers matching Screenshots 1, 2, 3, 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CARD 1: PERSONAL INFORMATION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('PERSONAL')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Gender</span>
              <span className="font-semibold text-slate-800">{member.gender}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Age</span>
              <span className="font-semibold text-slate-800">{member.age}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Date of Birth</span>
              <span className="font-semibold text-slate-800">{member.dateOfBirth || '23/07/1996'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Birth Time</span>
              <span className="font-semibold text-slate-800">{member.birthTime || '02:20 PM'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Birth Place</span>
              <span className="font-semibold text-slate-800">{member.birthPlace || 'NEW DELHI'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Marital Status</span>
              <span className="font-semibold text-slate-800">{member.maritalStatus || 'Single'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Mother Tongue</span>
              <span className="font-semibold text-slate-800">{member.motherTongue || 'Hindi'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Group</span>
              <span className="font-semibold text-slate-800">{member.bloodGroup || 'B+'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Diet</span>
              <span className="font-semibold text-slate-800">{member.diet || 'Vegetarian'}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: APPEARANCE & LIFESTYLE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Appearance & Lifestyle</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('PERSONAL')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Height</span>
              <span className="font-semibold text-slate-800">{member.height || '5-5'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Weight</span>
              <span className="font-semibold text-slate-800">{member.weight || '54 kg'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Body Type</span>
              <span className="font-semibold text-slate-800">{member.bodyType || 'Slim'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Complexion</span>
              <span className="font-semibold text-slate-800">{member.complexion || 'Fair'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Smoking</span>
              <span className="font-semibold text-slate-800">{member.smokingHabit || 'No'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Alcohol</span>
              <span className="font-semibold text-slate-800">{member.alcoholConsumption || 'No'}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: EDUCATION & PROFESSION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education & Profession</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('CAREER')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Education</span>
              <span className="font-semibold text-slate-800">{member.education || 'GRADUATE, NTT & NPTT'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Education Area</span>
              <span className="font-semibold text-slate-800">{member.educationArea || 'GRADUATE'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Extra Education</span>
              <span className="font-semibold text-slate-800">{member.extraEducation || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Working With</span>
              <span className="font-semibold text-slate-800">{member.workingWith || 'WORKING - SALARY - 25,000/- PM'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Profession Area</span>
              <span className="font-semibold text-slate-800">{member.employedIn || 'Corporate'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Working As</span>
              <span className="font-semibold text-slate-800">{member.workingAs || member.profession || 'Others'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Salary</span>
              <span className="font-extrabold text-emerald-700">{member.annualIncome || '₹3 - 4 Lakh'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Disabilities</span>
              <span className="font-semibold text-slate-800">{member.disabilities || 'No'}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: FAMILY INFORMATION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Family Information</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('FAMILY')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Father</span>
              <span className="font-semibold text-slate-800">
                {member.fatherName || 'RAKESH CHOPRA'} - {member.fatherOccupation || 'BUSINESSMAN'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Mother</span>
              <span className="font-semibold text-slate-800">
                {member.motherName || 'NEETU CHOPRA'} - {member.motherOccupation || 'HOME MAKER'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Family Type</span>
              <span className="font-semibold text-slate-800">{member.familyType || 'Nuclear'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Family Value</span>
              <span className="font-semibold text-slate-800">{member.familyValue || 'MIDDLE CLASS'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">House</span>
              <span className="font-semibold text-slate-800">{member.house || 'Owned'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Members Live With</span>
              <span className="font-semibold text-slate-800">{member.membersLiveWith || '3'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">About Brother</span>
              <span className="font-semibold text-slate-800">{member.aboutBrother || '1 YOUNGER BROTHER'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">About Sister</span>
              <span className="font-semibold text-slate-800">{member.aboutSister || '—'}</span>
            </div>
          </div>
        </div>

        {/* CARD 5: RELIGION & HOROSCOPE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Religion & Horoscope</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('RELIGION')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Religion</span>
              <span className="font-semibold text-slate-800">{member.religion || 'Hindu'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Community</span>
              <span className="font-semibold text-slate-800">{member.community || 'Punjabi'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sub-Community</span>
              <span className="font-semibold text-slate-800">{member.subcaste || 'Chopra'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Gotra</span>
              <span className="font-semibold text-slate-800">{member.gotra || 'NOT MENTION'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Mangalik</span>
              <span className="font-semibold text-slate-800">{member.manglik || 'No'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sunsign</span>
              <span className="font-semibold text-slate-800">{member.sunSign || 'Not Available'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Nakshatram</span>
              <span className="font-semibold text-slate-800">{member.nakshatram || 'Select nakshatram'}</span>
            </div>
          </div>
        </div>

        {/* CARD 6: CONTACT & LOGIN */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Contact & Login</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('ADDRESS')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile</span>
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                {member.mobile}
                <button
                  type="button"
                  onClick={() => handleCopy(member.mobile, 'Mobile')}
                  className="hover:text-slate-900 cursor-pointer text-slate-400"
                >
                  {copiedField === 'Mobile' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Alternate Mobile</span>
              <span className="font-semibold text-slate-800">{member.alternateMobile || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Landline</span>
              <span className="font-semibold text-slate-800">{member.landline || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Email</span>
              <span className="font-semibold text-slate-800">{member.email || '—'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Password</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {showPassword ? member.password || `${member.fullName.replace(/\s+/g, '').toUpperCase()}07566` : '••••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Toggle show password"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 7: CURRENT / WORKING ADDRESS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Current / Working Address</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('ADDRESS')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Address</span>
              <span className="font-semibold text-slate-800">{member.address || `${member.city.toUpperCase()}, DELHI`}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">City</span>
              <span className="font-semibold text-slate-800">{member.city}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">State</span>
              <span className="font-semibold text-slate-800">{member.state || 'Delhi'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Country</span>
              <span className="font-semibold text-slate-800">{member.country || 'INDIA'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pincode</span>
              <span className="font-semibold text-slate-800">{member.pincode || '110024'}</span>
            </div>
          </div>
        </div>

        {/* CARD 8: PERMANENT ADDRESS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Permanent Address</span>
            </div>
            <button
              type="button"
              onClick={() => openEditTab('ADDRESS')}
              className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Address</span>
              <span className="font-semibold text-slate-800">
                {member.permanentAddress || member.address || `${member.city.toUpperCase()}, DELHI`}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">City</span>
              <span className="font-semibold text-slate-800">{member.permanentCity || member.city}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">State</span>
              <span className="font-semibold text-slate-800">{member.permanentState || member.state || 'Delhi'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Country</span>
              <span className="font-semibold text-slate-800">{member.permanentCountry || member.country || 'INDIA'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pincode</span>
              <span className="font-semibold text-slate-800">{member.permanentPincode || member.pincode || '110024'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 9: ADDITIONAL INFORMATION (Full Width) matching Screenshot 4 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Additional Information</span>
          </div>
          <button
            type="button"
            onClick={() => openEditTab('ABOUT')}
            className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">About Me</span>
            <p className="text-slate-800 font-medium mt-1 leading-relaxed">
              {member.aboutCandidate || member.aboutMe || 'Dedicated, cultured, and family-oriented person with positive outlook towards life. Values honest communication, progressive thoughts, and mutual respect.'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">About Family</span>
            <p className="text-slate-800 font-medium mt-1 leading-relaxed">
              {member.aboutFamily || 'MODERATE'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Desired Profile</span>
            <p className="text-slate-800 font-medium mt-1 leading-relaxed">
              {member.desiredProfile || `PREFERENCE - 1. AGE - 29 2. CASTE - HINDU 3. LOCATION - SOUTH DELHI 4. MARRIED/UNMARRIED - UNMARRIED`}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 10: PHOTO GALLERY matching Screenshot 4 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Photo Gallery</span>
          </div>
          <button
            type="button"
            onClick={() => openEditTab('PHOTOS')}
            className="hover:text-amber-200 transition cursor-pointer text-[11px] font-bold lowercase flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Manage Photos
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div
              onClick={() => setLightboxImage(candidatePhoto)}
              className="w-36 h-44 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative group cursor-pointer"
            >
              <img
                src={candidatePhoto}
                alt={member.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Primary Avatar
              </span>
            </div>
            {member.galleryPhotos &&
              member.galleryPhotos.map((photo: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setLightboxImage(photo)}
                  className="w-36 h-44 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative group cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Photo #{i + 1}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* CARD 11: PAYMENT & MEMBERSHIP HISTORY (Requested specifically!) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between font-black text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span>Payment History & Membership Ledger</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-amber-200">
              Lifetime Paid: ₹{totalPaid.toLocaleString('en-IN')}
            </span>
            <button
              type="button"
              onClick={handleOpenAddPayment}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        <div className="p-5">
          {userTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No past payment transactions recorded for this member yet.</p>
              <button
                type="button"
                onClick={handleOpenAddPayment}
                className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C81E28] text-white hover:bg-[#a61720] transition cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Record First Payment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Txn ID</th>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Plan Tier</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Gateway & Mode</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.txnId}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{t.receiptNo}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{t.plan}</span>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900 text-sm">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {t.gateway} ({t.paymentMode})
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-3 text-slate-500">{t.date}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoiceSlip(t)}
                          className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer inline-flex items-center gap-1"
                          title="Download Invoice Receipt"
                        >
                          <FileText className="w-3 h-3 text-[#C81E28]" />
                          Slip
                        </button>
                        {t.status === 'SUCCESS' && (
                          <button
                            type="button"
                            onClick={() => setRefundTxn(t)}
                            className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Photo Gallery */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-transparent">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-rose-400 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Candidate"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border-2 border-white/20 object-contain"
            />
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#991B1B] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black tracking-tight">Record Payment Receipt</h3>
                <p className="text-xs text-white/80 mt-0.5">Member: {member.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="p-5 space-y-4 text-xs">
              <CustomDropDown
                label="Plan Package"
                value={paymentForm.planTier}
                options={PLAN_TIER_OPTIONS}
                onChange={(val) => {
                  const tier = val as PlanTier;
                  const priceMap: Record<PlanTier, number> = {
                    FREE: 0,
                    SILVER: 999,
                    GOLD: 2999,
                    PLATINUM: 5999,
                    TILL_MARRIAGE: 85000,
                  };
                  const nameMap: Record<PlanTier, string> = {
                    FREE: 'Free Plan',
                    SILVER: 'Silver Membership (90 Days)',
                    GOLD: 'Gold Matchmaking (180 Days)',
                    PLATINUM: 'Platinum VIP (180 Days)',
                    TILL_MARRIAGE: 'Till Marriage Elite Package',
                  };
                  setPaymentForm((prev) => ({
                    ...prev,
                    planTier: tier,
                    planName: nameMap[tier],
                    amount: priceMap[tier],
                  }));
                }}
                size="sm"
              />

              <CustomTextInput
                label="Amount (₹) *"
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
                error={(paymentSubmitAttempted || paymentTouched.amount) ? paymentErrors.amount : undefined}
                size="sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <CustomDropDown
                  label="Payment Gateway"
                  value={paymentForm.gateway}
                  options={[
                    { value: 'Razorpay', label: 'Razorpay' },
                    { value: 'Cashfree', label: 'Cashfree' },
                    { value: 'UPI / QR', label: 'UPI / QR' },
                    { value: 'Bank NEFT', label: 'Bank NEFT' },
                  ]}
                  onChange={(val) => setPaymentForm((prev) => ({ ...prev, gateway: val as any }))}
                  size="sm"
                />

                <CustomDropDown
                  label="Payment Mode"
                  value={paymentForm.paymentMode}
                  options={[
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'Debit Card', label: 'Debit Card' },
                    { value: 'NetBanking', label: 'NetBanking' },
                    { value: 'Offline', label: 'Offline / Cash' },
                  ]}
                  onChange={(val) => setPaymentForm((prev) => ({ ...prev, paymentMode: val as any }))}
                  size="sm"
                />
              </div>

              <CustomTextInput
                label="Receipt No *"
                type="text"
                required
                value={paymentForm.receiptNo}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, receiptNo: e.target.value }))}
                error={(paymentSubmitAttempted || paymentTouched.receiptNo) ? paymentErrors.receiptNo : undefined}
                size="sm"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white shadow-xs cursor-pointer active:scale-95"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        member={member}
        initialTab={editInitialTab}
        onClose={() => setEditModalOpen(false)}
        onSaved={(updated) => setMember(updated)}
      />

      {/* Reason Modal for Processing Refund */}
      <ReasonModal
        isOpen={Boolean(refundTxn)}
        title="Approve Member Refund"
        description={`Refund of ₹${refundTxn?.amount.toLocaleString('en-IN')} to ${member.fullName} for transaction ${refundTxn?.txnId}.`}
        confirmText="Confirm Refund"
        isDestructive={true}
        onClose={() => setRefundTxn(null)}
        onConfirm={handleConfirmRefund}
      />

      {/* 1-Click WhatsApp Biodata Maker & Formatter Modal */}
      <BiodataGeneratorModal
        isOpen={isBiodataModalOpen}
        onClose={() => setIsBiodataModalOpen(false)}
        member={member}
      />
    </div>
  );
};

export const ProfileDetailsById = ProfileDetailsByIdScreen;
export default ProfileDetailsByIdScreen;
