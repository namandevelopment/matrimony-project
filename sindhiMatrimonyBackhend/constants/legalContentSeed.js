/**
 * Seed data for Legal Policies (Privacy Policy & Terms and Conditions)
 * Fully compliant with Digital Personal Data Protection (DPDP) Act 2023 & Information Technology Act 2000.
 */

export const DEFAULT_PRIVACY_POLICY = {
  type: "PRIVACY_POLICY",
  title: "Privacy Policy – Sindhi Matrimony",
  lastUpdatedDate: "October 20, 2026",
  effectiveDate: "January 1, 2026",
  version: "1.2.0",
  meta: {
    complianceStandard: "DPDP Act 2023 & IT Act 2000",
    securityStandard: "256-Bit SSL Encryption",
    targetAudience: "All Registered Members & Visitors",
  },
  introduction:
    "At Sindhimarriage.in ('Platform', 'Website', 'We', 'Us', 'Our'), operated by Matrimony.com Group, we understand that searching for a life partner requires sharing sensitive personal, familial, and astrological information. Protecting your privacy and personal data is our foundational commitment. This Privacy Policy details how we collect, process, store, disclose, and protect your personal information in strict accordance with the Digital Personal Data Protection (DPDP) Act, 2023, the Information Technology Act, 2000, and international data security standards.",
  assurance: {
    title: "Our Privacy Pledge",
    description:
      "We never sell, rent, barter, or trade your contact details, personal photos, or matrimonial records to third-party telemarketers or advertisers under any circumstances.",
    commitmentBadge: "100% Data Protection Guaranteed",
  },
  contactInfo: {
    email: "support@sindhimarriage.in",
    dpoEmail: "grievance@sindhimarriage.in",
    phone: "8144-77-88-66",
    address: "Sindhi Matrimony Grievance Cell, Matrimony.com Group, India",
  },
  sections: [
    {
      id: "overview",
      number: "1",
      title: "Introduction & Commitment to Privacy",
      badge: "DPDP Act, 2023 Compliant",
      summary: "Our core commitment to protecting matrimonial, personal, and astrological data.",
      paragraphs: [
        "At Sindhimarriage.in, we understand that finding a life partner involves sharing deeply personal and familial details. We respect your trust and treat your data with the highest confidentiality.",
        "We operate under the Digital Personal Data Protection (DPDP) Act 2023, ensuring transparent data collection, explicit user consent, and purpose limitation.",
      ],
      bullets: [
        "Zero data selling or third-party telemarketing sharing.",
        "End-to-end HTTPS/TLS 1.3 transmission with 256-bit AES encryption.",
        "Strict employee access controls and periodic security audits.",
      ],
      order: 1,
    },
    {
      id: "information-collected",
      number: "2",
      title: "Information We Collect",
      badge: "Transparent Data Practices",
      summary: "Categories of personal, demographic, and astrological information collected.",
      paragraphs: [
        "To provide precise Sindhi community matchmaking and verified authentic profiles, we collect specific categories of information with your explicit consent:",
      ],
      bullets: [
        "Personal & Identity Data: Full Name, Gender, Date of Birth, Marital Status, and Government Photo ID verification.",
        "Community & Religious Data: Sub-caste (Bhaiband, Amil, Sahiti, Lohana, Larkana), Gotra (Nukh), Mother Tongue, and Native Place.",
        "Astrological Data: Time and place of birth, Nakshatra, and Raasi strictly used for Vedic Kundali matching.",
        "Professional & Educational Data: Education level, occupation, company name, and annual income bracket.",
        "Contact & Device Data: Verified mobile number, email address, IP address, device model, and push tokens.",
      ],
      order: 2,
    },
    {
      id: "how-we-use",
      number: "3",
      title: "How We Use Your Information",
      badge: "Purpose-Bound Usage",
      summary: "The specific legitimate purposes for processing candidate information.",
      paragraphs: [
        "Your data is processed strictly for legitimate matrimonial matchmaking purposes, candidate safety, and service fulfillment.",
      ],
      bullets: [
        "Generating compatible Sindhi matchmaking recommendations and calculating compatibility scores.",
        "Verifying phone numbers and government IDs to eliminate fraud and fake profiles.",
        "Enabling secure mutual communication (In-App Chat, Interest Requests, Assisted Matchmaker Calls).",
        "Sending vital transactional notifications like mutual interest acceptances, new matches, and security alerts.",
      ],
      order: 3,
    },
    {
      id: "privacy-controls",
      number: "4",
      title: "Profile Privacy & Photo Protection Controls",
      badge: "Granular Privacy",
      summary: "Controls to protect your profile visibility, contact details, and photos.",
      paragraphs: [
        "We empower members with granular privacy controls directly manageable from account settings at any time.",
      ],
      bullets: [
        "Photo Privacy: Set your photos to 'Visible to All', 'Visible only to Contacted / Accepted Members', or 'Blurred / Password Protected'.",
        "Phone Privacy: Choose whether your contact number is visible to premium members, shared only after mutual consent, or masked.",
        "Profile Incognito Mode: Hide your profile from public browsing while you take time to review existing conversations.",
      ],
      order: 4,
    },
    {
      id: "data-security",
      number: "5",
      title: "Data Storage, Encryption & Security Standards",
      badge: "Enterprise Security",
      summary: "How your data is stored and safeguarded against unauthorized access.",
      paragraphs: [
        "All user data is housed in enterprise Tier-4 ISO 27001-certified data centers located strictly within India in compliance with Indian sovereign data residency laws.",
      ],
      bullets: [
        "Database encryption at rest using AES-256 and cryptographic salting for authentication secrets.",
        "Automated rate-limiting and anti-scraping firewalls to block web crawlers and malicious harvesters.",
        "Annual third-party CERT-In empanelled penetration testing and vulnerability assessments.",
      ],
      order: 5,
    },
    {
      id: "user-rights",
      number: "6",
      title: "Your Rights as a Data Principal (DPDP Act)",
      badge: "Statutory Rights",
      summary: "Your rights to access, correct, export, and delete your profile data.",
      paragraphs: [
        "Under Section 11 of the DPDP Act 2023, you have full sovereignty over your personal data:",
      ],
      bullets: [
        "Right to Access & Summary: Request a complete digital summary of the personal data we hold about you.",
        "Right to Correction & Updating: Easily rectify inaccurate, outdated, or incomplete profile details.",
        "Right to Erasure & Account Deletion: Delete your profile permanently along with all photos, chat history, and astrological records.",
        "Right to Withdraw Consent: Revoke previously granted consent for specific communication channels at any time.",
      ],
      order: 6,
    },
    {
      id: "grievance-dpo",
      number: "7",
      title: "Grievance Redressal & Data Protection Officer",
      badge: "24-Hour Acknowledgment",
      summary: "Official contact channels for privacy concerns, complaints, and statutory escalation.",
      paragraphs: [
        "In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021 and the DPDP Act 2023, we have appointed a dedicated Grievance Officer and Data Protection Officer.",
      ],
      bullets: [
        "Grievance Officer: Vipin Narang",
        "Email: grievance@sindhimarriage.in",
        "Helpline: 8144-77-88-66 (Mon – Sat, 10:00 AM – 6:00 PM IST)",
        "SLA: All grievances are officially acknowledged within 24 hours and resolved within 15 working days.",
      ],
      order: 7,
    },
  ],
};

