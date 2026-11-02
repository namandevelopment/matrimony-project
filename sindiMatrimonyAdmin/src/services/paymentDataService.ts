import { storage } from '../storage';

export type DateRangePreset = 'ALL' | 'TODAY' | '7_DAYS' | '30_DAYS' | '1_YEAR' | 'CUSTOM';
export type PaymentStatus = 'SUCCESS' | 'REFUNDED' | 'FAILED' | 'PENDING';
export type PaymentGateway = 'Razorpay' | 'Cashfree' | 'UPI / QR' | 'Bank NEFT';
export type PlanTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'TILL_MARRIAGE' | 'FREE';

export interface PaymentTransaction {
  id: string;
  txnId: string;
  memberId: string; // Numeric ID (e.g. "101408") or Client ID ("SIND001")
  memberUniqueId: string; // e.g. "E10265P1598"
  memberName: string;
  memberMobile: string;
  memberCity: string;
  plan: string;
  planTier: PlanTier;
  amount: number;
  gateway: PaymentGateway;
  paymentMode: 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Offline';
  status: PaymentStatus;
  date: string; // Human readable formatted date
  timestamp: number; // Milliseconds for date range filtering
  receiptNo: string;
  refundReason?: string;
  refundProcessedAt?: string;
}

export interface PaymentFilterOptions {
  datePreset: DateRangePreset;
  customStartDate?: string; // YYYY-MM-DD
  customEndDate?: string; // YYYY-MM-DD
  status?: string; // 'ALL' | PaymentStatus
  gateway?: string; // 'ALL' | PaymentGateway
  planTier?: string; // 'ALL' | PlanTier
  search?: string;
}

export interface PaymentKPIs {
  grossCollections: number;
  netRevenue: number;
  refundedAmount: number;
  refundedCount: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalTransactions: number;
  averageTransactionValue: number;
}

const STORAGE_KEY = 'sindhi_admin_payment_transactions_v2';

// Realistic timestamps relative to 11 Oct 2026
const DAY_MS = 24 * 60 * 60 * 1000;

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [];

