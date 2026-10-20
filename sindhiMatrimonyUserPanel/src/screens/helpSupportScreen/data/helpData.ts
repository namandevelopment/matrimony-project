import {
  HelpCategory,
  HelpGuideline,
  HelpFAQ,
  SupportChannel,
} from "../types";

export const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: "phone-helpline",
    title: "Member Helpline",
    subtitle: "Direct assistance with our dedicated Sindhi support team",
    value: "8144778866",
    displayValue: "8144-77-88-66",
    actionLabel: "Call Toll-Free",
    actionHref: "tel:8144778866",
    timing: "9:00 AM – 8:00 PM IST (Mon – Sun)",
    badge: "Fastest Response",
    iconType: "phone",
    isPrimary: true,
  },
  {
    id: "whatsapp-chat",
    title: "WhatsApp & Live Chat",
    subtitle: "Quick queries, photo upload assistance & verification help",
    value: "918144778866",
    displayValue: "+91 8144-77-88-66",
    actionLabel: "Chat on WhatsApp",
    actionHref: "https://wa.me/918144778866?text=Hi%20SindhiMatrimony%20Support,%20I%20need%20assistance%20with%20my%20account.",
    timing: "Instant AI + Agent (24/7)",
    badge: "Available 24/7",
    iconType: "message",
  },
  {
    id: "email-desk",
    title: "Email Support Desk",
    subtitle: "Detailed account queries, billing receipts & document submission",
    value: "support@sindhimarriage.in",
    displayValue: "support@sindhimarriage.in",
    actionLabel: "Send Email",
    actionHref: "mailto:support@sindhimarriage.in?subject=Support%20Request%20-%20SindhiMatrimony",
    timing: "Guaranteed reply within 4 hours",
    badge: "Official Desk",
    iconType: "mail",
  },
  {
    id: "grievance-desk",
    title: "Grievance & Trust Officer",
    subtitle: "Statutory escalation under IT Rules 2021 & DPDP Act 2023",
    value: "grievance@sindhimarriage.in",
    displayValue: "grievance@sindhimarriage.in",
    actionLabel: "Contact Officer",
    actionHref: "mailto:grievance@sindhimarriage.in?subject=Grievance%20Escalation%20-%20SindhiMatrimony",
    timing: "Resolution acknowledged within 24 hrs",
    badge: "Statutory",
    iconType: "shield",
  },
];

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "all",
    title: "All Categories",
    shortTitle: "All Topics",
    description: "Browse all official support topics and guides",
    iconName: "HelpCircle",
  },
  {
    id: "profile-verification",
    title: "Profile & Verification",
    shortTitle: "Profile & ID",
    description: "Photo upload, ID verification, sub-caste setup & Kundali details",
    iconName: "UserCheck",
    badge: "Essential",
  },
  {
    id: "matchmaking-search",
    title: "Matchmaking & Search",
    shortTitle: "Matches & Search",
    description: "Express interests, sub-caste filters, chat, and horoscope match",
    iconName: "Search",
  },
  {
    id: "membership-billing",
    title: "Membership & Billing",
    shortTitle: "Plans & Billing",
    description: "Subscription packages, payment options, invoices & refunds",
    iconName: "CreditCard",
  },
  {
    id: "privacy-security",
    title: "Privacy & Account Settings",
    shortTitle: "Privacy & Security",
    description: "Phone masking, photo blur, blocking members & account deletion",
    iconName: "Lock",
  },
  {
    id: "safety-fraud",
    title: "Safety & Fraud Prevention",
    shortTitle: "Safety & Scams",
    description: "Scam alerts, safe meetings, reporting fake profiles & cyber crime",
    iconName: "ShieldAlert",
    badge: "Important",
  },
];

