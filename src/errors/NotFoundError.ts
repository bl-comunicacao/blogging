import { AppError } from "./AppError";

/**
 * Erro para recursos não encontrados (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

NotFoundError;
