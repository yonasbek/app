import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Alternative: disable turbopack for fonts specifically
  // experimental: {
  //   turbo: {
  //     loaders: {
  //       '.woff2': ['file-loader'],
  //     },
  //   },
  // },
};

export default nextConfig;