export const HELP_GUIDELINES: HelpGuideline[] = [
  {
    id: "guide-sindhi-profile-setup",
    categoryId: "profile-verification",
    title: "How to Create a 100% Verified Sindhi Matrimony Profile",
    summary:
      "A complete profile with verified details receives up to 5x more responses from compatible Sindhi families.",
    steps: [
      {
        stepNumber: 1,
        title: "Provide Accurate Community Details",
        description:
          "Select your specific Sindhi sub-caste (such as Bhaiband, Amil, Sahiti, Lohana, Larkana, Shikarpuri, or Sindhi-General) and native ancestral roots (e.g., Sindh origins or current settlement).",
      },
      {
        stepNumber: 2,
        title: "Upload High-Quality Recent Photos",
        description:
          "Upload at least 2 clear, front-facing recent photographs. Avoid group photos, heavy sunglasses, or low-resolution crops. You can choose to keep photos password-protected or visible only to accepted interests.",
      },
      {
        stepNumber: 3,
        title: "Add Education, Career & Family Background",
        description:
          "Enter your degree, college, current profession, employer/business, annual income, and family values (Traditional, Moderate, Liberal).",
      },
      {
        stepNumber: 4,
        title: "Complete Kundali & Astro Details",
        description:
          "Add date, exact time, and city of birth to automatically generate Guna Milan score, Manglik status, and Rashi for astrological compatibility.",
      },
    ],
    tips: [
      "Profiles with verified mobile numbers and government ID badges get prioritized placement in daily recommendations.",
      "Write a thoughtful 3-4 sentence bio highlighting family background, cultural interests, and partner expectations.",
    ],
    tags: ["profile", "sub-caste", "photo", "kundali", "verification"],
  },
  {
    id: "guide-id-trust-badge",
    categoryId: "profile-verification",
    title: "How to Get the 100% Verified Trust Badge",
    summary:
      "Build instant trust with prospective brides and grooms by completing government ID verification.",
    steps: [
      {
        stepNumber: 1,
        title: "Go to Profile Settings > Trust Verification",
        description:
          "Log in to your account and click on the 'Verify Profile' button under your profile picture.",
      },
      {
        stepNumber: 2,
        title: "Choose Verification Method",
        description:
          "Verify securely via Aadhaar OTP (instant paperless DigiLocker integration) or upload a scanned copy of your Passport, Voter ID, or Driving License.",
      },
      {
        stepNumber: 3,
        title: "Automated OCR & Team Review",
        description:
          "Our automated security system cross-checks your name and date of birth. Document verification is completed within 1 to 2 business hours.",
      },
    ],
    tips: [
      "Your uploaded identification documents are permanently encrypted with 256-bit AES encryption and never visible to other members.",
      "Once approved, a blue 'Verified Member' badge appears on your profile card.",
    ],
    tags: ["id verification", "trust badge", "aadhaar", "passport", "safety"],
  },
  {
    id: "guide-matchmaking-filters",
    categoryId: "matchmaking-search",
    title: "Using Community Filters to Find Compatible Matches",
    summary:
      "Narrow down thousands of profiles using Sindhi sub-caste, city, education, and lifestyle criteria.",
    steps: [
      {
        stepNumber: 1,
        title: "Apply Sindhi Sub-Caste & Cultural Filters",
        description:
          "Filter by Bhaiband, Amil, Sahiti, Lohana, Larkana, or open your preferences to all Sindhi sub-communities.",
      },
      {
        stepNumber: 2,
        title: "Location & NRI Preferences",
        description:
          "Select specific Indian metro cities (Mumbai, Pune, Ahmedabad, Delhi-NCR, Bangalore) or international Sindhi diaspora hubs (UAE/Dubai, USA, UK, Canada, Singapore).",
      },
      {
        stepNumber: 3,
        title: "Horoscope & Kundali Matching",
        description:
          "Filter matches based on Minimum Guna Score (e.g., 18+ or 24+ Gunas) and Manglik / Non-Manglik compatibility.",
      },
      {
        stepNumber: 4,
        title: "Express Interest & Send Messages",
        description:
          "Click 'Express Interest' to send a free notification. When accepted, you can initiate chats, request phone numbers, or exchange horoscopes.",
      },
    ],
    tips: [
      "Save your search criteria as an 'Alert' to receive automated email or WhatsApp notifications whenever a new matching profile registers.",
    ],
    tags: ["search", "filters", "nri", "guna milan", "sub-caste", "interest"],
  },
  {
    id: "guide-membership-plans",
    categoryId: "membership-billing",
    title: "Understanding Membership Plans & Payment Options",
    summary:
      "Learn what features are free and when to upgrade to Premium for direct contact numbers and personalized matchmaking.",
    steps: [
      {
        stepNumber: 1,
        title: "Free Registration vs. Premium Membership",
        description:
          "Free members can create a profile, upload photos, browse matches, and receive interests. Premium members get verified contact phone numbers, instant chat, and horoscope downloads.",
      },
      {
        stepNumber: 2,
        title: "Choose the Right Package",
        description:
          "Select from Gold (3 months), Diamond (6 months), or Platinum (12 months) based on how actively you are searching.",
      },
      {
        stepNumber: 3,
        title: "Secure Payment Methods",
        description:
          "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking (50+ banks), and No-Cost EMI on leading credit cards.",
      },
      {
        stepNumber: 4,
        title: "Instant Activation & GST Invoice",
        description:
          "Your package activates immediately upon successful payment. A GST-compliant tax invoice is sent to your registered email address.",
      },
    ],
    tips: [
      "All transactions are processed through RBI-authorized payment gateways with 3D-Secure 2-factor authentication.",
    ],
    tags: ["membership", "plans", "payment", "upi", "credit card", "invoice"],
  },
  {
    id: "guide-privacy-controls",
    categoryId: "privacy-security",
    title: "Controlling Your Phone Number, Photo & Contact Privacy",
    summary:
      "Maintain 100% control over who can view your photos, phone number, and personal details.",
    steps: [
      {
        stepNumber: 1,
        title: "Phone Number Masking & Privacy",
        description:
          "Go to Account Settings > Privacy. Choose to display your phone number to 'All Premium Members', 'Only Members Whose Interest I Accept', or 'Hide from All'.",
      },
      {
        stepNumber: 2,
        title: "Photo Privacy Shield",
        description:
          "Enable 'Photo Blur' or 'Password Protect'. Your photos will only be visible to prospective matches after you grant individual permission.",
      },
      {
        stepNumber: 3,
        title: "Block or Ignore Profiles",
        description:
          "Easily block any member by clicking 'Block Profile' on their detail page. Blocked profiles cannot view your activity or send you messages.",
      },
      {
        stepNumber: 4,
        title: "Temporary Deactivation or Account Deletion",
        description:
          "If you have found your match or wish to take a break, go to Settings > Delete Account. You can choose temporary deactivation or complete data purge under DPDP Act 2023.",
      },
    ],
    tips: [
      "We never share your personal phone number or email address with third-party advertisers or marketing companies.",
    ],
    tags: ["privacy", "phone masking", "photo blur", "block", "delete account"],
  },
  {
    id: "guide-safety-scam-alert",
    categoryId: "safety-fraud",
    title: "Matrimonial Safety & Fraud Prevention Guidelines",
    summary:
      "Essential precautions every member must take while interacting with online matrimonial prospects.",
    steps: [
      {
        stepNumber: 1,
        title: "The Golden Rule: Never Send Money",
        description:
          "Never send money, bank transfers, cryptocurrency, or high-value gifts to anyone you met on a matrimonial site, regardless of emergency excuses (customs clearance, medical emergencies, flight tickets).",
      },
      {
        stepNumber: 2,
        title: "Meet in Safe, Public Places",
        description:
          "Always organize initial meetings in well-lit public places (cafes, restaurants, family gatherings). Inform close family members before going.",
      },
      {
        stepNumber: 3,
        title: "Verify References Independently",
        description:
          "Check education, employment credentials, and common family references through Sindhi community circles or mutual acquaintances before finalizing alliances.",
      },
      {
        stepNumber: 4,
        title: "Report Suspicious Activity Immediately",
        description:
          "Use the 'Report Profile' button on any profile or contact our Grievance Desk at support@sindhimarriage.in. You can also dial the National Cyber Crime Helpline at 1930.",
      },
    ],
    tips: [
      "Read our detailed safety handbook at the official /safety-tips page.",
    ],
    tags: ["safety", "scams", "cyber crime", "1930", "report profile"],
  },
];

