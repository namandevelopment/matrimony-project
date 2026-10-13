import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  IndianRupee,
  Search,
  Calendar,
  Eye,
  RotateCcw,
  X,
  CreditCard,
  Crown,
  Receipt,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { TabsHeader } from '../../components/TabsHeader';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { ReasonModal } from '../../customModals/ReasonModal';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useGlobalModal } from '../../customModals/ModalContext';
import {
  paymentDataService,
  type PaymentTransaction,
  type DateRangePreset,
} from '../../services/paymentDataService';
import type { Column } from '../../components/DataTable';
import { toast } from '../../toastMessage/toast';
import { useInputs } from '../../customHooks/useInputs';

export interface FinanceFilterValues {
  datePreset: DateRangePreset;
  customStartDate: string;
  customEndDate: string;
  selectedStatus: string;
  selectedGateway: string;
  selectedPlanTier: string;
  searchQuery: string;
}

export const FinanceScreen: React.FC = () => {
  const { openUserProfile } = useGlobalModal();

  const [activeTab, setActiveTab] = useState('LEDGER');
  const {
    values: filters,
    setFieldValue,
    reset: resetFilters,
  } = useInputs<FinanceFilterValues>({
    datePreset: 'ALL',
    customStartDate: '',
    customEndDate: '',
    selectedStatus: 'ALL',
    selectedGateway: 'ALL',
    selectedPlanTier: 'ALL',
    searchQuery: '',
  });

  const [refundModal, setRefundModal] = useState<PaymentTransaction | null>(null);

  // Subscribe to live transactions updates
  const [dataVersion, setDataVersion] = useState(0);
  useEffect(() => {
    const unsub = paymentDataService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Compute filtered transactions and dynamic KPIs
  const { transactions, kpis, rangeDescription } = useMemo(() => {
    return paymentDataService.filterTransactions({
      datePreset: filters.datePreset,
      customStartDate: filters.customStartDate || undefined,
      customEndDate: filters.customEndDate || undefined,
      status: filters.selectedStatus,
      gateway: filters.selectedGateway,
      planTier: filters.selectedPlanTier,
      search: filters.searchQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataVersion,
    filters.datePreset,
    filters.customStartDate,
    filters.customEndDate,
    filters.selectedStatus,
    filters.selectedGateway,
    filters.selectedPlanTier,
    filters.searchQuery,
  ]);

  const handleResetFilters = () => {
    resetFilters();
    toast.info('Payment report filters reset to All Time.');
  };

  const handleExportCSV = () => {
    const filename = `payment_report_${filters.datePreset.toLowerCase()}_${transactions.length}_records`;
    paymentDataService.exportTransactionsCSV(transactions, filename);
    toast.success(`Exported ${transactions.length} transactions ledger records to CSV.`);
  };

  const handleConfirmRefund = async (reason: string) => {
    if (!refundModal) return;
    const ok = paymentDataService.issueRefund(refundModal.txnId, reason);
    if (ok) {
      toast.success(
        `Refund of ₹${refundModal.amount.toLocaleString('en-IN')} approved for ${refundModal.memberName} (${refundModal.txnId}).`
      );
    } else {
      toast.error('Failed to process refund. Please try again.');
    }
    setRefundModal(null);
  };

  const columns = useMemo<Column<PaymentTransaction>[]>(() => [
    {
      key: 'txnId',
      header: 'Txn ID & Receipt',
      render: (t) => (
        <div>
          <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            {t.txnId}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            {t.receiptNo}
          </div>
        </div>
      ),
    },
    {
      key: 'member',
      header: 'Member Profile',
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openUserProfile(t.memberId || t.memberName)}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B91C1C] to-[#E11D48] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs hover:scale-105 transition cursor-pointer"
            title="Click to view complete user details"
          >
            {t.memberName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </button>
          <div>
            <button
              type="button"
              onClick={() => openUserProfile(t.memberId || t.memberName)}
              className="font-bold text-slate-900 hover:text-[#C81E28] hover:underline transition text-left cursor-pointer flex items-center gap-1"
            >
              <span>{t.memberName}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-600 font-bold">
                ID: {t.memberUniqueId || t.memberId}
              </span>
              <span>•</span>
              <span>{t.memberCity}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Matrimony Plan',
      render: (t) => (
        <div className="space-y-0.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
              t.planTier === 'PLATINUM'
                ? 'bg-purple-100 text-purple-700'
                : t.planTier === 'GOLD'
                ? 'bg-amber-100 text-amber-800'
                : t.planTier === 'TILL_MARRIAGE'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-sky-100 text-sky-800'
            }`}
          >
            <Crown className="w-3 h-3" />
            {t.planTier}
          </span>
          <div className="text-[11px] text-slate-700 font-medium truncate max-w-[140px]">
            {t.plan}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount & Gateway',
      render: (t) => (
        <div>
          <div className="font-extrabold text-slate-900 text-sm">
            ₹{t.amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-slate-400" />
            {t.gateway} ({t.paymentMode})
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'date',
      header: 'Timestamp',
      render: (t) => (
        <div className="text-slate-600 text-xs">
          <div>{t.date}</div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View User Details Button (Requested specifically by user) */}
          <button
            type="button"
            onClick={() => openUserProfile(t.memberId || t.memberName)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-950 rounded-lg transition active:scale-95 cursor-pointer shadow-2xs"
            title={`View complete profile details of ${t.memberName}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#C81E28]" />
            <span>User Details</span>
          </button>

          {/* Refund action button for SUCCESS transactions */}
          {t.status === 'SUCCESS' && (
            <button
              type="button"
              onClick={() => setRefundModal(t)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition active:scale-95 cursor-pointer"
              title="Initiate refund via gateway"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Refund</span>
            </button>
          )}

          {t.status === 'REFUNDED' && (
            <span
              className="text-[10px] font-medium text-slate-400 px-2 py-1 italic"
              title={t.refundReason || 'Refund processed'}
            >
              Refunded
            </span>
          )}
        </div>
      ),
    },
  ], [openUserProfile]);

  // Refund Desk list for secondary tab
  const refundTransactions = transactions.filter((t) => t.status === 'REFUNDED');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Report & Financial Ledger"
        description="Comprehensive audit of matrimony subscription collections, gateway reconciliations, and member refund desk"
        actions={
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              size="md"
              onClick={handleExportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export Report ({transactions.length})
            </CustomButton>
          </div>
        }
      />

      {/* Dynamic KPI Cards updated live by the selected time period & filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Gross Collections"
          value={`₹${kpis.grossCollections.toLocaleString('en-IN')}`}
          change={`${kpis.successfulTransactions} Paid`}
          isPositive={true}
          icon={IndianRupee}
        />
        <StatCard
          title="Net Realized Revenue"
          value={`₹${kpis.netRevenue.toLocaleString('en-IN')}`}
          change="After Gateway Refunds"
          isPositive={true}
          icon={IndianRupee}
        />
        <StatCard
          title="Refunds Processed"
          value={`₹${kpis.refundedAmount.toLocaleString('en-IN')}`}
          change={`${kpis.refundedCount} Refunded`}
          isPositive={false}
          icon={RotateCcw}
        />
        <StatCard
          title="Average Ticket Value"
          value={`₹${kpis.averageTransactionValue.toLocaleString('en-IN')}`}
          change={`${kpis.totalTransactions} Total Records`}
          isPositive={true}
          icon={Crown}
        />
      </div>

      {/* Filter Control Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top: Quick Date Range Preset Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C81E28]" />
              Period:
            </span>

            {[
              { key: 'ALL', label: 'All Time' },
              { key: 'TODAY', label: 'Today' },
              { key: '7_DAYS', label: 'Last 7 Days' },
              { key: '30_DAYS', label: 'This Month (30D)' },
              { key: '1_YEAR', label: 'This Year (2026)' },
              { key: 'CUSTOM', label: 'Custom Range' },
            ].map((preset) => {
              const isSelected = filters.datePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setFieldValue('datePreset', preset.key as DateRangePreset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C81E28] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Active Period Description Banner */}
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Active: <strong className="text-slate-900">{rangeDescription}</strong> ({transactions.length} txns)
            </div>
            {(filters.datePreset !== 'ALL' ||
              filters.selectedStatus !== 'ALL' ||
              filters.selectedGateway !== 'ALL' ||
              filters.selectedPlanTier !== 'ALL' ||
              filters.searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Reset all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Inputs (if 'CUSTOM' selected) */}
        {filters.datePreset === 'CUSTOM' && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <span className="font-bold text-amber-950">Select Custom Range:</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">From:</span>
              <CustomTextInput
                type="date"
                value={filters.customStartDate}
                onChange={(e) => setFieldValue('customStartDate', e.target.value)}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">To:</span>
              <CustomTextInput
                type="date"
                value={filters.customEndDate}
                onChange={(e) => setFieldValue('customEndDate', e.target.value)}
                size="sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!filters.customStartDate && !filters.customEndDate) {
                  toast.info('Please select start or end date');
                } else {
                  toast.success('Custom range applied successfully');
                }
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Apply Dates
            </button>
          </div>
        )}

        {/* Multi-Filter Dropdowns and Instant Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
          {/* Search Box */}
          <CustomTextInput
            value={filters.searchQuery}
            onChange={(e) => setFieldValue('searchQuery', e.target.value)}
            placeholder="Search Member, ID, Txn..."
            leftIcon={<Search className="w-3.5 h-3.5" />}
            clearable={true}
            onClear={() => setFieldValue('searchQuery', '')}
            size="sm"
          />

          {/* Status Filter */}
          <div>
            <CustomDropDown
              value={filters.selectedStatus}
              onChange={(val) => setFieldValue('selectedStatus', String(val))}
              options={[
                { value: 'ALL', label: 'All Statuses (Success, Refund, Failed)' },
                { value: 'SUCCESS', label: 'Success (Completed Payments)' },
                { value: 'REFUNDED', label: 'Refunded Transactions' },
                { value: 'FAILED', label: 'Failed / Abandoned' },
              ]}
              size="sm"
            />
          </div>

          {/* Gateway Filter */}
          <div>
            <CustomDropDown
              value={filters.selectedGateway}
              onChange={(val) => setFieldValue('selectedGateway', String(val))}
              options={[
                { value: 'ALL', label: 'All Payment Gateways' },
                { value: 'Razorpay', label: 'Razorpay Gateway' },
                { value: 'Cashfree', label: 'Cashfree Gateway' },
                { value: 'UPI / QR', label: 'UPI / QR Payment' },
                { value: 'Bank NEFT', label: 'Bank NEFT / Direct' },
              ]}
              size="sm"
            />
          </div>

          {/* Matrimony Plan Filter */}
          <div>
            <CustomDropDown
              value={filters.selectedPlanTier}
              onChange={(val) => setFieldValue('selectedPlanTier', String(val))}
              options={[
                { value: 'ALL', label: 'All Matrimony Plans' },
                { value: 'PLATINUM', label: 'Platinum VIP (₹5,999)' },
                { value: 'GOLD', label: 'Gold Plan (₹2,999)' },
                { value: 'SILVER', label: 'Silver Plan (₹999)' },
                { value: 'TILL_MARRIAGE', label: 'Till Marriage Lifetime (₹85,000)' },
              ]}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <TabsHeader
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'LEDGER', label: 'Payment Transactions Ledger', count: transactions.length },
          { key: 'REFUNDS', label: 'Refund Approval Desk', count: refundTransactions.length },
        ]}
      />

      {/* Main Ledger Table */}
      {activeTab === 'LEDGER' && (
        <DataTable
          columns={columns}
          data={transactions}
          totalRecords={transactions.length}
        />
      )}

      {/* Refund Desk Tab View */}
      {activeTab === 'REFUNDS' && (
        <DataTable
          columns={columns}
          data={refundTransactions}
          totalRecords={refundTransactions.length}
        />
      )}

      {/* Reason Modal for Processing Refund */}
      <ReasonModal
        isOpen={Boolean(refundModal)}
        title="Approve Refund & Call Razorpay API"
        description={`Refund of ₹${refundModal?.amount.toLocaleString('en-IN')} to ${refundModal?.memberName} (${refundModal?.txnId}). This will revoke their subscription plan access.`}
        confirmText="Approve Refund"
        isDestructive={true}
        onClose={() => setRefundModal(null)}
        onConfirm={handleConfirmRefund}
      />
    </div>
  );
};

export default FinanceScreen;
