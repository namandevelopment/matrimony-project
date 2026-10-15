import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertOctagon,
  Users,
  Eye,
  CreditCard,
  MapPin,
  FileCheck,
  PhoneCall,
  Scale,
  Flag,
} from "lucide-react";
import {
  QuickRule,
  SafetySection,
  SafetyMetaInfo,
  EmergencyContact,
  SafetyFAQ,
} from "../types";

export const SAFETY_META: SafetyMetaInfo = {
  lastUpdatedDate: "October 14, 2026",
  effectiveDate: "January 1, 2026",
  targetAudience: "Brides, Grooms, Parents & Guardians",
  helplineNumber: "1930 (National Cyber Crime) / 1800-419-6287",
  trustEmail: "safety@sindhimatrimony.com",
};

export const SAFETY_QUICK_RULES: readonly QuickRule[] = [
  {
    id: "rule-no-money",
    title: "Zero Money Transfer Policy",
    description:
      "Never transfer funds, wire money, or share bank account, UPI PINs, or OTPs with any match, regardless of the emergency or emotional plea.",
    badge: "Most Critical Rule",
    type: "danger",
  },
  {
    id: "rule-chat-platform",
    title: "Chat on Platform First",
    description:
      "Use SindhiMatrimony's secure in-app messaging and secure calls before sharing personal phone numbers or moving to unmonitored messaging apps.",
    badge: "Identity Defense",
    type: "warning",
  },
  {
    id: "rule-public-meetings",
    title: "Meet in Safe Public Spaces",
    description:
      "Always schedule initial meetings during daytime at crowded public spots (cafes, restaurants). Arrange your own transport and inform parents.",
    badge: "Personal Security",
    type: "shield",
  },
  {
    id: "rule-family-involvement",
    title: "Involve Families & References",
    description:
      "Matrimonial alliances thrive on mutual family verification. Always verify workplace credentials, family background, and community references.",
    badge: "Community Trust",
    type: "shield",
  },
];

