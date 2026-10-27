import React, { memo } from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Crown Icon for Upgrade membership
export const CrownIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16, color = "#FF9900" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M2.5 18.5H21.5V20H2.5V18.5ZM3 7L7.5 15.5L12 8.5L16.5 15.5L21 7L18.5 17H5.5L3 7Z"
      fill={color}
    />
    <circle cx="3" cy="6" r="1.5" fill={color} />
    <circle cx="12" cy="7" r="1.5" fill={color} />
    <circle cx="21" cy="6" r="1.5" fill={color} />
  </svg>
));
CrownIcon.displayName = "CrownIcon";

// 2. Horoscope / Kundli Icon
export const HoroscopeIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
));
HoroscopeIcon.displayName = "HoroscopeIcon";

// 3. Tile Icon: Add Photo(s)
export const AddPhotoTileIcon = memo<IconProps>(({ className = "w-10 h-10", size = 40 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-2xl bg-[#E8F8F0] border border-[#C2EED7] text-[#10B981] shadow-2xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0284C7] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
      +
    </span>
  </div>
));
AddPhotoTileIcon.displayName = "AddPhotoTileIcon";

// 4. Tile Icon: Family Details
export const FamilyDetailsTileIcon = memo<IconProps>(({ className = "w-10 h-10", size = 40 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-2xl bg-[#FFF6EB] border border-[#FED7AA] text-[#F97316] shadow-2xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
      <path d="M9 21V12h6v9" />
    </svg>
    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0284C7] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
      +
    </span>
  </div>
));
FamilyDetailsTileIcon.displayName = "FamilyDetailsTileIcon";

// 5. Tile Icon: Add Hobbies
export const AddHobbiesTileIcon = memo<IconProps>(({ className = "w-10 h-10", size = 40 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] text-[#EC4899] shadow-2xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" />
      <circle cx="18" cy="16" r="3" fill="currentColor" />
    </svg>
    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0284C7] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
      +
    </span>
  </div>
));
AddHobbiesTileIcon.displayName = "AddHobbiesTileIcon";

// 6. Classic Silhouette Female Avatar (Graceful, high-aesthetic matrimonial portrait)
export const FemaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-gradient-to-b from-[#FFF5F6] via-[#FCEAEF] to-[#F3D7DF] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[92%] h-[95%] -mb-1 select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft hair gradient */}
        <linearGradient id="femaleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C2828" />
          <stop offset="50%" stopColor="#1E1A1A" />
          <stop offset="100%" stopColor="#121010" />
        </linearGradient>

        {/* Soft natural skin tone gradient */}
        <linearGradient id="femaleSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F9DFD2" />
          <stop offset="100%" stopColor="#EBC6B5" />
        </linearGradient>

        {/* Elegant dress/saree gradient */}
        <linearGradient id="femaleDressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Gold glow */}
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
      </defs>

      {/* Background Back-Hair Volume */}
      <path
        d="M38 105 C30 65, 34 26, 80 26 C126 26, 130 65, 122 105 C118 135, 126 170, 134 195 C122 195, 114 172, 112 150 C98 153, 62 153, 48 150 C46 172, 38 195, 26 195 C34 170, 42 135, 38 105 Z"
        fill="url(#femaleHairGrad)"
      />

      {/* Natural Graceful Neck */}
      <path
        d="M68 95 C68 116, 70 128, 62 135 L98 135 C90 128, 92 116, 92 95 Z"
        fill="url(#femaleSkinGrad)"
      />

      {/* Graceful Face Oval */}
      <path
        d="M57 74 C57 98, 70 112, 80 112 C90 112, 103 98, 103 74 C103 52, 92 42, 80 42 C68 42, 57 52, 57 74 Z"
        fill="url(#femaleSkinGrad)"
      />

      {/* Front Hair Contour & Flowing Strands */}
      <path
        d="M54 55 C60 40, 72 38, 80 47 C88 38, 100 40, 106 55 C110 70, 107 90, 105 106 C101 88, 103 62, 98 55 C92 48, 86 48, 80 54 C74 48, 68 48, 62 55 C57 62, 59 88, 55 106 C53 90, 50 70, 54 55 Z"
        fill="url(#femaleHairGrad)"
      />

      {/* Subtle traditional bindi */}
      <circle cx="80" cy="62" r="1.8" fill="#BE123C" />

      {/* Delicate gold earrings */}
      <circle cx="56" cy="85" r="2.2" fill="url(#goldGlow)" />
      <path d="M56 87 L55 94 L57 94 Z" fill="url(#goldGlow)" />
      
      <circle cx="104" cy="85" r="2.2" fill="url(#goldGlow)" />
      <path d="M104 87 L103 94 L105 94 Z" fill="url(#goldGlow)" />

      {/* Elegant Indian Kurti / Saree Shoulders & Drapes */}
      <path
        d="M20 200 C20 162, 54 135, 80 135 C106 135, 140 162, 140 200 Z"
        fill="url(#femaleDressGrad)"
      />

      {/* Gold zari neckline border */}
      <path
        d="M62 135 C70 148, 90 148, 98 135"
        stroke="url(#goldGlow)"
        strokeWidth="2"
        fill="none"
      />

      {/* Delicate saree pallu fold */}
      <path
        d="M45 155 C60 170, 75 185, 95 200"
        stroke="#FDA4AF"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
      />
    </svg>

    {/* Floating "Request Photo" Frosted Badge */}
    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center pointer-events-none">
      <div className="bg-black/35 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-red-200 fill-current" aria-hidden="true">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-1.66 1.34-3 3-3z"/>
        </svg>
        <span>Request Photo</span>
      </div>
    </div>
  </div>
));
FemaleSilhouetteAvatar.displayName = "FemaleSilhouetteAvatar";

// 7. Classic Male Silhouette Avatar (Sharp, masculine profile portrait)
export const MaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-gradient-to-b from-[#F8FAFC] via-[#EDF2F7] to-[#E2E8F0] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[92%] h-[95%] -mb-1 select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="maleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C3038" />
          <stop offset="100%" stopColor="#1A1D23" />
        </linearGradient>

        <linearGradient id="maleSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAD7C0" />
          <stop offset="100%" stopColor="#E2BD9E" />
        </linearGradient>

        <linearGradient id="maleSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
      </defs>

      {/* Neck */}
      <path
        d="M66 98 C66 118, 68 128, 62 134 L98 134 C92 128, 94 118, 94 98 Z"
        fill="url(#maleSkinGrad)"
      />

      {/* Head / Face Jawline */}
      <path
        d="M58 72 C58 96, 68 114, 80 114 C92 114, 102 96, 102 72 C102 52, 92 40, 80 40 C68 40, 58 52, 58 72 Z"
        fill="url(#maleSkinGrad)"
      />

      {/* Ears */}
      <circle cx="56" cy="74" r="5" fill="#E2BD9E" />
      <circle cx="104" cy="74" r="5" fill="#E2BD9E" />

      {/* Modern Hairstyle */}
      <path
        d="M54 62 C52 38, 70 30, 84 32 C96 34, 108 42, 106 62 C100 52, 92 46, 80 44 C68 42, 60 48, 54 62 Z"
        fill="url(#maleHairGrad)"
      />

      {/* Collared Blazer / Kurta */}
      <path
        d="M16 200 C16 156, 50 134, 80 134 C110 134, 144 156, 144 200 Z"
        fill="url(#maleSuitGrad)"
      />

      {/* Crisp White Shirt Collar */}
      <path
        d="M66 134 L80 156 L94 134 Z"
        fill="#FFFFFF"
      />
      {/* Placket accent */}
      <path
        d="M78 156 L82 156 L83 195 L77 195 Z"
        fill="#DB2F3C"
      />
    </svg>

    {/* Floating "Request Photo" Frosted Badge */}
    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center pointer-events-none">
      <div className="bg-black/35 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-sky-200 fill-current" aria-hidden="true">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-1.66 1.34-3 3-3z"/>
        </svg>
        <span>Request Photo</span>
      </div>
    </div>
  </div>
));
MaleSilhouetteAvatar.displayName = "MaleSilhouetteAvatar";

// 8. MatchAstro Logo
export const MatchAstroIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 2L14.4 8.6L21.5 9.1L16 13.6L17.8 20.4L12 16.7L6.2 20.4L8 13.6L2.5 9.1L9.6 8.6L12 2Z"
      fill="#10B981"
    />
  </svg>
));
MatchAstroIcon.displayName = "MatchAstroIcon";

