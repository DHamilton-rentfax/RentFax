export default {
  transform: {
    "^.+\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
};
