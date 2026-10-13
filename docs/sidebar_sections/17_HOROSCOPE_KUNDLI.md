# 🔮 Horoscope & Kundli Milan Desk — Documentation

## 1. Overview & Theoretical Foundation (कुंडली मिलान एवं वैदिक ज्योतिष)

### Purpose & Business Rationale
Sindhi Matrimony aur Indian Hindu Matrimony platforms me vivah (marriage) fix karne me **Kundli Milan (Horoscope Matching)** aur **Gotra Exogamy (सगोत्र विवाह निषेध)** sabse pehle dekha jane wala parampara-gat aur psychological criterion hota hai. 

Jeevansathi, Bharat Matrimony aur Shaadi.com jaise market leaders ke reports ke mutabik:
- **70% se zyada Indian families** proposal aage badhane se pehle Kundli / Guna Milan check karti hain.
- **Same Gotra (Sagotra)** vivah Sindhi aur Hindu sanskriti me prohibited (varjit) mana jata hai kyunki yeh ek hi rishi vanshavali (genetic lineage) ko darshata hai.
- **Manglik Dosha (Kuja Dosha)** ka bhay aur galatfahami rishto me rukawat banti hai, isliye accurate Anshik vs Purna Manglik cancellation checks zaroori hain.
- **Ashtakoota 36 Guna Milan**: 8 kooto (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) par adharit mathematical score (36 me se 18 minimum Vivah ke liye anukool maane jaate hain).

**Horoscope & Kundli Milan Desk** admin portal me CRM managers, matchmakers aur super admin ko yeh suvidha deta hai ki wo:
1. Kisi bhi Ladke (Var) aur Ladki (Vadhu) ki Kundli live simulate karke 36 me se Guna nikal sakein.
2. Caste aur Gotra verification karke Sagotra vivaah risk turant detect karein.
3. Manglik compatibility calculate karein.
4. Anukool rishte milne par dono paksho (users) ko real-time Kundli Match Notification bhej sakein.

---

## 2. Industry Comparison: Jeevansathi, Bharat Matrimony & Shaadi.com

| Feature / Dimension | Shaadi.com | Bharat Matrimony | Jeevansathi.com | Sindhi Matrimony Implementation |
|---|---|---|---|---|
| **Astrological Engine** | Vedic Ashtakoota (Lahiri Ayanamsha) | Vedic Ashtakoota + South Indian Porutham | Vedic 36-Guna Ashtakoota Milan | Vedic 36-Guna Ashtakoota + Sindhi Gotra Engine |
| **Input Parameters** | Date, Time (AM/PM), Place of Birth, Gotra | Date, Time, City, Nakshatra, Rashi, Gotra | Date, Time, Place, Manglik, Gotra | Date/Time/Place + Rashi + Nakshatra + Gotra |
| **Gotra Exogamy Rule** | Filterable: "Exclude Same Gotra" | Hard Warning: "Same Gotra Marriage Not Recommended" | Filterable & In-Profile Warning | Strict Gotra Collision Flag + Sagotra Warning Banner |
| **Manglik Validation** | Non / Manglik / Don't Know / Both Ok | Strict Manglik Matching / Cancellation Rules | Manglik to Manglik recommendation | Purna & Anshik Manglik cancellation matrix |
| **User Notifications** | Push Notification: "92% Astro Match Found!" | SMS + App Notification: "Horoscope matched with 28 Gunas" | Daily Horoscope Match Digest | Real-time Push, In-App Notification & Broadcast |
| **Monetization / Access** | Free preview (Guna count), Detailed Kundli behind VIP Gold | Kundli Report unlock through Paid Credits | Free basic score, Full Astrological PDF behind Pro | Integrated with Paid Membership & CRM Calling |

---

## 3. Ashtakoota 36-Guna Mathematical Architecture

Horoscope Service (`horoscopeService.ts`) 8 paramparik kooto ko calculate karti hai:

| # | Koota (कूट) | Max Points | Area of Human Life & Marriage | Astrological Logic |
|---|---|---|---|---|
| 1 | **Varna (वर्ण)** | 1 | Ego, spiritual temperament, intellectual compatibility | Brahmin > Kshatriya > Vaishya > Shudra hierarchy check |
| 2 | **Vashya (वश्य)** | 2 | Mutual dominance, attraction & power balance | Quadruped, Human, Water, Wild, Insect signs compatibility |
| 3 | **Tara (तारा)** | 3 | Health, destiny, longevity & mutual well-being | Nakshatra count modulo 9 (Janma, Sampat, Vipat, Kshem, etc.) |
| 4 | **Yoni (योनि)** | 4 | Physical intimacy, animal totem compatibility | 14 Animal categories (Ashwa, Gaja, Mesh, Sarpa, etc.) |
| 5 | **Graha Maitri (ग्रह मैत्री)** | 5 | Psychological friendship, mindset & mental harmony | Rashi lords mutual friendship (Sun, Moon, Mars, Mercury, etc.) |
| 6 | **Gana (गण)** | 6 | Temperament & societal behavior | Deva (Divine), Manushya (Human), Rakshasa (Demonic) |
| 7 | **Bhakoot (भकूट)** | 7 | Prosperity, family growth & happiness | Rashi distance (Avoid 2/12, 6/8, 9/5 doshas) |
| 8 | **Nadi (नाडी)** | 8 | Genetic lineage, physiological health & progeny | Adi, Madhya, Antya Nadi (Same Nadi creates Nadi Dosha) |
| **Total** | **Ashtakoota** | **36** | **Comprehensive Vedic Marriage Compatibility** | **>= 18: Auspicious, 25+: Highly Recommended** |

