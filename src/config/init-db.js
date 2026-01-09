require("dotenv").config()
const pool = require("./database")
const fs = require("fs")
const path = require("path")

const initDatabase = async () => {
  try {
    // Testa a conexão primeiro
    await pool.query("SELECT 1")

    const sql = fs.readFileSync(path.join(__dirname, "../tables.sql"), "utf8")
    await pool.query(sql)
    // console.log('Tabela criada com sucesso!');
  } catch (error) {
    if (error.message.includes("already exists") || error.code === "42P07") {
      // console.log("Tabela já existe.")
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.error(
        "Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando."
      )
      console.error(
        `Tentando conectar em: ${process.env.DB_HOST}:${process.env.DB_PORT}`
      )
      throw new Error(
        `Não foi possível conectar ao banco de dados. Certifique-se de que o Docker está rodando: docker-compose up -d postgres`
      )
    } else {
      console.error("Erro ao criar tabela:", error.message)
      throw error
    }
  }
}

module.exports = initDatabase
