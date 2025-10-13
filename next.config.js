const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Add this to allow Firebase Studio / proxy connections
  allowedDevOrigins: [
    'https://3000-firebase-studio-1754325563199.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev'
  ],

  // App Router handles i18n via folders and middleware now
  experimental: {},
};

module.exports = withNextIntl(nextConfig);
