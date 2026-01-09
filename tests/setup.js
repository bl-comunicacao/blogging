require('dotenv').config();

// Configura variáveis de ambiente para testes (fora do Docker)
// Sobrescreve as configurações do .env para usar localhost
if (!process.env.DB_HOST || process.env.DB_HOST === 'postgres') {
  process.env.DB_HOST = 'localhost';
}
if (!process.env.DB_PORT || process.env.DB_PORT === '5432') {
  process.env.DB_PORT = '5433';
}

const initDatabase = require('../src/config/init-db');
const pool = require('../src/config/database');

// Garante que a tabela existe antes de rodar os testes
beforeAll(async () => {
  try {
    await initDatabase();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
    throw error;
  }
});

// Fecha as conexões do banco após todos os testes
afterAll(async () => {
  await pool.end();
});
