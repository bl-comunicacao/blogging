require("dotenv").config();

// Ajusta configurações do banco quando rodando localmente (fora do Docker)
// Se DB_HOST for "postgres" (nome do container), ajusta para "localhost"
if (process.env.DB_HOST === "postgres" && !process.env.DOCKER_CONTAINER) {
  process.env.DB_HOST = "localhost";
  // Ajusta a porta também, pois docker-compose expõe na 5433
  if (process.env.DB_PORT === "5432") {
    process.env.DB_PORT = "5433";
  }
}

const app = require("./app");
const initDatabase = require("./config/init-db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`O server rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicação:", error.message);
    process.exit(1);
  }
})();
