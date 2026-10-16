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
export const AddPhotoTileIcon = memo<IconProps>(({ className = "w-8 h-8", size = 32 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-xs ${className}`}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      +
    </span>
  </div>
));
AddPhotoTileIcon.displayName = "AddPhotoTileIcon";

// 4. Tile Icon: Family Details
export const FamilyDetailsTileIcon = memo<IconProps>(({ className = "w-8 h-8", size = 32 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shadow-xs ${className}`}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
      <path d="M9 21V12h6v9" />
    </svg>
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      +
    </span>
  </div>
));
FamilyDetailsTileIcon.displayName = "FamilyDetailsTileIcon";

// 5. Tile Icon: Add Hobbies
export const AddHobbiesTileIcon = memo<IconProps>(({ className = "w-8 h-8", size = 32 }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-xl bg-pink-50 border border-pink-200 text-pink-600 shadow-xs ${className}`}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      +
    </span>
  </div>
));
AddHobbiesTileIcon.displayName = "AddHobbiesTileIcon";

// 6. Silhouette Female Avatar (as in screenshots for Aisha Pandit / S Sreyashi)
export const FemaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-[#E3E7ED] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[82%] h-[90%] -mb-1"
      aria-hidden="true"
    >
      {/* Hair back */}
      <path
        d="M20 55 C15 30, 25 10, 50 10 C75 10, 85 30, 80 55 C77 75, 78 85, 80 95 C75 95, 72 82, 70 70 C60 72, 40 72, 30 70 C28 82, 25 95, 20 95 C22 85, 23 75, 20 55 Z"
        fill="#262626"
      />
      {/* Face / Neck */}
      <path
        d="M38 52 C38 64, 62 64, 62 52 C62 40, 62 30, 50 30 C38 30, 38 40, 38 52 Z"
        fill="#F6D1B9"
      />
      <path d="M44 60 L44 76 L56 76 L56 60 Z" fill="#E8BD9E" />
      {/* Hair front / bangs */}
      <path
        d="M34 32 C38 22, 62 22, 66 32 C60 30, 55 35, 50 42 C46 35, 40 30, 34 32 Z"
        fill="#1A1A1A"
      />
      {/* Pink Blouse / Shoulders */}
      <path
        d="M24 100 C24 82, 36 76, 44 76 L56 76 C64 76, 76 82, 76 100 Z"
        fill="#F472B6"
      />
    </svg>
  </div>
));
FemaleSilhouetteAvatar.displayName = "FemaleSilhouetteAvatar";

// 7. Male Silhouette Avatar
export const MaleSilhouetteAvatar = memo<{ className?: string }>(({ className = "w-full h-full" }) => (
  <div className={`relative w-full h-full bg-[#E2E8F0] flex items-end justify-center overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[80%] h-[90%] -mb-1"
      aria-hidden="true"
    >
      <circle cx="50" cy="40" r="22" fill="#E0A980" />
      {/* Short Hair */}
      <path
        d="M28 35 C28 18, 72 18, 72 35 C72 26, 64 20, 50 20 C36 20, 28 26, 28 35 Z"
        fill="#1E293B"
      />
      {/* Neck */}
      <rect x="44" y="60" width="12" height="15" fill="#D3976F" />
      {/* Blue shirt / shoulders */}
      <path
        d="M20 100 C20 78, 35 72, 44 72 L56 72 C65 72, 80 78, 80 100 Z"
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

// 10. Mandap.com Logo
export const MandapIcon = memo<IconProps>(({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 20h16M5 20V9l7-5 7 5v11M9 20v-6h6v6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
  </svg>
));
MandapIcon.displayName = "MandapIcon";
