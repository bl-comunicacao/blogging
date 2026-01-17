import request from "supertest";
import app from "../../src/app";
import type { PostCreate, PostUpdate } from "../../src/types";

describe("Post Controller - Testes Reais", () => {
  describe("getAll", () => {
    it("Deve retornar 200 e lista de posts quando existirem posts", async () => {
      // Cria posts primeiro
      const post1: PostCreate = {
        title: "Post 1",
        content: "Conteúdo do post 1",
        author: "Autor 1",
      };
      const post2: PostCreate = {
        title: "Post 2",
        content: "Conteúdo do post 2",
        author: "Autor 2",
      };

      await request(app).post("/posts").send(post1);
      await request(app).post("/posts").send(post2);

      // Busca todos os posts
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("content");
      expect(res.body[0]).toHaveProperty("author");
      expect(res.body[0]).toHaveProperty("created_at");
    });

    it("Deve retornar 404 quando não houver posts", async () => {
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Nenhum post encontrado");
    });
  });

  describe("getById", () => {
    it("Deve retornar 200 e o post quando existir", async () => {
      // Cria um post primeiro
      const postData: PostCreate = {
        title: "Post Teste",
        content: "Conteúdo do post teste",
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

    it("Deve retornar 404 quando post não for encontrado", async () => {
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

  describe("create", () => {
    it("Deve criar um post e retornar 201", async () => {
      const postData: PostCreate = {
        title: "Novo Post",
        content: "Conteúdo do novo post",
        author: "Autor do Post",
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

    it("Deve retornar 400 em caso de erro de validação - falta título", async () => {
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

    it("Deve retornar 400 em caso de erro de validação - falta conteúdo", async () => {
      const postData: Partial<PostCreate> = {
        title: "Título sem conteúdo",
        author: "Autor",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors).toContain("Conteúdo é obrigatório");
    });

    it("Deve retornar 400 em caso de erro de validação - falta autor", async () => {
      const postData: Partial<PostCreate> = {
        title: "Título sem autor",
        content: "Conteúdo",
      };

      const res = await request(app).post("/posts").send(postData);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors).toContain("Autor é obrigatório");
    });

    it("Deve retornar 400 quando todos os campos estiverem vazios", async () => {
      const res = await request(app).post("/posts").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.errors.length).toBe(3);
    });
  });

  describe("update", () => {
    it("Deve atualizar um post e retornar 200", async () => {
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

    it("Deve atualizar apenas campos fornecidos (atualização parcial)", async () => {
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
      // Os outros campos devem permanecer
      expect(res.body.post.content).toBe(postData.content);
      expect(res.body.post.author).toBe(postData.author);
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

  describe("remove", () => {
    it("Deve deletar um post e retornar 204", async () => {
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

  describe("search", () => {
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

    it("Deve retornar posts filtrados por termo no título", async () => {
      const res = await request(app).get("/posts/search?q=JavaScript");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toContain("JavaScript");
    });

    it("Deve retornar posts usando query parameter 'query'", async () => {
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

  describe("Fluxo completo do Controller", () => {
    it("Deve realizar CRUD completo através do controller", async () => {
      // CREATE
      const postData: PostCreate = {
        title: "Post Completo Controller",
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
        title: "Post Atualizado Controller",
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
