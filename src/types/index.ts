interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: Date;
  updated_at: Date;
}

interface PostCreate {
  title: string;
  content: string;
  author: string;
}

interface PostUpdate {
  title?: string;
  content?: string;
  author?: string;
}

import { Request, Response } from "express";

// Extende a interface Request do Express para adicionar tipos explícitos aos body, params e query
interface TypedRequest<T = any> extends Request {
  body: T;
  params: any;
  query: any;
}

// Extende a interface Response do Express para adicionar um tipo explícito ao json
interface TypedResponse<T = any> extends Response {
  json: (body: T) => this;
}

export { Post, PostCreate, PostUpdate, TypedRequest, TypedResponse };
