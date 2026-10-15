import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;

