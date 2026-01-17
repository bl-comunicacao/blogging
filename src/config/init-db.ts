import pool from "./database";
import fs from "fs";
import path from "path";

interface ErrorWithCode extends Error {
  code?: string;
}

//verifica se o banco de dados está rodando e cria as tabelas se não existirem
async function initDatabase(): Promise<void> {
  try {
    await pool.query("SELECT 1");

    const tablesSqlPath = path.join(__dirname, "../tables.sql");
    if (fs.existsSync(tablesSqlPath)) {
      const tablesSql = fs.readFileSync(tablesSqlPath, "utf8");
      await pool.query(tablesSql);
    }
  } catch (error) {
    const dbError = error as ErrorWithCode;

    if (dbError.code === "ENOTFOUND" || dbError.code === "ECONNREFUSED") {
      console.error(
        "Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando."
      );
      console.error(
        `Tentando conectar em: ${process.env.DB_HOST}:${process.env.DB_PORT}`
      );
      throw new Error(
        "Não foi possível conectar ao banco de dados. Certifique-se de que o Docker está rodando: docker-compose up -d postgres"
      );
    }
    throw error;
  }
}

export default initDatabase;
