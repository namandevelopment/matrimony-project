import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/registration-otp",
        destination: "/registration/otp",
        permanent: true,
      },
      {
        source: "/register/otp",
        destination: "/registration/otp",
        permanent: true,
      },
      {
        source: "/registration/step-1",
        destination: "/registration/basic-info",
        permanent: true,
      },
      {
        source: "/registration/basic",
        destination: "/registration/basic-info",
        permanent: true,
      },
      {
        source: "/registration/step-2",
        destination: "/registration/personal-religious-info",
        permanent: true,
      },
      {
        source: "/registration/step-3",
        destination: "/registration/location-professional-info",
        permanent: true,
      },
      {
        source: "/registration/professional",
        destination: "/registration/location-professional-info",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "https://sindi-matrimony-admin.vercel.app",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "https://sindi-matrimony-admin.vercel.app/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

