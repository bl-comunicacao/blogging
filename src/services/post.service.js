const model = require('../models/post.model')
const { NotFoundError, ValidationError } = require('../errors')

const getAllPosts = async () => {
  try {
    return await model.findAllPosts()
  } catch (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`)
  }
}

const getPostById = async (id) => {
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('ID inválido')
  }

  const post = await model.findByIdPost(id)
  if (!post) {
    throw new NotFoundError('Post não encontrado')
  }
  return post
}

const createPost = async ({ title, content, author }) => {
  const errors = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Título é obrigatório')
  }
  if (!content || content.trim().length === 0) {
    errors.push('Conteúdo é obrigatório')
  }
  if (!author || author.trim().length === 0) {
    errors.push('Autor é obrigatório')
  }

  if (errors.length > 0) {
    throw new ValidationError('Campos obrigatórios não preenchidos', errors)
  }

  try {
    return await model.createPost({ title, content, author })
  } catch (error) {
    throw new Error(`Erro ao criar post: ${error.message}`)
  }
}

const updatePost = async (id, data) => {
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('ID inválido')
  }

  const post = await model.findByIdPost(id)
  if (!post) {
    throw new NotFoundError('Post não encontrado')
  }

  // Permite atualização parcial - usa valores existentes se não fornecidos
  const updateData = {
    id,
    title: data.title !== undefined ? data.title : post.title,
    content: data.content !== undefined ? data.content : post.content,
    author: data.author !== undefined ? data.author : post.author
  }

  try {
    return await model.updatePost(updateData)
  } catch (error) {
    throw new Error(`Erro ao atualizar post: ${error.message}`)
  }
}

const deletePost = async (id) => {
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('ID inválido')
  }

  const post = await model.findByIdPost(id)
  if (!post) {
    throw new NotFoundError('Post não encontrado')
  }

  try {
    await model.removePost(id)
  } catch (error) {
    throw new Error(`Erro ao deletar post: ${error.message}`)
  }
}

const searchPosts = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new ValidationError('Query de busca é obrigatória')
  }

  try {
    return await model.searchPosts(query)
  } catch (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`)
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts
}