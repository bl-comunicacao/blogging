require("dotenv").config()
const express = require("express")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")

const postRoutes = require("./routes/post.routes")

const app = express()

app.use(express.json())

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rotas
app.use("/posts", postRoutes)

module.exports = app
