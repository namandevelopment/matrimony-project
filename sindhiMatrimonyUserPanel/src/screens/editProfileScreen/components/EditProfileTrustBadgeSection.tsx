"use client";

import React, { memo } from "react";
import { ShieldCheck, Award, Upload, CheckCircle2, Clock } from "lucide-react";
import { TrustBadgeState } from "../types";

export interface EditProfileTrustBadgeSectionProps {
  subType: "identity_badge" | "professional_badge";
  trustBadge: TrustBadgeState;
  onUploadDocument: (badgeType: "identity" | "professional", docName: string) => void;
  className?: string;
}

const EditProfileTrustBadgeSectionComponent: React.FC<EditProfileTrustBadgeSectionProps> = ({
  subType,
  trustBadge,
  onUploadDocument,
  className = "",
}) => {
  const isIdentity = subType === "identity_badge";
  const title = isIdentity ? "Identity Verification Badge" : "Professional Verification Badge";
  const status = isIdentity
    ? trustBadge.identityBadgeStatus
    : trustBadge.professionalBadgeStatus;

  return (
    <div className={`w-full bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#FAFBFB]">
        <div className="flex items-center gap-2">
          {isIdentity ? (
            <ShieldCheck className="w-5 h-5 text-[#DB2F3C]" />
          ) : (
            <Award className="w-5 h-5 text-[#1D68CD]" />
          )}
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-heading">
            {title}
          </h2>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${
            status === "verified"
              ? "bg-emerald-100 text-emerald-800"
              : status === "pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {status === "verified" ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </>
          ) : status === "pending" ? (
            <>
              <Clock className="w-3.5 h-3.5" />
              In Review
            </>
          ) : (
            "Not Submitted"
          )}
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs sm:text-[13px] text-stone-700 leading-relaxed">
          {isIdentity ? (
            <>
              <p className="font-semibold text-stone-900 mb-1">
                Why get Identity Verified?
              </p>
              Profiles with a verified identity badge receive a trusted badge icon on search results and enjoy up to 40% higher contact acceptance rates. Your documents remain 100% confidential and are never shared publicly.
            </>
          ) : (
            <>
              <p className="font-semibold text-stone-900 mb-1">
                Why get Professionally Verified?
              </p>
              Professional badge verification reassures potential matches regarding your educational qualifications and career standing.
            </>
          )}
        </div>

        {/* Accepted Documents */}
        <div>
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
            Accepted Documents
          </h4>
          <ul className="text-xs text-stone-600 list-disc list-inside space-y-1">
            {isIdentity ? (
              <>
                <li>Government ID (Aadhaar Card, Voter ID, Passport, PAN Card)</li>
                <li>Driving License</li>
              </>
            ) : (
              <>
                <li>Recent Salary Slip / Payslip (Last 3 months)</li>
                <li>Company Official ID Card</li>
                <li>Degree / Graduation Certificate</li>
                <li>Business Registration / GST Certificate</li>
              </>
            )}
          </ul>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-stone-300 hover:border-[#DB2F3C] rounded-xl p-6 sm:p-8 text-center transition-colors bg-stone-50/50 flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-stone-400 mb-2" />
          <p className="text-xs font-semibold text-stone-700">
            Click to upload your verification document
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </p>
          <button
            type="button"
            onClick={() =>
              onUploadDocument(
                isIdentity ? "identity" : "professional",
                isIdentity ? "aadhaar_card_masked.pdf" : "degree_certificate.pdf"
              )
            }
            className="mt-3 px-5 py-2 rounded-md bg-[#DB2F3C] hover:bg-[#C22430] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Select &amp; Submit Document
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditProfileTrustBadgeSection = memo(EditProfileTrustBadgeSectionComponent);
EditProfileTrustBadgeSection.displayName = "EditProfileTrustBadgeSection";
