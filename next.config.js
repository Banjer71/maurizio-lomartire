/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Fully disable image optimization
  images: {
    unoptimized: true,
  },

  webpack(config, { isServer }) {
    // 🧠 Tell Webpack to ignore the Squoosh WASM modules entirely
    config.module.rules.push({
      test: /mozjpeg.*\.wasm$/,
      type: "javascript/auto",
      use: [],
    });

    // ✅ Avoid bundling FS or other Node core modules
    config.resolve.fallback = { fs: false };

    // ✅ Prevent Next.js from even trying to import WASM in CI
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== "ImageOptimizerPlugin"
    );

    return config;
  },

  // Just to be safe
  experimental: {
    images: { unoptimized: true },
  },
};

module.exports = nextConfig;
