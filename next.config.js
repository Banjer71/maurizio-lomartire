/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable image optimization (Squoosh)
  images: {
    unoptimized: true,
  },

  // ✅ Ensure Next.js doesn’t try to use the WASM optimizer
  experimental: {
    images: {
      unoptimized: true,
    },
  },

  webpack(config) {
    // Prevent Node modules like 'fs' from breaking in CI
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
