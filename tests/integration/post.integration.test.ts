import request from "supertest";
import app from "../../src/app";
import type { PostCreate, PostUpdate } from "../../src/types";

describe("Testes de Integração - Posts API", () => {
  describe("GET /posts", () => {
    it("Deve retornar lista vazia quando não houver posts", async () => {
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Nenhum post encontrado");
    });

    it("Deve retornar lista de posts quando existirem posts", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Vênus e Adônis",
        content: "Conteúdo do post de teste",
        author: "William Shakespear",
      };

      await request(app).post("/posts").send(postData);

      // Busca todos os posts
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("content");
      expect(res.body[0]).toHaveProperty("author");
      expect(res.body[0]).toHaveProperty("created_at");
    });
  });

  describe("POST /posts", () => {
    it("Deve criar um post com sucesso", async () => {
      const postData: PostCreate = {
        title: "Revolução Industrial",
        content:
          "A Revolução Industrial foi um processo de profundas transformações econômicas e sociais iniciado na Inglaterra no século XVIII.",
        author: "Roberto Carlos",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Post criado com sucesso");
      expect(res.body.post).toBeDefined();
      expect(res.body.post.title).toBe(postData.title);
      expect(res.body.post.content).toBe(postData.content);
      expect(res.body.post.author).toBe(postData.author);
      expect(res.body.post.id).toBeDefined();
      expect(res.body.post.created_at).toBeDefined();
    });

    it("Deve retornar erro 400 quando faltar título", async () => {
      const postData: Partial<PostCreate> = {
        content: "Conteúdo sem título",
        author: "Autor",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Campos obrigatórios não preenchidos");
      expect(res.body.errors).toContain("Título é obrigatório");
    });

    it("Deve retornar erro 400 quando faltar conteúdo", async () => {
      const postData: Partial<PostCreate> = {
        title: "Título sem conteúdo",
        author: "Autor",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors).toContain("Conteúdo é obrigatório");
    });

    it("Deve retornar erro 400 quando faltar autor", async () => {
      const postData: Partial<PostCreate> = {
        title: "Título sem autor",
        content: "Conteúdo",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors).toContain("Autor é obrigatório");
    });

    it("Deve retornar erro 400 quando todos os campos estiverem vazios", async () => {
      const res = await request(app).post("/posts").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors.length).toBe(3);
    });
  });

  describe("GET /posts/:id", () => {
    it("Deve retornar um post específico pelo ID", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Post para Buscar",
        content: "Conteúdo do post",
        author: "Autor Teste",
      };

      const createRes = await request(app).post("/posts").send(postData);
      const postId = createRes.body.post.id;

      // Busca o post criado
      const res = await request(app).get(`/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(postId);
      expect(res.body.title).toBe(postData.title);
      expect(res.body.content).toBe(postData.content);
      expect(res.body.author).toBe(postData.author);
    });

    it("Deve retornar 404 quando post não existir", async () => {
      const res = await request(app).get("/posts/99999");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Post não encontrado");
    });

    it("Deve retornar 400 quando ID for inválido", async () => {
      const res = await request(app).get("/posts/abc");

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("ID inválido");
    });
  });

  describe("PUT /posts/:id", () => {
    it("Deve atualizar um post existente", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Post Original",
        content: "Conteúdo original",
        author: "Autor Original",
      };

      const createRes = await request(app).post("/posts").send(postData);
      const postId = createRes.body.post.id;

      // Atualiza o post
      const updateData: PostUpdate = {
        title: "Post Atualizado",
        content: "Conteúdo atualizado",
        author: "Autor Atualizado",
      };

      const res = await request(app)
        .put(`/posts/${postId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Post atualizado com sucesso");
      expect(res.body.post.title).toBe(updateData.title);
      expect(res.body.post.content).toBe(updateData.content);
      expect(res.body.post.author).toBe(updateData.author);
      expect(res.body.post.id).toBe(postId);
    });

    it("Deve atualizar apenas campos fornecidos", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Post Completo",
        content: "Conteúdo completo",
        author: "Autor Completo",
      };

      const createRes = await request(app).post("/posts").send(postData);
      const postId = createRes.body.post.id;

      // Atualiza apenas o título
      const updateData: PostUpdate = {
        title: "Apenas Título Atualizado",
      };

      const res = await request(app)
        .put(`/posts/${postId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe(updateData.title);
      // Os outros campos devem permanecer ou ser atualizados conforme o modelo
    });

    it("Deve retornar 404 quando tentar atualizar post inexistente", async () => {
      const updateData: PostUpdate = {
        title: "Título",
        content: "Conteúdo",
        author: "Autor",
      };

      const res = await request(app).put("/posts/99999").send(updateData);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Post não encontrado");
    });

    it("Deve retornar 400 quando ID for inválido", async () => {
      const res = await request(app).put("/posts/abc").send({
        title: "Teste",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("ID inválido");
    });
  });

  describe("DELETE /posts/:id", () => {
    it("Deve deletar um post existente", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Post para Deletar",
        content: "Este post será deletado",
        author: "Autor",
      };

      const createRes = await request(app).post("/posts").send(postData);
      const postId = createRes.body.post.id;

      // Deleta o post
      const res = await request(app).delete(`/posts/${postId}`);

      expect(res.statusCode).toBe(204);

      // Verifica que o post foi deletado
      const getRes = await request(app).get(`/posts/${postId}`);
      expect(getRes.statusCode).toBe(404);
    });

    it("Deve retornar 404 quando tentar deletar post inexistente", async () => {
      const res = await request(app).delete("/posts/99999");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Post não encontrado");
    });

    it("Deve retornar 400 quando ID for inválido", async () => {
      const res = await request(app).delete("/posts/abc");

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("ID inválido");
    });
  });

  describe("GET /posts/search", () => {
    beforeEach(async () => {
      // Cria alguns posts para testar a busca
      await request(app).post("/posts").send({
        title: "JavaScript Avançado",
        content: "Aprenda JavaScript avançado",
        author: "Dev Master",
      });

      await request(app).post("/posts").send({
        title: "Node.js para Iniciantes",
        content: "Introdução ao Node.js",
        author: "Dev Master",
      });

      await request(app).post("/posts").send({
        title: "Python Básico",
        content: "Aprenda Python do zero",
        author: "Python Expert",
      });
    });

    it("Deve buscar posts por termo no título", async () => {
      const res = await request(app).get("/posts/search?q=JavaScript");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toContain("JavaScript");
    });

    it("Deve buscar posts usando query parameter 'query'", async () => {
      const res = await request(app).get("/posts/search?query=Node");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toContain("Node");
    });

    it("Deve retornar lista vazia quando não encontrar resultados", async () => {
      const res = await request(app).get(
        "/posts/search?q=TermoInexistente"
      );

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("Deve retornar 400 quando query estiver vazia", async () => {
      const res = await request(app).get("/posts/search?q=");

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Query de busca é obrigatória");
    });

    it("Deve retornar 400 quando query não for fornecida", async () => {
      const res = await request(app).get("/posts/search");

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Query de busca é obrigatória");
    });
  });

  describe("Fluxo completo", () => {
    it("Deve realizar CRUD completo de um post", async () => {
      // CREATE
      const postData: PostCreate = {
        title: "Post Completo",
        content: "Conteúdo completo do post",
        author: "Autor Completo",
      };

      const createRes = await request(app).post("/posts").send(postData);
      expect(createRes.statusCode).toBe(201);
      const postId = createRes.body.post.id;

      // READ
      const getRes = await request(app).get(`/posts/${postId}`);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.title).toBe(postData.title);

      // UPDATE
      const updateData: PostUpdate = {
        title: "Post Atualizado",
        content: "Conteúdo atualizado",
        author: "Autor Atualizado",
      };
      const updateRes = await request(app)
        .put(`/posts/${postId}`)
        .send(updateData);
      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.post.title).toBe(updateData.title);

      // DELETE
      const deleteRes = await request(app).delete(`/posts/${postId}`);
      expect(deleteRes.statusCode).toBe(204);

      // Verifica que foi deletado
      const getAfterDelete = await request(app).get(`/posts/${postId}`);
      expect(getAfterDelete.statusCode).toBe(404);
    });
  });
});
