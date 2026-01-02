export default {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/firestore.rules.test.ts",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};