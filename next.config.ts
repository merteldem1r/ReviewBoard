import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Only use turbopack config in development
  ...(process.env.NODE_ENV === "development" && {
    turbopack: {
      root: path.resolve(__dirname),
    },
  }),

  // Add these for production
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