export const SAFETY_SECTIONS: readonly SafetySection[] = [
  {
    id: "financial-safety",
    number: "1",
    title: "Financial Security & Fraud Prevention (Never Send Money)",
    badge: "Zero Tolerance",
    summary:
      "Financial requests in online matchmaking are the primary indicator of fraud. SindhiMatrimony members must adhere strictly to our zero-money transfer rule.",
    dos: [
      "Keep all initial communication focused strictly on matrimonial values, family background, and lifestyle expectations.",
      "Decline immediately and notify our Trust & Safety team if someone asks for financial assistance, loans, medical bill support, or travel money.",
      "Report any individual claiming to be an NRI who requests money to clear 'customs duty' for an expensive gift or jewelry sent to India.",
      "Remember that official SindhiMatrimony executives will never request payments into personal UPI or bank accounts.",
    ],
    donts: [
      "NEVER share your UPI ID, OTP, credit card CVV, bank passwords, or Net Banking credentials with anyone.",
      "Do NOT invest money in crypto schemes, forex trading, or business partnerships recommended by a prospective match.",
      "Do NOT accept financial cheques, courier receipts, or foreign draft copies as collateral or proof of authenticity.",
      "Never pay on behalf of someone claiming to be stuck at the airport, customs department, or hospital.",
    ],
    redFlags: [
      "Claims of sudden medical emergency, lost wallet, or frozen bank accounts in a foreign country.",
      "Offers to send expensive gold jewellery, iPhones, or foreign currency packages that require 'customs tax clearance'.",
      "Pressure to make swift transfers through Western Union, MoneyGram, or cryptocurrency wallets.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          The safety and financial well-being of our members is our highest priority. Genuine matrimonial prospects will never request money, loans, or financial favors from you or your family. Any request for money—regardless of how convincing or heart-wrenching the narrative—is a confirmed indicator of malicious fraudulent intent.
        </p>
        <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-[#DB2F3C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-900 block mb-1">
                The &quot;Customs Gift / Airport Emergency&quot; Scam Alert:
              </strong>
              A prevalent scam involves fraudsters pretending to be high-earning NRIs based in the UK, USA, Canada, or Gulf. They claim to have sent precious gifts or arrived at Delhi/Mumbai airport, followed by a fake call from a supposed &quot;customs officer&quot; demanding duty fees. <strong>This is 100% fraudulent.</strong> Neither Indian Customs nor SindhiMatrimony operates in this manner.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "communication-safety",
    number: "2",
    title: "Safe Online Communication & Digital Privacy",
    badge: "Platform Security",
    summary:
      "Protect your personal perimeter by using platform features and pacing your interactions before sharing sensitive contact details.",
    dos: [
      "Communicate via SindhiMatrimony chat and voice calling features until mutual comfort and initial background checks are established.",
      "Conduct video calls (using our secure interface or agreed tools) to verify that the person matches their uploaded profile photographs.",
      "Pay attention to consistency in biographical facts (age, education, employment, family residence).",
      "Take your time to understand the person’s character, values, and family outlook without feeling pressured to rush.",
    ],
    donts: [
      "Do NOT share your private residential street address, office floor details, or personal Aadhaar/Passport numbers upfront.",
      "Do NOT succumb to pressure to move conversations to WhatsApp, Telegram, or private email within minutes of connecting.",
      "Do NOT share intimate, compromising, or private photographs or video clips with anyone.",
      "Avoid clicking on suspicious external website links, downloadable attachments, or software APK files sent in chats.",
    ],
    redFlags: [
      "Refusal or repeated excuses for avoiding live video calls (claiming broken camera, bad connection, or military base restrictions).",
      "Overwhelming declarations of undying love or obsession within days ('love bombing') before knowing each other.",
      "Contradictions between their profile bio-data and their spoken answers regarding their qualification or caste.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          SindhiMatrimony provides high-grade privacy tools, including phone number masking, photo protection, and filtered communication. We urge you to take full advantage of these built-in safeguards before moving communication off-platform.
        </p>
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 block mb-1">Video Call Verification Rule:</strong>
              Before deciding to meet in person or involving family elders, insist on at least 1-2 live video conversations. If the person repeatedly declines video calls while requesting phone calls or texts, treat this as a serious warning sign.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "in-person-meetings",
    number: "3",
    title: "In-Person Meeting Protocol & Venue Selection",
    badge: "Physical Safety",
    summary:
      "Meeting your prospective life partner is an exciting milestone. Ensure it remains safe, transparent, and respectful by observing these proven protocols.",
    dos: [
      "Always select a well-lit, busy, public location such as a reputed cafe, popular restaurant, or prominent shopping mall.",
      "Schedule meetings during daytime or early evening hours rather than late nights.",
      "Inform a parent, sibling, or close friend about the meeting details, including venue name, scheduled time, and match’s contact number.",
      "Arrange your own independent transportation to and from the meeting venue (your own vehicle, taxi app, or family drop).",
      "Keep your smartphone charged and share your live location with a trusted family member throughout the meeting.",
    ],
    donts: [
      "NEVER agree to meet at a hotel room, private residence, secluded park, farmhouse, or isolated outskirts on the first few visits.",
      "Do NOT accept offers to be picked up from your home or dropped off in the match’s personal car for an initial meeting.",
      "Do NOT leave your beverages or food unattended at any time during the conversation.",
      "Never consume alcoholic beverages or substances if you feel uncomfortable or uncertain about the environment.",
    ],
    redFlags: [
      "Insistence on changing the venue at the last moment to an isolated spot or private apartment.",
      "Hostility or anger when you mention that your parents or siblings know about the meeting.",
      "Inappropriate physical contact or crossing personal boundaries during the first interaction.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Physical safety is paramount. In traditional Sindhi matchmaking, meetings frequently take place with the presence of parents, uncles, or trusted family members. We strongly endorse this practice, as it provides natural security and allows both families to connect respectfully.
        </p>
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 block mb-1">The Public Venue Guarantee:</strong>
              If a match insists that meeting in a public cafe is &quot;too crowded&quot; or insists on a private secluded space, stand firm. A genuine person seeking marriage will always respect your safety boundaries and public meeting choices.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "background-verification",
    number: "4",
    title: "Family Due Diligence & Community Background Checks",
    badge: "Trust Verification",
    summary:
      "Independent verification of professional, educational, and familial credentials is an essential pillar of a successful matrimonial alliance.",
    dos: [
      "Verify the match’s employment details by cross-checking LinkedIn, official corporate directories, or company websites.",
      "Leverage the strong, interconnected Sindhi community network (Panchayats, community elders, mutual acquaintances, or business networks).",
      "Request verified government identification (such as Aadhaar, Passport, or Driving License) before formalizing engagement talks.",
      "Visit the family’s residence and invite them to your home to understand family dynamics, lifestyle, and traditions.",
    ],
    donts: [
      "Do NOT rely solely on self-declared profile descriptions or verbal claims of wealth, property, or executive titles.",
      "Do NOT hesitate to conduct a discreet professional background check or matrimonial verification agency check if doubts arise.",
      "Do NOT ignore gut feelings or dismiss concerns raised by your parents or elders.",
      "Never proceed to an engagement without verifying marital status (single, legally divorced with decree, or widowed).",
    ],
    redFlags: [
      "Reluctance to share parental phone numbers or reluctance to introduce you to their parents and siblings.",
      "Evasiveness when asked for residential proof, company ID card, or divorce decree documentation.",
      "Stories of estrangement from all family members without credible explanation.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          While SindhiMatrimony enforces algorithmic profile moderation and mobile number verification, online verification cannot substitute for thorough personal due diligence. In the Sindhi community, family values, reputable references, and mutual transparency are celebrated cornerstones of marriage.
        </p>
        <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#DB2F3C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-1">Marital Status Verification:</strong>
              If a match states they are divorced or widowed, respectfully request to verify the official court Divorce Decree or Spouse Death Certificate before solemnizing any alliance. Legitimate individuals will welcome this transparency.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "photo-privacy",
    number: "5",
    title: "Photo Privacy, Media Protection & Blackmail Prevention",
    badge: "Cyber Defense",
    summary:
      "Guard your visual identity and photos against unauthorized misuse, morphing, and extortion through our proactive privacy controls.",
    dos: [
      "Use SindhiMatrimony's 'Photo Privacy' settings (e.g., 'Visible Only to Accepted Matches' or 'Blur Photo' with password access).",
      "Upload authentic, recent photos that represent your true appearance without revealing house numbers, car license plates, or luxury assets.",
      "Keep copies of any abusive or threatening messages as digital screenshots for legal documentation.",
    ],
    donts: [
      "NEVER send revealing, intimate, or compromising photographs or videos under any emotional pressure or promise of marriage.",
      "Do NOT upload photos containing other minors or family members without their permission.",
      "Do NOT share links to your private personal Instagram or cloud photo storage with unverified profiles.",
    ],
    redFlags: [
      "Demands for intimate photographs or video calls late at night as 'proof of love' or commitment.",
      "Threats to share your conversations or pictures with family if you cease talking to them (sextortion/blackmail).",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Sextortion and photo morphing are serious cyber crimes. Under Section 66E, 67, and 67A of the Information Technology Act, 2000, sending or threatening to circulate private media carries severe criminal imprisonment and non-bailable penalties.
        </p>
        <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#DB2F3C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-900 block mb-1">What to do in case of Extortion or Blackmail:</strong>
              If anyone threatens to leak your photos or calls, <strong>do not panic and NEVER pay money.</strong> Paying only escalates extortion. Immediately take screenshots, block the caller, report them on SindhiMatrimony, and register a complaint on <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-bold text-red-900">cybercrime.gov.in</a> or dial <strong>1930</strong>.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "red-flags-checklist",
    number: "6",
    title: "Scammer Red Flags & Behavioral Warning Signs",
    badge: "Detection Checklist",
    summary:
      "Learn to spot the tactical manipulation patterns commonly used by matrimonial imposters, romance scammers, and commercial opportunists.",
    dos: [
      "Trust your intuition. If something sounds too good to be true (e.g., billionaire lifestyle, multi-national property with zero social footprint), question it.",
      "Check whether their written language style matches their declared educational level and professional background.",
      "Report profiles that express interest in multiple members simultaneously using identical copy-pasted introductory messages.",
    ],
    donts: [
      "Do NOT ignore inconsistencies in their age, marital status, or educational degrees.",
      "Do NOT overlook aggressive behavior, jealousy, or control tactics displayed early in the courtship.",
      "Do NOT engage with members who exhibit disrespect towards women, dowry greed, or disdain for Indian marriage laws.",
    ],
    redFlags: [
      "The 'Prince Charming' trope: Picture-perfect photos, ultra-wealthy NRI narrative, lavish lifestyle claims, yet always has a reason to delay meeting your parents.",
      "Emotional manipulation: Guilt-tripping you for wanting to verify facts or accusing you of 'lacking faith in true love'.",
      "Soliciting investments: Asking you to buy cryptocurrency, download questionable trading apps, or invest in real estate projects.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Fraudsters frequently count on emotional vulnerability and matrimonial urgency to bypass rational scrutiny. By staying grounded, keeping your family in the loop, and cross-referencing claims, you eliminate more than 99% of potential scams.
        </p>
      </div>
    ),
  },
  {
    id: "reporting-helpline",
    number: "7",
    title: "Reporting Suspicious Profiles & Cyber Crime Escalation",
    badge: "Instant Action",
    summary:
      "We operate a zero-tolerance policy against fraudulent behavior. Use our built-in reporting tools or reach out to law enforcement authorities.",
    dos: [
      "Click the 'Report Member' or 'Block Profile' button on any suspicious profile immediately.",
      "Provide detailed context, screenshots, and specific reasons when reporting a profile to help our moderation team act swiftly.",
      "Report matrimonial fraud or financial extortion to the National Cyber Crime Portal at cybercrime.gov.in or dial 1930.",
      "Report dowry demands or matrimonial harassment to the National Commission for Women (NCW) or local police authorities.",
    ],
    donts: [
      "Do NOT engage in arguments, retaliatory threats, or verbal abuse with a suspected scammer.",
      "Do NOT delete chat history or call logs before submitting evidence to the safety team and police.",
    ],
    redFlags: [
      "Profiles that attempt to create multiple duplicate accounts after being previously suspended or flagged.",
    ],
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Our specialized Trust &amp; Safety Operations team reviews reported accounts 24 hours a day, 7 days a week. Upon receiving a report with prima facie evidence of fraud or financial demands, the reported profile is instantly suspended and blacklisted across the Matrimony.com network.
        </p>
        <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-1">Legal Prosecution Under Indian Law:</strong>
              Impersonation and cheating in matrimonial portals are punishable under <strong>Section 419, 420 of the Indian Penal Code (IPC)</strong> and <strong>Section 66D of the Information Technology Act, 2000</strong> (imprisonment up to 3 years and heavy fines). We actively cooperate with Indian law enforcement agencies to assist in criminal prosecutions.
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const SAFETY_FAQS: readonly SafetyFAQ[] = [
  {
    question: "What should I do if a match asks me for money or financial help?",
    answer:
      "Never send money under any circumstances, regardless of the emergency claimed (medical, customs clearance, travel fees, or business loss). Decline immediately, take screenshots of the conversation, block the profile, and report the member using our 'Report Profile' button or email safety@sindhimatrimony.com.",
  },
  {
    question: "How does SindhiMatrimony ensure the safety of member profiles?",
    answer:
      "We enforce 100% mobile number OTP verification, automated photo screening for decency and duplication, AI-based scam pattern detection, and optional government ID verification. Members can also enable photo privacy settings to control who views their photos.",
  },
  {
    question: "Is it safe to meet someone from SindhiMatrimony in person?",
    answer:
      "Yes, when following basic safety protocols: always meet in a crowded public venue (cafe or restaurant) during daylight hours, arrange your own transportation, inform family members about your whereabouts, and preferably bring a family member along for the initial introduction.",
  },
  {
    question: "What are the common warning signs of a fake or scammer profile?",
    answer:
      "Common red flags include refusing live video calls, rushing to declare love, claiming to be an ultra-wealthy NRI stuck in customs duty emergencies, inconsistent biographical details, asking to move conversations to Telegram, and requesting money or investments.",
  },
  {
    question: "Where can I report matrimonial cyber fraud in India?",
    answer:
      "You can file a formal complaint on the Government of India's National Cyber Crime Reporting Portal at cybercrime.gov.in or call the National Cyber Crime Toll-Free Helpline at 1930. You should also report the profile to safety@sindhimatrimony.com.",
  },
  {
    question: "How can I protect my photographs and contact number on the platform?",
    answer:
      "You can use our Privacy Settings in your account dashboard. You can choose to show your photo only to members you express interest in or accept, blur your photo with request access, and use our secure in-app calling feature to speak without disclosing your personal phone number.",
  },
];

export const EMERGENCY_CONTACTS: readonly EmergencyContact[] = [
  {
    title: "National Cyber Crime Helpline",
    numberOrEmail: "1930",
    description: "Government of India 24x7 toll-free helpline for financial fraud and cyber extortion.",
    badge: "Govt Helpline",
    actionUrl: "tel:1930",
    actionLabel: "Call 1930",
  },
  {
    title: "SindhiMatrimony Trust & Safety",
    numberOrEmail: "safety@sindhimatrimony.com",
    description: "Dedicated escalation desk for immediate profile investigation and fraud prevention.",
    badge: "Official Team",
    actionUrl: "mailto:safety@sindhimatrimony.com",
    actionLabel: "Email Safety Team",
  },
  {
    title: "National Cyber Crime Portal",
    numberOrEmail: "cybercrime.gov.in",
    description: "Official portal to file online cyber complaints and register formal FIR evidence.",
    badge: "Official Portal",
    actionUrl: "https://cybercrime.gov.in",
    actionLabel: "Visit Portal",
  },
  {
    title: "Women's Emergency Helpline",
    numberOrEmail: "1091",
    description: "24-hour emergency police helpline for women safety, harassment, and security.",
    badge: "Women Safety",
    actionUrl: "tel:1091",
    actionLabel: "Call 1091",
  },
];
