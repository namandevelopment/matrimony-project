# Sindhi Matrimony - Complete Registration & Authentication Changes Explanation

इस दस्तावेज़ में रजिस्ट्रेशन, ऑथेंटिकेशन, सिक्योरिटी और रिकवरी सिस्टम में किए गए सभी बदलावों का पूरा विवरण दिया गया है।

---

## 1. मुख्य समस्याएँ (Original Flaws Discovered)

1. **डेटाबेस इंडेक्स समस्या:** `phone` फील्ड पर `unique: true` लगा हुआ था, जिससे सॉफ्ट-डिलीटेड (`isDeleted: true`) अकाउंट्स होने पर नए यूज़र्स रजिस्टर नहीं कर पा रहे थे।
2. **गलत डिफ़ॉल्ट स्टेटस:** `isPhoneVerified` पहले डिफ़ॉल्ट रूप से `true` था, यानी बिना OTP वेरिफाई किए ही फोन वेरिफाइड माना जा रहा था।
3. **स्टेप्स का डेटाबेस में सेव न होना:** स्टेप 4 (`RegistrationPersonalReligiousScreen.tsx`) और स्टेप 5 (`RegistrationLocationProfessionalScreen.tsx`) सिर्फ ब्राउज़र के `sessionStorage` में डेटा सेव कर रहे थे, बैकएंड API को कॉल ही नहीं कर रहे थे। इसलिए ब्राउज़र बंद होने पर डेटा गायब हो जाता था।
4. **हार्डकोडेड डेमो और बाईपास:** OTP स्क्रीन पर `"1234"` का डेमो बाईपास और टेस्ट बटन था। साथ ही कोड में `"9829012345"`, `"Sindhi Member"`, `"Password123@"` जैसे मॉक डेटा का उपयोग हो रहा था।
5. **असुरक्षित OTP स्टोरेज:** Redis में OTP प्लेन-टेक्स्ट में स्टोर होता था, बिना किसी HMAC हैशिंग, अटेम्प्ट लिमिट या कूलडाउन के।
6. **मॉक यूज़र फॉलबैक:** बैकएंड में MongoDB डिस्कनेक्ट होने पर इन-मेमरी डमी यूज़र रिटर्न किया जा रहा था।

---

## 2. बैकएंड में किए गए बदलाव (Backend Changes)

### A. Phone Normalization & Variables
- **[`utils/phoneNormalizer.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/utils/phoneNormalizer.js):** 
  - सभी नंबरों को E.164 फॉर्मेट (जैसे `+919829012345`) में नॉर्मलाइज़ किया।
  - स्पेस, हाइफ़न, और लीडिंग `0` को हटाकर एक समान पहचान बनाई।
- **[`utils/variables.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/utils/variables.js):** 
  - `REGISTRATION_STATUS` एनम जोड़ा (`DRAFT`, `OTP_PENDING`, `PHONE_VERIFIED`, `ONBOARDING_IN_PROGRESS`, `COMPLETE`, `SUSPENDED`, `DELETED`)।

### B. Mongoose User Model & Index
- **[`models/users/user.model.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/models/users/user.model.js):**
  - `phone` से यूनिवर्सल `unique: true` हटाया।
  - `isPhoneVerified` का डिफ़ॉल्ट `false` किया।
  - `registrationStatus` फील्ड जोड़ी।
  - पार्शियल यूनिक इंडेक्स लगाया: `{ phone: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } }` ताकि सिर्फ एक्टिव यूज़र्स में नंबर यूनिक रहे।

### C. Secure OTP Lifecycle (Two-Phase Commit)
- **[`services/otpService.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/services/otpService.js):**
  - क्रिप्टोग्राफिक रैंडम 4-अंकों का OTP (`crypto.randomInt(1000, 10000)`).
  - Keyed HMAC-SHA256 हैशिंग (Redis में कभी प्लेन OTP सेव नहीं होता).
  - टाइमिंग अटैक से बचाव के लिए `crypto.timingSafeEqual`.
  - मैक्सिमम 5 गलत अटेम्प्ट की लिमिट (5 के बाद चैलेंज रद्द).
  - 60 सेकंड का रीसेंड कूलडाउन और 5 OTP/घंटा की रेट लिमिट.
  - **Two-Phase Lock/Commit/Rollback:** OTP वेरिफाई होने पर पहले लॉक होता है, DB अपडेट सफल होने पर कमिट होता है। अगर DB अपडेट फेल हुआ, तो रोलबैक होता है ताकि यूज़र लॉक न हो जाए।

