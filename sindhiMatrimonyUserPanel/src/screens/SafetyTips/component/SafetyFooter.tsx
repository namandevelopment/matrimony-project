import React from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "@/screens/landingScreen/components/Icons";

export const SafetyFooter: React.FC = React.memo(() => {
  return (
    <footer className="w-full bg-stone-900 text-stone-400 py-10 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left border-b border-stone-800 pb-6">
          <div className="flex items-center gap-3">
            <MatrimonyHeartLogo size={28} className="w-7 h-7" color="#FF4A57" />
            <div>
              <span className="text-base font-bold text-white font-heading">
                Sindhi<span className="text-[#FF4A57]">Matrimony</span>.com
              </span>
              <p className="text-[11px] text-stone-400">
                © {new Date().getFullYear()} Matrimony.com Group. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-stone-300 font-medium">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/safety-tips" className="text-white underline underline-offset-4">
              Safety Tips
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Help &amp; Support
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 leading-relaxed max-w-4xl">
          SindhiMatrimony.com complies with the Information Technology Act, 2000, and operates under strict intermediary guidelines. We urge all members to never transfer money to prospective matches, verify references independently, and immediately report suspicious profiles to our Trust &amp; Safety Officers.
        </div>
      </div>
    </footer>
  );
});

SafetyFooter.displayName = "SafetyFooter";
