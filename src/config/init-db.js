const { Pool } = require("pg");

module.exports = async function initDatabase() {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USER ||
    !process.env.DB_NAME
  ) {
    throw new Error("Variáveis de ambiente do banco não definidas");
  }

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await pool.query("SELECT 1");
    console.log(
      `Banco conectado em ${process.env.DB_HOST}:${process.env.DB_PORT}`
    );
  } catch (error) {
    console.error(
      `Erro ao conectar em ${process.env.DB_HOST}:${process.env.DB_PORT}`
    );
    throw error;
  }
};
