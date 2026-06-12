import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Creates .next/standalone
  output: "standalone",

  // Expose build-time public env vars
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  images: {
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;