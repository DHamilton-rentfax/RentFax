import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://*.web.app",
        "https://*.firebaseapp.com",
        "https://*.cloudworkstations.dev",
        "http://localhost:9002",
        "http://127.0.0.1:9002",
      ],
    },
  },

  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;
