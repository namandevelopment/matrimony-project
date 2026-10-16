"use client";

import React, { memo } from "react";
import { OFFICE_DETAILS } from "../data/helpData";
import { Building2, ShieldAlert, PhoneCall, Mail, MapPin, Clock, Award } from "lucide-react";

export const HelpOfficeDetails: React.FC = memo(() => {
  return (
    <section
      aria-label="Official Corporate and Grievance Details"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Official Portal & Operating Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB2F3C] flex items-center justify-center shrink-0 border border-red-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Official Portal &amp; Operating Headquarters
              </h3>
              <p className="text-xs text-stone-500">
                {OFFICE_DETAILS.portalName} • {OFFICE_DETAILS.parentOrg}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 border-t border-stone-100">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">Corporate Address:</span>
                <p className="text-stone-600 text-xs mt-0.5 leading-relaxed">
                  {OFFICE_DETAILS.registeredOffice}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">Support Hours:</span>
                <p className="text-stone-600 text-xs mt-0.5">
                  {OFFICE_DETAILS.operatingHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">Regulatory Adherence:</span>
                <p className="text-stone-600 text-xs mt-0.5">
                  Operates under IT Act 2000, IT Rules 2021, and DPDP Act 2023.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Grievance Officer & Emergency Cyber Crime Assistance */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Grievance Officer &amp; Cyber Cell Redressal
              </h3>
              <p className="text-xs text-stone-500">
                Statutory Redressal Mechanism under Rule 3(2) IT Rules 2021
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600 border-t border-stone-100">
            <div>
              <span className="font-semibold text-stone-800">Designated Grievance Officer:</span>
              <p className="text-stone-700 text-xs mt-0.5 font-medium">
                {OFFICE_DETAILS.grievanceOfficer}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-xs text-stone-600">
                Email:{" "}
                <a
                  href={`mailto:${OFFICE_DETAILS.grievanceEmail}`}
                  className="font-semibold text-[#DB2F3C] hover:underline"
                >
                  {OFFICE_DETAILS.grievanceEmail}
                </a>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>Cyber Financial Fraud Emergency Helpline:</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Dial <strong className="text-stone-900">1930</strong> (National Cyber Crime Reporting Portal) immediately if someone solicits fraudulent financial transfers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HelpOfficeDetails.displayName = "HelpOfficeDetails";
