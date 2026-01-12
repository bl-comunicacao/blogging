const swaggerJSDoc = require("swagger-jsdoc")

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Post API",
      version: "1.0.0",
      description: "API para gerenciamento de posts",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // arquivos onde estarão os comentários Swagger
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

module.exports = swaggerSpec
