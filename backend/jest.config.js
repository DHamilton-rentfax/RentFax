// jest.config.js

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'], // looks inside tests/ folder
    setupFilesAfterEnv: ['./tests/setup.js'], // optional setup file
    coverageDirectory: './coverage',
    testTimeout: 30000, // increase if testing async DB ops
    verbose: true,
    forceExit: true,
    clearMocks: true,
    restoreMocks: true,
  };
  