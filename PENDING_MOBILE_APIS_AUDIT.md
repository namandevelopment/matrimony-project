# Pending Mobile APIs Audit & Cross-Platform Implementation Matrix

Comprehensive audit of the 12 pending mobile APIs (`sindhiMatrimonyMobile`), cross-referenced against **`sindhiMatrimonyBackhend`** and **`sindhiMatrimonyUserPanel`**.

---

## Executive Summary

| Category | Backend Implementation (`sindhiMatrimonyBackhend`) | User Panel Integration (`sindhiMatrimonyUserPanel`) | Mobile Status (`sindhiMatrimonyMobile`) |
|---|---|---|---|
| **Fully Built & Integrated** | 7 modules | 7 modules | 0 modules (All pending) |
| **Partially Built / Config Only** | 3 modules (`notifications`, `horoscope`, `matches`) | 2 modules (`matches`, `horoscope`) | 0 modules |
| **Missing / Not Implemented** | 2 modules (`verifications` KYC selfie/aadhaar/status, granular `notifications` sub-routes) | 3 modules (`search`, `notifications`, `kyc`) | 12 modules |

---

## Detailed 12-Module Audit

### 1. Search & Discovery Screen
* **Mobile Screen**: `src/screens/bottomTabScreens/searchScreen/index.tsx`
* **Mobile Status**: Hardcoded static profile array.
* **APIs**:
  - `POST /api/v1/matchmaking/search` (`ApiURL.searchMembers`)
  - `GET /api/v1/matchmaking/quick-search` (`ApiURL.quickSearch`)
* **Backend Status**: **BUILT**
  - Implemented in `controllers/matchmaking/matchmakingController.js` (`searchCandidates`, `quickSearch`).
  - Mounted in `routes/matchmaking/index.js` (`router.post("/search")`, `router.get("/quick-search")`).
* **User Panel Status**: **CONFIGURED BUT UNLINKED IN UI**
  - Declared in `src/redux/apiService/endpoint.ts` and TanStack Query keys.
  - `DashboardSearchView.tsx` currently calls `router.push("/matches")` without dispatching the network filter query.

---

### 2. Matches Screen
* **Mobile Screen**: `src/screens/bottomTabScreens/matchesScreen/index.tsx`
* **Mobile Status**: Loading from static `matchesData.json`.
* **APIs**:
  - `GET /api/v1/dashboard/all-matches` (`ApiURL.allMatchesFeed`)
  - `GET /api/v1/dashboard/new-matches` (`ApiURL.newMatchesFeed`)
  - `POST /api/v1/matchmaking/shortlist/:id` (`ApiURL.shortlistCandidate`)
  - `POST /api/v1/members/view-contact/:id` (`ApiURL.viewContact`) *(Note: Backend accepts POST for credit deduction)*
* **Backend Status**: **BUILT**
  - `all-matches` & `new-matches` mounted in `routes/dashboard/userDashboard.js`.
  - `shortlist/:candidateId` mounted in `routes/matchmaking/index.js`.
  - `view-contact/:candidateId` mounted in `routes/members/profile.js`.
* **User Panel Status**: **PARTIALLY INTEGRATED**
  - Shortlist toggle is fully integrated via `useShortlistMutation` in `MatchesScreen.tsx`.
  - Candidate feed loads from `/api/v1/dashboard/matches` instead of `all-matches`/`new-matches`.

---

### 3. Messages & Real-Time Chat
* **Mobile Screen**: `src/screens/bottomTabScreens/messagesScreen/index.tsx`
* **Mobile Status**: Hardcoded `conversations` mock list.
* **APIs**:
  - `GET /api/v1/chat/conversations` (`ApiURL.chatConversations`)
  - `GET /api/v1/chat/messages/:conversationId` (`ApiURL.chatMessages`)
  - `POST /api/v1/chat/messages/send` (`ApiURL.chatSendMessage`)
  - `PUT /api/v1/chat/messages/read` (`ApiURL.chatMarkAsRead`)
* **Backend Status**: **BUILT**
  - Mounted in `routes/chat/index.js` with Socket.io real-time broadcast and 5-message trial/membership quota enforcement.
