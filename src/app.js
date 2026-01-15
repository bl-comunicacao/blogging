const express = require("express")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")

const postRoutes = require("./routes/post.routes")
const errorHandler = require("./middleware/errorHandler.middleware")

const app = express()

app.use(express.json())

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rotas
app.use("/posts", postRoutes)

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler)

module.exports = app
