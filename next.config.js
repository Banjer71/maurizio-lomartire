/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ✅ disable image optimization for CI
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  webpack(config) {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
