const express = require("express")
const controller = require("../controllers/post.controller")

const router = express.Router()

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Criar um novo post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreate'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", controller.create)

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar todos os posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", controller.getAll)

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Buscar posts por termo
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/search", controller.search)

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Buscar post por ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", controller.getById)

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualizar um post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", controller.update)

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remover um post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", controller.remove)

module.exports = router