### D. Authoritative Onboarding State Machine
- **[`services/onboardingService.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/services/onboardingService.js):**
  - यूज़र की रजिस्ट्रेशन प्रोग्रेस पूरी तरह MongoDB के डेटा से कैलकुलेट होती है।
  - प्रीसीडिंग स्टेप वैलिडेशन: स्टेप 4 तभी सेव होगा जब स्टेप 3 पूरा हो; स्टेप 5 तभी सेव होगा जब स्टेप 4 पूरा हो।
  - 18 वर्ष से कम उम्र के यूज़र्स को रिजेक्ट करता है।
  - मास-असाइनमेंट से सुरक्षा: केवल व्हाइटलिस्टेड फील्ड्स ही अपडेट हो सकती हैं।
  - `completeRegistration`: अटॉमिक ट्रांजैक्शन से प्रोफाइल एक्टिवेट करता है और डिफ़ॉल्ट पार्टनर प्रेफरेंस बनाता है।

### E. Auth Controller & Routes
- **[`controllers/auth/users.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/controllers/auth/users.js):**
  - `sendOtp`: E.164 नॉर्मलाइजेशन और MongoDB ड्राफ्ट रियूज़।
  - `verifyLoginOtp`: HMAC वेरिफिकेशन और `ONBOARDING` स्कोप्ड टोकन जारी करना।
  - `registerStep`: टोकन ऑथेंटिकेशन और स्टेप-वाइज़ DB सेव।
  - `loginWithPassword`: मॉक यूज़र फॉलबैक हटाया। अगर पासवर्ड सेट नहीं है तो `REQUIRE_OTP_RESUME` रिटर्न करता है (Case B)।
  - `checkRegistrationStatus`: टोकन के आधार पर अथॉरिटेटिव स्टेटस रिटर्न करता है।
  - `completeRegistration`: फाइनल स्टेप पूरा होने पर `FULL_ACCESS` टोकन जारी करता है।
- **[`routes/auth/users.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/routes/auth/users.js):**
  - `/registration-status` (GET/POST) और `/complete-registration` (POST) रूट रजिस्टर किए गए।

### F. Migration & Automated Testing
- **[`script/migrations/auditAndMigratePhoneIndex.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/script/migrations/auditAndMigratePhoneIndex.js):**
  - बिना डेटा डिलीट किए डुप्लीकेट नंबर्स को ऑडिट करने और पार्शियल यूनिक इंडेक्स बनाने की स्क्रिप्ट।
- **[`test/unit/registrationRebuild.test.js`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/test/unit/registrationRebuild.test.js):**
  - नॉर्मलाइजेशन, HMAC हैश, स्टेट मशीन और टोकन स्कोप्स के ऑटोमेटेड टेस्ट।

---

## 3. फ्रंटएंड में किए गए बदलाव (Frontend Changes)

### A. API Endpoints
- **[`src/redux/apiService/endpoint.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/redux/apiService/endpoint.ts):**
  - `completeRegistration: "/api/v1/auth/users/complete-registration"` जोड़ा।

### B. Registration Screens (Wired to MongoDB)
1. **[`QuickRegisterForm.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/landingScreen/components/QuickRegisterForm.tsx) (Step 1):**
   - बैकएंड से मिला `challengeId` ड्राफ्ट और URL में पास किया ताकि OTP वेरिफिकेशन बाइंड रहे।
2. **[`RegistrationOtpScreen.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/registrationOtpScreen/RegistrationOtpScreen.tsx) (Step 2):**
   - `"1234"` फॉलबैक और "Demo Hint" बटन पूरी तरह हटाया। असली 4-डिजिट OTP और `challengeId` से वेरिफिकेशन।
3. **[`RegistrationBasicInfoScreen.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/registrationBasicInfoScreen/RegistrationBasicInfoScreen.tsx) (Step 3):**
   - साइलेंट एरर इग्नोर बंद किया। API एरर आने पर यूज़र उसी स्क्रीन पर एरर मैसेज के साथ रुकेगा।
