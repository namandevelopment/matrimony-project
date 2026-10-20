/**
 * Default Seed & Fallback Data for "Our Process" (How It Works)
 * Specially customized for Sindhi Matrimony with 4 primary steps,
 * security guarantees, community culture, and statistics.
 */
export const DEFAULT_OUR_PROCESS = {
  title: "Our Matchmaking Process",
  subtitle:
    "A simple, secure, and dignified 4-step journey designed exclusively for Sindhi singles and families worldwide.",
  badge: "Simple • Secure • Community Focused",
  tagline:
    "From your first introduction to vivah — every step guided by tradition, privacy, and modern technology.",
  version: "1.0.0",
  isActive: true,
  steps: [
    {
      stepNumber: 1,
      stepKey: "REGISTER",
      title: "Create Profile & Define Preferences",
      shortDescription:
        "Sign up in under 2 minutes. Enter your sub-caste, gotra, profession, lifestyle, and partner expectations.",
      detailedDescription:
        "Begin your matrimony journey with zero hassle. Fill in essential details including your profile creator role (Self, Parent, Sibling), Sindhi sub-caste (Amil, Bhaibhand, Sahiti, Shikarpuri, etc.), educational background, ancestral roots, and what you seek in an ideal life companion.",
      icon: "UserPlus",
      badge: "Free & Fast (2 Mins)",
      order: 1,
      highlights: [
        "100% Free registration with mobile OTP",
        "Granular Sindhi sub-caste and gotra options",
        "Configurable privacy settings for photos & contact details",
      ],
      tips: [
        "Add at least 3 high-quality recent photos to get 5x more responses.",
        "Write a genuine 'About Me' mentioning family values and hobbies.",
      ],
    },
    {
      stepNumber: 2,
      stepKey: "VERIFY",
      title: "Document & Mobile Screening",
      shortDescription:
        "Multi-tier verification guarantees only genuine, authentic Sindhi profiles with verified badges.",
      detailedDescription:
        "Safety and trust are our cornerstone. Every member undergoes mandatory phone OTP verification and optional Government ID verification (Aadhaar, Passport, Driving License, or Voter ID). Our screening algorithm and manual moderation team inspect photos and details before awarding the trusted Blue Shield verification badge.",
      icon: "ShieldCheck",
      badge: "100% Verified Profiles",
      order: 2,
      highlights: [
        "Two-factor OTP authentication on mobile and email",
        "Government ID verification for trusted profile badge",
        "Human and AI moderation filters out fake or spam entries",
      ],
      tips: [
        "Upload a clear Govt ID to receive the 'Verified Sindhi Profile' shield.",
        "Verified profiles appear at the top in partner recommendations.",
      ],
    },
    {
      stepNumber: 3,
      stepKey: "MATCH",
      title: "Discover Compatible Matches",
      shortDescription:
        "Intelligent matchmaking algorithm tailored to Sindhi cultural values, horoscope, and modern lifestyles.",
      detailedDescription:
        "Browse thousands of verified Sindhi brides and grooms. Use precision filters for sub-caste, city, country (India, UAE, USA, Canada, Singapore), education (Engineers, Doctors, CA, Entrepreneurs), and optional Kundali / Guna Milan matching to identify your most compatible prospects.",
      icon: "Sparkles",
      badge: "AI & Tradition Powered",
      order: 3,
      highlights: [
        "Daily personalized recommendations delivered to your dashboard",
        "Advanced community filters: Gotra, Sub-caste, City, Diet & Habits",
        "Automatic Kundali & Horoscope compatibility calculations",
      ],
      tips: [
        "Save your searches and set up daily instant match alerts on WhatsApp.",
        "Filter by NRI or local city matches depending on relocation preference.",
      ],
    },
    {
      stepNumber: 4,
      stepKey: "CONNECT",
      title: "Connect, Chat & Involve Families",
      shortDescription:
        "Express interest, initiate safe in-app conversations, and arrange family meetings with confidence.",
      detailedDescription:
        "Take the next step with complete comfort. Send complimentary personalized interests. Unlock direct phone numbers, initiate encrypted in-app messaging, or request a voice/video consultation. When both sides are aligned, arrange comfortable family meetings to take the sacred Vivah forward.",
      icon: "HeartHandshake",
      badge: "Secure Communication",
      order: 4,
      highlights: [
        "Instant 'Express Interest' with custom greeting messages",
        "End-to-end encrypted in-app messaging with photo protection",
        "Personalized Relationship Manager assistance for premium members",
      ],
      tips: [
        "Initiate conversations by expressing appreciation for shared cultural roots.",
        "Our customer support team is always available to facilitate introductions.",
      ],
    },
  ],
  featurePillars: [
    {
      title: "Exclusive Sindhi Network",
      description:
        "Focusing purely on the global Sindhi community ensures cultural affinity, shared culinary tastes, and familiar festive celebrations (Cheti Chand, Thadri, Teej).",
      icon: "Users2",
      badge: "Community First",
    },
    {
      title: "Ironclad Privacy Protection",
      description:
        "You control who views your contact numbers and photos. Blur photo options, phone number masking, and watermark safeguards keep your privacy intact.",
      icon: "Lock",
      badge: "Strict Privacy",
    },
    {
      title: "Relationship Manager Support",
      description:
        "Dedicated matchmaking executives assist busy professionals and families by hand-picking matches and coordinating meetings.",
      icon: "Headset",
      badge: "Personalized Care",
    },
    {
      title: "Transparent & Affordable",
      description:
        "Zero hidden fees. Clear subscription plans with verified contact views, unlimited messaging, and round-the-clock customer support.",
      icon: "BadgeCheck",
      badge: "Honest Pricing",
    },
  ],
  stats: [
    {
      label: "Active Sindhi Profiles",
      value: "50,000",
      suffix: "+",
      description: "Verified singles & families across India & abroad",
    },
    {
      label: "Happy Sindhi Marriages",
      value: "10,000",
      suffix: "+",
      description: "Successful matches united across 15+ countries",
    },
    {
      label: "Identity Verification Rate",
      value: "99.2",
      suffix: "%",
      description: "High integrity profiles verified via phone & ID",
    },
    {
      label: "Community Reach",
      value: "25",
      suffix: "+",
      description: "Sindhi sub-castes and diaspora cities connected",
    },
  ],
  faqs: [
    {
      question: "Is registration free on Sindhi Matrimony?",
      answer:
        "Yes, registration and creating your profile is 100% free. You can add photos, specify sub-caste, gotra, and browse compatible matches without paying anything.",
    },
    {
      question: "How long does profile verification take?",
      answer:
        "Mobile OTP verification is instant. Document and photo moderation are completed within 1 to 4 business hours by our verification team.",
    },
    {
      question: "Can parents or siblings manage the matrimonial profile?",
      answer:
        "Yes! During registration you can select 'Profile Created By: Parent / Sibling / Relative'. Both self-managed and family-managed profiles are welcomed and clearly tagged.",
    },
    {
      question: "Are my contact number and photos safe from strangers?",
      answer:
        "Absolutely. You have complete control over who can view your phone number and full photos. You can set them to 'Visible to All', 'Only to Accepted Interests', or 'Hidden'.",
    },
  ],
  cta: {
    title: "Find Your Life Partner Within the Sindhi Community",
    subtitle:
      "Join thousands of verified Sindhi brides, grooms, and parents actively seeking matches.",
    buttonText: "Register Free Now",
    buttonLink: "/#quick-register",
  },
};

export default DEFAULT_OUR_PROCESS;
