// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * ✅ REQUIRED for Firebase Studio / Cloud Workstations
   * Allows /_next assets to load from preview origin
   */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ".cloudworkstations.dev",
  ],

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
    };

    return config;
  },
};

export default nextConfig;
