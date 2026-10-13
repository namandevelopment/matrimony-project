import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export const TermsAssuranceCard: React.FC = React.memo(() => {
  return (
    <div className="p-6 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Lock className="w-6 h-6 text-[#DB2F3C] shrink-0" />
        <p>
          By continuing to use SindhiMatrimony, you acknowledge that you have read, understood, and agreed to this User Agreement in its entirety.
        </p>
      </div>
      <Link
        href="/"
        className="shrink-0 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-xs"
      >
        Back to Home
      </Link>
    </div>
  );
});

TermsAssuranceCard.displayName = "TermsAssuranceCard";
