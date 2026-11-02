import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Check,
  Tag,
  Flame,
} from 'lucide-react';
import {
  type PaymentVisitor,
  campaignService,
} from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CustomTextInput } from '../../../components/CustomTextInput';

export const PaymentVisitorsSection: React.FC = () => {
  const [visitors, setVisitors] = useState<PaymentVisitor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreen, setSelectedScreen] = useState<'ALL' | 'PAYMENT_UPGRADE' | 'FESTIVAL_OFFERS' | 'PRIME_MODAL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'NEW_VISIT' | 'CONTACTED' | 'CONVERTED' | 'DROPPED'>('ALL');
  const [todayOnly, setTodayOnly] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Subscribe to live campaignService state updates
  useEffect(() => {
    const refresh = () => setVisitors(campaignService.getPaymentVisitors());
    refresh();
    const unsubscribe = campaignService.subscribe(refresh);
    return () => unsubscribe();
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const stats = useMemo(() => {
    return campaignService.getPaymentVisitorsStats();
  }, [visitors]);

  const filteredVisitors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visitors.filter((v) => {
      if (todayOnly && v.visitDate !== todayStr) return false;
      if (selectedScreen !== 'ALL' && v.visitedScreen !== selectedScreen) return false;
      if (selectedStatus !== 'ALL' && v.status !== selectedStatus) return false;
      if (q) {
        const matchesName = v.name?.toLowerCase().includes(q);
        const matchesPhone = v.phone?.includes(q);
        const matchesMemberId = v.memberId?.toLowerCase().includes(q);
        const matchesCity = v.city?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesMemberId && !matchesCity) return false;
      }
      return true;
    });
  }, [visitors, searchQuery, selectedScreen, selectedStatus, todayOnly, todayStr]);

  const handleStatusChange = (id: string, newStatus: PaymentVisitor['status']) => {
    campaignService.updatePaymentVisitorStatus(id, newStatus);
    toast.success(`Visitor status updated to ${newStatus.replace('_', ' ')}.`);
  };

  const handleSaveNotes = (id: string) => {
    campaignService.updatePaymentVisitorStatus(id, undefined as any, notesInput);
    setEditingNotesId(null);
    setNotesInput('');
    toast.success('Counselor notes updated.');
  };

  const handleSendSpecialOffer = (visitor: PaymentVisitor) => {
    const coupon = 'SINDHI50';
    const message = encodeURIComponent(
      `Hello ${visitor.name}, we noticed you explored our Membership Plans on Sindhi Matrimony! Use exclusive coupon code ${coupon} to get flat 50% discount today: https://sindhimarriage.in/upgrade`
    );
    window.open(`https://wa.me/${visitor.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    campaignService.updatePaymentVisitorStatus(visitor.id, 'CONTACTED', `Sent ${coupon} coupon via WhatsApp`);
    toast.success(`Special offer discount sent to ${visitor.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Daily Deduplication & Anti-Spam Notice Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-300/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900">
                1-Visit-Per-Day Rate Limiting &amp; Anti-Spam Rule Active
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Automated
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Even if a user visits the payment or offer screen multiple times throughout the day, their entry is logged exactly <strong>once every 24 hours</strong> to ensure your CRM leads remain accurate.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTodayOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              todayOnly
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{todayOnly ? 'Showing Today Only' : 'Show All Time'}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Today&apos;s Visitors</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.todayCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1">
            <span className="text-emerald-600 font-bold">Throttled (1/day)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Free Users (High Intent)</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.freeTierHighIntentCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Active Free users checking rates
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Follow-up Pending</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.pendingFollowupCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            New intent visits uncontacted
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Converted to Paid</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.convertedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Upgraded following visit
          </div>
        </div>
      </div>

      {/* 3. Toolbar: Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <CustomTextInput
              placeholder="Search by name, phone, member ID..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Screen Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedScreen('ALL')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedScreen === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Screens
              </button>
              <button
                type="button"
                onClick={() => setSelectedScreen('PAYMENT_UPGRADE')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedScreen === 'PAYMENT_UPGRADE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upgrade Plans
              </button>
              <button
                type="button"
                onClick={() => setSelectedScreen('FESTIVAL_OFFERS')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedScreen === 'FESTIVAL_OFFERS' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Festival Offers
              </button>
              <button
                type="button"
                onClick={() => setSelectedScreen('PRIME_MODAL')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedScreen === 'PRIME_MODAL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prime Modal
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedStatus('ALL')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedStatus === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('NEW_VISIT')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedStatus === 'NEW_VISIT' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('CONTACTED')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedStatus === 'CONTACTED' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contacted
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('CONVERTED')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedStatus === 'CONVERTED' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Converted
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Visitors Table / Card List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredVisitors.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No visitors found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No matching payment or offer screen visits found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Member Details</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Visited Screen / Offer</th>
                  <th className="py-3 px-4">Visit Time</th>
                  <th className="py-3 px-4">Current Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick CRM Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredVisitors.map((v) => {
                  const isToday = v.visitDate === todayStr;
                  const dateObj = new Date(v.visitedAt);
                  const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition">
                      {/* User Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-600 text-sm border border-slate-300 shadow-2xs">
                            {v.avatar ? (
                              <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              v.name.slice(0, 1).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{v.name}</span>
                              {v.gender && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                  {v.gender}, {v.age || '28'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-rose-700 font-bold">{v.memberId}</span>
                              <span>•</span>
                              <span>{v.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{v.phone || 'Not Available'}</span>
                          </div>
                          {v.email && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[140px]">{v.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Screen Visited */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              v.visitedScreen === 'PAYMENT_UPGRADE'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : v.visitedScreen === 'FESTIVAL_OFFERS'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-purple-50 text-purple-800 border-purple-200'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{v.visitedScreenTitle}</span>
                          </span>
                          {v.notes && (
                            <p className="text-[11px] text-slate-500 italic max-w-xs truncate">
                              &ldquo;{v.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Visit Time */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            {isToday ? (
                              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">
                                Today
                              </span>
                            ) : (
                              <span>{v.visitDate}</span>
                            )}
                            <span className="text-slate-600">{timeFormatted}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Total historical visits: {v.totalHistoricalVisits || 1}
                          </div>
                        </div>
                      </td>

                      {/* Current Plan */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            v.currentPlan === 'FREE_MEMBER'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {v.currentPlan === 'FREE_MEMBER' ? 'Free Tier (High Intent)' : v.currentPlan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-xl text-xs font-bold border cursor-pointer outline-none transition ${
                            v.status === 'NEW_VISIT'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : v.status === 'CONTACTED'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : v.status === 'CONVERTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="NEW_VISIT">New Visit</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Converted to Paid</option>
                          <option value="DROPPED">Dropped / Inactive</option>
                        </select>
                      </td>

                      {/* Quick CRM Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Discount CTA */}
                          <button
                            type="button"
                            title="Send Discount Coupon on WhatsApp"
                            onClick={() => handleSendSpecialOffer(v)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Quick Call */}
                          <a
                            href={`tel:${v.phone}`}
                            title="Call Member"
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer inline-flex items-center justify-center"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Add Notes */}
                          <button
                            type="button"
                            title="Edit Notes"
                            onClick={() => {
                              setEditingNotesId(v.id);
                              setNotesInput(v.notes || '');
                            }}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Counselor Notes Edit Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-rose-600" />
              <span>Update Counselor / Telecaller Notes</span>
            </h3>
            <textarea
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. User requested 20% discount; calling back tomorrow at 3 PM..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNotesId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotes(editingNotesId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

