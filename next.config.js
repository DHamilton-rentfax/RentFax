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

    // Add a rule to handle .ttf files
    config.module.rules.push({
      test: /\.ttf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/fonts/',
            publicPath: '/_next/static/fonts/',
          },
        },
      ],
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

  // Add this to allow cross-origin requests in development
  allowedDevOrigins: ["https://*.cloudworkstations.dev"],
};

export default nextConfig;