* **User Panel Status**: **FULLY INTEGRATED**
  - Live in `DashboardMessagesView.tsx` with TanStack Query, message polling, optimistic bubble updates, and quota handling.

---

### 4. Membership Plans & Payment Gateway
* **Mobile Screen**: `src/screens/bottomTabScreens/upgradeScreen/index.tsx`
* **Mobile Status**: **FULLY INTEGRATED** (Dynamic backend plans retrieval, order creation & signature verification)
* **APIs**:
  - `GET /api/v1/plans` (`ApiURL.getPlans`)
  - `POST /api/v1/payments/create-order` (`ApiURL.createPaymentOrder`)
  - `POST /api/v1/payments/verify` (`ApiURL.verifyPaymentSignature`)
* **Backend Status**: **BUILT**
  - Catalog mounted in `routes/plans/index.js`.
  - Razorpay order creation, verification, and webhook handling mounted in `routes/finance/payments.js`.
* **User Panel Status**: **FULLY INTEGRATED**
  - Dynamically renders plans, calls `createPaymentOrder`, and completes checkout verification in `SubscriptionScreen.tsx`.

---

### 5. In-App Notifications
* **Mobile Screen**: `src/screens/notificationScreen/index.tsx`
* **Mobile Status**: Hardcoded `initialNotifications` mock array.
* **APIs**:
  - `GET /api/v1/notifications` (`ApiURL.getNotificationsList`)
  - `GET /api/v1/notifications/unread-count` (`ApiURL.unreadNotificationsCount`)
  - `PUT /api/v1/notifications/mark-read` (`ApiURL.markAllNotificationsAsRead`)
* **Backend Status**: **PARTIALLY BUILT**
  - Mounted in `routes/notifications/index.js`: `GET /`, `GET /unread-count`, and `PUT /mark-read`.
  - Subpaths `PUT /:id/read`, `PUT /mark-all-read`, and `DELETE /:id` are **NOT mounted** (backend uses `PUT /mark-read` with `{ notificationId: "ALL" | id }`).
* **User Panel Status**: **PENDING UI HOOK**
  - `NotificationsScreen.tsx` currently relies on local mock state.

---

### 6. Profile Management & Editing
* **Mobile Screens**: `src/screens/profileScreen/index.tsx`, `src/screens/editProfile/index.tsx`
* **Mobile Status**: **FULLY INTEGRATED** (Live backend profile syncing, dynamic profile score, backend edit persistence)
* **APIs**:
  - `GET /api/v1/profile/me` (`ApiURL.getProfileMe`)
  - `PUT /api/v1/profile/basic` (`ApiURL.updateProfileBasic`)
  - `PUT /api/v1/profile/education-career` (`ApiURL.updateProfileEducationCareer`)
  - `PUT /api/v1/profile/editProfile` (`ApiURL.updateUserProfile`)
* **Backend Status**: **BUILT**
  - All profile endpoints mounted in `routes/members/profile.js` with Joi validation middlewares.
* **User Panel Status**: **FULLY INTEGRATED**
  - `EditProfileScreen.tsx` loads profile data and commits updates through `updateProfileMutation` to `/api/v1/profile/editProfile`.

---

### 7. Family Details
* **Mobile Screen**: `src/screens/familyDetails/index.tsx`
* **Mobile Status**: UI form present, no network submit dispatch.
* **APIs**:
  - `PUT /api/v1/profile/family` (`ApiURL.updateProfileFamily`)
* **Backend Status**: **BUILT**
  - Mounted at `PUT /api/v1/profile/family` with `familySchema` validation in `routes/members/profile.js`.
* **User Panel Status**: **INTEGRATED**
  - Updated as part of the unified edit profile payload in `EditProfileScreen.tsx`.

---

### 8. Horoscope & Kundli Matching
* **Mobile Screens**: `src/screens/addHoroscope/index.tsx`, `src/screens/horoscopeView/index.tsx`
* **Mobile Status**: Local state only, no server submission.
* **APIs**:
  - `PUT /api/v1/profile/horoscope` (`ApiURL.updateProfileHoroscope`)
  - `POST /api/v1/horoscope/guna-milan` (`ApiURL.gunaMilan`)
  - `GET /api/v1/horoscope/chart/:candidateId` (`ApiURL.kundliChart`)
  - `POST /api/v1/dashboard/horoscope/save-rashi` (`ApiURL.saveRashi`)