export const HELP_FAQS: HelpFAQ[] = [
  {
    id: "faq-1",
    category: "profile-verification",
    question: "How long does it take for my profile and photos to get approved?",
    answer:
      "All newly created profiles, updated bio details, and uploaded photos are screened by our automated AI safety filters and verified by our content review team within 1 to 4 hours. You will receive an SMS and email notification as soon as your profile is active.",
  },
  {
    id: "faq-2",
    category: "profile-verification",
    question: "Can I register a profile on behalf of my son, daughter, brother, or sister?",
    answer:
      "Yes, absolutely. Over 60% of profiles on SindhiMatrimony are created by parents, siblings, or guardians. While creating the account, simply select 'Profile Created By: Parent / Sibling' and provide appropriate contact details.",
  },
  {
    id: "faq-3",
    category: "privacy-security",
    question: "Who can see my phone number and contact details?",
    answer:
      "You have total control. Under Privacy Settings, you can configure your contact visibility to: (1) All verified Premium Members, (2) Only members whose interest you have mutually accepted, or (3) Hide from everyone. Your number is never publicly displayed on search engines.",
  },
  {
    id: "faq-4",
    category: "matchmaking-search",
    question: "How does Kundali and Guna Milan matching work on SindhiMatrimony?",
    answer:
      "Our system uses authentic Vedic astrological algorithms. When you enter date, exact time, and place of birth, our engine computes Ashta Koota matching (total 36 Gunas), checks Manglik Dosha compatibility, and generates a free downloadable Kundali match report with prospective profiles.",
  },
  {
    id: "faq-5",
    category: "membership-billing",
    question: "What payment methods do you accept and is it safe?",
    answer:
      "We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Net Banking, and Wallet payments. All transactions are protected by 256-bit SSL encryption and RBI-mandated 2-factor authentication.",
  },
  {
    id: "faq-6",
    category: "membership-billing",
    question: "Can I get a refund if I find a match before my subscription expires?",
    answer:
      "Subscriptions are non-refundable once contact details or messaging features have been utilized, as stated in our Terms & Conditions. However, if you experienced technical issues or duplicate deductions, our billing team processes refund claims within 5-7 business days.",
  },
  {
    id: "faq-7",
    category: "safety-fraud",
    question: "What should I do if someone asks me for money or financial help?",
    answer:
      "Never send money under any circumstances. Genuine matrimonial matches will never request financial transfers, crypto, or customs clearance fees. Immediately block the profile, take screenshots of the chat, and report it to us via the 'Report Profile' button or email support@sindhimarriage.in.",
  },
  {
    id: "faq-8",
    category: "privacy-security",
    question: "How do I permanently delete my profile and personal data?",
    answer:
      "Log in to your account, navigate to Account Settings > Delete Account, select your reason (e.g. 'Found my match on SindhiMatrimony'), and confirm. In compliance with the Digital Personal Data Protection (DPDP) Act 2023, your personal data, photos, and horoscope records are permanently wiped from active servers.",
  },
];

export const OFFICE_DETAILS = {
  portalName: "Sindhimarriage.in",
  parentOrg: "Matrimony.com Group / NeelimaMarriage Network",
  tollFreeHelpline: "8144-77-88-66",
  supportEmail: "support@sindhimarriage.in",
  grievanceEmail: "grievance@sindhimarriage.in",
  operatingHours: "Monday to Sunday, 9:00 AM to 8:00 PM IST",
  grievanceOfficer: "Mr. Ramesh Advani (Chief Trust & Compliance Officer)",
  grievanceTimeline: "Acknowledgement within 24 hours; disposal within 15 days as per IT Rules 2021",
  registeredOffice: "Sindhi Matrimony Hub, 4th Floor, Commercial Tower, Bandra-Kurla Complex (BKC), Mumbai, Maharashtra 400051, India",
  cyberCrimeHelpline: "1930 (National Cyber Crime Reporting Portal)",
};
