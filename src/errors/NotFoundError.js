const AppError = require('./AppError');

/**
 * Erro para recursos não encontrados (404)
 */
class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
