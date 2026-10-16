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

// 6. Silhouette Female Avatar (as in screenshots for Aisha Pandit / S Sreyashi)
export const FemaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[85%] h-[92%] -mb-0.5"
      aria-hidden="true"
    >
      {/* Background Hair Volume */}
      <path
        d="M24 65 C18 35, 30 12, 60 12 C90 12, 102 35, 96 65 C92 88, 92 100, 94 115 C88 115, 84 98, 82 82 C72 84, 48 84, 38 82 C36 98, 32 115, 26 115 C28 100, 28 88, 24 65 Z"
        fill="#262626"
      />
      {/* Neck & Shoulders Base */}
      <path
        d="M52 68 L52 90 L68 90 L68 68 Z"
        fill="#E8BD9E"
      />
      {/* Face Oval */}
      <path
        d="M44 54 C44 72, 76 72, 76 54 C76 38, 76 26, 60 26 C44 26, 44 38, 44 54 Z"
        fill="#FDE3D0"
      />
      {/* Hair Bangs / Front Styling */}
      <path
        d="M38 30 C44 20, 76 20, 82 30 C74 27, 66 34, 60 44 C54 34, 46 27, 38 30 Z"
        fill="#1A1A1A"
      />
      {/* Left & Right front hair strands */}
      <path
        d="M38 30 C36 45, 40 60, 44 68 C42 55, 40 40, 42 30 Z"
        fill="#1A1A1A"
      />
      <path
        d="M82 30 C84 45, 80 60, 76 68 C78 55, 80 40, 78 30 Z"
        fill="#1A1A1A"
      />
      {/* Pink Blouse / Shoulders */}
      <path
        d="M20 125 C20 100, 40 90, 52 90 L68 90 C80 90, 100 100, 100 125 Z"
        fill="#F472B6"
      />
    </svg>
  </div>
));
FemaleSilhouetteAvatar.displayName = "FemaleSilhouetteAvatar";

// 7. Male Silhouette Avatar
export const MaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[85%] h-[92%] -mb-0.5"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="60" cy="46" r="26" fill="#FDE3D0" />
      {/* Short Neat Hair */}
      <path
        d="M34 40 C34 20, 86 20, 86 40 C86 28, 76 22, 60 22 C44 22, 34 28, 34 40 Z"
        fill="#1E293B"
      />
      {/* Neck */}
      <rect x="52" y="70" width="16" height="18" fill="#E8BD9E" />
      {/* Slate Blue Shirt / Shoulders */}
      <path
        d="M18 125 C18 98, 40 90, 52 90 L68 90 C80 90, 102 98, 102 125 Z"
        fill="#64748B"
      />
    </svg>
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
