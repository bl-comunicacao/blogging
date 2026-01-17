import { AppError } from "./AppError";

/**
 * Erro para validação de dados (400)
 */
export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(message: string = "Dados inválidos", errors = []) {
    super(message, 400);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