class PaymentDataService {
  private transactions: PaymentTransaction[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    const raw = storage.getString(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = INITIAL_PAYMENT_TRANSACTIONS.filter((t) => !existingIds.has(t.id));
          this.transactions = [...missing, ...parsed];
          return;
        }
      } catch {
        this.transactions = [...INITIAL_PAYMENT_TRANSACTIONS];
      }
    } else {
      this.transactions = [...INITIAL_PAYMENT_TRANSACTIONS];
      this.persist();
    }
  }

  private persist() {
    storage.set(STORAGE_KEY, JSON.stringify(this.transactions));
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error in payment subscriber:', err);
      }
    });
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getTransactions(): PaymentTransaction[] {
    return [...this.transactions];
  }

  public getTransactionById(txnId: string): PaymentTransaction | undefined {
    return this.transactions.find((t) => t.txnId === txnId || t.id === txnId);
  }

  public getTransactionsByMember(memberIdOrName: string): PaymentTransaction[] {
    const q = memberIdOrName.toLowerCase().trim();
    return this.transactions.filter(
      (t) =>
        t.memberId.toLowerCase() === q ||
        t.memberUniqueId.toLowerCase() === q ||
        t.memberName.toLowerCase().includes(q)
    );
  }

  public issueRefund(txnId: string, reason: string): boolean {
    const txn = this.transactions.find((t) => t.txnId === txnId || t.id === txnId);
    if (!txn) return false;

    txn.status = 'REFUNDED';
    txn.refundReason = reason;
    txn.refundProcessedAt = new Date().toLocaleString('en-IN');
    this.persist();
    return true;
  }

  public addTransaction(data: Omit<PaymentTransaction, 'id'>): PaymentTransaction {
    const newTxn: PaymentTransaction = {
      ...data,
      id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
    this.transactions.unshift(newTxn);
    this.persist();
    return newTxn;
  }

  /**
   * Filter transactions by date range presets, status, gateway, plan, search
   */
  public filterTransactions(options: PaymentFilterOptions): {
    transactions: PaymentTransaction[];
    kpis: PaymentKPIs;
    rangeDescription: string;
  } {
    const now = new Date(2026, 9, 11, 23, 59, 59, 999).getTime(); // Oct 11, 2026 end of day
    let startTimestamp = 0;
    let endTimestamp = now;
    let rangeDesc = 'All Time';

    // Calculate timestamp bounds based on preset
    switch (options.datePreset) {
      case 'TODAY': {
        const todayStart = new Date(2026, 9, 11, 0, 0, 0, 0).getTime();
        startTimestamp = todayStart;
        endTimestamp = now;
        rangeDesc = 'Today (11 Oct 2026)';
        break;
      }
      case '7_DAYS': {
        // Last 7 full days
        startTimestamp = now - 7 * DAY_MS;
        endTimestamp = now;
        rangeDesc = 'Last 7 Days (04 Oct - 11 Oct 2026)';
        break;
      }
      case '30_DAYS': {
        // Last 30 days
        startTimestamp = now - 30 * DAY_MS;
        endTimestamp = now;
        rangeDesc = 'This Month / Last 30 Days (11 Sep - 11 Oct 2026)';
        break;
      }
      case '1_YEAR': {
        // Year 2026
        startTimestamp = new Date(2026, 0, 1, 0, 0, 0, 0).getTime();
        endTimestamp = now;
        rangeDesc = 'This Year (2026)';
        break;
      }
      case 'CUSTOM': {
        if (options.customStartDate) {
          startTimestamp = new Date(`${options.customStartDate}T00:00:00`).getTime();
        }
        if (options.customEndDate) {
          endTimestamp = new Date(`${options.customEndDate}T23:59:59`).getTime();
        }
        rangeDesc = `Custom Range (${options.customStartDate || 'Start'} to ${options.customEndDate || 'Now'})`;
        break;
      }
      case 'ALL':
      default:
        startTimestamp = 0;
        endTimestamp = Number.MAX_SAFE_INTEGER;
        rangeDesc = 'All Time Records';
        break;
    }

    const filtered = this.transactions.filter((t) => {
      // Date range check
      if (t.timestamp < startTimestamp || t.timestamp > endTimestamp) {
        return false;
      }

      // Status filter
      if (options.status && options.status !== 'ALL' && t.status !== options.status) {
        return false;
      }

      // Gateway filter
      if (options.gateway && options.gateway !== 'ALL' && t.gateway !== options.gateway) {
        return false;
      }

      // Plan tier filter
      if (options.planTier && options.planTier !== 'ALL' && t.planTier !== options.planTier) {
        return false;
      }

      // Search term
      if (options.search && options.search.trim()) {
        const q = options.search.trim().toLowerCase();
        const match =
          t.txnId.toLowerCase().includes(q) ||
          t.memberId.toLowerCase().includes(q) ||
          t.memberUniqueId.toLowerCase().includes(q) ||
          t.memberName.toLowerCase().includes(q) ||
          t.memberMobile.includes(q) ||
          t.receiptNo.toLowerCase().includes(q) ||
          t.plan.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    // Compute dynamic KPIs
    let grossCollections = 0;
    let refundedAmount = 0;
    let refundedCount = 0;
    let successfulTransactions = 0;
    let failedTransactions = 0;

    filtered.forEach((t) => {
      if (t.status === 'SUCCESS') {
        grossCollections += t.amount;
        successfulTransactions++;
      } else if (t.status === 'REFUNDED') {
        refundedAmount += t.amount;
        refundedCount++;
      } else if (t.status === 'FAILED') {
        failedTransactions++;
      }
    });

    const netRevenue = grossCollections - refundedAmount;
    const averageTransactionValue =
      successfulTransactions > 0 ? Math.round(grossCollections / successfulTransactions) : 0;

    const kpis: PaymentKPIs = {
      grossCollections,
      netRevenue,
      refundedAmount,
      refundedCount,
      successfulTransactions,
      failedTransactions,
      totalTransactions: filtered.length,
      averageTransactionValue,
    };

    return {
      transactions: filtered,
      kpis,
      rangeDescription: rangeDesc,
    };
  }

  /**
   * Export transactions to CSV
   */
  public exportTransactionsCSV(txns: PaymentTransaction[], filename = 'payment_report_ledger'): void {
    if (typeof window === 'undefined') return;

    const headers = [
      'Transaction ID',
      'Receipt No',
      'Member ID',
      'Unique ID',
      'Member Name',
      'Mobile',
      'City',
      'Plan Tier',
      'Matrimony Plan',
      'Amount (INR)',
      'Payment Gateway',
      'Payment Mode',
      'Status',
      'Date & Time',
      'Refund Reason',
    ];

    const rows = txns.map((t) => [
      t.txnId,
      t.receiptNo,
      t.memberId,
      t.memberUniqueId,
      `"${t.memberName.replace(/"/g, '""')}"`,
      t.memberMobile,
      `"${t.memberCity}"`,
      t.planTier,
      `"${t.plan.replace(/"/g, '""')}"`,
      t.amount,
      t.gateway,
      t.paymentMode,
      t.status,
      `"${t.date}"`,
      `"${(t.refundReason || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const paymentDataService = new PaymentDataService();
