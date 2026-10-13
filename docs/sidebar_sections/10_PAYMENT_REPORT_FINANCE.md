# 💳 Section 10: Payment Report & Finance (`/finance`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Payment Report & Finance screen portal ka **audited revenue ledger, settlement desk, aur refund management engine** hai. Sindhi Matrimony platform par online payment gateways (Razorpay, Cashfree, UPI) aur offline modes (NEFT bank transfer, cash at office) dono ke through subscription fees collect hoti hain. Yeh screen har rupee ka double-entry audit trail maintain karti hai, GST billing receipts generate karti hai, aur disputed payments par refund process karti hai.

### Key Conceptual Pillars
1. **Immutable Transaction Ledger (अपरिवर्तनीय बहीखाता):** Har transaction ka unique Transaction ID (`TXN-2026-XXXX`) aur sequential Tax Receipt Number (`REC-2026-YYYY`) generate hota hai jise delete nahi kiya ja sakta; sirf reversing entry (Refund) pass ki ja sakti hai.
2. **Multi-Gateway Reconciliation:** Platform online gateways (Razorpay, Cashfree, Stripe, UPI Direct) aur offline bank transfers ko ek standard ledger schema me reconcile karta hai.
3. **Refund Governance:** Refund issue karne ke liye mandatory justification reason record karna padta hai jo direct audit log aur transaction status me stamp hota hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Finance Manager Navigates to /finance]
         │
         ▼
[Mount FinanceScreen & Subscribe to paymentDataService]
         │
         ├─► Calculate Range KPIs: Total Collections, Successful Txns, Failed, Refunds
         ├─► Render Date Filter Presets (Today, This Month, Quarter, Custom Dates)
         ├─► Render Advanced Filter Bar (Status, Gateway, Plan Tier, Search)
         └─► Render Ledger DataTable with Financial Badges
         │
[User Interactions]
  ├── Change Date Range Preset ─────► Recalculates metrics for selected window
  ├── Filter by Gateway / Plan ────► Isolates specific cashflows (e.g. UPI or Platinum Plans)
  ├── Search Bar Input ─────────────► Real-time search by Txn ID, Member Name, Receipt No
  ├── Click "Refund" Button ────────► Opens ReasonModal (Mandatory justification note)
  │                                   └─► Sets status='REFUNDED', adds audit log, updates KPIs
  ├── Click "Export CSV" ───────────► Downloads full filtered transaction spreadsheet
  └── Click "Reset Filters" ────────► Reverts all filters back to All Time overview
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Real-Time Revenue KPI Cards
1. **Total Collections:** Gross revenue collected in Indian Rupees (`₹`) within selected date window.
2. **Successful Transactions:** Count and percentage of completed, settled payments.
3. **Pending / Failed Attempts:** Transactions stuck in gateway webhook or abandoned by customer.
4. **Refunds Issued:** Total refunded amount and volume.

### B. Comprehensive Date Range Picker
- **Preset Buttons:** `Today`, `Yesterday`, `This Week`, `This Month`, `Last Month`, `This Quarter`, `This Year`, `All Time`.
- **Custom Date Range:** Native HTML5 date pickers for Start Date and End Date.
- Dynamic subtitle describing active filter range (e.g. *"Showing 42 transactions for Month of October 2026"*).

### C. Multi-Dimensional Filter Bar
- **Status Dropdown:** `ALL`, `SUCCESS`, `PENDING`, `FAILED`, `REFUNDED`.
- **Gateway Dropdown:** `Razorpay`, `Cashfree`, `Stripe`, `UPI Direct`, `Bank Transfer / NEFT`, `Offline Cash`.
- **Plan Tier Dropdown:** `Silver (₹999)`, `Gold (₹2,999)`, `Platinum (₹5,999)`, `Till Marriage (₹85,000)`.
- **Search Query:** Search by Transaction ID, Receipt Number, Member Name, Member Code, Gateway Ref ID.
- **Reset Filters CTA:** One-click clear button restoring default state.

### D. Transaction Ledger Table
- **Txn ID & Receipt:** Formatted transaction identifier with copyable receipt number.
- **Member Name & Profile ID:** Clickable link to preview member profile.
- **Plan Purchased:** Styled plan badge with duration indicator.
- **Gateway & Payment Mode:** Visual badge (e.g. *Razorpay / UPI* or *Bank Transfer*).
- **Amount & GST:** Base amount, GST breakdown (18%), and Net Paid.
- **Date & Time:** Timestamp with 12-hour format.
- **Transaction Status:** Colored badge (`SUCCESS` in Green, `REFUNDED` in Rose, `PENDING` in Amber).
- **Action Column:**
  - For `SUCCESS` items: "Issue Refund" button (`RotateCcw` icon).
  - For `REFUNDED` items: "Refunded" disabled badge with reason tooltip.

### E. Refund Modal Flow (`ReasonModal`)
- Prompts admin to input mandatory reason (e.g. *"Duplicate payment processed"*, *"Customer requested cancellation within 48-hour policy"*).
- Upon confirmation:
  - Calls `paymentDataService.issueRefund(txnId, reason)`.
  - Emits real-time reactive event updating KPIs and ledger row.
  - Displays green toast notification confirming refund issuance.

### F. CSV Ledger Exporter (`handleExportCSV`)
- Generates compliant spreadsheet containing: `TxnId`, `ReceiptNo`, `Date`, `MemberId`, `MemberName`, `Plan`, `Amount`, `GST`, `Gateway`, `Mode`, `Status`, `RefundReason`.
- Filename includes date preset and record count for automated bookkeeping.

---

## 4. 📊 Financial Calculation Models

$$\text{Net Revenue} = \sum \text{Amount}_{\text{SUCCESS}} - \sum \text{Amount}_{\text{REFUNDED}}$$
$$\text{GST Collected (18\%)} = \frac{\text{Gross Revenue} \times 18}{118}$$

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `FINANCE_STAFF`.
- **Restricted from:** `CRM_AGENT`, `MODERATOR`, `EMPLOYEE` (Blocked at route & sidebar clearance level).
- **Refund Authority:** Only `SUPER_ADMIN` and `FINANCE_MANAGER` can approve and execute refunds.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Double Refund Guard:** Button is disabled for already-refunded transactions.
2. **Invalid Date Span:** Start Date cannot be later than End Date (validation error shown).
3. **Empty Ledger:** Friendly state with "Reset Filters" CTA if no payments match query.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/financeScreen/FinanceScreen.tsx`
- **Data Service:** `src/services/paymentDataService.ts` (`filterTransactions`, `issueRefund`, `exportTransactionsCSV`)
- **Data Models:** `PaymentTransaction`, `DateRangePreset`, `PaymentGateway`, `PlanTier`
- **Modal:** `src/customModals/ReasonModal.tsx`