### Gotra & Nadi Connection
Sindhi aur Vedic parampara me **Sagotra vivah** me biological similarity hone ki wajah se Nadi Dosha ka jokhim sabse zyada rehta hai. Isliye system me:
- **Same Gotra Detection:** Agar Groom Gotra === Bride Gotra ho, toh system turant warning badge display karta hai aur recommendation flag low kar deta hai chahe Gunas 30+ ho.

---

## 4. Admin Screen Capabilities & Tab Architecture

### Tab 1: Kundli Milan Simulator (कुंडली मिलान सिमुलेटर)
- **Interactive Groom & Bride Selector:** Dropdowns se verified active male aur female profile select karein.
- **Live Guna Scorecard:** 36 me se score, percentage bar aur verdict (`EXCELLENT` >=28, `GOOD` >=24, `AVERAGE` >=18, `POOR` <18).
- **Gotra Collision Alert:** Same Gotra par red warning alert box.
- **Manglik Dosha Breakdown:** Mars positions, Anshik vs Purna Manglik cancellation checks.
- **Detailed 8-Koota Breakdown Table:** Har koot ka max points, obtained points aur description.
- **Dispatch Match Notification:** Single click me dono users ko custom astrological push alert bhejna:
  *"🌟 Astrological Match Found: 28/36 Gunas matched with Priya Advani! Both Kundlis indicate high marital harmony."*

### Tab 2: Member Horoscopes Directory (सदस्य जन्मपत्री निर्देशिका)
- **Directory Table:** Har member ka ID, Name, Gender, Caste/Subcaste, Gotra, Rashi, Nakshatra, aur Manglik status.
- **Fast Filter & Search:** Gotra, Rashi, Manglik status aur keyword search.
- **Quick Test Button:** Kisi bhi candidate ko directly Kundli Milan Simulator me Groom ya Bride slot me send karna.

### Tab 3: Batch Match & Automated Notifications Desk (ऑटोमेटेड मिलान एवं अलर्ट्स)
- **Opposite Gender Auto-Matrix:** Active groom aur bride profiles ko batch match karke eligible pairs filter karna.
- **Minimum Guna Filter:** Admin filter set kar sakta hai (e.g. only pairs with >= 24 Gunas).
- **One-Click Broadcast Alerts:** High compatibility pairs ko bulk notifications send karna.

### Tab 4: Astro Matching Policies & Settings (ज्योतिष नीतियां एवं सेटिंग्स)
- **Minimum Recommended Guna Threshold:** Default 18 (adjustable 18-32).
- **Strict Gotra Exogamy Enforcement:** Disallow/flag same-gotra matches.
- **Manglik Mutual Cancellation Override:** Auto-clear Manglik dosha if both partners are Manglik.
- **Auto Push Notification Trigger:** Daily background job trigger criteria.

### Tab 5: Direct Dispatch Desk (Send Horoscope to User / कुंडली प्रेषण डेस्क)
- **Direct User Dispatch:** Admin kisi bhi verified member ko select karke unka **Personal Janam Kundli Report** ya kisi candidate ke saath **Kundli Milan Match Report** bhej sakta hai.
- **Multi-Channel Dispatch:** In-App Push Alert, WhatsApp (with PDF preview link), SMS Text, ya Email HTML report.
- **Pandit / Relationship Manager Remarks:** Custom comments aur verification notes add karne ki suvidha.
- **Live Device Preview:** Phone mockup par live preview dikhta hai ki notification user ke mobile me kaise dikhegi.
- **Dispatch Audit History:** Real-time log jo record karta hai ki kis user ko kab, kis channel se aur kaunsi Kundli bheji gayi.

---

## 5. Technical Architecture & File Map

- **Service Engine:** `src/services/horoscopeService.ts`
  - Ephemeris tables for 27 Nakshatras & 12 Rashis.
  - Ashtakoota calculation functions.
  - Gotra collision evaluator.
  - Direct individual report & match report dispatchers.
  - Notification dispatcher integrated with `notificationService.ts`.
- **UI Screen:** `src/screens/horoscopeScreen/HoroscopeScreen.tsx`
  - 5-tab layout, KPI counters, responsive table, interactive simulation, direct dispatch desk.
- **Routing & Navigation:**
  - Route: `/horoscope` in `src/routes/screenConfig.ts`.
  - Sidebar Item: `Horoscope & Kundli` in `src/components/AdminLayout.tsx`.
  - RBAC Clearances: Added to `ROUTE_PERMISSIONS`, `SIDEBAR_SECTIONS`, and role presets in `src/utils/rbac.ts`.

---

## 6. Security, RBAC & Privacy Compliance

- **Role Clearance:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`, `EMPLOYEE`, `SUPPORT_AGENT`.
- **Client Privacy:** Birth time aur birth place sensitive PII (Personally Identifiable Information) data hain. Unhe encrypted format me store kiya jata hai aur matchmaking suggestions me exact coordinates hide karke keval compatibility score show kiya jata hai.
