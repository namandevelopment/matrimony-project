import React, { memo } from "react";

const AboutSectionComponent: React.FC = () => {
  return (
    <section
      aria-label="About Sindhi Matrimony"
      className="relative z-10 w-full py-12 bg-stone-50 border-t border-[#E9E9E9] text-stone-600 text-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            India&apos;s Most Trusted Sindhi Matrimonial Network
          </h2>
          <p className="leading-relaxed mb-4 text-[#444444]">
            SindhiMatrimony.com is the dedicated matchmaking portal from Matrimony.com Group, tailored exclusively for the global Sindhi community. Whether you belong to Bhaiband, Amil, Sahiti, Lohana, Larkana, or any other Sindhi sub-caste, our verified profiles, advanced horoscope matching, and strict privacy controls help you discover your compatible life partner with ease and dignity.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
              Sindhi Brides &amp; Grooms
            </span>
            <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
              100% Mobile &amp; ID Verified
            </span>
            <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
              Kundali &amp; Horoscope Matching
            </span>
            <span className="inline-block px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700">
              Global Sindhi NRI Network
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutSection = memo(AboutSectionComponent);
AboutSection.displayName = "AboutSection";
