import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  LifeBuoy,
  Send,
  HelpCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  MessageSquare,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import {
  supportService,
  DIRECT_CONTACT,
  FAQ_LIST,
  type SupportTicket,
  type TicketCategory,
  type TicketPriority,
} from '../../services/supportService';
import { getStoredUser, getSimulatedUser } from '../../storage';
import { toast } from '../../toastMessage/toast';
import { usePerformanceTracker } from '../../customHooks/usePerformanceTracker';
import { useInputs } from '../../customHooks/useInputs';
import { memoWithDeepEqual } from '../../utils/memoUtils';

interface SupportTicketFormValues {
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
}

interface TicketReplyFormValues {
  replyText: string;
}

interface FaqSearchFormValues {
  faqSearch: string;
}

export const HelpSupportScreen: React.FC = memoWithDeepEqual(() => {
  usePerformanceTracker('HelpSupportScreen');

  const currentUser = useMemo(() => {
    return getSimulatedUser() || getStoredUser() || { fullName: 'Admin User', email: 'admin@sindhimarriage.in', mobile: '+91 9876543210' };
  }, []);

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>(() => supportService.getTickets());

  // Ticket form state
  const {
    values: ticketForm,
    setFieldValue: setTicketFieldValue,
    reset: resetTicketForm,
  } = useInputs<SupportTicketFormValues>({
    category: 'CRM_LEADS',
    priority: 'HIGH',
    subject: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const {
    values: replyForm,
    setFieldValue: setReplyFieldValue,
    reset: resetReplyForm,
  } = useInputs<TicketReplyFormValues>({
    replyText: '',
  });

  // FAQ state
  const {
    values: faqForm,
    setFieldValue: setFaqFieldValue,
  } = useInputs<FaqSearchFormValues>({
    faqSearch: '',
  });
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    faq_1: true,
  });

  // Subscribe to ticket updates
  useEffect(() => {
    const unsubscribe = supportService.subscribe(() => {
      setTickets(supportService.getTickets());
      if (selectedTicket) {
        const updated = supportService.getTicketById(selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    });
    return unsubscribe;
  }, [selectedTicket]);

  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }, []);

  const handleToggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    if (!faqForm.faqSearch.trim()) return FAQ_LIST;
    const q = faqForm.faqSearch.toLowerCase();
    return FAQ_LIST.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [faqForm.faqSearch]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim()) {
      toast.error('Please enter a ticket subject');
      return;
    }
    if (!ticketForm.description.trim()) {
      toast.error('Please provide details of your query or issue');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = supportService.createTicket({
        userId: currentUser.id || 'emp_user',
        userName: currentUser.fullName || 'Admin User',
        userEmail: currentUser.email || 'user@sindhimarriage.in',
        userPhone: currentUser.mobile || '+91 9876543210',
        category: ticketForm.category,
        priority: ticketForm.priority,
        subject: ticketForm.subject.trim(),
        description: ticketForm.description.trim(),
      });

      resetTicketForm();
      setIsSubmitting(false);
      toast.success(`Support Ticket #${newTicket.id} submitted successfully!`);
    }, 400);
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyForm.replyText.trim()) return;
    supportService.addResponse(
      selectedTicket.id,
      currentUser.fullName || 'Staff Member',
      replyForm.replyText.trim(),
      false
    );
    resetReplyForm();
    toast.success('Your message has been added to the ticket thread');
  };

  const getPriorityColor = (p: TicketPriority) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            OPEN
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            IN PROGRESS
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="Help & Direct Support Desk"
        description="Immediate assistance, live chat, dedicated helpline, and staff query ticketing"
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Support Active
          </span>
        }
      />

      {/* 2. Direct 1-Click Contact Channels Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* A. Direct Phone Support */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white rounded-2xl border border-emerald-200/80 p-5 shadow-2xs hover:shadow-xs transition relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                Direct Hotline
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant phone assistance for lead escalation & VoIP mic errors
            </p>
            <div className="mt-3 font-mono font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>{DIRECT_CONTACT.phone}</span>
              <button
                onClick={() => handleCopy(DIRECT_CONTACT.phone, 'Phone number')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Copy phone number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {DIRECT_CONTACT.hours}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`tel:${DIRECT_CONTACT.phone.replace(/\s+/g, '')}`}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              Direct Call Now
            </a>
          </div>
        </div>

        {/* B. WhatsApp Direct Chat */}
        <div className="bg-gradient-to-br from-green-500/10 via-white to-white rounded-2xl border border-green-200/80 p-5 shadow-2xs hover:shadow-xs transition relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-green-100 text-green-800 rounded-full border border-green-200">
                &lt;5 Min SLA
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">WhatsApp Chat</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chat directly with our admin coordinator. Share screenshots instantly.
            </p>
            <div className="mt-3 font-mono font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>{DIRECT_CONTACT.whatsapp}</span>
              <button
                onClick={() => handleCopy(DIRECT_CONTACT.whatsapp, 'WhatsApp number')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Copy WhatsApp number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium">
              Average response: 3-5 minutes
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`https://wa.me/${DIRECT_CONTACT.whatsapp.replace(/\D/g, '')}?text=Hello%20Sindhi%20Matrimony%20Support%20Team%2C%20I%20am%20${encodeURIComponent(
                currentUser.fullName
              )}%20and%20I%20need%20assistance%20with...`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Open WhatsApp Chat
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* C. Official Email Dispatch */}
        <div className="bg-gradient-to-br from-blue-500/10 via-white to-white rounded-2xl border border-blue-200/80 p-5 shadow-2xs hover:shadow-xs transition relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Official Desk
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Email Support</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send formal queries, audit requests & transaction documents
            </p>
            <div className="mt-3 font-mono font-bold text-slate-800 text-sm flex items-center gap-2 truncate">
              <span className="truncate">{DIRECT_CONTACT.email}</span>
              <button
                onClick={() => handleCopy(DIRECT_CONTACT.email, 'Support Email')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer shrink-0"
                title="Copy Email"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-blue-600 mt-1 font-medium">
              Guaranteed resolution within 2 hours
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`mailto:${DIRECT_CONTACT.email}?subject=Sindhi%20Matrimony%20Admin%20Support%20Request%20-%20${encodeURIComponent(
                currentUser.fullName
              )}`}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Direct Email
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Escalation Notice */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wide">
              Emergency Escalation Desk (Super Admin)
            </h4>
            <p className="text-xs text-rose-800">
              For complete portal outage, security vulnerabilities, or blocked credentials: Direct line to Managing Director.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${DIRECT_CONTACT.escalationPhone.replace(/\s+/g, '')}`}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Escalate: {DIRECT_CONTACT.escalationPhone}</span>
          </a>
        </div>
      </div>

      {/* 3. Two Column Section: Submit Query Ticket + Active Tickets Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Direct Query Ticket Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#88131B]/10 text-[#88131B] flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Submit Direct Support Query / Ticket
              </h3>
              <p className="text-xs text-slate-500">
                Create a formal ticket for our IT and CRM management team
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <CustomTextInput
                  value={currentUser.fullName}
                  readOnly
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Email
                </label>
                <CustomTextInput
                  value={currentUser.email}
                  readOnly
                  className="bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Category
                </label>
                <CustomDropDown
                  value={ticketForm.category}
                  onChange={(val) => setTicketFieldValue('category', val as TicketCategory)}
                  options={[
                    { label: 'CRM Leads & Pipeline', value: 'CRM_LEADS' },
                    { label: 'Telephony & VoIP Calling', value: 'TELEPHONY_VOIP' },
                    { label: 'Payments & Refunds', value: 'PAYMENTS_REFUNDS' },
                    { label: 'KYC & Aadhaar Verification', value: 'KYC_VERIFICATION' },
                    { label: 'Sidebar Permissions & Access', value: 'PERMISSIONS_ACCESS' },
                    { label: 'Bug Report / Tech Glitch', value: 'TECHNICAL_BUG' },
                    { label: 'Other Support Query', value: 'OTHER' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency / Priority
                </label>
                <CustomDropDown
                  value={ticketForm.priority}
                  onChange={(val) => setTicketFieldValue('priority', val as TicketPriority)}
                  options={[
                    { label: '🚨 Critical (Work Blocked)', value: 'CRITICAL' },
                    { label: '⚡ High Priority', value: 'HIGH' },
                    { label: '🔹 Medium Priority', value: 'MEDIUM' },
                    { label: '⚪ Low / General Query', value: 'LOW' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject / Brief Issue Summary <span className="text-rose-500">*</span>
              </label>
              <CustomTextInput
                value={ticketForm.subject}
                onChange={(e) => setTicketFieldValue('subject', e.target.value)}
                placeholder="e.g., Unable to unmask contact for Lead #LD-1044"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Description & Context <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => setTicketFieldValue('description', e.target.value)}
                rows={4}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition resize-none"
                placeholder="Describe what occurred, any error messages displayed, and steps you took..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Tickets are tracked with guaranteed SLA response times.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#88131B] hover:bg-[#6c0f15] text-white text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Active Support Tickets (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Your Support Inquiries
                  </h3>
                  <p className="text-xs text-slate-500">Live ticket resolution tracker</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {tickets.length} Total
              </span>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No active tickets submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-amber-400/80 hover:bg-amber-50/20 transition cursor-pointer flex flex-col gap-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-extrabold text-slate-800">
                          {t.id}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getPriorityColor(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      {getStatusBadge(t.status)}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {t.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{t.responses.length} messages</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Click on any ticket to view updates or reply directly.
          </div>
        </div>
      </div>

      {/* 4. Interactive FAQ & Common Troubleshooting Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Frequently Asked Questions & Quick Self-Help
              </h3>
              <p className="text-xs text-slate-500">
                Instant answers for telephony, permissions, and lead disposition
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <CustomTextInput
              size="sm"
              value={faqForm.faqSearch}
              onChange={(e) => setFaqFieldValue('faqSearch', e.target.value)}
              placeholder="Search help topics..."
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              clearable
              onClear={() => setFaqFieldValue('faqSearch', '')}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq) => {
            const isOpen = Boolean(openFaqIds[faq.id]);
            return (
              <div key={faq.id} className="py-3">
                <button
                  onClick={() => handleToggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-[#88131B] transition cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2 pr-4">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 uppercase">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Details & Conversation Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-slate-900">
                  {selectedTicket.id}
                </span>
                {getStatusBadge(selectedTicket.status)}
              </div>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  resetReplyForm();
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-200 transition"
              >
                Close ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {selectedTicket.subject}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>Category: {selectedTicket.category}</span>
                  <span>•</span>
                  <span>Submitted by: {selectedTicket.userName}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed">
                {selectedTicket.description}
              </div>

              {/* Conversation thread */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Activity & Staff Responses ({selectedTicket.responses.length})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedTicket.responses.map((resp) => (
                    <div
                      key={resp.id}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        resp.isStaff
                          ? 'bg-amber-50/80 border border-amber-200 text-slate-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className={resp.isStaff ? 'text-amber-800' : 'text-slate-600'}>
                          {resp.sender}
                        </span>
                        <span className="text-slate-400">{resp.timestamp}</span>
                      </div>
                      <p>{resp.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <CustomTextInput
                  type="text"
                  value={replyForm.replyText}
                  onChange={(e) => setReplyFieldValue('replyText', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  placeholder="Type a follow-up reply..."
                  size="sm"
                  containerClassName="flex-1"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyForm.replyText.trim()}
                  className="px-3 py-2 rounded-xl bg-[#88131B] text-white font-bold text-xs hover:bg-[#6c0f15] transition disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HelpSupportScreen.displayName = 'HelpSupportScreen';
export default HelpSupportScreen;
