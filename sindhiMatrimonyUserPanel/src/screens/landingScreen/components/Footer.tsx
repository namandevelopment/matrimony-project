import React, { memo } from "react";
import Link from "next/link";
import { MatrimonyHeartLogo } from "./Icons";

const FooterComponent: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-stone-900 text-stone-400 py-8 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <MatrimonyHeartLogo size={24} className="w-6 h-6" color="#FF4A57" />
          <p>© {new Date().getFullYear()} Sindhimarriage.in. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-5 text-stone-300">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/safety-tips" className="hover:text-white transition-colors">
            Safety Tips
          </Link>
          <Link href="/help" className="hover:text-white transition-colors">
            Help &amp; Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
Footer.displayName = "Footer";
