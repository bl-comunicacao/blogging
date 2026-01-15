const AppError = require('./AppError');

/**
 * Erro para não autorizado (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
