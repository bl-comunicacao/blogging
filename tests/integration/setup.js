const initDatabase = require("../../src/config/init-db")
const pool = require("../../src/config/database")

beforeAll(async () => {
  await initDatabase()
})

afterAll(async () => {
  await pool.end()
})
