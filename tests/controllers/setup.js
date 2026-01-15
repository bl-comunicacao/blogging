const initDatabase = require("../../src/config/init-db")
const pool = require("../../src/config/database")

beforeAll(async () => {
  await initDatabase()
})

// Limpa a tabela antes de cada teste para garantir isolamento
beforeEach(async () => {
  await pool.query("TRUNCATE TABLE posts RESTART IDENTITY CASCADE")
})

afterAll(async () => {
  await pool.end()
})
