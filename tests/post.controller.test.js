jest.mock("../src/services/post.service", () => ({
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  searchPosts: jest.fn(),
}))

const controller = require("../src/controllers/post.controller")
const service = require("../src/services/post.service")

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

const mockRequest = ({ params = {}, body = {}, query = {} } = {}) => ({
  params,
  body,
  query,
})

describe("Post Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getAll", () => {
    it("Deve retornar 200 e lista de posts", async () => {
      const postsMock = [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ]

      service.getAllPosts.mockResolvedValue(postsMock)

      const req = mockRequest()
      const res = mockResponse()

      await controller.getAll(req, res)

      expect(service.getAllPosts).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(postsMock)
    })

    it("Deve retornar 404 quando não houver posts", async () => {
      service.getAllPosts.mockResolvedValue([])

      const req = mockRequest()
      const res = mockResponse()

      await controller.getAll(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: "Nenhum post encontrado",
      })
    })
  })

  describe("getById", () => {
    it("Deve retornar 200 e o post", async () => {
      const postMock = {
        id: 1,
        title: "Post Teste",
        content: "Conteúdo",
        author: "Autor",
      }

      service.getPostById.mockResolvedValue(postMock)

      const req = mockRequest({
        params: { id: 1 },
      })
      const res = mockResponse()

      await controller.getById(req, res)

      expect(service.getPostById).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(postMock)
    })

    it("Deve retornar 404 quando ocorrer erro", async () => {
      service.getPostById.mockRejectedValue(new Error("Post não encontrado"))

      const req = mockRequest({
        params: { id: 999 },
      })
      const res = mockResponse()

      await controller.getById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: "Post não encontrado",
      })
    })
  })

  describe("create", () => {
    it("Deve criar um post e retornar 201", async () => {
      const postMock = {
        id: 1,
        title: "Novo Post",
        content: "Conteúdo",
        author: "Autor",
      }

      service.createPost.mockResolvedValue(postMock)

      const req = mockRequest({
        body: postMock,
      })
      const res = mockResponse()

      await controller.create(req, res)

      expect(service.createPost).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: "Post criado com sucesso",
        post: postMock,
      })
    })

    it("Deve retornar 400 em caso de erro", async () => {
      service.createPost.mockRejectedValue(new Error("Erro ao criar post"))

      const req = mockRequest({
        body: {},
      })
      const res = mockResponse()

      await controller.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao criar post",
      })
    })
  })

  describe("update", () => {
    it("Deve atualizar um post e retornar 200", async () => {
      const postAtualizado = {
        id: 1,
        title: "Post Atualizado",
      }

      service.updatePost.mockResolvedValue(postAtualizado)

      const req = mockRequest({
        params: { id: 1 },
        body: { title: "Post Atualizado" },
      })
      const res = mockResponse()

      await controller.update(req, res)

      expect(service.updatePost).toHaveBeenCalledWith(1, req.body)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: "Post atualizado com sucesso",
        post: postAtualizado,
      })
    })
  })

  describe("remove", () => {
    it("Deve deletar um post e retornar 204", async () => {
      service.deletePost.mockResolvedValue()

      const req = mockRequest({
        params: { id: 1 },
      })
      const res = mockResponse()

      await controller.remove(req, res)

      expect(service.deletePost).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(204)
    })
  })

  describe("search", () => {
    it("Deve retornar posts filtrados", async () => {
      const postsMock = [{ id: 1, title: "Teste" }]

      service.searchPosts.mockResolvedValue(postsMock)

      const req = mockRequest({
        query: { query: "Teste" },
      })
      const res = mockResponse()

      await controller.search(req, res)

      expect(service.searchPosts).toHaveBeenCalledWith("Teste")
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(postsMock)
    })
  })
})
