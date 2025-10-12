/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  experimental: {
    // Leave empty — avoids "invalid option" errors
  },

  // App Router handles i18n via folders and middleware now
};

module.exports = nextConfig;
