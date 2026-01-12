const pool = require("./database")

async function initDatabase() {
  try {
    await pool.query("SELECT 1")
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.error(
        "Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando."
      )
      console.error(
        `Tentando conectar em: ${process.env.DB_HOST}:${process.env.DB_PORT}`
      )
      throw new Error(
        "Não foi possível conectar ao banco de dados. Certifique-se de que o Docker está rodando: docker-compose up -d postgres"
      )
    }
    throw error
  }
}

module.exports = initDatabase
