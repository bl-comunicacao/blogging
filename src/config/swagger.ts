import swaggerJSDoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Posts API",
      version: "1.0.0",
      description: "API para gerenciamento de posts",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Ambiente local",
      },
    ],
    components: {
      schemas: {
        Post: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            title: {
              type: "string",
              example: "Título do post",
            },
            content: {
              type: "string",
              example: "Conteúdo do post",
            },
            author: {
              type: "string",
              example: "Autor do post",
            },
          },
        },
        PostCreate: {
          type: "object",
          required: ["title", "content", "author"],
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            author: {
              type: "string",
            },
          },
        },
        PostUpdate: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            author: {
              type: "string",
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Recurso não encontrado",
        },
        BadRequest: {
          description: "Erro de validação",
        },
      },
    },
    tags: [
      {
        name: "Posts",
        description: "Gerenciamento de posts",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerJSDoc(options);
