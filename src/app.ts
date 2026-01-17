import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

import postRoutes from "./routes/post.routes";
import errorHandler from "./middleware/errorHandler.middleware";

const app: Express = express();

app.use(express.json());

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rotas
app.use("/posts", postRoutes);

//Middleware de tratamento de erros
app.use(errorHandler);

export default app;
