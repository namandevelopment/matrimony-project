"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

const OtpTrustFooterComponent: React.FC = () => {
  return (
    <footer className="w-full mt-10 pt-6 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        {/* Trust Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">100% Privacy Protected</p>
              <p className="text-[10.5px] text-stone-500">256-Bit SSL data encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 text-left">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#DB2F3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Verified Sindhi Profiles</p>
              <p className="text-[10.5px] text-stone-500">Government ID & phone checked</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Zero Spam Guarantee</p>
              <p className="text-[10.5px] text-stone-500">No unwanted telemarketing</p>
            </div>
          </div>
        </div>

        {/* Helpful links & copyright */}
        <div className="text-center space-y-2 text-xs text-stone-500">
          <p className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/safety-tips"
              className="text-stone-600 hover:text-[#DB2F3C] hover:underline"
            >
              Safety Tips
            </Link>
            <span>•</span>
            <Link
              href="/terms-and-conditions"
              className="text-stone-600 hover:text-[#DB2F3C] hover:underline"
            >
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link
              href="/privacy-policy"
              className="text-stone-600 hover:text-[#DB2F3C] hover:underline"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <a
              href="mailto:support@sindhimatrimony.com"
              className="text-stone-600 hover:text-[#DB2F3C] hover:underline"
            >
              support@sindhimatrimony.com
            </a>
          </p>
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} SindhiMatrimony.com. All rights reserved. Powered by NeelimaMarriage.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export const OtpTrustFooter = memo(OtpTrustFooterComponent);
OtpTrustFooter.displayName = "OtpTrustFooter";
