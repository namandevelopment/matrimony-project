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
// Current base timestamp: 11 Oct 2026 ~ 1791676800000
const NOW_TS = new Date(2026, 9, 11, 16, 30).getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  // --- Radhika Chopra (101037) ---
  {
    id: 'pay_100',
    txnId: 'TXN-90810',
    memberId: '101037',
    memberUniqueId: 'S1133',
    memberName: 'RADHIKA CHOPRA',
    memberMobile: '8076768013',
    memberCity: 'DELHI',
    plan: 'Silver Membership (90 Days)',
    planTier: 'SILVER',
    amount: 999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '10 Oct 2026, 04:15 PM',
    timestamp: NOW_TS - 24 * 60 * 60 * 1000,
    receiptNo: 'REC-2026-8810',
  },
  // --- TODAY: 11 Oct 2026 ---
  {
    id: 'pay_101',
    txnId: 'TXN-90812',
    memberId: '101408',
    memberUniqueId: 'E10265P1598',
    memberName: 'MANISH KUMAR',
    memberMobile: '9818022636',
    memberCity: 'DELHI',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: 'Today, 10:45 AM',
    timestamp: NOW_TS - 5 * 60 * 60 * 1000,
    receiptNo: 'REC-2026-8812',
  },
  {
    id: 'pay_102',
    txnId: 'TXN-90813',
    memberId: '101385',
    memberUniqueId: 'A8051P1596',
    memberName: 'RASHMI TEKCHANDANI',
    memberMobile: '7043003073',
    memberCity: 'Ahmadabad City',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: 'Today, 09:12 AM',
    timestamp: NOW_TS - 7 * 60 * 60 * 1000,
    receiptNo: 'REC-2026-8813',
  },
  {
    id: 'pay_103',
    txnId: 'TXN-90814',
    memberId: 'SIND001',
    memberUniqueId: 'SIND001',
    memberName: 'Roshni Motwani',
    memberMobile: '+91 98200 44551',
    memberCity: 'Mumbai',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 4500,
    gateway: 'Cashfree',
    paymentMode: 'NetBanking',
    status: 'SUCCESS',
    date: 'Today, 08:30 AM',
    timestamp: NOW_TS - 8 * 60 * 60 * 1000,
    receiptNo: 'REC-2026-8814',
  },
  {
    id: 'pay_104',
    txnId: 'TXN-90815',
    memberId: '101290',
    memberUniqueId: 'A7965P1582',
    memberName: 'KAVITA M',
    memberMobile: '9822019944',
    memberCity: 'Pune',
    plan: 'Silver Plan (30 Days)',
    planTier: 'SILVER',
    amount: 999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'FAILED',
    date: 'Today, 07:15 AM',
    timestamp: NOW_TS - 9 * 60 * 60 * 1000,
    receiptNo: 'REC-2026-8815',
  },

  // --- YESTERDAY: 10 Oct 2026 ---
  {
    id: 'pay_105',
    txnId: 'TXN-90805',
    memberId: '101372',
    memberUniqueId: 'A8041P1599',
    memberName: 'JITENDRA SINGH SOLANKI',
    memberMobile: '8432817571',
    memberCity: 'Tonk',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: 'Yesterday, 04:20 PM',
    timestamp: NOW_TS - 1 * DAY_MS,
    receiptNo: 'REC-2026-8805',
  },
  {
    id: 'pay_106',
    txnId: 'TXN-90806',
    memberId: 'SIND002',
    memberUniqueId: 'SIND002',
    memberName: 'Kunal Advani',
    memberMobile: '+91 98200 44552',
    memberCity: 'Mumbai',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: 'Yesterday, 02:15 PM',
    timestamp: NOW_TS - (1 * DAY_MS + 2 * 60 * 60 * 1000),
    receiptNo: 'REC-2026-8806',
  },
  {
    id: 'pay_107',
    txnId: 'TXN-90807',
    memberId: '101355',
    memberUniqueId: 'A8026A',
    memberName: 'CHETAN SANGTANI',
    memberMobile: '7828018785',
    memberCity: 'Ujjain',
    plan: 'Silver Plan (30 Days)',
    planTier: 'SILVER',
    amount: 999,
    gateway: 'UPI / QR',
    paymentMode: 'UPI',
    status: 'REFUNDED',
    date: 'Yesterday, 11:10 AM',
    timestamp: NOW_TS - (1 * DAY_MS + 5 * 60 * 60 * 1000),
    receiptNo: 'REC-2026-8807',
    refundReason: 'Accidental duplicate QR payment by client. Refunded back to UPI VPA.',
    refundProcessedAt: '10 Oct 2026, 04:30 PM',
  },

  // --- PAST 7 DAYS (05 - 09 Oct 2026) ---
  {
    id: 'pay_108',
    txnId: 'TXN-90791',
    memberId: '101356',
    memberUniqueId: 'A8028P1593',
    memberName: 'SHUBHAM KUMAWAT',
    memberMobile: '8770046370',
    memberCity: 'Indore',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: '09 Oct 2026, 05:40 PM',
    timestamp: NOW_TS - 2 * DAY_MS,
    receiptNo: 'REC-2026-8791',
  },
  {
    id: 'pay_109',
    txnId: 'TXN-90788',
    memberId: '101350',
    memberUniqueId: 'A8023BP1594',
    memberName: 'MANSHA MORDHANI',
    memberMobile: '7891463816',
    memberCity: 'Ajmer',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '08 Oct 2026, 03:25 PM',
    timestamp: NOW_TS - 3 * DAY_MS,
    receiptNo: 'REC-2026-8788',
  },
  {
    id: 'pay_110',
    txnId: 'TXN-90782',
    memberId: 'SIND004',
    memberUniqueId: 'SIND004',
    memberName: 'Deepak Vazirani',
    memberMobile: '+91 98200 44554',
    memberCity: 'Dubai / Mumbai',
    plan: 'Till Marriage Premium (Lifetime)',
    planTier: 'TILL_MARRIAGE',
    amount: 85000,
    gateway: 'Bank NEFT',
    paymentMode: 'NetBanking',
    status: 'SUCCESS',
    date: '07 Oct 2026, 01:10 PM',
    timestamp: NOW_TS - 4 * DAY_MS,
    receiptNo: 'REC-2026-8782',
  },
  {
    id: 'pay_111',
    txnId: 'TXN-90775',
    memberId: '101347',
    memberUniqueId: 'A8021P1597',
    memberName: 'ANKUSH',
    memberMobile: '7067494479',
    memberCity: 'Raipur',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Cashfree',
    paymentMode: 'Debit Card',
    status: 'SUCCESS',
    date: '06 Oct 2026, 04:50 PM',
    timestamp: NOW_TS - 5 * DAY_MS,
    receiptNo: 'REC-2026-8775',
  },
  {
    id: 'pay_112',
    txnId: 'TXN-90770',
    memberId: '101341',
    memberUniqueId: 'A8015P1592',
    memberName: 'MOHAMMAD SAIFULLAH',
    memberMobile: '8718807000',
    memberCity: 'Raipur',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '05 Oct 2026, 11:30 AM',
    timestamp: NOW_TS - 6 * DAY_MS,
    receiptNo: 'REC-2026-8770',
  },
  {
    id: 'pay_113',
    txnId: 'TXN-90765',
    memberId: 'SIND003',
    memberUniqueId: 'SIND003',
    memberName: 'Simran Chandnani',
    memberMobile: '+91 98200 44553',
    memberCity: 'Pune',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: '04 Oct 2026, 06:15 PM',
    timestamp: NOW_TS - 7 * DAY_MS,
    receiptNo: 'REC-2026-8765',
  },

  // --- THIS MONTH (Sep 12 - Oct 03 2026) ---
  {
    id: 'pay_114',
    txnId: 'TXN-90750',
    memberId: '101315',
    memberUniqueId: 'A7989P1588',
    memberName: 'KHUSHBOO SHARMA',
    memberMobile: '8560840868',
    memberCity: 'Jaipur',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '02 Oct 2026, 03:00 PM',
    timestamp: NOW_TS - 9 * DAY_MS,
    receiptNo: 'REC-2026-8750',
  },
  {
    id: 'pay_115',
    txnId: 'TXN-90742',
    memberId: '101311',
    memberUniqueId: 'A7990P1589',
    memberName: 'MANNY KAMRA',
    memberMobile: '7230839244',
    memberCity: 'SRI GANGANAGAR',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Razorpay',
    paymentMode: 'NetBanking',
    status: 'SUCCESS',
    date: '28 Sep 2026, 12:45 PM',
    timestamp: NOW_TS - 13 * DAY_MS,
    receiptNo: 'REC-2026-8742',
  },
  {
    id: 'pay_116',
    txnId: 'TXN-90730',
    memberId: 'SIND005',
    memberUniqueId: 'SIND005',
    memberName: 'Varun Hingorani',
    memberMobile: '+91 98200 44555',
    memberCity: 'Ahmedabad',
    plan: 'Platinum VIP (180 Days)',
    planTier: 'PLATINUM',
    amount: 5999,
    gateway: 'Cashfree',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: '22 Sep 2026, 02:20 PM',
    timestamp: NOW_TS - 19 * DAY_MS,
    receiptNo: 'REC-2026-8730',
  },
  {
    id: 'pay_117',
    txnId: 'TXN-90725',
    memberId: '101300',
    memberUniqueId: 'E10251P1587',
    memberName: 'ABHISHEK JAIMAN',
    memberMobile: '9414002211',
    memberCity: 'Kota',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '18 Sep 2026, 04:10 PM',
    timestamp: NOW_TS - 23 * DAY_MS,
    receiptNo: 'REC-2026-8725',
  },
  {
    id: 'pay_118',
    txnId: 'TXN-90715',
    memberId: '101210',
    memberUniqueId: 'A7890P1550',
    memberName: 'POOJA ROCHLANI',
    memberMobile: '9821034455',
    memberCity: 'Mumbai',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: '14 Sep 2026, 11:05 AM',
    timestamp: NOW_TS - 27 * DAY_MS,
    receiptNo: 'REC-2026-8715',
  },

  // --- EARLIER THIS YEAR (2026) ---
  {
    id: 'pay_119',
    txnId: 'TXN-90601',
    memberId: '101250',
    memberUniqueId: 'E10220P1560',
    memberName: 'SANJAY LALWANI',
    memberMobile: '9819922331',
    memberCity: 'Ulhasnagar',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'Credit Card',
    status: 'SUCCESS',
    date: '12 Aug 2026, 01:30 PM',
    timestamp: NOW_TS - 60 * DAY_MS,
    receiptNo: 'REC-2026-8601',
  },
  {
    id: 'pay_120',
    txnId: 'TXN-90480',
    memberId: '101180',
    memberUniqueId: 'E10150P1520',
    memberName: 'VIKRAM KHATRI',
    memberMobile: '9820098877',
    memberCity: 'Indore',
    plan: 'Till Marriage Premium (Lifetime)',
    planTier: 'TILL_MARRIAGE',
    amount: 85000,
    gateway: 'Bank NEFT',
    paymentMode: 'NetBanking',
    status: 'SUCCESS',
    date: '20 May 2026, 03:45 PM',
    timestamp: NOW_TS - 144 * DAY_MS,
    receiptNo: 'REC-2026-8480',
  },
  {
    id: 'pay_121',
    txnId: 'TXN-90390',
    memberId: '101120',
    memberUniqueId: 'A7800P1510',
    memberName: 'AARTI MOTWANI',
    memberMobile: '9820033221',
    memberCity: 'Nagpur',
    plan: 'Silver Plan (30 Days)',
    planTier: 'SILVER',
    amount: 999,
    gateway: 'UPI / QR',
    paymentMode: 'UPI',
    status: 'REFUNDED',
    date: '14 Mar 2026, 02:15 PM',
    timestamp: NOW_TS - 211 * DAY_MS,
    receiptNo: 'REC-2026-8390',
    refundReason: 'Customer requested cancellation within 2 hours of payment.',
    refundProcessedAt: '14 Mar 2026, 06:00 PM',
  },
  {
    id: 'pay_122',
    txnId: 'TXN-90210',
    memberId: '101050',
    memberUniqueId: 'E10050P1480',
    memberName: 'SUNIL AHUJA',
    memberMobile: '9820011234',
    memberCity: 'Delhi',
    plan: 'Gold Plan (90 Days)',
    planTier: 'GOLD',
    amount: 2999,
    gateway: 'Razorpay',
    paymentMode: 'Debit Card',
    status: 'SUCCESS',
    date: '10 Jan 2026, 11:20 AM',
    timestamp: NOW_TS - 274 * DAY_MS,
    receiptNo: 'REC-2026-8210',
  },
];

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