export const DEFAULT_TERMS_AND_CONDITIONS = {
  type: "TERMS_AND_CONDITIONS",
  title: "Terms & Conditions – Sindhi Matrimony",
  lastUpdatedDate: "October 20, 2026",
  effectiveDate: "January 1, 2026",
  version: "1.2.0",
  meta: {
    complianceStandard: "IT Act 2000 Section 79 & Intermediary Guidelines 2021",
    securityStandard: "Standard Electronic Contract",
    targetAudience: "All Registered Members & Visitors",
  },
  introduction:
    "Welcome to Sindhimarriage.in ('Platform', 'Website', 'App'), an exclusive matrimonial matchmaking service owned and operated by Matrimony.com Group ('Company', 'We', 'Us', 'Our'). By accessing, browsing, registering on, or using this Platform, you ('User', 'Member', 'You') unconditionally agree to be bound by these Terms & Conditions, together with our Privacy Policy, Safety Guidelines, and Community Standards. If you do not agree with any provision of this Agreement, you must immediately cease accessing or using our services.",
  assurance: {
    title: "Intermediary Status Disclosure",
    description:
      "SindhiMatrimony operates as an electronic intermediary under Section 79 of the Information Technology Act, 2000. We provide an online matchmaking facilitation platform for the global Sindhi community to connect for lawful matrimonial alliances. We do not arrange marriages directly nor guarantee alliances.",
    commitmentBadge: "Verified Legal Agreement",
  },
  contactInfo: {
    email: "legal@sindhimarriage.in",
    dpoEmail: "grievance@sindhimarriage.in",
    phone: "8144-77-88-66",
    address: "Sindhi Matrimony Legal Department, Matrimony.com Group, India",
  },
  sections: [
    {
      id: "acceptance",
      number: "1",
      title: "Acceptance of Terms & User Agreement",
      badge: "Binding Agreement",
      summary: "Contractual validity of terms between the member and Sindhi Matrimony.",
      paragraphs: [
        "This electronic document is published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediaries guidelines) Rules, 2011.",
        "Your registration on the platform constitutes a legally enforceable contract between you and Sindhi Matrimony.",
      ],
      bullets: [
        "Valid across all platforms: Web, Mobile Web, Android App, and iOS App.",
        "Continued use after terms modification constitutes automatic acceptance of updated terms.",
      ],
      order: 1,
    },
    {
      id: "eligibility",
      number: "2",
      title: "Membership Eligibility & Legal Capacity",
      badge: "Mandatory Criteria",
      summary: "Legal age, marital status, and capacity requirements for registration.",
      paragraphs: [
        "Membership on SindhiMatrimony is strictly restricted to individuals seeking lawful marriage alliances for themselves or on behalf of their children, siblings, or wards with their explicit consent.",
      ],
      bullets: [
        "Minimum Marriage Age: At least 21 years for males and 18 years for females as mandated by Indian Law.",
        "Legal Marital Status: Must be legally unmarried (Never Married, Legally Divorced with decree, or Widowed). Married individuals are strictly prohibited.",
        "Sindhi Heritage: Must belong to or have ancestral affiliation with the global Sindhi community.",
        "Mental & Legal Capacity: Must possess full legal competence to contract under the Indian Contract Act, 1872.",
      ],
      order: 2,
    },
    {
      id: "account-security",
      number: "3",
      title: "Account Registration & Security Obligations",
      badge: "Member Responsibilities",
      summary: "Authenticity of information, OTP security, and password confidentiality.",
      paragraphs: [
        "Members must provide 100% genuine, current, and verifiable information during registration and profile creation.",
      ],
      bullets: [
        "Single Profile Rule: A candidate can hold only one active profile on the platform at any given time.",
        "OTP & Credentials Security: You are solely responsible for maintaining the confidentiality of your login credentials and OTPs.",
        "Verification Mandate: We reserve the right to request government ID verification at any point before activating contact view permissions.",
      ],
      order: 3,
    },
    {
      id: "acceptable-use",
      number: "4",
      title: "Acceptable Use & Code of Conduct",
      badge: "Zero Tolerance Policy",
      summary: "Strict prohibition against harassment, financial solicitation, dowry, and fake data.",
      paragraphs: [
        "Our community standards protect candidates and families from unethical conduct and fraudulent behavior.",
      ],
      bullets: [
        "No Financial Solicitation: Members must NEVER ask for money, gifts, loans, travel tickets, or financial assistance from matches.",
        "No Dowry Promotion: The platform strictly condemns and prohibits any demands or discussions regarding dowry under the Dowry Prohibition Act, 1961.",
        "Decency & Respect: Offensive language, obscene media, stalking, or harassment will lead to immediate permanent ban and police reporting.",
        "Commercial Prohibition: Profiles cannot be used for commercial advertising, dating, casual hookups, or recruitment.",
      ],
      order: 4,
    },
    {
      id: "paid-membership",
      number: "5",
      title: "Paid Membership Plans, Billing & Refunds",
      badge: "Transparent Commercials",
      summary: "Terms governing Gold, Diamond, Platinum, and Assisted matchmaker packages.",
      paragraphs: [
        "Premium memberships grant enhanced benefits such as direct contact views, priority listing, and matchmaker assistance.",
      ],
      bullets: [
        "Credit Validity: Contact view credits expire alongside the plan duration and do not rollover unless renewed prior to expiry.",
        "No Guarantee of Marriage: Premium plans provide connection facilitation and profile visibility; they do NOT guarantee marriage or alliance finalization.",
        "Refund Policy: Subscriptions are non-refundable once activated and contact view credits have been utilized, except where legally required under consumer law.",
      ],
      order: 5,
    },
    {
      id: "limitation-liability",
      number: "6",
      title: "Independent Verification & Limitation of Liability",
      badge: "Intermediary Protection",
      summary: "Mandatory due diligence requirement for members prior to final alliance decisions.",
      paragraphs: [
        "While we perform phone verification and algorithmic authenticity checks, matrimonial alliances represent lifelong family decisions.",
      ],
      bullets: [
        "Family Due Diligence: Members and their families are strongly urged to independently verify the background, character, employment, and family of prospective matches before marriage talks.",
        "Intermediary Disclaimer: SindhiMatrimony shall not be liable for misrepresentations, false claims, or matrimonial disputes arising between members outside the platform.",
      ],
      order: 6,
    },
    {
      id: "termination",
      number: "7",
      title: "Account Suspension & Termination",
      badge: "Enforcement Rules",
      summary: "Grounds for immediate profile takedown, blacklist, and legal action.",
      paragraphs: [
        "We reserve the unilateral right to suspend, terminate, or blacklist any profile that violates platform rules without refund.",
      ],
      bullets: [
        "Submitting forged government documents or impersonating another person.",
        "Sending unsolicited commercial messages or harassing other registered candidates.",
        "Engaging in monetary fraud, deception, or blackmail.",
      ],
      order: 7,
    },
    {
      id: "jurisdiction",
      number: "8",
      title: "Governing Law & Dispute Jurisdiction",
      badge: "Indian Jurisdiction",
      summary: "Applicable laws and arbitration courts for dispute resolution.",
      paragraphs: [
        "This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes or claims shall be subject to the exclusive jurisdiction of the competent courts in Chennai/Mumbai, India.",
      ],
      bullets: [
        "Arbitration under the Arbitration and Conciliation Act, 1996 in case of unresolved commercial disputes.",
      ],
      order: 8,
    },
  ],
};
