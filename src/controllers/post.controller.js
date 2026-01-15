const service = require('../services/post.service')
const { NotFoundError } = require('../errors')

const getAll = async (req, res) => {
  const posts = await service.getAllPosts()
  
  if (!posts || posts.length === 0) {
    throw new NotFoundError('Nenhum post encontrado')
  }
  
  return res.status(200).json(posts)
}

const getById = async (req, res) => {
  const post = await service.getPostById(req.params.id)
  return res.status(200).json(post)
}

const create = async (req, res) => {
  const post = await service.createPost(req.body)
  return res.status(201).json({
    message: 'Post criado com sucesso',
    post
  })
}

const update = async (req, res) => {
  const post = await service.updatePost(req.params.id, req.body)
  return res.status(200).json({
    message: 'Post atualizado com sucesso',
    post
  })
}

const remove = async (req, res) => {
  await service.deletePost(req.params.id)
  return res.status(204).send()
}

const search = async (req, res) => {
  // Suporta tanto 'q' quanto 'query' para compatibilidade
  const searchQuery = req.query.q || req.query.query
  const posts = await service.searchPosts(searchQuery)
  return res.status(200).json(posts)
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  search
}
