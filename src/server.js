require("dotenv").config({
  path:
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "production"
      ? ".env"
      : ".env.local",
});

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
