export const siteConfig = {
  name: "Sindhi Matrimony",
  shortName: "SindhiMatrimony",
  description:
    "The most trusted matchmaking and matrimony portal for the global Sindhi community. Find verified Sindhi brides and grooms with horoscope matching and privacy controls.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sindhimatrimony.com",
  ogImage: "/images/og-default.jpg",
  locale: "en_IN",
  author: "Sindhi Matrimony Team",
  creator: "Sindhi Matrimony",
  keywords: [
    "Sindhi Matrimony",
    "Sindhi Rishtey",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Sindhi Matchmaking",
    "Sindhi Marriage Bureau",
    "Bhaiband Matrimony",
    "Amil Matrimony",
    "Lohana Matrimony",
    "Sahiti Sindhi",
    "Larkana Sindhi",
    "Sindhi NRI Matrimony",
    "Free Sindhi Matrimony Registration",
  ],
  links: {
    twitter: "https://twitter.com/sindhimatrimony",
    facebook: "https://facebook.com/sindhimatrimony",
    instagram: "https://instagram.com/sindhimatrimony",
    supportEmail: "support@sindhimatrimony.com",
    supportPhone: "+91-9876543210",
  },
  address: {
    street: "Sindhi Society, Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400071",
    country: "IN",
  },
} as const;

export type SiteConfig = typeof siteConfig;
