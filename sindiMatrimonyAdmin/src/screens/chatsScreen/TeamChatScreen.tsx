import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Search,
  Shield,
  Sparkles,
  Paperclip,
  Contact2,
  ChevronLeft,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomTextInput } from '../../components/CustomTextInput';
import { useInputs } from '../../customHooks/useInputs';
import { crmDataService } from '../../services/crmDataService';
import type { TeamChatMessage, Lead } from '../../types/crm.types';
import type { Employee } from '../../types/employee.types';
import { getStoredUser, getSimulatedUser, getActiveRole } from '../../storage';

interface TeamChatFormValues {
  searchQuery: string;
  messageInput: string;
}

export const TeamChatScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Current session & effective user
  const storedUser = getStoredUser() || { fullName: 'Rajesh Mulchandani', role: 'SUPER_ADMIN', id: 'emp_001' };
  const simulatedUser = getSimulatedUser();
  const activeRoleOverride = getActiveRole();
  const effectiveUser = simulatedUser || storedUser;
  const effectiveRole = activeRoleOverride || effectiveUser.role || 'SUPER_ADMIN';
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  // State
  const [employees, setEmployees] = useState<Employee[]>(() => crmDataService.getEmployees());
  const [leads, setLeads] = useState<Lead[]>(() => crmDataService.getLeads());
  const [allMessages, setAllMessages] = useState<TeamChatMessage[]>(() => crmDataService.getTeamChatMessages());

  const {
    values: chatForm,
    setFieldValue: setChatFieldValue,
  } = useInputs<TeamChatFormValues>({
    searchQuery: '',
    messageInput: '',
  });

  const [selectedLeadForAttachment, setSelectedLeadForAttachment] = useState<Lead | null>(null);
  const [isAttachLeadModalOpen, setIsAttachLeadModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

  // Subscriptions to live store
  useEffect(() => {
    const unsub = crmDataService.subscribe(() => {
      setEmployees(crmDataService.getEmployees());
      setLeads(crmDataService.getLeads());
      setAllMessages(crmDataService.getTeamChatMessages());
    });
    return unsub;
  }, []);

  // Determine Current User ID in CRM
  const currentUserId = useMemo(() => {
    const found = employees.find(
      (e) => e.id === effectiveUser.id || e.employeeId === effectiveUser.employeeId || e.fullName === effectiveUser.fullName
    );
    return found ? found.id : effectiveUser.id || 'emp_001';
  }, [employees, effectiveUser]);

  // Selected Chat Partner (Target Employee)
  const defaultPartnerId = useMemo(() => {
    const paramId = searchParams.get('empId');
    if (paramId && employees.some((e) => e.id === paramId)) return paramId;

    if (isSuperAdmin) {
      // For Super Admin, default to Priya Sharma (CRM Manager)
      const priya = employees.find((e) => e.fullName.includes('Priya') || e.id === 'emp_003');
      return priya ? priya.id : employees.find((e) => e.id !== currentUserId)?.id || 'emp_003';
    } else {
      // For Employee, default to Super Admin (Rajesh Mulchandani)
      const admin = employees.find((e) => e.role === 'SUPER_ADMIN') || employees[0];
      return admin ? admin.id : 'emp_001';
    }
  }, [searchParams, employees, isSuperAdmin, currentUserId]);

  const [activePartnerId, setActivePartnerId] = useState<string>(defaultPartnerId);

  // Synchronize search param if provided
  useEffect(() => {
    const paramId = searchParams.get('empId');
    if (paramId && employees.some((e) => e.id === paramId)) {
      setActivePartnerId(paramId);
      setMobileView('chat');
    }
  }, [searchParams, employees]);

  const activePartner = useMemo(() => {
    return employees.find((e) => e.id === activePartnerId) || employees[0];
  }, [employees, activePartnerId]);

  // Mark incoming messages as read when active thread changes
  useEffect(() => {
    if (activePartnerId && currentUserId) {
      crmDataService.markMessagesAsRead(activePartnerId, currentUserId);
    }
  }, [activePartnerId, currentUserId, allMessages.length]);

  // Messages between current user and active partner
  const threadMessages = useMemo(() => {
    return allMessages.filter(
      (m) =>
        (m.senderId === currentUserId && m.recipientId === activePartnerId) ||
        (m.senderId === activePartnerId && m.recipientId === currentUserId)
    );
  }, [allMessages, currentUserId, activePartnerId]);

  // Scoped Auto-scroll inside chat messages container ONLY (prevents window & left pane from scrolling)
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [threadMessages]);

  useEffect(() => {
    scrollToBottom('auto');
  }, [activePartnerId]);

  // Colleague directory list on left
  const partnerList = useMemo(() => {
    let list = employees.filter((e) => e.id !== currentUserId);

    if (chatForm.searchQuery.trim()) {
      const q = chatForm.searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    return list.map((emp) => {
      // Find latest message between current user and this employee
      const msgs = allMessages.filter(
        (m) =>
          (m.senderId === currentUserId && m.recipientId === emp.id) ||
          (m.senderId === emp.id && m.recipientId === currentUserId)
      );
      const lastMsg = msgs[msgs.length - 1];
      const unreadCount = allMessages.filter(
        (m) => m.senderId === emp.id && m.recipientId === currentUserId && !m.read
      ).length;

      return {
        employee: emp,
        lastMessage: lastMsg,
        unreadCount,
      };
    });
  }, [employees, currentUserId, chatForm.searchQuery, allMessages]);

  // Handle Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatForm.messageInput.trim() && !selectedLeadForAttachment) return;

    crmDataService.sendTeamChatMessage({
      senderId: currentUserId,
      senderName: effectiveUser.fullName || (isSuperAdmin ? 'Super Administrator' : 'CRM Executive'),
      senderRole: effectiveRole,
      recipientId: activePartner.id,
      recipientName: activePartner.fullName,
      recipientRole: activePartner.role,
      content: chatForm.messageInput.trim() || (selectedLeadForAttachment ? `Sharing reference for lead: ${selectedLeadForAttachment.name}` : ''),
      leadReference: selectedLeadForAttachment
        ? {
            leadId: selectedLeadForAttachment.leadId,
            leadName: selectedLeadForAttachment.name,
            status: selectedLeadForAttachment.status,
            subcaste: selectedLeadForAttachment.subcaste,
            mobile: selectedLeadForAttachment.mobile,
          }
        : undefined,
    });

    setChatFieldValue('messageInput', '');
    setSelectedLeadForAttachment(null);
  };

  // Quick Action Prompts
  const handleSendQuickAction = (text: string) => {
    setChatFieldValue('messageInput', text);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Team Chat & Staff Communication"
        description="Direct two-way internal messaging between Super Admin and CRM Employees. Collaborate on lead assignments, discount approvals, and follow-up strategies in real-time."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-[#DB2F3C]" />
            Internal Staff Channel
          </span>
        }
      />

      {/* Main Two-Pane Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:grid md:grid-cols-12 h-[calc(100vh-225px)] min-h-[500px] max-h-[760px]">
        {/* Left Column: Team Channel Directory (4 cols) */}
        <div
          className={`md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/60 h-full min-h-0 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#88131B]" />
                {isSuperAdmin ? 'Staff Directory' : 'Management & Team'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {partnerList.length} Staff
              </span>
            </div>

            <CustomTextInput
              size="sm"
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              placeholder="Search employee or role..."
              value={chatForm.searchQuery}
              onChange={(e) => setChatFieldValue('searchQuery', e.target.value)}
              clearable
              onClear={() => setChatFieldValue('searchQuery', '')}
            />
          </div>

          {/* Employee Channels List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {partnerList.map(({ employee, lastMessage, unreadCount }) => {
              const isSelected = employee.id === activePartnerId;
              const isEmpAdmin = employee.role === 'SUPER_ADMIN';

              return (
                <button
                  key={employee.id}
                  onClick={() => {
                    setActivePartnerId(employee.id);
                    setMobileView('chat');
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-50 to-amber-50/60 border border-red-200 shadow-xs'
                      : 'hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs ${
                          isEmpAdmin
                            ? 'bg-gradient-to-tr from-[#88131B] to-rose-600 text-white'
                            : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-white'
                        }`}
                      >
                        {employee.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {employee.fullName}
                        </span>
                        {isEmpAdmin && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                            Super Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <span>{employee.designation || employee.role}</span>
                      </div>
                      {lastMessage && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {lastMessage.content}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {lastMessage && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        {lastMessage.timestamp}
                      </span>
                    )}
                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#DB2F3C] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chat Thread (8 cols) */}
        <div
          className={`md:col-span-8 flex flex-col bg-white h-full min-h-0 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Partner Top Bar */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back button on mobile */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer shrink-0"
                title="Back to Staff List"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#88131B] to-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                {activePartner.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-extrabold text-slate-900 truncate">{activePartner.fullName}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    {activePartner.role}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 truncate">
                  <span className="truncate">{activePartner.department}</span>
                  <span>•</span>
                  <span className="truncate">{activePartner.email}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Mobile: {activePartner.mobile}</span>
                </div>
              </div>
            </div>

            {/* Quick Link to Leads for this partner */}
            <button
              onClick={() => navigate(`/leads`)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
            >
              <Contact2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Assigned Leads</span>
            </button>
          </div>

          {/* Conversation Messages Thread */}
          <div
            ref={chatMessagesContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/30 to-white"
          >
            {threadMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#DB2F3C] flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Previous Messages</h3>
                <p className="text-xs max-w-sm text-slate-500">
                  Start an internal conversation with {activePartner.fullName}. Discuss lead assignments, follow-ups, or discount approvals.
                </p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isSentByMe = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-100`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-1">
                      <span className="font-bold text-slate-600">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 shadow-xs text-xs leading-relaxed space-y-2 break-words ${
                        isSentByMe
                          ? 'bg-gradient-to-r from-[#88131B] via-[#941A22] to-[#7B0F16] text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p className="font-medium whitespace-pre-wrap break-words">{msg.content}</p>

                      {/* Attached Lead Reference Card */}
                      {msg.leadReference && (
                        <div
                          className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                            isSentByMe
                              ? 'bg-black/20 border-white/20 text-white'
                              : 'bg-amber-50/70 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold flex items-center gap-1.5 truncate">
                              <Contact2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              <span className="truncate">{msg.leadReference.leadName}</span>
                              <span className="text-[10px] opacity-80 font-mono">
                                ({msg.leadReference.leadId})
                              </span>
                            </div>
                            <div className="text-[10px] opacity-80 mt-0.5">
                              Subcaste: {msg.leadReference.subcaste} • Status: {msg.leadReference.status}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/leads')}
                            className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-extrabold text-[10px] hover:bg-slate-100 transition shadow-2xs shrink-0 cursor-pointer"
                          >
                            Open Lead →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="px-4 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Replies:
            </span>
            {[
              'Please prioritize the 5 high-priority Bhaiband leads assigned today.',
              'Approved! You may offer the customer a 10% community discount.',
              'Customer requested senior matchmaker call. Taking over follow-up.',
              'Please log what response came from Karan Advani.',
              'All assigned follow-ups completed for the morning shift.',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuickAction(chip)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200 transition shrink-0 cursor-pointer shadow-2xs"
              >
                {chip.length > 40 ? chip.substring(0, 40) + '...' : chip}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            {/* Attach Lead Button */}
            <button
              type="button"
              onClick={() => setIsAttachLeadModalOpen(true)}
              title="Attach a lead reference into this message"
              className={`p-2.5 rounded-2xl border transition cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold ${
                selectedLeadForAttachment
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Paperclip className="w-4 h-4 text-slate-500" />
              {selectedLeadForAttachment && (
                <span className="hidden sm:inline text-[11px] font-bold truncate max-w-[100px]">
                  {selectedLeadForAttachment.name}
                </span>
              )}
            </button>

            <div className="flex-1">
              <CustomTextInput
                size="md"
                value={chatForm.messageInput}
                onChange={(e) => setChatFieldValue('messageInput', e.target.value)}
                placeholder={`Message ${activePartner.fullName}... (Press Enter to send)`}
              />
            </div>

            <button
              type="submit"
              disabled={!chatForm.messageInput.trim() && !selectedLeadForAttachment}
              className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 ${
                chatForm.messageInput.trim() || selectedLeadForAttachment
                  ? 'bg-gradient-to-r from-[#88131B] to-red-700 text-white hover:from-red-800 hover:to-red-900'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Attach Lead Reference Modal */}
      {isAttachLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Select Lead to Reference in Chat</h3>
                <p className="text-[11px] text-slate-500">Attach customer inquiry details into your conversation</p>
              </div>
              <button
                onClick={() => setIsAttachLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 max-h-[60vh]">
              {leads.slice(0, 15).map((ld) => (
                <div
                  key={ld.id}
                  onClick={() => {
                    setSelectedLeadForAttachment(ld);
                    setIsAttachLeadModalOpen(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{ld.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {ld.leadId} • {ld.subcaste} • {ld.city} • Mobile: {ld.mobile}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[10px] font-bold"
                  >
                    Attach
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamChatScreen;
