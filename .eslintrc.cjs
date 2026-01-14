/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['next/core-web-vitals'],
  
    ignorePatterns: [
      // build / tooling
      '.next/',
      'dist/',
      'node_modules/',
  
      // tests
      '**/*.test.*',
      '**/*.spec.*',
  
      // backend / admin
      'src/app/api/**',
      'src/pages/api/**',
      'src/firebase/**',
      'src/functions/**',
      'src/server-actions/**',
      'src/lib/**',
  
      // legacy & WIP dashboards
      'src/app/(staff)/**',
      'src/app/(superadmin-dashboard)/**',
      'src/app/(renter)/**',
      'src/app/verify/**',
      'src/app/legal/**',
  
      // old or demo UI
      'src/components/**',
    ],
  
    rules: {
      // fully relaxed during refactor
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-key': 'off',
      'react-hooks/exhaustive-deps': 'warn',
  
      // App Router
      'react/react-in-jsx-scope': 'off',
    },
  };
  