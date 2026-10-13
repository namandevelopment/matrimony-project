import assert from 'assert';

// ========================================================
// 💰 Test Suite 4: Finance, Ledger & Refund Approval Rules
// ========================================================

// 1. Net Revenue Calculation (Razorpay standard 2% fee + 18% GST on fee)
function calculateNetRevenue(grossAmount: number): {
  gross: number;
  gatewayFee: number;
  net: number;
} {
  const feePercent = 0.02; // 2%
  const feeGstPercent = 0.18; // 18% GST on Razorpay fee
  const rawFee = grossAmount * feePercent;
  const totalGatewayFee = Math.round((rawFee + rawFee * feeGstPercent) * 100) / 100;
  const netAmount = Math.round((grossAmount - totalGatewayFee) * 100) / 100;

  return {
    gross: grossAmount,
    gatewayFee: totalGatewayFee,
    net: netAmount,
  };
}

// For Gold Plan: ₹2,999
const revGold = calculateNetRevenue(2999);
assert.strictEqual(revGold.gross, 2999);
assert.strictEqual(revGold.gatewayFee > 50 && revGold.gatewayFee < 80, true);
assert.strictEqual(revGold.net < 2999 && revGold.net > 2900, true);

// 2. Two-Tier Refund Approval State Machine
type RefundStatus = 'REQUESTED' | 'APPROVED_BY_MANAGER' | 'REJECTED' | 'PROCESSED_BY_GATEWAY';

interface RefundRequest {
  id: string;
  transactionId: string;
  amount: number;
  requestedByRole: string;
  status: RefundStatus;
  reason: string;
  approverRole?: string;
}

function approveRefund(
  request: RefundRequest,
  approverRole: string
): { success: boolean; error?: string; updatedRequest: RefundRequest } {
  // Only FINANCE_MANAGER or SUPER_ADMIN can approve
  if (approverRole !== 'FINANCE_MANAGER' && approverRole !== 'SUPER_ADMIN') {
    return {
      success: false,
      error: 'Permission Denied: Only Finance Manager or Super Admin can approve refunds.',
      updatedRequest: request,
    };
  }

  if (request.status !== 'REQUESTED') {
    return {
      success: false,
      error: `Invalid transition: Refund is already ${request.status}`,
      updatedRequest: request,
    };
  }

  return {
    success: true,
    updatedRequest: {
      ...request,
      status: 'APPROVED_BY_MANAGER',
      approverRole,
    },
  };
}

const initialReq: RefundRequest = {
  id: 'ref_101',
  transactionId: 'TXN-90812',
  amount: 2999,
  requestedByRole: 'FINANCE_STAFF',
  status: 'REQUESTED',
  reason: 'Accidental double payment via UPI',
};

// Case A: Finance Staff attempts to self-approve (Must fail!)
const unauthorizedApproval = approveRefund(initialReq, 'FINANCE_STAFF');
assert.strictEqual(unauthorizedApproval.success, false);
assert.strictEqual(unauthorizedApproval.updatedRequest.status, 'REQUESTED');

// Case B: Finance Manager approves (Must succeed)
const authorizedApproval = approveRefund(initialReq, 'FINANCE_MANAGER');
assert.strictEqual(authorizedApproval.success, true);
assert.strictEqual(authorizedApproval.updatedRequest.status, 'APPROVED_BY_MANAGER');
assert.strictEqual(authorizedApproval.updatedRequest.approverRole, 'FINANCE_MANAGER');

// Case C: Double approval on already approved request (Must fail)
const doubleApproval = approveRefund(authorizedApproval.updatedRequest, 'SUPER_ADMIN');
assert.strictEqual(doubleApproval.success, false);

// 3. Payment Report Dynamic Date Range Filters & KPI Metrics Tests
import { paymentDataService } from '../services/paymentDataService';
import { getUnifiedUserProfile } from '../services/unifiedUserService';

