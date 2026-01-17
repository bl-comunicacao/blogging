import "dotenv/config";
import app from "./app";
import initDatabase from "./config/init-db";

// Ajusta configurações do banco quando rodando localmente (fora do Docker)
// Se DB_HOST for "postgres" (nome do container), ajusta para "localhost"
if (process.env.DB_HOST === "postgres" && !process.env.DOCKER_CONTAINER) {
  process.env.DB_HOST = "localhost";
  // Ajusta a porta também, pois docker-compose expõe na 5433
  if (process.env.DB_PORT === "5432") {
    process.env.DB_PORT = "5433";
  }
}

const PORT: number = parseInt(process.env.PORT || "3000", 10);

(async (): Promise<void> => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`O server rodando na porta ${PORT}`);
    });
  } catch (error) {
    const err = error as Error;
    console.error("Erro ao iniciar a aplicação:", err.message);
    process.exit(1);
  }
})();