4. **[`RegistrationPersonalReligiousScreen.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/registrationPersonalReligiousScreen/RegistrationPersonalReligiousScreen.tsx) (Step 4):**
   - `apiFetch(ApiURL.registerStep)` से कनेक्ट किया। हाइट, मैरिटल स्टेटस, सिंधी सब-कास्ट अब सीधे MongoDB में सेव होते हैं।
5. **[`RegistrationLocationProfessionalScreen.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/registrationLocationProfessionalScreen/RegistrationLocationProfessionalScreen.tsx) (Step 5):**
   - `apiFetch(ApiURL.registerStep)` से कनेक्ट किया। लोकेशन, एजुकेशन और प्रोफेशन डेटा MongoDB में सेव होता है।
6. **[`RegistrationAdditionalInfoScreen.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/screens/registrationAdditionalInfoScreen/RegistrationAdditionalInfoScreen.tsx) (Step 6):**
   - डमी फॉलबैक्स (`"9829012345"`, `"Sindhi Member"`) हटाए। `completeRegistration` API कॉल करके फुल-एक्सेस टोकन और डैशबोर्ड रीडायरेक्ट सुनिश्चित किया।

### C. Route Guard & Resumability
- **[`RegistrationRouteGuard.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/app/registration/components/RegistrationRouteGuard.tsx):**
  - अगर कोई यूज़र स्टेप स्किप करके सीधे `/registration/location-professional-info` पर जाए, तो रूट गार्ड बैकएंड से अथॉरिटेटिव स्टेटस मांगता है और यूज़र को उसके अधूरे स्टेप पर वापस भेज देता है।
- **[`layout.tsx`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyUserPanel/src/app/registration/layout.tsx):**
  - सभी रजिस्ट्रेशन पेजों को `<RegistrationRouteGuard>` के अंदर रैप किया गया है।

---

## 4. ब्राउज़र रीफ़्रेश / बंद करने के परिदृश्य (Resumability Scenarios)

1. **Step 1 के बाद ब्राउज़र बंद हुआ:** यूज़र वापस आकर वही नंबर डालेगा -> नया OTP आएगा -> Step 2 पर जाएगा। डुप्लीकेट अकाउंट नहीं बनेगा।
2. **Step 2 (OTP) के बाद ब्राउज़र बंद हुआ:** OTP वेरिफाइड है, पासवर्ड नहीं बना -> यूज़र वापस आकर नंबर डालेगा तो सिस्टम उसे सुरक्षित तरीके से Step 3 (Basic Details) पर ले जाएगा।
3. **Step 3 या 4 या 5 के बाद ब्राउज़र बंद हुआ:** पूरा डेटा MongoDB में सुरक्षित है। यूज़र लॉगिन करके या OTP वेरिफाई करके तुरंत अपने उसी आखिरी अधूरे स्टेप से जारी रख सकता है।
4. **Redis रीस्टार्ट हुआ:** सभी ड्राफ्ट्स और प्रोफाइल डिटेल्स MongoDB में सुरक्षित हैं। केवल एक्टिव OTP री-रिक्वेस्ट करना होगा।

---

## 5. फाइल सारांश टेबल (Summary Table)

| कंपोनेंट | फाइल पाथ | किया गया बदलाव |
| :--- | :--- | :--- |
| User Model | `models/users/user.model.js` | पार्शियल यूनिक इंडेक्स, `isPhoneVerified: false`, `registrationStatus` |
| OTP Service | `services/otpService.js` | HMAC-SHA256, 5 अटेम्प्ट, 60s कूलडाउन, टू-फेज लॉक/रोलबैक |
| Onboarding | `services/onboardingService.js` | अथॉरिटेटिव स्टेट मशीन, स्टेप प्रीसीडिंग वैलिडेशन, अटॉमिक कम्प्लीशन |
| Auth Controller | `controllers/auth/users.js` | सभी एंडपॉइंट्स को सुरक्षित किया, मॉक फॉलबैक हटाया |
| Phone Normalizer | `utils/phoneNormalizer.js` | E.164 कैनोनिकल फॉर्मेटिंग |
| Migration | `script/migrations/auditAndMigratePhoneIndex.js` | सेफ डुप्लीकेट फोन ऑडिट व इंडेक्स माइग्रेशन |
| Unit Tests | `test/unit/registrationRebuild.test.js` | 11 ऑटोमेटेड टेस्ट केसेज |
| Frontend Steps | `src/screens/registration*` | स्टेप 4 व 5 को API से जोड़ा, डेमो 1234 व मॉक डेटा हटाया |
| Route Guard | `src/app/registration/components/RegistrationRouteGuard.tsx` | स्टेप स्किपिंग प्रोटेक्शन व ऑटो-रेज़्यूमे |