// 9. WeddingBazaar Logo
export const WeddingBazaarIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="6" width="18" height="15" rx="3" stroke="#F43F5E" strokeWidth="2" />
    <path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#F43F5E" strokeWidth="2" />
    <circle cx="12" cy="13" r="2.5" fill="#F43F5E" />
  </svg>
));
WeddingBazaarIcon.displayName = "WeddingBazaarIcon";

export const MandapIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 20h16M5 20V9l7-5 7 5v11M9 20v-6h6v6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
  </svg>
));
MandapIcon.displayName = "MandapIcon";

// 11. Paid Member Features: Call/WhatsApp Icon
export const CallWhatsAppFeatureIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <div
    style={{ width: size, height: size }}
    className={`shrink-0 rounded-full bg-[#EBF6FE] flex items-center justify-center text-[#0284C7] shadow-xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  </div>
));
CallWhatsAppFeatureIcon.displayName = "CallWhatsAppFeatureIcon";

// 12. Paid Member Features: Unlimited Messages Icon
export const UnlimitedMessagesFeatureIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <div
    style={{ width: size, height: size }}
    className={`shrink-0 rounded-full bg-[#F0F4FF] flex items-center justify-center text-[#3B82F6] shadow-xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </div>
));
UnlimitedMessagesFeatureIcon.displayName = "UnlimitedMessagesFeatureIcon";