* **Backend Status**: **BUILT**
  - Vedic 36-guna calculation (`/guna-milan`) and Kundli SVG chart generation (`/chart/:candidateId`) mounted in `routes/horoscope/index.js`.
  - Save Rashi mounted in `routes/dashboard/userDashboard.js` and `routes/horoscope/index.js`.
* **User Panel Status**: **PARTIALLY INTEGRATED**
  - Daily horoscope and `saveRashi` are live in `DashboardHoroscopeSection.tsx`.
  - Guna-Milan and Kundli chart are defined in `endpoint.ts` but pending UI view integration.

---

### 9. Manage Photos
* **Mobile Screen**: `src/screens/managePhotos/index.tsx`
* **Mobile Status**: Empty placeholder stub.
* **APIs**:
  - `POST /api/v1/profile/photos` (`ApiURL.uploadProfilePhoto`)
  - `DELETE /api/v1/profile/photos/:photoId` (`ApiURL.deleteProfilePhoto`)
* **Backend Status**: **BUILT**
  - S3/Multer upload and photo deletion mounted in `routes/members/profile.js`.
* **User Panel Status**: **FULLY INTEGRATED**
  - Live photo upload, primary photo assignment, and photo deletion in `EditProfileScreen.tsx`.

---

### 10. KYC & Trust Verifications
* **Mobile Screen**: `src/screens/verifyYourProfile/index.tsx`
* **Mobile Status**: Static modal view with phone dialer only.
* **APIs**:
  - `POST /api/v1/verifications/id-proof` (`ApiURL.uploadIdProof`)
  - `POST /api/v1/verifications/selfie` (`ApiURL.kycSelfieVerify`)
  - `POST /api/v1/verifications/aadhaar` (`ApiURL.kycAadhaarVerify`)
  - `GET /api/v1/verifications/status` (`ApiURL.kycStatus`)
* **Backend Status**: **PARTIALLY BUILT**
  - Only `POST /api/v1/verifications/id-proof` is registered in `routes/verifications/index.js`.
  - `selfie`, `aadhaar`, and `status` endpoints are documented in API specifications but **have not yet been implemented** in backend routes/controllers.
* **User Panel Status**: **PENDING UI HOOK**
  - Endpoints declared in `endpoint.ts` but not connected to user-facing verification forms.

---

### 11. Customer Support & Live Helpdesk
* **Mobile Screens**: `src/screens/helpCenter/index.tsx`, `src/screens/supportChatScreen/index.tsx`
* **Mobile Status**: Static client dialer and mock bot dictionary.
* **APIs**:
  - `GET /api/v1/support` / `/api/v1/support/help-desk` (`ApiURL.supportConfig` / `helpSupport`)
  - `POST /api/v1/support/ticket` (`ApiURL.submitSupportTicket`)
* **Backend Status**: **BUILT**
  - Help desk channels, grievance officer data, FAQ queries, and ticket creation (`POST /ticket`) mounted in `routes/support/index.js`.
* **User Panel Status**: **FULLY INTEGRATED**
  - Help center channels and FAQs render dynamically in `HelpSupportScreen.tsx`; ticket dispatch is handled by `HelpTicketForm.tsx`.

---

### 12. Dynamic Policies & CMS Content
* **Mobile Screens**: `src/screens/privacyPolicy/index.tsx`, `src/screens/termsAndConditions/index.tsx`
* **Mobile Status**: Hardcoded static text.
* **APIs**:
  - `GET /api/v1/content?type=privacy-policy`
  - `GET /api/v1/content?type=terms-and-conditions`
* **Backend Status**: **BUILT**
  - Unified dynamic CMS gateway mounted at `/api/v1/content` (and root aliases) in `routes/common/content.js`.
* **User Panel Status**: **FULLY INTEGRATED**
  - Dynamically fetched and rendered in `PrivacyPolicy.tsx` and `TermsAndCondition.tsx`.

