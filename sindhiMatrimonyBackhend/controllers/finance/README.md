# 💳 Controllers: Finance & Payments (`controllers/finance/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Razorpay payment processing, invoice generation, subscription ledger, aur refund management.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Ledger view, offline payment entry, refund approvals, financial reports.
- `users.js`: Razorpay Order ID generate karna, payment verification, user invoice history.

## ⚙️ Key Actions & Flows
1. **Order Creation (`users.js`)**:
   - Plan select karne par Razorpay Order create hota hai.
2. **Payment Verification**:
   - Razorpay signature verify hoti hai.
   - Transaction success hone par `UserSubscription` active hota hai aur invoice PDF generate hoti hai.
3. **Refund Requests (`admin.js`)**:
   - Accounts manager refund approve karta hai -> Razorpay Refund API call hoti hai.
