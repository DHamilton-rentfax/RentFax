export default {
  preset: "ts-jest",
  transform: {
    "^.+\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e/",
    "/tests/playwright/",
    "/src_backup/",
    "/loadtest/",
  ],
  moduleNameMapper: {
    "^@/firebase/server$": "<rootDir>/src/firebase/server",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
