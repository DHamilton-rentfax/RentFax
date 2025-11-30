/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Enable WebAssembly support
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Optional: Fix for WASM modules (farmhash, sharp, etc.)
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Fix for optional imports (helps Firebase & Next 15)
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
    };

    return config;
  },

  // ✅ Fix invalid previous settings
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;
