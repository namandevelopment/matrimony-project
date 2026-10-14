export const siteConfig = {
  name: "Sindhi Matrimony",
  shortName: "SindhiMatrimony",
  description:
    "Discover Sindhi matrimonial profiles and connect with compatible life partners from the Sindhi community. Explore meaningful matches with SindhiMatrimony.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sindhimatrimony.com",
  ogImage: "/images/og-default.jpg",
  logo: "/images/logo.webp",
  locale: "en_IN",
  author: "Sindhi Matrimony Team",
  creator: "Sindhi Matrimony",
  keywords: [
    "Sindhi Matrimony",
    "Sindhi Marriage",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Sindhi Matchmaking",
    "Bhaiband Matrimony",
    "Amil Matrimony",
    "Lohana Matrimony",
    "Sahiti Sindhi",
    "Larkana Sindhi",
    "Sindhi NRI Matrimony",
    "Verified Sindhi Profiles",
  ],
  links: {
    twitter: "https://twitter.com/sindhimatrimony",
    facebook: "https://facebook.com/sindhimatrimony",
    instagram: "https://instagram.com/sindhimatrimony",
    supportEmail: "support@sindhimatrimony.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;

