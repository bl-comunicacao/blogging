const AppError = require('./AppError');

/**
 * Erro para validação de dados (400)
 */
class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', errors = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

module.exports = ValidationError;