// 13. Paid Member Features: Higher chances of response
export const HigherResponseFeatureIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <div
    style={{ width: size, height: size }}
    className={`shrink-0 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shadow-xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  </div>
));
HigherResponseFeatureIcon.displayName = "HigherResponseFeatureIcon";

// 14. Paid Member Features: View and match horoscopes
export const HoroscopeMatchFeatureIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <div
    style={{ width: size, height: size }}
    className={`shrink-0 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shadow-xs ${className}`}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="1.5" />
    </svg>
  </div>
));
HoroscopeMatchFeatureIcon.displayName = "HoroscopeMatchFeatureIcon";

// 15. Assisted Service Gold Badge
export const AssistedServiceBadgeIcon = memo<IconProps>(({ className = "w-6 h-6", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" fill="url(#goldGradientBadge)" stroke="#F6D580" strokeWidth="1.2" />
    <path
      d="M12 7L13.3 9.8L16.2 10.2L14.1 12.2L14.6 15L12 13.6L9.4 15L9.9 12.2L7.8 10.2L10.7 9.8L12 7Z"
      fill="#1A1A1A"
    />
    <defs>
      <linearGradient id="goldGradientBadge" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
));
AssistedServiceBadgeIcon.displayName = "AssistedServiceBadgeIcon";

// 16. Assisted Service: Handpicked Matches Icon
export const HandpickedMatchesIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20, color = "#F6D580" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <polyline points="18 11 20 13 24 9" />
  </svg>
));
HandpickedMatchesIcon.displayName = "HandpickedMatchesIcon";

// 17. Assisted Service: Regular Follow-ups Icon
export const RegularFollowupsIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20, color = "#F6D580" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M18 8a3 3 0 1 1-6 0" />
    <polyline points="19 14 22 17 19 20" />
  </svg>
));
RegularFollowupsIcon.displayName = "RegularFollowupsIcon";

// 18. Assisted Service: Guaranteed Monthly Meetings Icon
export const MonthlyMeetingsIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20, color = "#F6D580" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2 4-4" />
  </svg>
));
MonthlyMeetingsIcon.displayName = "MonthlyMeetingsIcon";

// 19. Limca Book of Records Badge
export const LimcaBookBadge = memo<IconProps>(({ className = "w-20 h-10", size = 80 }) => (
  <div className={`relative inline-flex flex-col items-center justify-center p-1 border border-stone-800 rounded bg-white text-center shadow-xs ${className}`}>
    <span className="text-[11px] font-black tracking-widest text-[#1A1A1A] leading-none uppercase font-serif">
      LIMCA
    </span>
    <span className="text-[8px] font-bold text-[#333333] tracking-wider leading-none">
      BOOK of
    </span>
    <span className="text-[10px] font-black tracking-widest text-[#1A1A1A] leading-none uppercase font-serif">
      RECORDS
    </span>
  </div>
));
LimcaBookBadge.displayName = "LimcaBookBadge";

// ==========================================
// Specialized Profile Card & Menu Icons (Pixel-perfect to screenshots)
// ==========================================

// 20. Edit Profile Menu Icon (Document with lines & pencil with red tip)
export const EditProfileMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Document sheet */}
    <rect x="4" y="3" width="13" height="17" rx="2" stroke="#1E293B" strokeWidth="1.6" fill="#FFFFFF" />
    {/* Text lines */}
    <line x1="7.5" y1="7.5" x2="13.5" y2="7.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7.5" y1="11" x2="13.5" y2="11" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7.5" y1="14.5" x2="10.5" y2="14.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Pencil at bottom right with red tip */}
    <path
      d="M19.8 13.2a1 1 0 0 0-1.4 0l-5.4 5.4v1.8h1.8l5.4-5.4a1 1 0 0 0 0-1.4l-.4-.4z"
      stroke="#1E293B"
      strokeWidth="1.5"
      fill="#FFFFFF"
      strokeLinejoin="round"
    />
    <path d="M13 20.4l1.6-.4-.8-.8" fill="#DB2F3C" stroke="#DB2F3C" strokeWidth="0.8" />
    <line x1="17.2" y1="14.2" x2="18.6" y2="15.6" stroke="#DB2F3C" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
));
EditProfileMenuIcon.displayName = "EditProfileMenuIcon";

// 21. Edit Preferences Menu Icon (User silhouette with pencil and red tip)
export const EditPreferencesMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* User silhouette */}
    <circle cx="10" cy="7" r="3.5" stroke="#1E293B" strokeWidth="1.6" fill="#FFFFFF" />
    <path
      d="M4 18c0-3 2.5-5 6-5s6 2 6 5"
      stroke="#1E293B"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="#FFFFFF"
    />
    {/* Pencil at bottom right with red tip */}
    <path
      d="M19.5 12.5l2 2-5 5H14v-2.5l5-5z"
      stroke="#1E293B"
      strokeWidth="1.5"
      fill="#FFFFFF"
      strokeLinejoin="round"
    />
    <path d="M14 19.5l1.2-.3-.6-.6" fill="#DB2F3C" stroke="#DB2F3C" strokeWidth="0.6" />
    <line x1="18" y1="14" x2="19.5" y2="15.5" stroke="#DB2F3C" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
));
EditPreferencesMenuIcon.displayName = "EditPreferencesMenuIcon";

// 22. View/Edit Horoscope Menu Icon (Saturn planet with ring & red accent)
export const HoroscopeMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Ring back */}
    <path
      d="M4.5 14.5 C2.5 11 8.5 7.5 16 8 C18.5 8.2 20.5 9 21.5 10.5"
      stroke="#DB2F3C"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Planet globe */}
    <circle cx="12" cy="12" r="5.5" stroke="#1E293B" strokeWidth="1.7" fill="#FFFFFF" />
    {/* Ring front */}
    <path
      d="M3.2 13.5 C2 15 5.5 17.5 12 17.5 C17 17.5 21.5 15.5 22.2 13.5"
      stroke="#DB2F3C"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Inner ring shadow */}
    <path
      d="M8.5 14 C10.5 15.2 13.5 15.2 15.5 14"
      stroke="#1E293B"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
));
HoroscopeMenuIcon.displayName = "HoroscopeMenuIcon";

// 23. Settings Menu Icon (Gear with clean teeth)
export const SettingsMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M19.4 13a7.7 7.7 0 0 0 .1-1 7.7 7.7 0 0 0-.1-1l2.1-1.6a.5.5 0 0 0 .1-.6l-2-3.5a.5.5 0 0 0-.6-.2l-2.5 1a7.9 7.9 0 0 0-1.7-1l-.4-2.6a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.6a7.9 7.9 0 0 0-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.5a.5.5 0 0 0 .1.6L4.5 11a7.7 7.7 0 0 0-.1 1c0 .3 0 .7.1 1l-2.1 1.6a.5.5 0 0 0-.1.6l2 3.5a.5.5 0 0 0 .6.2l2.5-1a7.9 7.9 0 0 0 1.7 1l.4 2.6a.5.5 0 0 0 .5.4h4a.5.5 0 0 0 .5-.4l.4-2.6a7.9 7.9 0 0 0 1.7-1l2.5 1a.5.5 0 0 0 .6-.2l2-3.5a.5.5 0 0 0-.1-.6L19.4 13z"
      stroke="#1E293B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FFFFFF"
    />
    <circle cx="12" cy="12" r="3" stroke="#1E293B" strokeWidth="1.6" fill="#FFFFFF" />
  </svg>
));
SettingsMenuIcon.displayName = "SettingsMenuIcon";

// 24. Help Menu Icon (Chat bubbles with red ? bubble, matching screenshot)
export const HelpMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Left speech bubble with dots */}
    <path
      d="M3.5 14V6.5a2.5 2.5 0 0 1 2.5-2.5h8a2.5 2.5 0 0 1 2.5 2.5V11a2.5 2.5 0 0 1-2.5 2.5H7.5l-4 3v-2.5z"
      stroke="#1E293B"
      strokeWidth="1.6"
      fill="#FFFFFF"
      strokeLinejoin="round"
    />
    <circle cx="6.5" cy="8.5" r="0.8" fill="#1E293B" />
    <circle cx="9.5" cy="8.5" r="0.8" fill="#1E293B" />
    <circle cx="12.5" cy="8.5" r="0.8" fill="#1E293B" />
    {/* Overlapping red speech bubble on bottom right with ? */}
    <path
      d="M13.5 12a2.8 2.8 0 0 1 2.8-2.8h2.2a2.8 2.8 0 0 1 2.8 2.8v2.2a2.8 2.8 0 0 1-2.8 2.8h-1l-2 1.8v-1.6a2.8 2.8 0 0 1-2-2.4v-2.8z"
      fill="#E53935"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <text
      x="17.4"
      y="15.2"
      fill="#FFFFFF"
      fontSize="6.2"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      ?
    </text>
  </svg>
));
HelpMenuIcon.displayName = "HelpMenuIcon";

// 25. Safe Matrimony Menu Icon (Shield with red badge and white checkmark)
export const SafeMatrimonyMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Shield */}
    <path
      d="M12 3L4 6.5v6c0 5 3.5 9.5 8 10.5 4.5-1 8-5.5 8-10.5v-6L12 3z"
      stroke="#1E293B"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="#FFFFFF"
    />
    {/* Red circular badge with checkmark inside */}
    <circle cx="12" cy="12.5" r="4.2" fill="#E53935" />
    <path
      d="M10.2 12.4l1.3 1.3 2.5-2.5"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
SafeMatrimonyMenuIcon.displayName = "SafeMatrimonyMenuIcon";

// 26. Success Stories Menu Icon (Heart outline with small red heart at bottom-left)
export const SuccessStoriesMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Main outline heart */}
    <path
      d="M12 20.2s-7.5-4.5-9.3-8.8C1.2 7.7 3.5 4.5 7.3 4.5c2.4 0 4.1 1.4 4.7 2.4.6-1 2.3-2.4 4.7-2.4 3.8 0 6.1 3.2 4.6 6.9-1.8 4.3-9.3 8.8-9.3 8.8z"
      stroke="#1E293B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FFFFFF"
    />
    {/* Small red heart at bottom-left */}
    <path
      d="M6 16.5c-1.3-.8-2-1.8-2-2.8 0-1.1.9-2 2-2 .8 0 1.5.5 1.8 1.1.3-.6 1-.1 1.8-1.1 1.1 0 2 .9 2 2 0 1-.7 2-2 2.8l-1.8 1.4L6 16.5z"
      fill="#E53935"
    />
  </svg>
));
SuccessStoriesMenuIcon.displayName = "SuccessStoriesMenuIcon";

// 26. More Menu Icon (Circle with red plus sign)
export const MoreMenuIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" stroke="#1E293B" strokeWidth="1.8" />
    <line x1="12" y1="7.5" x2="12" y2="16.5" stroke="#DB2F3C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="#DB2F3C" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
));
MoreMenuIcon.displayName = "MoreMenuIcon";

// 27. MatchAstro Brand Icon
export const MatchAstroBrandIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 3L6 19H9.5L10.8 15H13.2L14.5 19H18L12 3ZM12 7.8L12.7 12H11.3L12 7.8Z"
      fill="#1E293B"
    />
    <ellipse
      cx="12"
      cy="13.5"
      rx="9"
      ry="2.8"
      transform="rotate(-15 12 13.5)"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
));
MatchAstroBrandIcon.displayName = "MatchAstroBrandIcon";

// 28. WeddingBazaar Brand Icon
export const WeddingBazaarBrandIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect x="2.5" y="4" width="19" height="16" rx="3.5" stroke="#1E293B" strokeWidth="1.6" />
    <text x="5" y="16" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#E11D48">w</text>
    <text x="12" y="16" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#1E293B">b</text>
  </svg>
));
WeddingBazaarBrandIcon.displayName = "WeddingBazaarBrandIcon";

// 29. Mandap Brand Icon
export const MandapBrandIcon = memo<IconProps>(({ className = "w-5 h-5", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Base platform */}
    <path d="M3 20h18" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
    {/* Pillars */}
    <path d="M5 20V11M8 20V11M16 20V11M19 20V11" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Arch / Roof Dome */}
    <path d="M4 11C4 7 8 5 12 3C16 5 20 7 20 11H4Z" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" fill="#FFFFFF" />
    {/* Floral Garland Swag */}
    <path d="M5 12Q8.5 15 12 12Q15.5 15 19 12" stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="8.5" cy="13.5" r="1" fill="#E11D48" />
    <circle cx="15.5" cy="13.5" r="1" fill="#E11D48" />
    <circle cx="12" cy="12" r="1" fill="#E11D48" />
  </svg>
));
MandapBrandIcon.displayName = "MandapBrandIcon";

// 30. Upgrade Crown Artwork (Warm peach illustration from screenshot)
export const UpgradeCrownArt = memo<{ className?: string; size?: number }>(
  ({ className = "w-24 h-20", size = 96 }) => (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 110 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crown base band */}
      <path
        d="M20 58 Q 55 69 90 58 Q 55 64 20 58 Z"
        stroke="#EEA47F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M23 54 Q 55 64 87 54"
        stroke="#EEA47F"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Crown peaks */}
      <path
        d="M20 54 L 14 30 Q 25 38 34 46 L 38 22 Q 46 36 55 42 Q 64 36 72 22 L 76 46 Q 85 38 96 30 L 90 54"
        stroke="#EEA47F"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crown pearls on peak tips */}
      <circle cx="14" cy="28" r="3" stroke="#EEA47F" strokeWidth="2" fill="#FFF4EC" />
      <circle cx="38" cy="20" r="3" stroke="#EEA47F" strokeWidth="2" fill="#FFF4EC" />
      <circle cx="55" cy="16" r="3.6" stroke="#EEA47F" strokeWidth="2.2" fill="#FFF4EC" />
      <circle cx="72" cy="20" r="3" stroke="#EEA47F" strokeWidth="2" fill="#FFF4EC" />
      <circle cx="96" cy="28" r="3" stroke="#EEA47F" strokeWidth="2" fill="#FFF4EC" />
      {/* Jewels on crown base band */}
      <ellipse cx="55" cy="61" rx="4" ry="2.5" stroke="#EEA47F" strokeWidth="1.6" />
      <ellipse cx="36" cy="58" rx="3" ry="2" stroke="#EEA47F" strokeWidth="1.6" />
      <ellipse cx="74" cy="58" rx="3" ry="2" stroke="#EEA47F" strokeWidth="1.6" />
      {/* Sparkles */}
      <circle cx="85" cy="12" r="1.5" fill="#EEA47F" />
      <circle cx="94" cy="18" r="2" fill="#EEA47F" />
      <circle cx="24" cy="14" r="1.8" fill="#EEA47F" />
    </svg>
  )
);
UpgradeCrownArt.displayName = "UpgradeCrownArt";

