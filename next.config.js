// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // ✅ Enable WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // ✅ Ensure WASM files are parsed correctly
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // ✅ Prevent Firebase / crypto / fs polyfill issues
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // ✅ Experimental settings with correct format
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },

  // ✅ Cross-domain preview fix for Firebase Studio
  devIndicators: {
    buildActivity: true,
  },
  output: "standalone",

  // ✅ Allow Firebase Studio / cloud dev domains
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
