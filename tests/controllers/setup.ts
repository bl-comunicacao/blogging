// Carrega variáveis de ambiente do arquivo .env
import "dotenv/config";

// Configura variáveis de ambiente para testes
// Usa valores do .env se existirem, caso contrário usa valores padrão
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.PORT = process.env.PORT || "3000";

// Configuração do banco de dados para testes
// Ajusta DB_HOST se for "postgres" (nome do container) para "localhost" em testes locais
if (process.env.DB_HOST === "postgres") {
  process.env.DB_HOST = "localhost";
  // Ajusta a porta também, pois docker-compose expõe na 5433
  if (process.env.DB_PORT === "5432") {
    process.env.DB_PORT = "5433";
  }
}

// Se não estiver definido no .env, usa valores padrão para ambiente local
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "5433";
process.env.DB_USER = process.env.DB_USER || "postgres";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
process.env.DB_NAME = process.env.DB_NAME || "blog";

import initDatabase from "../../src/config/init-db";
import pool from "../../src/config/database";

beforeAll(async () => {
  await initDatabase();
});

// Limpa a tabela antes de cada teste para garantir isolamento
beforeEach(async () => {
  await pool.query("TRUNCATE TABLE posts RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});
