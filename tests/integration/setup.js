const initDatabase = require("../../src/config/init-db")

beforeAll(async () => {
  await initDatabase()
})
