import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Phone,
  KeyRound,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PolicySection, PolicyMetaInfo } from "../types";

export const PRIVACY_META: PolicyMetaInfo = {
  lastUpdatedDate: "October 14, 2026",
  effectiveDate: "January 1, 2026",
  complianceStandard: "DPDP Act 2023 & IT Act 2000",
  securityStandard: "256-Bit SSL Encryption",
};

export const PRIVACY_SECTIONS: readonly PolicySection[] = [
  {
    id: "overview",
    number: "1",
    title: "Introduction & Commitment to Privacy",
    badge: "DPDP Act, 2023 Compliant",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          At <strong>SindhiMatrimony.com</strong> (&quot;Platform&quot;, &quot;Website&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;), operated by <strong>Matrimony.com Group</strong>, we understand that searching for a life partner requires sharing sensitive personal, familial, and astrological information. Protecting your privacy and personal data is our foundational commitment.
        </p>
        <p className="text-stone-700 leading-relaxed">
          This <strong>Privacy Policy</strong> details how we collect, process, store, disclose, and protect your personal information in strict accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and international data security standards.
        </p>
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-1">Our Privacy Pledge:</strong>
              We never sell, rent, barter, or trade your contact details, personal photos, or matrimonial records to third-party telemarketers or advertisers under any circumstances.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "information-collected",
    number: "2",
    title: "Information We Collect",
    badge: "Transparent Data Practices",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          To provide precise Sindhi community matchmaking and ensure verified authentic profiles, we collect the following categories of information:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-stone-700">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-semibold text-stone-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#DB2F3C]" />
              Personal &amp; Identity Data
            </div>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>Full Name, Gender, Date of Birth, Marital Status</li>
              <li>Community &amp; Sub-caste (Bhaiband, Amil, Sahiti, Lohana, Larkana, etc.)</li>
              <li>Mother Tongue, Native Place, Citizenship</li>
              <li>Government Photo ID for verification badge (Aadhaar, Passport, Voter ID)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-semibold text-stone-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#DB2F3C]" />
              Horoscope &amp; Background Data
            </div>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>Time &amp; Place of Birth, Nakshatra, Raasi, Manglik status for Kundali matching</li>
              <li>Highest Education, Institution, Profession, Annual Income range</li>
              <li>Family values, parents&apos; occupation, siblings&apos; details</li>
              <li>Partner preferences (age, height, community, location)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-semibold text-stone-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#DB2F3C]" />
              Contact &amp; Verification Details
            </div>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>Mobile number verified via SMS OTP</li>
              <li>Email address for secure communications and receipts</li>
              <li>Current residential address and city of residence</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="font-semibold text-stone-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#DB2F3C]" />
              Technical &amp; Usage Telemetry
            </div>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>IP address, browser type, device identifiers, and OS version</li>
              <li>Platform activity logs (search queries, matches viewed, interests sent)</li>
              <li>Cookies and session tokens for secure authentication</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "how-we-use-data",
    number: "3",
    title: "How We Use Your Personal Information",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Your data is utilized solely for genuine matrimonial purposes and platform security:
        </p>
        <ul className="space-y-2.5 text-sm text-stone-700">
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Matchmaking &amp; Recommendations:</strong> Delivering compatible Sindhi bride and groom profiles based on community sub-caste, education, family values, and astrological Kundali Guna Milan.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Member Authenticity &amp; Verification:</strong> Validating contact numbers, detecting duplicate accounts, verifying government credentials, and issuing Trust badges.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Secure Member Communication:</strong> Facilitating mutual express interest requests, protected chat messaging, and controlled contact number disclosures.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Fraud Detection &amp; Safety:</strong> Monitoring suspicious behavior, detecting financial scams or fake accounts, and upholding our zero-tolerance policy against dowry and harassment.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "privacy-controls",
    number: "4",
    title: "Your Privacy Controls & Shield Settings",
    badge: "Granular Member Controls",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          We empower you with comprehensive privacy toggles directly accessible under <code>Account Settings &gt; Privacy Settings</code>:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <Eye className="w-5 h-5 text-[#DB2F3C]" />
            <h4 className="font-semibold text-stone-900 text-sm">Photo Privacy</h4>
            <p className="text-stone-600 leading-relaxed">
              Choose to keep your photographs <strong>Visible to All</strong>, <strong>Visible Only to Members I Contact</strong>, or <strong>Protected by Password</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <Phone className="w-5 h-5 text-[#DB2F3C]" />
            <h4 className="font-semibold text-stone-900 text-sm">Phone Masking</h4>
            <p className="text-stone-600 leading-relaxed">
              Hide your personal mobile number and utilize our secure in-app calling or require mutual verification before revealing your direct contact details.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <KeyRound className="w-5 h-5 text-[#DB2F3C]" />
            <h4 className="font-semibold text-stone-900 text-sm">Kundali / Horoscope</h4>
            <p className="text-stone-600 leading-relaxed">
              Choose whether your complete birth time and astro chart are publicly visible or shared solely with compatible matches on request.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "sharing-disclosure",
    number: "5",
    title: "Data Sharing & Third-Party Disclosures",
    content: (
      <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <p>
          We strictly limit data disclosure to essential operational scenarios described below:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
          <li>
            <strong>1. Prospective Matches:</strong> Other registered members can view the public profile attributes (bio, preferences, education, profession) that you choose to display.
          </li>
          <li>
            <strong>2. Payment Gateways:</strong> While purchasing premium memberships, transaction data is transmitted directly to RBI-authorized payment processors (e.g., Razorpay, CCAvenue). We do not store complete credit card or debit card CVV/PIN credentials.
          </li>
          <li>
            <strong>3. Cloud &amp; SMS Infrastructure:</strong> Encrypted data transmission via trusted cloud service providers (AWS, Google Cloud) and certified SMS gateways (for OTP delivery).
          </li>
          <li>
            <strong>4. Law Enforcement &amp; Legal Mandates:</strong> We may disclose user information when mandated by a valid court order, warrant, or official directive from recognized law enforcement agencies investigating crime or fraud under Indian statutes.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-security",
    number: "6",
    title: "Data Security & Encryption Safeguards",
    badge: "ISO 27001 & 256-Bit SSL",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          We enforce industry-standard technical and organizational security measures to protect your sensitive personal data from unauthorized access, alteration, disclosure, or destruction:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>End-to-End In-Transit Encryption:</strong> All data transferred between your browser and our servers is encrypted using TLS 1.3 / 256-bit SSL protocols.
            </span>
          </div>
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-2.5">
            <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Encryption at Rest:</strong> Sensitive data such as passwords, Aadhaar numbers, and payment tokens are stored in hashed or AES-256 encrypted database vaults.
            </span>
          </div>
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Role-Based Access Controls:</strong> Only authorized compliance personnel have monitored access to ID verification documents.
            </span>
          </div>
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Regular Vulnerability Audits:</strong> Periodic penetration testing and security audits to patch vulnerabilities and prevent cyber attacks.
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "data-retention-deletion",
    number: "7",
    title: "Data Retention & Right to Erasure",
    badge: "Right to be Forgotten",
    content: (
      <div className="space-y-4 text-sm text-stone-700">
        <p className="leading-relaxed">
          In compliance with the DPDP Act, 2023, you possess the autonomous right to request access, correction, or permanent erasure of your personal records:
        </p>
        <div className="p-4 bg-stone-100/80 rounded-xl space-y-2 text-xs sm:text-sm">
          <h4 className="font-semibold text-stone-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#DB2F3C]" />
            Account Deletion Process:
          </h4>
          <p className="text-stone-600 leading-relaxed">
            When you find your match or choose to discontinue, you can permanently delete your account via <code>Settings &gt; Delete Profile</code> or by emailing <code>privacy@sindhimatrimony.com</code>.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Upon account deletion, your profile, photographs, and contact information are removed from search results immediately and purged from production databases within <strong>30 days</strong>, retaining only financial transaction logs required under Indian taxation and accounting statutes.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "cookies-tracking",
    number: "8",
    title: "Cookies & Tracking Technologies",
    content: (
      <div className="space-y-3 text-stone-700 text-sm">
        <p className="leading-relaxed">
          We use essential session cookies to remember your authenticated login state, security cookies to thwart CSRF attacks, and analytical cookies to analyze aggregated traffic trends and improve user experience.
        </p>
        <p className="leading-relaxed text-xs sm:text-sm text-stone-600">
          You may disable non-essential cookies via your web browser settings; however, disabling certain cookies may impact core functionalities such as remaining logged in across sessions.
        </p>
      </div>
    ),
  },
  {
    id: "dpo-contact",
    number: "9",
    title: "Data Protection Officer & Grievance Contact",
    badge: "Statutory Officer",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed text-sm">
          If you have questions, concerns, or grievances concerning your data privacy or wish to exercise your rights under the DPDP Act, 2023, please contact our designated <strong>Data Protection Officer (DPO)</strong>:
        </p>
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Designated Privacy Officer</div>
            <div className="font-bold text-stone-900 text-base">Mr. Rajiv Advani</div>
            <div className="text-xs text-stone-600">Data Protection Officer &amp; Compliance Head</div>
            <div className="text-xs text-stone-600">SindhiMatrimony.com / Matrimony.com Group</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Direct Coordinates</div>
            <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm">
              <Mail className="w-4 h-4 text-[#DB2F3C]" />
              <a href="mailto:privacy@sindhimatrimony.com" className="text-[#DB2F3C] hover:underline font-medium">
                privacy@sindhimatrimony.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-stone-500" />
              <span>+91-9876543210 (Mon–Fri, 10 AM – 6 PM IST)</span>
            </div>
            <div className="text-xs text-stone-500 leading-relaxed pt-1">
              Office: Sindhi Society, Chembur, Mumbai, Maharashtra 400071, India.
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-600">
          Privacy requests are formally acknowledged within <strong>24 hours</strong> and addressed within <strong>15 business days</strong>.
        </p>
      </div>
    ),
  },
];
