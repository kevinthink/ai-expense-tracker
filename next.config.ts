import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The dev badge sits on top of the bottom tab bar and blocks taps on it.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
