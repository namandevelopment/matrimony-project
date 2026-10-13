import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Two connected figures / loving couple heart symbol (Matrimony Logo style)
export const MatrimonyHeartLogo: React.FC<IconProps> = ({
  className = "w-10 h-10",
  size = 40,
  color = "#DB2F3C",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="10" fill={color} />
    <path
      d="M24 38c-1.2 0-7.5-5.2-11.2-9.8-3.5-4.4-4.8-8.4-4.8-12.2 0-5.5 4.3-9 9.5-9 3.5 0 6.5 1.8 7.5 4.2 1-2.4 4-4.2 7.5-4.2 5.2 0 9.5 3.5 9.5 9 0 3.8-1.3 7.8-4.8 12.2C31.5 32.8 25.2 38 24 38z"
      fill="white"
    />
    {/* Inner couple silhouettes */}
    <circle cx="19" cy="18" r="2.5" fill={color} />
    <circle cx="29" cy="18" r="2.5" fill={color} />
    <path
      d="M14.5 27c.5-3 2.5-5 4.5-5s4 2 4.5 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24.5 27c.5-3 2.5-5 4.5-5s4 2 4.5 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 2. 10+ years of service ribbon medal (Photo 2 Badge 1)
export const MedalRibbonIcon: React.FC<IconProps> = ({
  className = "w-12 h-12",
  size = 48,
  color = "#FF4A57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Rosette outer scalloped edges */}
    <circle
      cx="32"
      cy="24"
      r="16"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 6c1.5 2.5 3.5 2.5 5 0 1.5 2.5 3.5 2.5 5 0 1.5 2.5 3.5 2.5 5 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Inner certificate/badge lines */}
    <path
      d="M26 21h12M24 25h16M28 29h8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Rosette ribbon tails hanging down */}
    <path
      d="M24 37l-4 19 8-4 4 4"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 37l4 19-8-4-4 4"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. 2 Lakh+ people interlocked wedding rings (Photo 2 Badge 2)
export const InterlockedRingsIcon: React.FC<IconProps> = ({
  className = "w-12 h-12",
  size = 48,
  color = "#FF4A57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left Ring */}
    <circle
      cx="24"
      cy="36"
      r="14"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Right Ring */}
    <circle
      cx="40"
      cy="36"
      r="14"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Diamond atop Left Ring */}
    <path
      d="M20 18l4-4 4 4-4 4-4-4z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkles around left diamond */}
    <path
      d="M15 13l2 2M29 13l-2 2M24 10v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Diamond atop Right Ring */}
    <path
      d="M36 18l4-4 4 4-4 4-4-4z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkles around right diamond */}
    <path
      d="M45 13l-2 2M40 10v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 4. Growth Champions Trophy Cup (Photo 2 Badge 3)
export const TrophyStarIcon: React.FC<IconProps> = ({
  className = "w-12 h-12",
  size = 48,
  color = "#FF4A57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Trophy Cup */}
    <path
      d="M20 14h24v14c0 6.6-5.4 12-12 12s-12-5.4-12-12V14z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Trophy Handles */}
    <path
      d="M20 18h-6c-2.2 0-4 1.8-4 4v2c0 4.4 3.6 8 8 8h2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M44 18h6c2.2 0 4 1.8 4 4v2c0 4.4-3.6 8-8 8h-2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Star inside cup */}
    <path
      d="M32 20l1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6L32 20z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Stem and Base */}
    <path
      d="M32 40v8M22 48h20M18 52h28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// 5. 100% Verified Profiles Shield (Photo 2 Badge 4)
export const VerifiedShieldIcon: React.FC<IconProps> = ({
  className = "w-12 h-12",
  size = 48,
  color = "#FF4A57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Shield */}
    <path
      d="M32 10l18 6v14c0 13.5-7.8 21.5-18 24C21.8 51.5 14 43.5 14 30V16l18-6z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner Shield Contour */}
    <path
      d="M32 16l13 4.5v9.5c0 10-5.8 16.5-13 18.5-7.2-2-13-8.5-13-18.5v-9.5L32 16z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2 2"
      opacity="0.6"
    />
    {/* Bold Verified Checkmark */}
    <path
      d="M26 31l5 5 10-10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 6. 130+ branches Location Pin (Photo 2 Badge 5)
export const LocationBranchIcon: React.FC<IconProps> = ({
  className = "w-12 h-12",
  size = 48,
  color = "#FF4A57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Map Pin */}
    <path
      d="M32 10c-9.9 0-18 8.1-18 18 0 12.5 15.5 25.5 17.2 26.9.5.4 1.1.4 1.6 0C34.5 53.5 50 40.5 50 28c0-9.9-8.1-18-18-18z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner Circle / Center Point */}
    <circle
      cx="32"
      cy="27"
      r="7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