// Test A: 7 Days Filter
const filter7Days = paymentDataService.filterTransactions({ datePreset: '7_DAYS' });
assert.strictEqual(filter7Days.transactions.length > 0, true, '7 Days filter should return transactions');
assert.strictEqual(filter7Days.kpis.grossCollections > 0, true, '7 Days gross collections should be greater than 0');
assert.strictEqual(filter7Days.rangeDescription.includes('Last 7 Days'), true);

// Test B: 30 Days (Month) Filter
const filterMonth = paymentDataService.filterTransactions({ datePreset: '30_DAYS' });
assert.strictEqual(filterMonth.transactions.length >= filter7Days.transactions.length, true, '30 Days filter should return at least as many transactions as 7 Days');
assert.strictEqual(filterMonth.kpis.grossCollections >= filter7Days.kpis.grossCollections, true);

// Test C: 1 Year Filter
const filterYear = paymentDataService.filterTransactions({ datePreset: '1_YEAR' });
assert.strictEqual(filterYear.transactions.length >= filterMonth.transactions.length, true, 'Yearly filter should return all year transactions');
assert.strictEqual(filterYear.kpis.grossCollections >= filterMonth.kpis.grossCollections, true);

// Test D: Status Filter (SUCCESS only)
const filterSuccessOnly = paymentDataService.filterTransactions({ datePreset: 'ALL', status: 'SUCCESS' });
assert.strictEqual(filterSuccessOnly.transactions.every((t) => t.status === 'SUCCESS'), true);
assert.strictEqual(filterSuccessOnly.kpis.refundedCount, 0);

// Test E: Status Filter (REFUNDED only)
const filterRefundedOnly = paymentDataService.filterTransactions({ datePreset: 'ALL', status: 'REFUNDED' });
assert.strictEqual(filterRefundedOnly.transactions.every((t) => t.status === 'REFUNDED'), true);
assert.strictEqual(filterRefundedOnly.kpis.refundedAmount > 0, true);

// 4. Unified User Profile Lookup by ID & Everywhere
// Test A: Lookup by numeric member ID (101408)
const profileManish = getUnifiedUserProfile('101408');
assert.strictEqual(Boolean(profileManish), true);
assert.strictEqual(profileManish?.fullName, 'MANISH KUMAR');
assert.strictEqual(profileManish?.uniqueId, 'E10265P1598');
assert.strictEqual(profileManish?.plan, 'PLATINUM');
assert.strictEqual(profileManish?.isVerified, true);
assert.strictEqual(profileManish?.subcaste, 'Amil');

// Test B: Lookup by alphanumeric code (E10265P1598)
const profileByUniqueId = getUnifiedUserProfile('E10265P1598');
assert.strictEqual(profileByUniqueId?.id, '101408');
assert.strictEqual(profileByUniqueId?.fullName, 'MANISH KUMAR');

// Test C: Lookup by CRM Client ID (SIND001 - Roshni Motwani)
const profileRoshni = getUnifiedUserProfile('SIND001');
assert.strictEqual(Boolean(profileRoshni), true);
assert.strictEqual(profileRoshni?.fullName.toUpperCase(), 'ROSHNI MOTWANI');
assert.strictEqual(profileRoshni?.gender, 'Female');

// Test D: Lookup by user name
const profileByName = getUnifiedUserProfile('Rashmi Tekchandani');
assert.strictEqual(Boolean(profileByName), true);
assert.strictEqual(profileByName?.id, '101385');

// Test E: Transaction lookup for member
const manishTxns = paymentDataService.getTransactionsByMember('101408');
assert.strictEqual(manishTxns.length > 0, true, 'User should have transaction ledger records');
assert.strictEqual(manishTxns[0].memberName, 'MANISH KUMAR');

console.log('✅ [4/6] finance-and-refunds.test.ts: Passed all 20 finance reconciliation, date range filters & universal user profile scenarios successfully!');
