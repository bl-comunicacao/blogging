export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/controllers/**/*.test.{js,ts}"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/integration/"],
  setupFilesAfterEnv: ["<rootDir>/tests/controllers/setup.ts"],
  clearMocks: false,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [],
};
