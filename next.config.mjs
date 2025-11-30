import "./logger.config.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore optional VSCode worker errors
    config.ignoreWarnings = [
      { message: /Failed to load resource/ },
      { message: /extensionHostWorker/ },
      { message: /workbench\.js/ },
    ];

    // Add node polyfills for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        path: require.resolve("path-browserify"),
        fs: false, // fs can't be polyfilled, so we provide an empty module.
      };
    }

    return config;
  },
  images: {
    unoptimized: true, // avoids 400 errors from /_next/image in dev
  },
};

export default nextConfig;
