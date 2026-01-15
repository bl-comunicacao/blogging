require("dotenv").config({
  path: ".env.test",
})

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/controllers/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/integration/"],
  setupFilesAfterEnv: ["<rootDir>/tests/controllers/setup.js"],
  clearMocks: false, // Não limpar mocks pois não estamos mais usando
}
