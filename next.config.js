/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false }
};

module.exports = nextConfig;