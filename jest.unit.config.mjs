export default {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/qa/",
    "/tests/firestore/",
    "firestore.rules.test.ts",
    "tests/dashboard.spec.ts",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};