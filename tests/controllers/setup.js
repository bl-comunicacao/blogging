// Configura variáveis de ambiente para testes (sem depender de .env.test)
process.env.NODE_ENV = process.env.NODE_ENV || "test"
process.env.PORT = process.env.PORT || "3000"

// Configuração do banco de dados para testes
// Se não estiver definido, usa valores padrão para ambiente local
process.env.DB_HOST = process.env.DB_HOST || "localhost"
process.env.DB_PORT = process.env.DB_PORT || "5433"
process.env.DB_USER = process.env.DB_USER || "postgres"
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "postgres"
process.env.DB_NAME = process.env.DB_NAME || "blog"

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
