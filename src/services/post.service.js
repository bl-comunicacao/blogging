const model = require('../models/post.model')

const getAllPosts = async () => model.findAllPosts()

const getPostById = async (id) => {
  const post = await model.findByIdPost(id)
  if (!post) throw new Error('Post not found')
  return post
}

const createPost = ({ title, content, author }) => {
  if (!title || !content || !author) throw new Error('Campos obrigatórios não preenchidos')
  return model.createPost({ title, content, author })
}

const updatePost = async (id, data) => {
  const post = await model.findByIdPost(id)
  if (!post) throw new Error('Post não encontrado')
  return model.updatePost({ id, ...data });
}

const deletePost = async (id) => {
  const post = await model.findByIdPost(id)
  if (!post) throw new Error('Post não encontrado')
  await model.removePost(id)
};

const searchPosts = (query) => {
  if (!query) throw new Error('Query é obrigatório')
  return model.searchPosts(query)
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts
}