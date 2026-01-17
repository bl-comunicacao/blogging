import { Request, Response } from "express";
import * as service from "../services/post.service";
import { NotFoundError, ValidationError } from "../errors";
import type { PostCreate, PostUpdate } from "../types";

export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const posts = await service.getAllPosts();

  if (!posts || posts.length === 0)
    throw new NotFoundError("Nenhum post encontrado");

  return res.status(200).json(posts);
};

export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const post = await service.getPostById(req.params.id as string | number);
  return res.status(200).json(post);
};

export const create = async (
  req: Request<{}, {}, PostCreate>,
  res: Response
): Promise<Response> => {
  const post = await service.createPost(req.body);
  return res.status(201).json({
    message: "Post criado com sucesso",
    post,
  });
};

export const update = async (
  req: Request<{ id: string | number }, {}, PostUpdate>,
  res: Response
): Promise<Response> => {
  const post = await service.updatePost(req.params.id, req.body);
  return res.status(200).json({
    message: "Post atualizado com sucesso",
    post,
  });
};

export const remove = async (
  req: Request<{ id: string | number }>,
  res: Response
): Promise<Response> => {
  await service.deletePost(req.params.id);
  return res.status(204).send();
};

export const search = async (
  req: Request<{}, {}, {}, { q?: string; query?: string }>,
  res: Response
): Promise<Response> => {
  const searchQuery = req.query.q || req.query.query;

  if (!searchQuery) throw new ValidationError("Query de busca é obrigatória");

  const posts = await service.searchPosts(searchQuery);
  return res.status(200).json(posts);
};
