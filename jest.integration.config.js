require("dotenv").config({
  path: ".env.test",
})

module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.js"],
}
