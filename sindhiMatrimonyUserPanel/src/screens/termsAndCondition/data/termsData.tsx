import React from "react";
import Link from "next/link";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { TermsSection, TermsMetaInfo } from "../types";

export const TERMS_META: TermsMetaInfo = {
  lastUpdatedDate: "October 14, 2026",
  effectiveDate: "January 1, 2026",
  targetAudience: "All Registered Members & Visitors",
};

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "acceptance",
    number: "1",
    title: "Acceptance of Terms & User Agreement",
    badge: "Binding Agreement",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Welcome to <strong>SindhiMatrimony.com</strong> (&quot;Platform&quot;, &quot;Website&quot;, &quot;App&quot;), an exclusive matrimonial matchmaking service owned and operated by <strong>Matrimony.com Group</strong> (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;).
        </p>
        <p className="text-stone-700 leading-relaxed">
          By accessing, browsing, registering on, or using this Platform, you (&quot;User&quot;, &quot;Member&quot;, &quot;You&quot;) unconditionally agree to be bound by these <strong>Terms &amp; Conditions</strong>, together with our <strong>Privacy Policy</strong>, <strong>Safety Guidelines</strong>, and <strong>Community Standards</strong>. If you do not agree with any provision of this Agreement, you must immediately cease accessing or using our services.
        </p>
        <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-xl text-stone-800 text-sm">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-[#DB2F3C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-1">Intermediary Status Disclosure:</strong>
              SindhiMatrimony operates as an electronic intermediary under Section 79 of the Information Technology Act, 2000. We provide an online matchmaking facilitation platform for the global Sindhi community to connect for matrimonial alliances. We do not arrange marriages directly nor guarantee alliances.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "eligibility",
    number: "2",
    title: "Membership Eligibility & Legal Capacity",
    badge: "Mandatory Criteria",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          Membership on SindhiMatrimony is strictly restricted to individuals seeking lawful marriage alliances for themselves or on behalf of their children, siblings, or wards with their explicit consent.
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm text-stone-700 pt-1">
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Minimum Marriage Age:</strong> At least <strong>21 years</strong> for males and <strong>18 years</strong> for females as per Indian law.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Marital Status:</strong> Unmarried, legally divorced, or widowed individuals possessing full legal capacity to remarry.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Solely Matrimonial Purpose:</strong> Absolute prohibition of dating, casual hookups, commercial sex work, or advertising.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Sindhi Heritage:</strong> Primary platform focus tailored for the worldwide Sindhi community (Bhaiband, Amil, Sahiti, Lohana, Larkana, and associated sub-castes).
            </span>
          </li>
        </ul>
        <p className="text-stone-600 text-xs italic">
          Note: We reserve the right to demand official government photo identification (such as Aadhaar, Passport, Voter ID, or Driving License) to verify age and marital eligibility at any time.
        </p>
      </div>
    ),
  },
  {
    id: "account-registration",
    number: "3",
    title: "Account Registration & Security",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          During registration, you agree to provide true, accurate, current, and complete details regarding your personal identity, education, profession, family background, and horoscope/kundali data.
        </p>
        <div className="space-y-2 text-sm text-stone-700">
          <p>
            <strong>1. Single Profile Rule:</strong> Each individual user is entitled to maintain only one active matrimonial profile on SindhiMatrimony. Duplicate profiles or impersonations will be suspended immediately without refund.
          </p>
          <p>
            <strong>2. Mobile &amp; OTP Verification:</strong> Registration requires successful authentication via a valid mobile phone number and one-time password (OTP).
          </p>
          <p>
            <strong>3. Credential Confidentiality:</strong> You are strictly responsible for maintaining the confidentiality of your login credentials (password, mobile OTP). Any activity conducted through your authenticated account is presumed to be authorized by you.
          </p>
          <p>
            <strong>4. Prompt Notification:</strong> You must immediately report any suspected unauthorized access, security breach, or compromised account to <code>security@sindhimatrimony.com</code>.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "member-conduct",
    number: "4",
    title: "Member Code of Conduct & Etiquette",
    badge: "Zero Tolerance",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          SindhiMatrimony is built upon trust, dignity, and cultural mutual respect. All communications via messages, chat, calls, or video invites must remain polite, decorous, and matrimonial in intent.
        </p>
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-sm text-stone-800">
          <h4 className="font-semibold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Strictly Prohibited Actions on the Platform:
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-stone-700">
            <li>Requesting money, loans, gifts, travel reimbursements, or financial favors from any member under any pretext.</li>
            <li>Sending offensive, sexually explicit, abusive, vulgar, defamatory, or threatening communications.</li>
            <li>Uploading photos containing watermarks, copyright infringements, group photographs without consent, or non-human avatars.</li>
            <li>Harassing or stalking members who have declined your interest or express lack of reciprocity.</li>
            <li>Collecting personal contact numbers or emails for commercial, marketing, spam, or phishing campaigns.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "dowry-prohibition",
    number: "5",
    title: "Strict Dowry Prohibition & Legal Compliance",
    badge: "Dowry Prohibition Act, 1961",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          SindhiMatrimony strictly abides by the <strong>Dowry Prohibition Act, 1961</strong> and laws of India.
        </p>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-stone-800 space-y-2">
          <p className="font-semibold text-red-900">Absolute Zero Tolerance Notice:</p>
          <p className="leading-relaxed">
            Demanding, giving, taking, or abetting the giving or taking of dowry, or demanding direct or indirect dowry from the bride, groom, or their respective families is a criminal offense under Indian penal laws.
          </p>
          <p className="leading-relaxed">
            Any member found using this platform to negotiate, demand, or solicit dowry will face instantaneous account termination, permanent IP banning, and reporting to relevant cyber and law enforcement authorities.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "packages-refunds",
    number: "6",
    title: "Subscription Plans, Payments & Refund Policy",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          SindhiMatrimony provides both free basic membership and premium paid subscription packages (such as Gold, Diamond, and Assisted Matchmaking).
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-stone-700">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="font-semibold text-stone-900 mb-2">Paid Membership Features</h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>• View verified phone numbers &amp; WhatsApp contacts</li>
              <li>• Send personalized messages &amp; chat requests</li>
              <li>• Detailed Kundali / Horoscope Guna Milan reports</li>
              <li>• Priority listing in search results for Sindhi brides &amp; grooms</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="font-semibold text-stone-900 mb-2">Payment Terms</h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>• All prices are inclusive of applicable GST (Goods &amp; Services Tax)</li>
              <li>• Payments processed via RBI-licensed secure payment gateways</li>
              <li>• Membership plans are personal and strictly non-transferable</li>
              <li>• Unused contact views expire at the end of validity tenure</li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-stone-100/80 rounded-xl text-stone-800 text-sm space-y-2">
          <h4 className="font-semibold text-stone-900">Refund &amp; Cancellation Policy:</h4>
          <p className="leading-relaxed text-xs sm:text-sm">
            Payments made towards subscription packages are generally <strong>non-refundable</strong> once any premium privilege (such as viewing contact details or initiating chats) has been exercised. In exceptional cases of double billing or technical payment gateway errors, refund requests submitted within <strong>48 hours</strong> will be reviewed and refunded to original payment method within 5–7 working days.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "privacy-data",
    number: "7",
    title: "Privacy, Data Protection & Identity Safeguards",
    badge: "DPDP Act, 2023 Compliant",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          We value your trust and implement bank-grade privacy controls in compliance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the Information Technology (Reasonable Security Practices) Rules, 2011.
        </p>
        <div className="space-y-2 text-sm text-stone-700">
          <p>
            <strong>1. Privacy Shield:</strong> You have complete control over who can view your contact details, horoscopes, and photos. You may set photo visibility to &quot;Visible to All&quot;, &quot;Visible on Request&quot;, or &quot;Hidden&quot;.
          </p>
          <p>
            <strong>2. Contact Number Masking:</strong> Verified members may choose to mask their personal mobile numbers or communicate initially via our secure in-app calling / messaging interface.
          </p>
          <p>
            <strong>3. Third-Party Sharing:</strong> We do not sell or rent member contact lists to third-party telemarketers or advertisers under any circumstances.
          </p>
        </div>
        <p className="text-sm text-stone-600">
          For exhaustive details on how your sensitive personal data is collected, stored, processed, and purged, please inspect our dedicated{" "}
          <Link href="/privacy-policy" className="text-[#DB2F3C] font-medium underline hover:text-[#B71F2A]">
            Privacy Policy
          </Link>.
        </p>
      </div>
    ),
  },
  {
    id: "safety-verification",
    number: "8",
    title: "Profile Verification & Due Diligence Advisory",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          While SindhiMatrimony conducts automated algorithmic checks and manual document review for badges such as &quot;ID Verified&quot; or &quot;Trust Shield&quot;, we do not represent or warrant the complete accuracy, character, background, financial standing, or intentions of any user.
        </p>
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-sm text-stone-800">
          <h4 className="font-semibold text-emerald-950 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Member Advisory Before Marriage Finalization:
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
            Users and their families are strongly urged to independently verify the credentials, matrimonial history, character, employment, and family background of any prospective bride or groom through mutual community acquaintances, family references, or independent inquiry before solemnizing alliances or exchanging valuables.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "termination",
    number: "9",
    title: "Account Deactivation, Deletion & Termination",
    content: (
      <div className="space-y-3 text-stone-700 text-sm">
        <p className="leading-relaxed">
          <strong>Voluntary Deactivation:</strong> You may at any point pause or permanently delete your account through <code>Account Settings &gt; Privacy &amp; Delete Account</code>. If you find your soulmate through our platform, we invite you to share your joy with our community under Success Stories.
        </p>
        <p className="leading-relaxed">
          <strong>Termination by Company:</strong> We reserve the right to immediately suspend or permanently delete any profile without prior intimation if:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-stone-600 text-xs sm:text-sm">
          <li>You provide falsified identity documents, fake age, or misleading marital records.</li>
          <li>Multiple authenticated complaints of harassment, cyberstalking, or financial fraud are reported against you.</li>
          <li>You breach any clause of this User Agreement or violate applicable Indian statutes.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "intellectual-property",
    number: "10",
    title: "Intellectual Property Rights",
    content: (
      <div className="space-y-3 text-stone-700 text-sm">
        <p className="leading-relaxed">
          All text, logos, trademarks, design assets, algorithms, database layouts, and audio-visual graphics on SindhiMatrimony.com are the exclusive intellectual property of Matrimony.com Group and are protected under Indian and International Copyright and Trademark Treaties.
        </p>
        <p className="leading-relaxed">
          You are granted a limited, personal, non-exclusive, non-transferable license to access the portal solely for personal matchmaking. You shall not scrape, crawl, reverse engineer, index via automated bots, copy, or redistribute any member profile or platform content without prior written authorization.
        </p>
      </div>
    ),
  },
  {
    id: "grievance-officer",
    number: "11",
    title: "Grievance Redressal Mechanism & Officer Details",
    badge: "IT Rules, 2021 Statutory Compliance",
    content: (
      <div className="space-y-4">
        <p className="text-stone-700 leading-relaxed">
          In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the designated <strong>Grievance Redressal Officer</strong> for SindhiMatrimony is:
        </p>
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Designated Officer</div>
            <div className="font-bold text-stone-900 text-base">Mr. Rajiv Advani</div>
            <div className="text-xs text-stone-600">Chief Grievance Officer &amp; Compliance Head</div>
            <div className="text-xs text-stone-600">SindhiMatrimony.com / Matrimony.com Group</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Contact Coordinates</div>
            <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm">
              <Mail className="w-4 h-4 text-[#DB2F3C]" />
              <a href="mailto:grievance@sindhimatrimony.com" className="text-[#DB2F3C] hover:underline font-medium">
                grievance@sindhimatrimony.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-stone-500" />
              <span>+91-9876543210 (Mon–Fri, 10 AM – 6 PM IST)</span>
            </div>
            <div className="text-xs text-stone-500 leading-relaxed pt-1">
              Postal Address: Sindhi Society, Chembur, Mumbai, Maharashtra 400071, India.
            </div>
          </div>
        </div>
        <div className="text-xs text-stone-600 space-y-1">
          <p>
            • <strong>Acknowledgment:</strong> Grievance tickets are acknowledged within <strong>24 hours</strong> of formal receipt.
          </p>
          <p>
            • <strong>Resolution Timelines:</strong> In accordance with statutory guidelines, complaints are investigated and redressed within <strong>15 days</strong>.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "jurisdiction",
    number: "12",
    title: "Governing Law & Jurisdiction",
    content: (
      <div className="space-y-3 text-stone-700 text-sm">
        <p className="leading-relaxed">
          This User Agreement and all disputes or claims arising out of or related to your use of SindhiMatrimony shall be governed by, construed, and enforced in accordance with the substantive laws of the <strong>Republic of India</strong>, without regard to conflict of law principles.
        </p>
        <p className="leading-relaxed">
          The competent courts situated in <strong>Mumbai, Maharashtra, India</strong> shall have exclusive subject-matter and territorial jurisdiction over all legal proceedings, disputes, or claims arising hereunder.
        </p>
      </div>
    ),
  },
];
